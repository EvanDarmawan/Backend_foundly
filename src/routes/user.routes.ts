import { Router } from 'express';
import { 
  getMyProfileController, 
  updateMyProfileController, 
  getAllUsersController, 
  changeRoleController,
  deleteUserController
} from '../controllers/user.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Semua rute di file ini wajib mebawa token JWT yang valid
router.use(authenticateJWT);

// Rute General (Pelapor, Penemu, Admin bisa akses milik masing-masing)
router.get('/me', getMyProfileController);
router.put('/me', updateMyProfileController);

// Rute Khusus Admin (Role Management & Audit)
router.get('/all', authorizeRoles('ADMIN'), getAllUsersController);
router.put('/role/:id', authorizeRoles('ADMIN'), changeRoleController);
router.delete('/:id', authorizeRoles('ADMIN'), deleteUserController);

export default router;