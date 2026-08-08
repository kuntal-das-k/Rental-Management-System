import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new DashboardController();

router.use(authenticateToken);

router.get('/metrics', controller.getMetrics);
router.get('/scheduler', controller.getSchedulerEvents);
router.get('/reporting', controller.getReporting);

export default router;
