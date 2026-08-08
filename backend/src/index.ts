import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { config } from './config';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import pricelistRoutes from './routes/pricelist.routes';
import orderRoutes from './routes/order.routes';
import dashboardRoutes from './routes/dashboard.routes';
import couponRoutes from './routes/coupon.routes';
import wishlistRoutes from './routes/wishlist.routes';
import notificationRoutes from './routes/notification.routes';
import contactRoutes from './routes/contact.routes';

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const invoicesDir = path.join(uploadsDir, 'invoices');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

// Static file serving for images & generated PDF invoices
app.use('/uploads', express.static(uploadsDir));

// API Router Mounts (REST versioned under /api/v1/)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/pricelists', pricelistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/contact', contactRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'TwinSix Rentals API operational 🚀' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

app.listen(config.port, () => {
  console.log(`⚡ TwinSix Rentals API Server listening on port ${config.port}`);
});

export default app;
