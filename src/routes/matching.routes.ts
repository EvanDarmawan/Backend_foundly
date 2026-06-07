import { Router } from 'express';
import { getMatchResultsController } from '../controllers/matching.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Wajib login untuk melihat hasil pencocokan barang miliknya sendiri
router.get('/matches/:id_barang_hilang', authenticateJWT, getMatchResultsController);

export default router;