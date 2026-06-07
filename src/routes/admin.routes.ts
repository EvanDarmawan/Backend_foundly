import { Router } from 'express';
import { 
  getDashboardStatsController, 
  getPendingVerificationsController, 
  verifyMatchController 
} from '../controllers/admin.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// GERBANG UTAMA: Seluruh rute di bawah ini wajib LOGIN dan berstatus ADMIN
router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

// Endpoints
router.get('/stats', getDashboardStatsController);
router.get('/verifications/pending', getPendingVerificationsController);
router.post('/verifications/process', verifyMatchController);

export default router;