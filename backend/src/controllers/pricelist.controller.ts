import { Response } from 'express';
import { PricelistService } from '../services/pricelist.service';
import { AuthenticatedRequest } from '../middleware/auth';

const pricelistService = new PricelistService();

export class PricelistController {
  async getPricelists(req: AuthenticatedRequest, res: Response) {
    try {
      const vendorId = req.user!.vendorId || (req.query.vendorId as string);
      if (!vendorId) {
        return res.status(400).json({ success: false, error: 'Vendor ID is required' });
      }
      const lists = await pricelistService.getPricelists(vendorId);
      return res.status(200).json({ success: true, data: lists });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async createPricelist(req: AuthenticatedRequest, res: Response) {
    try {
      const vendorId = req.user!.vendorId!;
      const { name, isDefault } = req.body;
      const list = await pricelistService.createPricelist(vendorId, name, isDefault);
      return res.status(201).json({ success: true, data: list });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async addRule(req: AuthenticatedRequest, res: Response) {
    try {
      const rule = await pricelistService.addRule(req.body);
      return res.status(201).json({ success: true, data: rule });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async deleteRule(req: AuthenticatedRequest, res: Response) {
    try {
      const { ruleId } = req.params;
      await pricelistService.deleteRule(ruleId);
      return res.status(200).json({ success: true, data: { message: 'Rule deleted successfully' } });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
