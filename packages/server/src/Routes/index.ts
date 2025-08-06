import express from 'express';
import { verifyToken } from '../Helpers/JWT';
import AccountRouter from "./Account";
import UsersRouter from "./Users";
import ConfigRouter from "./Config";
import ProductRouter from "./Product";
import ServerRouter from "./Server";
import UsefulLinksRouter from "./UsefulLinks";
const app = express.Router();

app.use((req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader && !authHeader?.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return next();

    req.user = user;
    next();
});


app.use(AccountRouter);
app.use(UsersRouter);
app.use(ConfigRouter);
app.use(ProductRouter);
app.use(ServerRouter);
app.use(UsefulLinksRouter);

export default app;