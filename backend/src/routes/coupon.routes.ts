import { Router, Request, Response } from 'express';
import { prisma } from '../config';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Coupon code is required' });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid coupon code' });
    }

    const now = new Date();
    if (now < new Date(coupon.valid_from) || now > new Date(coupon.valid_to)) {
      return res.status(400).json({ success: false, error: 'Coupon code has expired' });
    }

    if (coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
