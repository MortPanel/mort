import express from 'express';
import { db } from '../../Database/db';
import { eggsTable, nestsTable, productsTable, serversTable, usersTable } from '../../Database';
import { eq } from 'drizzle-orm';
const router = express.Router();

router.get('/me', async(req, res) => {
    if (!req.user) return res.status(200).json({})

    const getuser = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        pterodactylId: usersTable.pterodactylId,
        suspended: usersTable.suspended,
        permissions: usersTable.permissions,
        credits: usersTable.credits,
        serverLimit: usersTable.serverLimit
    }).from(usersTable).where(
        eq(usersTable.id, req.user.id)
    ).limit(1);
    const user = getuser[0];
    let servers = await db.select().from(serversTable).where(
        eq(serversTable.userId, req.user.id)
    );

    for (const server of servers) {
        const product = await db.select().from(serversTable)
            .innerJoin(productsTable, eq(serversTable.productId, productsTable.id))
            .where(eq(serversTable.id, server.id))
            .limit(1);
        (server as any).product = product[0].products;

        const egg = await db.select().from(eggsTable)
            .where(eq(eggsTable.id, server.eggId))

        const nest = await db.select().from(nestsTable)
            .where(eq(nestsTable.id, egg[0].nestId))
            .limit(1);
        (server as any).nest = nest[0];
    }

    return res.status(200).json({
        user,
        servers
    });
});

import Login from './login';
import Register from './register';

router.use('/', Login)
    .use('/', Register);

export default router;