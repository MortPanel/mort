import { productsTable, serversTable, usersTable } from "../Database";
import { db } from "../Database/db";
import { and, eq } from "drizzle-orm";
import { CronJob } from 'cron';
import SuspendServer from "../Helpers/Pterodactyl/Server/SuspendServer";
import UnsuspendServer from "../Helpers/Pterodactyl/Server/UnsuspendServer";
export const billingCycleMap: Record<string, number> = {
    hourly: 3600,
    daily: 86400,
    weekly: 604800,
    monthly: 2592000
};

async function processBilling(server: any, product: any, nextBilling?: Date): Promise<boolean> {
    const [existingServer] = await db.select().from(serversTable).where(and(eq(serversTable.id, server.id), eq(serversTable.userId, server.userId), eq(serversTable.productId, server.productId))).limit(1);
    if (!existingServer) return false;
    const existingTime = existingServer.nextBilling ? new Date(existingServer.nextBilling).getTime() : null;
    const nextTime = nextBilling ? nextBilling.getTime() : null;
    if (nextBilling && existingTime !== nextTime) return false;
    if(nextBilling && isNaN(nextBilling.getTime())) return false; // for suspended servers by admin
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, server.userId)).limit(1);
    const between = Math.floor((new Date().getTime() - new Date(server.nextBilling!).getTime()) / 1000);
    const cycles = Math.floor(between / billingCycleMap[product.billingCycle]) || 1;

    if (!user || user.credits < (product.price * cycles)) {
        if(!existingServer.suspended) {
            await db.update(serversTable).set({ suspended: true }).where(eq(serversTable.id, server.id));
            await SuspendServer(server.id);
        }
        const nextCheckDate = new Date();
        nextCheckDate.setMinutes(nextCheckDate.getMinutes() + 1);

        await db.update(serversTable)
            .set({ nextBilling: nextCheckDate })
            .where(eq(serversTable.id, server.id));
        startBillingOfServer(server.id);
        
        return false;
    }

    if(existingServer.suspended) {
        await db.update(serversTable).set({ suspended: false }).where(eq(serversTable.id, server.id));
        await UnsuspendServer(server.id);
    }

    await db.update(usersTable).set({ credits: user.credits - (product.price * cycles) }).where(eq(usersTable.id, user.id));

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
        if (isNaN(nextBillingDate.getTime())) continue; // for suspended servers by admin
        if (nextBillingDate <= currentDate) await processBilling(server, product, nextBillingDate);
        else new CronJob(
            nextBillingDate,
            async () => { await processBilling(server, product, nextBillingDate); },
            null,
            true,
            timezone
        );
    }
}

export const startBillingOfServer = async (serverId: number) => {
    const [server] = await db.select().from(serversTable).where(eq(serversTable.id, serverId)).limit(1);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, server.productId)).limit(1);
    const currentDate = new Date();
    const nextBillingDate = new Date(server.nextBilling!);
    if (isNaN(nextBillingDate.getTime())) return; // for suspended servers by admin
    if (nextBillingDate <= currentDate) await processBilling(server, product, nextBillingDate);
    else new CronJob(
        nextBillingDate,
        async () => { await processBilling(server, product, nextBillingDate); },
        null,
        true,
        process.env.CRON_TIMEZONE
    );
}