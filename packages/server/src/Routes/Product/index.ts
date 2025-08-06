import express from 'express';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import permissions from '../../Helpers/Permissions/get';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { createProductSchema } from '../../Helpers/Validations/Product/Create';
import { productsTable, eggProductsTable, nodeProductsTable, nodesTable, eggsTable, serversTable } from '../../Database';
import { db } from '../../Database/db';
import { sql } from 'drizzle-orm';
const router = express.Router();

router.get('/products', requireAuth, async (req, res) => {
    let products = await db.select().from(productsTable) as any[];
    const productIds = products.map(product => product.id);
    let eggProducts: any[] = [];
    let nodeProducts: any[] = [];
    if (productIds.length > 0) {
        eggProducts = await db.select().from(eggProductsTable).where(
            sql`${eggProductsTable.productId} IN (${sql.join(productIds, sql`,`)})`
        );
        nodeProducts = await db.select().from(nodeProductsTable).where(
            sql`${nodeProductsTable.productId} IN (${sql.join(productIds, sql`,`)})`
        );
    }

    products.forEach(p => {
        p.eggIds = eggProducts.filter(ep => ep.productId === p.id).map(ep => ep.eggId);
        p.nodeIds = nodeProducts.filter(np => np.productId === p.id).map(np => np.nodeId);
    });

    return res.status(200).json(products);
});

router.get('/findProducts', requireAuth, async (req, res) => {
    const {
        eggId,
        nodeId,
    } = req.query;

    if (!eggId && !nodeId) return res.status(400).json({
        success: false,
        message: 'At least one of eggId or nodeId must be provided'
    });

    if (eggId && isNaN(Number(eggId))) return res.status(400).json({
        success: false,
        message: 'eggId must be a number'
    });
    if (nodeId && isNaN(Number(nodeId))) return res.status(400).json({
        success: false,
        message: 'nodeId must be a number'
    });

    let products: any[] = [];
    if (eggId) products = await db.select().from(productsTable)
        .innerJoin(eggProductsTable, sql`${productsTable.id} = ${eggProductsTable.productId}`)
        .where(sql`${eggProductsTable.eggId} = ${eggId}`);
    else if (nodeId) products = await db.select().from(productsTable)
        .innerJoin(nodeProductsTable, sql`${productsTable.id} = ${nodeProductsTable.productId}`)
        .where(sql`${nodeProductsTable.nodeId} = ${nodeId}`);
    products = products.filter((p: any) => !p.disabled);

    for (const p of products) {
        const productId = p.products.id;
        const [{ count }] = await db.select({ count: sql`COUNT(*)` }).from(serversTable).where(sql`product_id = ${productId}`);
        p.products.serverLength = Number(count);
    }

    return res.status(200).json(products.map(p => p.products).filter(p => ((p.serverLength < p.serverLimit) || p.serverLimit === null) && !p.disabled));
});

router.post('/products', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createProductSchema), async (req, res) => {
    if (!(await permissions(req.user.id)).includes('products')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to create product'
    });

    let {
        name,
        description,
        price,
        disabled,
        memory,
        disk,
        cpu,
        swap,
        serverLimit,
        allocation: allocations,
        databases,
        backups,
        io,
        oomKiller,
        nodeIds,
        eggIds,
        minimumCredits
    } = req.body;
    if(!minimumCredits) minimumCredits = price;

    const nodes = await db.select().from(nodesTable).where(
        sql`${nodesTable.id} IN (${sql.join(nodeIds, sql`,`)})`
    );

    if (nodes.length !== nodeIds.length) {
        return res.status(400).json({
            success: false,
            message: 'One or more nodes do not exist',
            errors: { "nodeIds": { "errors": [{ code: "", message: "One or more nodes do not exist" }] } }
        });
    }

    if (minimumCredits < price) return res.status(400).json({
        success: false,
        message: "Minimum credits cannot be less than product price",
        errors: { "minimumCredits": { "errors": [{ code: "", message: "Minimum credits cannot be less than product price" }] } }
    });

    const eggs = await db.select().from(eggsTable).where(
        sql`${eggsTable.id} IN (${sql.join(eggIds, sql`,`)})`
    );

    if (eggs.length !== eggIds.length) return res.status(400).json({
        success: false,
        message: 'One or more eggs do not exist',
        errors: { "eggIds": { "errors": [{ code: "", message: "One or more eggs do not exist" }] } }
    });

    const productId = await db.insert(productsTable).values({
        name,
        description,
        price,
        disabled,
        memory,
        disk,
        cpu,
        swap,
        serverLimit,
        allocation: allocations,
        databases,
        backups,
        io,
        oomKiller,
        minimumCredits
    }).$returningId();

    for (const nodeId of nodeIds) {
        await db.insert(nodeProductsTable).values({
            nodeId,
            productId: productId[0]?.id
        });
    }

    for (const eggId of eggIds) {
        await db.insert(eggProductsTable).values({
            eggId,
            productId: productId[0]?.id
        });
    }

    return res.status(201).json({
        success: true,
        data: {
            id: productId[0]?.id,
            eggs: eggIds,
            nodes: nodeIds,
        }
    });

});

import id from './id';

router.use("/",id);

export default router;