import { productsTable, serversTable, usersTable } from "../Database";
import { db } from "../Database/db";
import { and, eq } from "drizzle-orm";
import { CronJob } from 'cron';
export const billingCycleMap: Record<string, number> = {
    hourly: 3600,
    daily: 86400,
    weekly: 604800,
    monthly: 2592000
};

async function processBilling(server: any, product: any) {
    const [existingServer] = await db.select().from(serversTable).where(and(eq(serversTable.id, server.id), eq(serversTable.userId, server.userId), eq(serversTable.productId, server.productId))).limit(1);
    if (!existingServer) return false;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, server.userId)).limit(1);
    if (!user || user.credits < product.price) {
        // todo: suspend server
        return false;
    }

    await db.update(usersTable).set({ credits: user.credits - product.price }).where(eq(usersTable.id, user.id));

    const interval = billingCycleMap[product.billingCycle];
    const nextBillingDate = new Date(server.nextBilling || new Date());
    nextBillingDate.setSeconds(nextBillingDate.getSeconds() + interval);

    await db.update(serversTable).set({ nextBilling: nextBillingDate }).where(eq(serversTable.id, server.id));
    await startBillingOfServer(server.id);
    return true;
}

export const startBilling = async () => {
    const allServers = await db.select().from(serversTable);
    const allProducts = await db.select().from(productsTable);
    const timezone = process.env.CRON_TIMEZONE;
    const currentDate = new Date();

    for (const server of allServers) {
        const product = allProducts.find(p => p.id === server.productId)!;

        const nextBillingDate = new Date(server.nextBilling!);
        if (nextBillingDate <= currentDate) await processBilling(server, product);
        else new CronJob(
            nextBillingDate,
            async () => { await processBilling(server, product); },
            null,
            true,
            timezone
        );
    }
}

export const startBillingOfServer = async (serverId: number) => {
    const server = await db.select().from(serversTable).where(eq(serversTable.id, serverId)).limit(1);
    const product = await db.select().from(productsTable).where(eq(productsTable.id, server[0].productId)).limit(1);
    const currentDate = new Date();
    const nextBillingDate = new Date(server[0].nextBilling!);

    if (nextBillingDate <= currentDate) await processBilling(server[0], product[0]);
    else new CronJob(
            nextBillingDate,
            async () => { await processBilling(server[0], product[0]); },
            null,
            true,
            process.env.CRON_TIMEZONE
        );
}