import express from 'express';
import { db } from '../../../Database/db';
import { and, asc, count, eq, like } from 'drizzle-orm';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import { serversTable, usersTable } from '../../../Database';
import { ticketCommentsTable, ticketsTable } from '../../../Database/Schemas/Tickets';
import permissions from '../../../Helpers/Permissions/get';
import crypto from 'crypto';
import BodyValidationMiddleware from '../../../Helpers/Middlewares/Validation';
import { createTicketCommentSchema } from '../../../Helpers/Validations/Ticket/CommentCreate';
const router = express.Router();

router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);
    if (isNaN(ticketId)) return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID'
    });

    const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId)).limit(1);
    if (!ticket) return res.status(404).json({
        success: false,
        message: 'Ticket not found'
    });

    const perms = await permissions(req.user.id);
    if(!perms.includes('tickets') && ticket.userId !== req.user.id) return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this ticket'
    });

    if (ticket.serverId) {
        const [server] = await db.select().from(serversTable).where(eq(serversTable.id, ticket.serverId)).limit(1);
        (ticket as any).server = server;
    }

    let comments = await db.select().from(ticketCommentsTable).where(eq(ticketCommentsTable.ticketId, ticketId)).orderBy(asc(ticketCommentsTable.createdAt));
    for (const comment of comments) {
        let [user] = await db.select({
            name: usersTable.name,
            email: usersTable.email,
        }).from(usersTable).where(eq(usersTable.id, comment.userId)).limit(1);
        (user as any).avatar = `https://www.gravatar.com/avatar/${user.email ? crypto.createHash('md5').update(user.email).digest('hex') : ''}`;
        (user as any).email = undefined;
        (comment as any).user = user;
    }

    (ticket as any).comments = comments;

    let [user] = await db.select({
        name: usersTable.name,
        email: usersTable.email,
    }).from(usersTable).where(eq(usersTable.id, ticket.userId)).limit(1);
    (user as any).avatar = `https://www.gravatar.com/avatar/${user.email ? crypto.createHash('md5').update(user.email).digest('hex') : ''}`;
    (user as any).email = undefined;
    (ticket as any).user = user;

    return res.status(200).json(ticket);
});

router.post('/:id/comments', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createTicketCommentSchema), async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);
    if (isNaN(ticketId)) return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID'
    });

    const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId)).limit(1);
    if (!ticket) return res.status(404).json({
        success: false,
        message: 'Ticket not found'
    });

    const perms = await permissions(req.user.id);
    if(!perms.includes('tickets') && ticket.userId !== req.user.id) return res.status(403).json({
        success: false,
        message: 'You do not have permission to comment on this ticket'
    });

    const { message } = req.body;

    await db.insert(ticketCommentsTable).values({
        message,
        userId: req.user.id,
        ticketId: ticket.id
    });

    return res.status(201).json({
        success: true
    });
});

router.put('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const ticketId = parseInt(id);
    if (isNaN(ticketId)) return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID'
    });

    const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId)).limit(1);
    if (!ticket) return res.status(404).json({
        success: false,
        message: 'Ticket not found'
    });

    const perms = await permissions(req.user.id);
    if(!perms.includes('tickets') && ticket.userId !== req.user.id) return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this ticket'
    });
    
    if (!['open', 'closed'].includes(status)) return res.status(400).json({
        success: false,
        message: 'Invalid status'
    });

    await db.update(ticketsTable).set({ status }).where(eq(ticketsTable.id, ticketId));

    return res.status(200).json({
        success: true
    });
});

export default router;