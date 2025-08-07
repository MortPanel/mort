import express from 'express';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import permissions from '../../Helpers/Permissions/get';
import { locationsTable, serversTable, usersTable } from '../../Database';
import { db } from '../../Database/db';
import { count } from 'drizzle-orm';
const router = express.Router();

router.get('/admin/overview', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('*')) return res.status(403).json({ success: false, message: 'missing permissions' });
    const [u] = await db.select({ count: count(usersTable.id) }).from(usersTable);
    const [s] = await db.select({ count: count(serversTable.id) }).from(serversTable);
    const [l] = await db.select({ count: count(locationsTable.id) }).from(locationsTable);
    return res.json({
        success: true,
        totalUsers: u.count,
        totalServers: s.count,
        totalLocations: l.count
    });
});

import users from './Users';
import servers from './Servers';
import tickets from './Tickets';
router.use('/admin/users', users);
router.use('/admin/servers', servers);
router.use('/admin/tickets', tickets);

export default router;