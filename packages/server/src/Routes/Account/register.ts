import express from 'express';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { registerSchema } from '../../Helpers/Validations/Account/Register';
import CreateUser from '../../Helpers/Pterodactyl/Users/CreateUser';
import { usersTable } from '../../Database/Schemas/Users';
import CryptPassword from '../../Helpers/Cryptions/Password';
import { db } from '../../Database/db';
import { PterodactylErrorStyle } from '../../Helpers/Validations/Error';
import { signToken } from '../../Helpers/JWT';
import { requireNoAuth } from '../../Helpers/Middlewares/Auth';
import { eq } from 'drizzle-orm';
const router = express.Router();

router.post('/register', requireNoAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, registerSchema), async (req, res) => {
    let { username, email, password, isRoot = false, pterodactylId } = req.body;
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
    if (isRoot) {
        const rootUserExists = await db.select().from(usersTable).where(eq(usersTable.rootUser, true)).limit(1);
        if (rootUserExists.length > 0) return res.status(400).json({
            success: false,
            message: 'fail: root user already exists',
            errors: { isRoot: { errors: [{ code: '', message: 'Root user already exists' }] } }
        });
    } else pterodactylId = undefined;

    let request;
    if (!isRoot && !pterodactylId) {
        request = await CreateUser(email, username, password);

        if (request.errors) {
            return res.status(400).json({
                success: false,
                message: 'fail: pterodactyl user creation',
                errors: PterodactylErrorStyle({ errors: request.errors })
            });
        }
    }

    const findSameEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (findSameEmail.length > 0) return res.status(400).json({
        success: false,
        message: 'fail: email already exists',
        errors: { email: { errors: [{ code: '', message: 'Email already exists' }] } }
    });

    const findSameUsername = await db.select().from(usersTable).where(eq(usersTable.name, username)).limit(1);
    if (findSameUsername.length > 0) return res.status(400).json({
        success: false,
        message: 'fail: username already exists',
        errors: { username: { errors: [{ code: '', message: 'Username already exists' }] } }
    });

    const co = await db.insert(usersTable).values({
        name: username,
        email: email,
        password: CryptPassword(password),
        pterodactylId: pterodactylId || request!.attributes!.id,
        rootUser: isRoot || false,
        permissions: isRoot ? 1 : undefined
    }).$returningId();

    if (!co) return res.status(500).json({
        success: false,
        message: 'failed: database user creation'
    });

    return res.status(201).json({
        success: true,
        data: {
            id: co[0]?.id,
            token: signToken(co[0]?.id)
        }
    });
});


export default router;