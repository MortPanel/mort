import express from 'express';
import { count, eq } from 'drizzle-orm';
import { db } from '../../../Database/db';
import { usersTable } from '../../../Database';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import permissions from '../../../Helpers/Permissions/get';
import { signToken } from '../../../Helpers/JWT';
import BodyValidationMiddleware from '../../../Helpers/Middlewares/Validation';
import { adminUpdateUserSchema } from '../../../Helpers/Validations/Admin/Users/Update';
import UpdateUser from '../../../Helpers/Pterodactyl/Users/UpdateUser';
import { PterodactylErrorStyle } from '../../../Helpers/Validations/Error';
const router = express.Router();

router.post('/:id/login', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('*')) return res.status(403).json({ success: false, message: 'missing permissions' });
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });
    const [user] = await db.select().from(usersTable).where(
        eq(usersTable.id, userId)
    ).limit(1);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const token = signToken(userId);
    return res.status(200).json({
        success: true,
        token,
    });
});

router.put('/:id', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, adminUpdateUserSchema), async (req, res) => {
    if (!(await permissions(req.user.id)).includes('*')) return res.status(403).json({
        success: false,
        message: 'missing permissions'
    });

    let { username, email, suspended, serverLimit, permissions: userPermissions } = req.body;
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });
    const [user] = await db.select().from(usersTable).where(
        eq(usersTable.id, userId)
    ).limit(1);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (email) {
        const existingEmail = await db.select().from(usersTable).where(
            eq(usersTable.email, email)
        ).limit(1);
        if (existingEmail.length > 0 && existingEmail[0].id !== userId) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
                errors: { email: { errors: [{ code: '', message: 'Email already exists' }] } }
            });
        }
    }

    if (username) {
        const existingUsername = await db.select().from(usersTable).where(
            eq(usersTable.name, username)
        ).limit(1);
        if (existingUsername.length > 0 && existingUsername[0].id !== userId) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
                errors: { username: { errors: [{ code: '', message: 'Username already exists' }] } }
            });
        }
    }

    if (user.rootUser && req.user.id !== userId) return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this user',
        errors: { email: { errors: [{ code: '', message: 'You do not have permission to update this user' }] } }
    });

    if(user.rootUser && suspended) return res.status(400).json({
        success: false,
        message: 'Root users cannot be suspended',
        errors: { suspended: { errors: [{ code: '', message: 'Root users cannot be suspended' }] } }
    });

    if((user.id === req.user.id && !user.rootUser) && userPermissions !== user.permissions) return res.status(400).json({
        success: false,
        message: 'You cannot change your own permissions',
        errors: { permissions: { errors: [{ code: '', message: 'You cannot change your own permissions' }] } }
    });

    if(user.id === req.user.id && suspended) return res.status(400).json({
        success: false,
        message: 'You cannot suspend your own account',
        errors: { suspended: { errors: [{ code: '', message: 'You cannot suspend your own account' }] } }
    });

    const u = await UpdateUser(userId, email, username);
    if (u.errors) return res.status(400).json({
        success: false,
        message: 'Pterodactyl user update failed',
        errors: PterodactylErrorStyle({ errors: u.errors })
    });

    await db.update(usersTable).set({
        name: username,
        email,
        suspended,
        serverLimit,
        permissions: userPermissions
    }).where(eq(usersTable.id, userId));

    return res.status(200).json({
        success: true
    });
});

export default router;