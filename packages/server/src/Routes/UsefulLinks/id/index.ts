import express from 'express';
import { requireAuth } from '../../../Helpers/Middlewares/Auth';
import BodyValidationMiddleware from '../../../Helpers/Middlewares/Validation';
import { createUsefulLinkSchema } from '../../../Helpers/Validations/UsefulLinks/Create';
import permissions from '../../../Helpers/Permissions/get';
import { db } from '../../../Database/db';
import { usefulLinksTable } from '../../../Database';
import { eq } from 'drizzle-orm';
const router = express.Router();

router.put('/useful-links/:id', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createUsefulLinkSchema), async (req, res) => {
    if (!(await permissions(req.user.id)).includes('usefulLinks')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit useful links'
    });
    const { title, url, description, positions } = req.body;

    const findId = parseInt(req.params.id);
    if (isNaN(findId)) return res.status(400).json({
        success: false,
        message: 'Invalid useful link ID'
    });

    const [link] = await db.update(usefulLinksTable).set({
        title,
        url,
        description,
        positions: positions,
    }).where(
        eq(usefulLinksTable.id, findId)
    );

    if (!link) return res.status(404).json({
        success: false,
        message: 'Useful link not found'
    });

    return res.status(200).json({
        success: true
    });
});

router.delete('/useful-links/:id', requireAuth, async (req, res) => {
    if (!(await permissions(req.user.id)).includes('usefulLinks')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete useful links'
    });

    const findId = parseInt(req.params.id);
    if (isNaN(findId)) return res.status(400).json({
        success: false,
        message: 'Invalid useful link ID'
    });

    const [link] = await db.delete(usefulLinksTable).where(
        eq(usefulLinksTable.id, findId)
    );

    if (!link) return res.status(404).json({
        success: false,
        message: 'Useful link not found'
    });

    return res.status(200).json({
        success: true
    });
});

export default router;