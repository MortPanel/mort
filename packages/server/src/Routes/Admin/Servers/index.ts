import express from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../../Database/db';
import { serversTable } from '../../../Database';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import permissions from '../../../Helpers/Permissions/get';
import BodyValidationMiddleware from '../../../Helpers/Middlewares/Validation';
import { adminUpdateServerSchema } from '../../../Helpers/Validations/Admin/Servers/Update';
import SuspendServer from '../../../Helpers/Pterodactyl/Server/SuspendServer';
import UnsuspendServer from '../../../Helpers/Pterodactyl/Server/UnsuspendServer';
import { startBillingOfServer } from '../../../CronJobs/Billing';
import UpdateServer from '../../../Helpers/Pterodactyl/Server/UpdateServer';
import { PterodactylErrorStyle } from '../../../Helpers/Validations/Error';
import DeleteServer from '../../../Helpers/Pterodactyl/Server/DeleteServer';
const router = express.Router();

router.delete('/:id', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('servers')) return res.status(403).json({ success: false, message: 'missing permissions' });
    const { id } = req.params;
    const serverId = parseInt(id);
    if (isNaN(serverId)) return res.status(400).json({
        success: false,
        message: 'Invalid server ID'
    });

    const findServer = await db.select().from(serversTable).where(
        eq(serversTable.id, serverId),
    ).limit(1);

    if (!findServer.length) return res.status(404).json({
        success: false,
        message: 'Server not found'
    });

    const deletereq = await DeleteServer(findServer[0].id);
    if (deletereq.errors) return res.status(500).json({
        success: false,
        message: 'Failed to delete server from Pterodactyl',
        errors: PterodactylErrorStyle({ errors: deletereq.errors })
    });

    await db.delete(serversTable).where(eq(serversTable.id, serverId));

    return res.status(200).json({success: true});
});

router.put('/:id', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, adminUpdateServerSchema), async (req, res) => {
    const { name, description, suspended } = req.body;

    if (!(await permissions(req.user.id)).includes('servers')) return res.status(403).json({ success: false, message: 'missing permissions' });

    const serverId = parseInt(req.params.id);
    if (isNaN(serverId)) return res.status(400).json({ success: false, message: 'Invalid server ID' });

    const [server] = await db.select().from(serversTable).where(
        eq(serversTable.id, serverId)
    ).limit(1);
    if (!server) return res.status(404).json({ success: false, message: 'Server not found' });
    const u = await UpdateServer(serverId, name, description, server.userId);
    if (u.errors) return res.status(400).json({
        success: false,
        message: 'Pterodactyl server update failed',
        errors: PterodactylErrorStyle({ errors: u.errors })
    });

    if(!server.suspended && suspended) await SuspendServer(serverId);
    if(server.suspended && !suspended) await UnsuspendServer(serverId);

    let updatedFields: Partial<typeof serversTable.$inferInsert> = {
        name: name?.trim(),
        description: description?.trim(),
        suspended: suspended ?? server.suspended,
    };
    const isCurrentlySuspended = suspended ?? server.suspended;

    if (isCurrentlySuspended) updatedFields.nextBilling = new Date(0, 11, 31);
    else if (server.nextBilling && isNaN(server.nextBilling.getTime())) {
        updatedFields.nextBilling = new Date();
        startBillingOfServer(serverId);
    }

    await db.update(serversTable)
        .set(updatedFields)
        .where(eq(serversTable.id, serverId));

    return res.status(200).json({ success: true });
});

export default router;