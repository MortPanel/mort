import express from 'express';
import { db } from '../../Database/db';
import { usersTable } from '../../Database';
import { eq } from 'drizzle-orm';
import permissions from '../../Helpers/Permissions/get';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
const router = express.Router();

router.get('/users', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('users')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to view users'
    });

    const {limit, offset} = req.query;
    const limitNumber = parseInt(limit as string) || 10;
    const offsetNumber = parseInt(offset as string) || 0;
    if (isNaN(limitNumber) || isNaN(offsetNumber)) return res.status(400).json({
        success: false,
        message: 'Invalid limit or offset'
    });
    const users = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        pterodactylId: usersTable.pterodactylId,
        suspended: usersTable.suspended,
        permissions: usersTable.permissions,
        credits: usersTable.credits,
        serverLimit: usersTable.serverLimit,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        emailVerifiedAt: usersTable.emailVerifiedAt
    }).from(usersTable).limit(limitNumber).offset(offsetNumber);

    return res.status(200).json(users);
});

router.get('/users/:id', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('users')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to view users'
    });

    const dbUser = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        pterodactylId: usersTable.pterodactylId,
        suspended: usersTable.suspended,
        permissions: usersTable.permissions,
        credits: usersTable.credits,
        serverLimit: usersTable.serverLimit,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        emailVerifiedAt: usersTable.emailVerifiedAt
    }).from(usersTable).where(
        eq(usersTable.id, parseInt(req.params.id))
    ).limit(1);
    
    const user = dbUser[0];
    if (!user) return res.status(404).json({
        success: false,
        message: 'User not found'
    });

    return res.status(200).json(user)
});


export default router;