import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const controller = new OrderController();

router.use(authenticateToken);

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.post('/', controller.createOrder);

// State transitions
router.patch('/:id/send-quotation', requireRole(['VENDOR', 'ADMIN']), controller.sendQuotation);
router.patch('/:id/confirm', requireRole(['VENDOR', 'ADMIN', 'CUSTOMER']), controller.confirmOrder);
router.post('/:id/create-invoice', requireRole(['VENDOR', 'ADMIN', 'CUSTOMER']), controller.createInvoice);
router.patch('/:id/pickup', requireRole(['VENDOR', 'ADMIN']), controller.pickupOrder);
router.patch('/:id/return', requireRole(['VENDOR', 'ADMIN']), controller.returnOrder);
router.patch('/:id/cancel', controller.cancelOrder);

export default router;
