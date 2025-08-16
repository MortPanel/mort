import express from 'express';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import { serversTable, ticketsTable } from '../../../Database';
import { db } from '../../../Database/db';
import { and, eq } from 'drizzle-orm';
import DeleteServer from '../../../Helpers/Pterodactyl/Server/DeleteServer';
import { PterodactylErrorStyle } from '../../../Helpers/Validations/Error';
const router = express.Router();

router.delete('/servers/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const serverId = parseInt(id);
    if (isNaN(serverId)) return res.status(400).json({
        success: false,
        message: 'Invalid server ID'
    });

    const findServer = await db.select().from(serversTable).where(
        and(
            eq(serversTable.id, serverId),
            eq(serversTable.userId, req.user.id)
        )
    ).limit(1);

    if (!findServer.length) return res.status(404).json({
        success: false,
        message: 'Server not found or you do not have permission to delete it'
    });

    const deletereq = await DeleteServer(Number(findServer[0].pterodactylId));
    if (deletereq.errors) return res.status(500).json({
        success: false,
        message: 'Failed to delete server from Pterodactyl',
        errors: PterodactylErrorStyle({ errors: deletereq.errors })
    });

    await db.update(ticketsTable).set({
        serverId: null
    }).where(eq(ticketsTable.serverId, serverId));

    await db.delete(serversTable).where(
        and(
            eq(serversTable.id, serverId),
            eq(serversTable.userId, req.user.id)
        )
    );

    return res.status(200).json({
        success: true
    });
});

export default router;