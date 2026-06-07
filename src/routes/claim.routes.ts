import { Router } from 'express';
import { createClaimController, getClaimHistoryController } from '../controllers/claim.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { uploadFoto } from '../middlewares/upload.middleware.js';

const router = Router();

// Semua endpoint di bawah ini wajib menyertakan token JWT login yang valid
router.use(authenticateJWT);

// Endpoint Pelapor untuk melakukan klaim barang miliknya yang sudah ditemukan
router.post('/process', uploadFoto.single('bukti_klaim'), createClaimController);

// Endpoint Khusus Admin untuk memantau data audit sirkulasi barang yang keluar/selesai
router.get('/history', authorizeRoles('ADMIN'), getClaimHistoryController);

export default router;