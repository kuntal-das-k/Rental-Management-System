import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const controller = new ContactController();

// Public: Submit contact form
router.post('/', controller.createMessage);

// Authenticated Users/Admin: View contact responses
router.get('/', authenticateToken, controller.getMessages);

// Admin: Update status of stored contact response
router.patch('/:id/status', authenticateToken, requireRole(['ADMIN']), controller.updateMessageStatus);

export default router;
