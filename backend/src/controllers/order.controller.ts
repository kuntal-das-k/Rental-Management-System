import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest } from '../middleware/auth';

const orderService = new OrderService();

export class OrderController {
  async getOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;
      const { state, search, page, limit, customerId, vendorId } = req.query;

      const filters: any = {
        state: state as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      };

      if (user.role === 'CUSTOMER') {
        filters.customerId = user.userId;
      } else if (user.role === 'VENDOR') {
        let vId = user.vendorId;
        if (!vId) {
          const { prisma } = require('../config');
          const v = await prisma.vendor.findUnique({ where: { user_id: user.userId } });
          vId = v?.id;
        }
        filters.vendorId = vId;
      } else if (user.role === 'ADMIN') {
        if (customerId) filters.customerId = customerId as string;
        if (vendorId) filters.vendorId = vendorId as string;
      }

      const result = await orderService.getOrders(filters);
      return res.status(200).json({ success: true, data: result.orders, meta: result.meta });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.body.customerId || req.body.customer_id || req.user!.userId;
      const order = await orderService.createOrder(customerId, req.body);
      return res.status(201).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async sendQuotation(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.sendQuotation(id);
      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async confirmOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.confirmOrder(id);
      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async createInvoice(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const invoice = await orderService.createInvoice(id);
      return res.status(201).json({ success: true, data: invoice });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async pickupOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { conditionNotes } = req.body;
      const order = await orderService.markPickedUp(id, conditionNotes);
      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async returnOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { conditionNotes, conditionPass } = req.body;
      const order = await orderService.markReturned(id, conditionNotes, conditionPass);
      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async cancelOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.cancelOrder(id);
      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
