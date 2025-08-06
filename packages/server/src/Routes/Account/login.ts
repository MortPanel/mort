import express from 'express';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { usersTable } from '../../Database/Schemas/Users';
import { ComparePassword } from '../../Helpers/Cryptions/Password';
import { db } from '../../Database/db';
import { loginSchema } from '../../Helpers/Validations/Account/Login';
import { eq } from 'drizzle-orm';
import { signToken } from '../../Helpers/JWT';
import { requireNoAuth } from '../../Helpers/Middlewares/Auth';
const router = express.Router();

router.post('/login', requireNoAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, loginSchema), async (req, res) => {
    const { email, password } = req.body;

    const users = await db.select().from(usersTable).where(
        eq(usersTable.email, email)
    );
    const user = users[0];
    if (!user) return res.status(400).json({
        success: false,
        message: 'Mail or password is incorrect',
        errors: {"email": {"errors": [{code: "",message:"Mail or password is incorrect"}]}},
    });

    if (!ComparePassword(password, user.password)) return res.status(400).json({
        success: false,
        message: 'Mail or password is incorrect',
        errors: {"email": {"errors": [{code: "",message:"Mail or password is incorrect"}]}},
    });

    return res.status(200).json({
        success: true,
        data: {
            id: user.id,
            token: signToken(user.id),
        }
    });
});

export default router;