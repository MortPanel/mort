import express from 'express';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { productsTable, eggProductsTable, nodeProductsTable, eggsTable, serversTable, usersTable } from '../../Database';
import { createServerSchema } from '../../Helpers/Validations/Server/Create';
import { db } from '../../Database/db';
import { and, eq, like } from 'drizzle-orm';
import CreateServer from '../../Helpers/Pterodactyl/Server/CreateServer';
import { PterodactylErrorStyle } from '../../Helpers/Validations/Error';
import GetNode from '../../Helpers/Pterodactyl/Nodes/GetNode';
import { billingCycleMap, startBillingOfServer } from '../../CronJobs/Billing';
const router = express.Router();

router.get('/servers', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('servers')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to view servers'
    });

    const {limit, offset, query} = req.query;
    const limitNumber = parseInt(limit as string) || 10;
    const offsetNumber = parseInt(offset as string) || 0;
    if (isNaN(limitNumber) || isNaN(offsetNumber)) return res.status(400).json({
        success: false,
        message: 'Invalid limit or offset'
    });

    if(limitNumber < 1 || offsetNumber < 0) return res.status(400).json({
        success: false,
        message: 'Invalid limit or offset'
    });

    if(limitNumber > 100) return res.status(400).json({
        success: false,
        message: 'maximum limit reached'
    });

    let servers = await db.select().from(serversTable).limit(limitNumber).offset(offsetNumber).where(
        query ? like(serversTable.name, `%${query}%`) : undefined
    );

    for (const server of servers) {
        const [user] = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            suspended: usersTable.suspended,
            permissions: usersTable.permissions,
            serverLimit: usersTable.serverLimit,
            emailVerified: usersTable.emailVerified,
        }).from(usersTable).where(eq(usersTable.id, server.userId)).limit(1);

        (server as any).user = user;

        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, server.productId)).limit(1);
        (server as any).product = product;
    }

    return res.status(200).json(servers);
});

router.post('/servers', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createServerSchema), async (req, res) => {
    const { name, eggId, nodeId, productId } = req.body;

    const totalServers = await db.select().from(serversTable).where(
        eq(serversTable.userId, req.user.id)
    );
    
    const user = await db.select({
        serverLimit: usersTable.serverLimit,
        credits: usersTable.credits
    }).from(usersTable).where(
        eq(usersTable.id, req.user.id)
    );

    if (totalServers.length >= user[0].serverLimit) return res.status(403).json({
        success: false,
        message: 'You have reached your server limit',
    });

    const product = await db.select().from(productsTable).where(
        eq(productsTable.id, productId)
    ).limit(1);

    if (!product.length) return res.status(404).json({
        success: false,
        message: 'Product not found'
    });

    if(product[0].disabled) return res.status(400).json({
        success: false,
        message: 'Product is disabled'
    });

    if (product[0].serverLimit) {
        const productServerLength = await db.select().from(serversTable).where(
            eq(serversTable.productId, productId)
        );

        if (productServerLength.length >= product[0].serverLimit) return res.status(403).json({
            success: false,
            message: 'This product has reached its server limit'
        });
    }

    if (product[0].minimumCredits > user[0].credits) return res.status(403).json({
        success: false,
        message: 'You do not have enough credits to create this server'
    });

    const eggProduct = await db.select().from(eggProductsTable).where(
        and(
            eq(eggProductsTable.eggId, eggId),
            eq(eggProductsTable.productId, productId)
        )
    ).limit(1);

    if (!eggProduct.length) return res.status(400).json({
        success: false,
        message: 'This product does not support the selected egg'
    });


    const nodeProduct = await db.select().from(nodeProductsTable).where(
        and(
            eq(nodeProductsTable.nodeId, nodeId),
            eq(nodeProductsTable.productId, productId)
        )
    ).limit(1);

    if (!nodeProduct.length) return res.status(400).json({
        success: false,
        message: 'This product does not support the selected node'
    });

    const egg = await db.select().from(eggsTable).where(
        eq(eggsTable.id, eggId)
    ).limit(1);

    const getNode = await GetNode(nodeId);
    const firstAllocation = getNode.attributes?.relationships.allocations.data.filter((allocation: any) => !allocation.attributes?.assigned)[0].attributes;

    if(!firstAllocation) return res.status(400).json({
        success: false,
        message: 'No available allocation found'
    });

    const ptero = await CreateServer(
        name,
        req.user.id,
        egg[0].id,
        egg[0].dockerImage,
        egg[0].startup,
        (JSON.parse(egg[0].environment as any).reduce((acc: any, env: any) => {
            if(env.rules && env.rules.includes('required')) acc[env.env_variable] = env.default_value;
            return acc;
        }, {} as Record<string, string>)) || {},
        {
            memory: product[0].memory!,
            disk: product[0].disk,
            cpu: product[0].cpu,
            swap: product[0].swap,
            io: product[0].io,
            oom_disabled: !product[0].oomKiller,
        },
        {
            databases: product[0].databases,
            allocations: product[0].allocation,
            backups: product[0].backups,
        },
        {
            default: Number(firstAllocation?.id),
        }
    )

    if (ptero.errors) return res.status(400).json({
        success: false,
        message: 'fail: pterodactyl server creation',
        errors: PterodactylErrorStyle({ errors: ptero.errors })
    });

    const nextbill = new Date();
    nextbill.setSeconds(nextbill.getSeconds() + billingCycleMap[product[0].billingCycle]);

    const create = await db.insert(serversTable).values({
        name,
        userId: req.user.id,
        eggId,
        productId,
        locationId: nodeProduct[0].nodeId,
        pterodactylId: String(ptero.attributes!.id),
        identifier: ptero.attributes!.identifier,
        nextBilling: nextbill,
    }).$returningId();

    startBillingOfServer(create[0]?.id);

    return res.status(201).json({
        success: true,
        message: 'server created successfully',
        data: {
            id: create[0]?.id,
        }
    });
});

import id from './id';
import permissions from '../../Helpers/Permissions/get';

router.use("/",id);

export default router;