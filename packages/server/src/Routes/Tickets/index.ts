import express from 'express';
import { db } from '../../Database/db';
import { and, count, eq, like } from 'drizzle-orm';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import { serversTable } from '../../Database';
import { ticketsTable } from '../../Database/Schemas/Tickets';
const router = express.Router();

router.get('/tickets', requireAuth, async (req, res) => {
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
        and(query ? like(ticketsTable.title, `%${query}%`) : undefined, eq(ticketsTable.userId, req.user.id))
    );

    for (const ticket of tickets) if (ticket.serverId) {
        const [server] = await db.select().from(serversTable).where(eq(serversTable.id, ticket.serverId)).limit(1);
        (ticket as any).server = server;
    }

    return res.status(200).json(tickets);
});

router.post('/tickets', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createTicketSchema), async (req, res) => {
    const { title, message, category, priority, serverId } = req.body;
    if (serverId) {
        const [findServer] = await db.select().from(serversTable).where(
            and(eq(serversTable.id, serverId), eq(serversTable.userId, req.user.id)),
        );

        if (!findServer) return res.status(404).json({
            success: false,
            message: 'Server not found or you do not have permission to access it'
        });
    }

    const [totalOpenTickets] = await db.select({ count: count(ticketsTable.id) }).from(ticketsTable).where(
        and(eq(ticketsTable.userId, req.user.id), eq(ticketsTable.status, 'open'))
    );

    if (totalOpenTickets.count >= 5) return res.status(400).json({
        success: false,
        message: 'You have reached the maximum number of open tickets (5)'
    });

    const [ticket] = await db.insert(ticketsTable).values({
        title,
        message,
        category,
        priority,
        userId: req.user.id,
        serverId
    }).$returningId();

    return res.status(201).json({
        success: true,
        ticketId: ticket.id
    });
});

import idRouter from './id';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { createTicketSchema } from '../../Helpers/Validations/Ticket/Create';
router.use('/tickets', idRouter);

export default router;