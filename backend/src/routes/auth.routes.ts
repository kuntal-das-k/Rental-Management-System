import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login);
router.post('/signup/customer', controller.signupCustomer);
router.post('/signup/vendor', controller.signupVendor);
router.post('/reset-password', controller.resetPassword);

// Admin user management
router.get('/users', authenticateToken, requireRole(['ADMIN']), controller.getUsers);
router.patch('/users/:id/active', authenticateToken, requireRole(['ADMIN']), controller.toggleUserActive);

export default router;
