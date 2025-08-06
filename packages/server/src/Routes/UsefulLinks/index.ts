import express from 'express';
import { db } from '../../Database/db';
import { usefulLinksTable } from '../../Database';
import permissions from '../../Helpers/Permissions/get';
import BodyValidationMiddleware from '../../Helpers/Middlewares/Validation';
import { requireAuth } from '../../Helpers/Middlewares/Auth';
import { createUsefulLinkSchema } from '../../Helpers/Validations/UsefulLinks/Create';
const router = express.Router();

router.post('/useful-links', requireAuth, (req, res, next) => BodyValidationMiddleware(req, res, next, createUsefulLinkSchema), async (req, res) => {
    if (!(await permissions(req.user.id)).includes('usefulLinks')) return res.status(403).json({
        success: false,
        message: 'You do not have permission to create useful links'
    });
    const { title, url, description, positions } = req.body;

    const [link] = await db.insert(usefulLinksTable).values({
        title,
        url,
        description,
        positions,
        createdBy: req.user.id
    }).$returningId();

    return res.status(201).json({
        success: true,
        data: link
    });
});

import id from './id';
router.use('/', id);

export default router;