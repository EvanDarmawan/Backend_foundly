import { Router } from 'express';
import { getMyNotificationsController, readNotificationController } from '../controllers/notification.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Seluruh rute wajib membawa token login JWT
router.use(authenticateJWT);

router.get('/', getMyNotificationsController);
router.put('/:id/read', readNotificationController);

export default router;