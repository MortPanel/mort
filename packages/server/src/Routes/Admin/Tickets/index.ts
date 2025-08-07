import express from 'express';
import { serversTable, ticketsTable } from '../../../Database';
import { eq, like } from 'drizzle-orm';
import { db } from '../../../Database/db';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import permissions from '../../../Helpers/Permissions/get';
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const perm = await permissions(req.user.id);
    if (!perm.includes('tickets')) return res.status(403).json({ success: false, message: 'missing permissions' });
    const { limit, offset, query } = req.query;
    const limitNumber = parseInt(limit as string) || 10;
    const offsetNumber = parseInt(offset as string) || 0;
    if (isNaN(limitNumber) || isNaN(offsetNumber)) return res.status(400).json({
        success: false,
        message: 'Invalid limit or offset'
    });

    if (limitNumber < 1 || offsetNumber < 0) return res.status(400).json({
        success: false,
        message: 'Invalid limit or offset'
    });

    if (limitNumber > 100) return res.status(400).json({
        success: false,
        message: 'maximum limit reached'
    });

    let tickets = await db.select().from(ticketsTable).limit(limitNumber).offset(offsetNumber).where(
        query ? like(ticketsTable.title, `%${query}%`) : undefined
    );

    for (const ticket of tickets) if (ticket.serverId) {
        const [server] = await db.select().from(serversTable).where(eq(serversTable.id, ticket.serverId)).limit(1);
        (ticket as any).server = server;
    }

    return res.status(200).json(tickets);
});

export default router;