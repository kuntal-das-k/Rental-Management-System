import { Router } from 'express';
import { PricelistController } from '../controllers/pricelist.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const controller = new PricelistController();

router.use(authenticateToken);

router.get('/', controller.getPricelists);
router.post('/', requireRole(['VENDOR', 'ADMIN']), controller.createPricelist);
router.post('/rules', requireRole(['VENDOR', 'ADMIN']), controller.addRule);
router.delete('/rules/:ruleId', requireRole(['VENDOR', 'ADMIN']), controller.deleteRule);

export default router;
