import { Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../middleware/auth';

const dashboardService = new DashboardService();

export class DashboardController {
  async getMetrics(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;
      const vendorId = user.role === 'VENDOR' ? user.vendorId : (req.query.vendorId as string);
      const metrics = await dashboardService.getDashboardMetrics(vendorId);
      return res.status(200).json({ success: true, data: metrics });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getSchedulerEvents(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;
      const vendorId = user.role === 'VENDOR' ? user.vendorId : (req.query.vendorId as string);
      const targetDate = req.query.date ? new Date(req.query.date as string) : new Date();
      const events = await dashboardService.getDueAndOverdueOrders(vendorId, targetDate);
      return res.status(200).json({ success: true, data: events });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getReporting(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;
      const { metric, from, to, vendorId } = req.query;
      const targetVendorId = user.role === 'VENDOR' ? user.vendorId : (vendorId as string);
      const data = await dashboardService.getReportingData(
        (metric as string) || 'revenue',
        from as string,
        to as string,
        targetVendorId
      );
      return res.status(200).json({ success: true, data });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
