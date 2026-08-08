import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const controller = new ProductController();

// Public routes
router.get('/', controller.getProducts);
router.get('/attributes', controller.getAttributes);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getProductById);

// Protected routes (Vendor / Admin)
router.post('/', authenticateToken, requireRole(['VENDOR', 'ADMIN']), controller.createProduct);
router.put('/:id', authenticateToken, requireRole(['VENDOR', 'ADMIN']), controller.updateProduct);
router.delete('/:id', authenticateToken, requireRole(['VENDOR', 'ADMIN']), controller.deleteProduct);

// Admin-only toggle publish route
router.patch('/:id/publish', authenticateToken, requireRole(['ADMIN']), controller.togglePublish);

export default router;
