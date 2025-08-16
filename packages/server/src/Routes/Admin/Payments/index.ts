import express from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../../Database/db';
import { paymentsTable, usersTable } from '../../../Database';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import permissions from '../../../Helpers/Permissions/get';
import crypto from 'crypto';
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('payments')) return res.status(403).json({ success: false, message: 'missing permissions' });
    const {
        limit = 10,
        offset = 0,
    } = req.query;

    const limitNumber = parseInt(limit as string)
    const offsetNumber = parseInt(offset as string)

    if (isNaN(limitNumber)) return res.status(400).json({ success: false, message: 'Invalid limit' });
    if (isNaN(offsetNumber)) return res.status(400).json({ success: false, message: 'Invalid offset' });

    if (limitNumber > 100) return res.status(400).json({ success: false, message: 'Limit exceeds maximum of 100' });
    const userPermission = await permissions(req.user.id);
    let payments = await db.select().from(paymentsTable).orderBy(desc(
        paymentsTable.createdAt
    )).limit(limitNumber).offset(offsetNumber);
    const x = [];
    for (const payment of payments) {
        const user = await db.select({
            id: usersTable.id,
            email: usersTable.email,
            name: usersTable.name
        }).from(usersTable)
        .where(eq(usersTable.id, payment.userId)).limit(1).then(users => users[0]);
        x.push({
            ...payment,
            sessionId: undefined,
            user: {
                ...user,
                email: userPermission.includes('users') ? user.email : undefined,
                avatar: `https://www.gravatar.com/avatar/${user.email ? crypto.createHash('md5').update(user.email).digest('hex') : ''}`
            }
        } as any);
    }
    return res.json(x);
})
export default router;