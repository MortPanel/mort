import express from 'express';
import { verifyToken } from '../Helpers/JWT';
import AccountRouter from "./Account";
import UsersRouter from "./Users";
import ConfigRouter from "./Config";
import ProductRouter from "./Product";
import ServerRouter from "./Server";
import UsefulLinksRouter from "./UsefulLinks";
import AdminRouter from "./Admin";
import TicketsRouter from "./Tickets";
import ShopRouter from "./Shop";
import { usersTable } from '../Database';
import { db } from '../Database/db';
import { and, eq } from 'drizzle-orm';
const app = express.Router();

app.use(async(req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader && !authHeader?.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return next();

    const isSuspended = await db.select().from(usersTable).where(
        and(eq(usersTable.id, user.id), eq(usersTable.suspended, true))
    );
    if (isSuspended.length > 0) return next();
    req.user = user;
    next();
});


app.use(AccountRouter);
app.use(UsersRouter);
app.use(ConfigRouter);
app.use(ProductRouter);
app.use(ServerRouter);
app.use(UsefulLinksRouter);
app.use(AdminRouter);
app.use(TicketsRouter);
app.use(ShopRouter);

export default app;