import 'dotenv/config';
import express from 'express';
const app = express();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

import {startBilling} from "./src/CronJobs/Billing"
startBilling()
console.log('[Server] Starting...');

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');

import Routes from './src/Routes';

app.use('/', Routes);

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(err);
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.use((_req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Not Found'
    });
});

app.listen(process.env.PORT, () => console.log(`[Server] Listening on port ${process.env.PORT}.`));