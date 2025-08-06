import express from 'express';
import { db } from '../../Database/db';
import { eggsTable, locationsTable, nestsTable, nodesTable, usefulLinksTable, usersTable } from '../../Database';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import permissions from '../../Helpers/Permissions/get';
import GetNodes from '../../Helpers/Pterodactyl/Nodes/GetNodes';
import GetLocations from '../../Helpers/Pterodactyl/Locations/GetLocations';
import GetNests from '../../Helpers/Pterodactyl/Nests/GetNests';
import GetNestEggs from '../../Helpers/Pterodactyl/Nests/Eggs/GetNestEggs';
const router = express.Router();

router.get('/config', async (req, res) => {
    const requiredEnvs = [
        'DB_HOST',
        'DB_USER',
        'DB_NAME',
        'JWT_SECRET',
        'PTERODACTYL_API_KEY',
        'PTERODACTYL_PANEL_URL',
        'CRON_TIMEZONE'
    ];
    const isSetupDone = requiredEnvs.every(env => process.env[env]);
    const findRootUser = await db.select().from(usersTable).where(
        eq(usersTable.rootUser, true)
    ).limit(1);

    let response:any = {}
    response.isSetupDone = isSetupDone;
    response.rootUserExists = findRootUser.length > 0;
    if(req.user) {
        response.nests = await db.select({
            id: nestsTable.id,
            name: nestsTable.name,
            description: nestsTable.description
        }).from(nestsTable);

        response.eggs = await db.select({
            id: eggsTable.id,
            nestId: eggsTable.nestId,
            name: eggsTable.name,
            description: eggsTable.description
        }).from(eggsTable);

        response.nodes = await db.select({
            id: nodesTable.id,
            name: nodesTable.name,
            description: nodesTable.description
        }).from(nodesTable);

        response.usefulLinks = await db.select().from(usefulLinksTable);
        for (const link of response.usefulLinks) link.positions = JSON.parse(link.positions);
    }
    return res.status(200).json(response);
});

router.post('/sync', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('*')) return res.status(403).json({ success: false, message: 'You do not have permission to sync' });

    const [
        nodes,
        nests,
        locations
    ] = [await GetNodes(), await GetNests(), await GetLocations()];

    for (const l of locations.data || []) {
        await upsert(locationsTable, l.attributes.id, {
            name: l.attributes.short,
            description: l.attributes.long,
            createdAt: new Date(l.attributes.created_at),
            updatedAt: new Date(l.attributes.updated_at)
        });
    }

    for (const n of nests.data || []) {
        await upsert(nestsTable, n.attributes.id, {
            name: n.attributes.name,
            description: n.attributes.description,
            createdAt: new Date(n.attributes.created_at),
            updatedAt: new Date(n.attributes.updated_at)
        });
        const eggs = await GetNestEggs(n.attributes.id);
        for (const e of eggs.data || []) {
            const environment = (e.attributes.relationships?.variables?.data || []).map((variable: any) => ({
                name: variable.attributes.name,
                description: variable.attributes.description,
                default_value: variable.attributes.default_value,
                env_variable: variable.attributes.env_variable,
                user_viewable: variable.attributes.user_viewable,
                user_editable: variable.attributes.user_editable,
                rules: variable.attributes.rules,
            }));

            await upsert(eggsTable, e.attributes.id, {
                nestId: n.attributes.id,
                name: e.attributes.name,
                description: e.attributes.description,
                dockerImage: e.attributes.docker_image,
                startup: e.attributes.startup,
                environment,
                createdAt: new Date(e.attributes.created_at),
                updatedAt: new Date(e.attributes.updated_at)
            });
        }
    }

    for (const nd of nodes.data || []) {
        await upsert(nodesTable, nd.attributes.id, {
            locationId: nd.attributes.location_id,
            name: nd.attributes.name,
            description: nd.attributes.description,
            createdAt: new Date(nd.attributes.created_at),
            updatedAt: new Date(nd.attributes.updated_at)
        });
    }
    return res.status(204).json();
});

async function upsert(table: any, id: number, values: any) {
    const exists = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (exists.length > 0) await db.update(table).set(values).where(eq(table.id, id));
    else await db.insert(table).values({ id, ...values });
}

export default router;