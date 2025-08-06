import express from 'express';
import { eq, sql } from 'drizzle-orm';
import { eggProductsTable, eggsTable, nodeProductsTable, nodesTable, productsTable, serversTable } from '../../../Database';
import { db } from '../../../Database/db';
import permissions from '../../../Helpers/Permissions/get';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import BodyValidationMiddleware from '../../../Helpers/Middlewares/Validation';
import { createProductSchema } from '../../../Helpers/Validations/Product/Create';
const router = express.Router();

router.put('/products/:id', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createProductSchema), async (req, res) => {
    if (!(await permissions(req.user.id)).includes('products')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to create product'
    });

    const findId = parseInt(req.params.id);
    if (isNaN(findId)) return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
    });

    const product = await db.select().from(productsTable).where(
        eq(productsTable.id, findId)
    ).limit(1);

    if (!product.length) return res.status(404).json({
        success: false,
        message: 'Product not found'
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
    if (!minimumCredits) minimumCredits = price;
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

    const eggs = await db.select().from(eggsTable).where(
        sql`${eggsTable.id} IN (${sql.join(eggIds, sql`,`)})`
    );

    if (eggs.length !== eggIds.length) return res.status(400).json({
            success: false,
            message: 'One or more eggs do not exist',
            errors: { "eggIds": { "errors": [{ code: "", message: "One or more eggs do not exist" }] } }
        });

    if (minimumCredits < price) return res.status(400).json({
        success: false,
        message: "Minimum credits cannot be less than product price",
        errors: { "minimumCredits": { "errors": [{ code: "", message: "Minimum credits cannot be less than product price" }] } }
    });

    await db.update(productsTable)
        .set({
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
        })
        .where(eq(productsTable.id, findId));

    const existingNodeLinks = await db.select({ nodeId: nodeProductsTable.nodeId })
        .from(nodeProductsTable)
        .where(eq(nodeProductsTable.productId, findId));
    const existingNodeIds = existingNodeLinks.map(link => link.nodeId);

    const nodesToAdd = nodeIds.filter((id: number) => !existingNodeIds.includes(id));
    const nodesToRemove = existingNodeIds.filter((id: number) => !nodeIds.includes(id));

    for (const nodeId of nodesToAdd) {
        await db.insert(nodeProductsTable).values({
            nodeId,
            productId: findId
        });
    }
    if (nodesToRemove.length > 0) await db.delete(nodeProductsTable).where(eq(nodeProductsTable.productId, findId) && sql`${nodeProductsTable.nodeId} IN (${sql.join(nodesToRemove, sql`,`)})`);

    const existingEggLinks = await db.select({ eggId: eggProductsTable.eggId })
        .from(eggProductsTable)
        .where(eq(eggProductsTable.productId, findId));
    const existingEggIds = existingEggLinks.map(link => link.eggId);

    const eggsToAdd = eggIds.filter((id: number) => !existingEggIds.includes(id));
    const eggsToRemove = existingEggIds.filter((id: number) => !eggIds.includes(id));

    for (const eggId of eggsToAdd) await db.insert(eggProductsTable).values({
        eggId,
        productId: findId
    });
    if (eggsToRemove.length > 0) await db.delete(eggProductsTable).where(eq(eggProductsTable.productId, findId) && sql`${eggProductsTable.eggId} IN (${sql.join(eggsToRemove, sql`,`)})`);

    const productId = [{ id: findId }];

    return res.status(
        200
    ).json({
        success: true,
        data: {
            id: productId[0]?.id,
            eggs: eggIds,
            nodes: nodeIds,
        }
    });
});

router.delete('/products/:id', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('products')) return res.status(403).json({
        success: false,
        message: 'Forbidden'
    });

    const { id: productId } = req.params;
    const parsedId = parseInt(productId);
    if (isNaN(parsedId)) return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
    });
    const product = await db.select().from(productsTable).where(
        eq(productsTable.id, parsedId)
    ).limit(1);

    if (!product) return res.status(404).json({
        success: false,
        message: 'Product not found'
    });

    const servers = await db.select().from(serversTable).where(
        eq(serversTable.productId, parsedId)
    ).limit(1);

    if (servers.length > 0) return res.status(400).json({
        success: false,
        message: 'Product is associated with one or more servers. Please delete the servers first.',
    });

    await db.delete(productsTable).where(eq(productsTable.id, parsedId));

    return res.status(204).json({
        success: true
    });
});

export default router;