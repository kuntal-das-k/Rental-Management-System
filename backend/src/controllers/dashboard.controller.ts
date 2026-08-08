import { Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config';

const dashboardService = new DashboardService();

export class DashboardController {
  private resolveVendorId = async (req: AuthenticatedRequest): Promise<string | undefined> => {
    const user = req.user;
    if (!user) return req.query.vendorId as string;
    if (user.role === 'VENDOR') {
      if (user.vendorId) return user.vendorId;
      const v = await prisma.vendor.findUnique({ where: { user_id: user.userId } });
      return v?.id;
    }
    return req.query.vendorId as string;
  };

  getMetrics = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const vendorId = await this.resolveVendorId(req);
      const timeframe = (req.query.timeframe as string) || 'week';
      const metrics = await dashboardService.getDashboardMetrics(vendorId, timeframe);
      return res.status(200).json({ success: true, data: metrics });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  };

  getSchedulerEvents = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const vendorId = await this.resolveVendorId(req);
      const targetDate = req.query.date ? new Date(req.query.date as string) : new Date();
      const events = await dashboardService.getDueAndOverdueOrders(vendorId, targetDate);
      return res.status(200).json({ success: true, data: events });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  };

  getReporting = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const targetVendorId = await this.resolveVendorId(req);
      const { metric, from, to } = req.query;
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
  };
}
