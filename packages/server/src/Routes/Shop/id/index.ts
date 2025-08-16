import express from 'express';
import { db } from '../../../Database/db';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import { paymentsTable, shopProductsTable, usersTable } from '../../../Database';
import { and, eq } from 'drizzle-orm';
import GetServices from '../../../Helpers/Payments/GetServices';
import Stripe from 'stripe';
const router = express.Router();

router.post('/:id/buy', requireAuth, async (req, res) => {
    const { service } = req.query;
    const { id } = req.params;
    const frontendurl = req.headers['origin'];
    const [product] = await db.select().from(shopProductsTable).where(
        and(
            eq(shopProductsTable.id, parseInt(id)),
            eq(shopProductsTable.disabled, false)
        )
    ).limit(1)

    if (!product) return res.status(404).json({
        success: false,
        message: 'Product not found'
    });

    const ss = GetServices();
    if (!ss.find(s => s.name === service)) return res.status(400).json({ success: false, message: 'Invalid service' });
    const [user] = await db.select({email:usersTable.email}).from(usersTable).where(eq(usersTable.id, req.user.id)).limit(1);
    if (service == "stripe") {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: [
                'card'
            ],
            line_items: [
                {
                    price_data: {
                        currency: product.currency,
                        product_data: {
                            name: product.name + ' - ' + `(${product.quantity})`,
                            description: String(product.description),
                            metadata: {
                                id: product.id
                            },
                        },
                        unit_amount: product.price,
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId: req.user.id
            },
            customer_email: user.email,
            mode: 'payment',
            success_url: `${frontendurl}/payments/success?sId={CHECKOUT_SESSION_ID}&service=stripe&productId=${product.id}`,
            cancel_url: `${frontendurl}/payments/cancel?service=stripe`,
        });

        return res.status(200).json({ success: true, url: session.url });
    }
});

router.post('/:id/checkout', async (req, res) => {
    const { id } = req.params;
    const { sId,service } = req.body;

    if (service === "stripe") {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const session = await stripe.checkout.sessions.retrieve(sId, {
            expand: ['line_items.data.price.product']
        });

        const hasProduct = session.line_items?.data.find(item => {
            const productObj = (item.price?.product as Stripe.Product | undefined);
            return productObj?.metadata?.id === id;
        });

        if (!hasProduct) return res.status(400).json({ success: false, message: 'Invalid session' });
        const userId = Number((session.metadata as any).userId);

        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

        if (session.payment_status !== 'paid') return res.status(400).json({ success: false, message: 'Payment not completed' });

        const [product] = await db.select().from(shopProductsTable).where(eq(shopProductsTable.id, parseInt(id))).limit(1);

        if (!product) return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

        const [findSame] = await db.select().from(paymentsTable).where(and(eq(paymentsTable.sessionId, sId), eq(paymentsTable.status, 'completed'))).limit(1);
        if (findSame) return res.status(400).json({ success: false, message: 'Payment already processed' });

        await db.insert(paymentsTable).values({
            userId,
            productId: product.id,
            productName: product.name,
            productType: product.type,
            quantity: product.quantity,
            price: product.price,
            status: 'completed',
            service,
            sessionId: sId,
            currency: product.currency
        });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (product.type == "credit") await db.update(usersTable).set({
            credits: user.credits + product.quantity
        }).where(eq(usersTable.id, userId));

        if (product.type == "serverSlot") await db.update(usersTable).set({
            serverLimit: user.serverLimit + product.quantity
        }).where(eq(usersTable.id, userId));
    } else {
        return res.status(400).json({ success: false, message: 'Invalid service' });
    }

    return res.status(200).json({ success: true });
});

export default router;