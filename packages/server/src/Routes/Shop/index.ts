import express from 'express';
import { db } from '../../Database/db';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import { shopProductsTable } from '../../Database';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { createShopProductSchema } from '../../Helpers/Validations/ShopProduct/Create';
import permissions from '../../Helpers/Permissions/get';
const router = express.Router();

router.get('/shop/items', requireAuth, async (req, res) => {
    const products = await db.select().from(shopProductsTable).where(
        (await permissions(req.user.id)).includes('shopProducts') ? undefined : eq(shopProductsTable.disabled, false)
    );
    
    return res.status(200).json(products);
});

router.post('/shop/items', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createShopProductSchema), async (req, res) => {
    if (!(await permissions(req.user.id)).includes('shopProducts')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to create shop products'
    });

    const { name, currency, price, quantity, description, type } = req.body;
    const [product] = await db.insert(shopProductsTable).values({
        name,
        currency,
        price,
        quantity,
        description,
        type
    }).$returningId();

    return res.status(201).json({
        success: true,
        productId: product.id
    });
});

import idRouter from './id';
import { eq } from 'drizzle-orm';
router.use('/shop/items', idRouter);

export default router;