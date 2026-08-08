import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new NotificationController();

router.use(authenticateToken);

router.get('/', controller.getNotifications);
router.patch('/:id/read', controller.markAsRead);

export default router;
