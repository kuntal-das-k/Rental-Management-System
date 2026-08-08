import { Router, Response } from 'express';
import { prisma } from '../config';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user!.userId;
    const wishlist = await prisma.wishlist.findMany({
      where: { customer_id: customerId },
      include: {
        product: {
          include: { category: true, vendor: { select: { company_name: true } } },
        },
      },
    });
    return res.status(200).json({ success: true, data: wishlist.map((w) => w.product) });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/toggle', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user!.userId;
    const { productId } = req.body;

    const existing = await prisma.wishlist.findUnique({
      where: {
        customer_id_product_id: {
          customer_id: customerId,
          product_id: productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return res.status(200).json({ success: true, data: { isWishlisted: false } });
    } else {
      await prisma.wishlist.create({
        data: {
          customer_id: customerId,
          product_id: productId,
        },
      });
      return res.status(200).json({ success: true, data: { isWishlisted: true } });
    }
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
