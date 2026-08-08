import { prisma } from '../config';

export class DashboardService {
  /**
   * REUSABLE SERVICE FUNCTION: Query due and overdue rentals for a vendor/admin
   */
  async getDueAndOverdueOrders(vendorId?: string, targetDate: Date = new Date()) {
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const whereBase: any = {};
    if (vendorId) whereBase.vendor_id = vendorId;

    const [dueToday, overdue] = await Promise.all([
      prisma.order.findMany({
        where: {
          ...whereBase,
          state: { in: ['SALES_ORDER', 'PICKED_UP'] },
          scheduled_return_at: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          customer: { select: { name: true, email: true } },
          order_items: { include: { product: true } },
        },
      }),

      prisma.order.findMany({
        where: {
          ...whereBase,
          state: { in: ['SALES_ORDER', 'PICKED_UP'] },
          scheduled_return_at: { lt: startOfDay },
        },
        include: {
          customer: { select: { name: true, email: true } },
          order_items: { include: { product: true } },
        },
      }),
    ]);

    return {
      dueToday,
      overdue,
      totalDueTodayCount: dueToday.length,
      totalOverdueCount: overdue.length,
    };
  }

  async getDashboardMetrics(vendorId?: string) {
    const whereBase: any = {};
    if (vendorId) whereBase.vendor_id = vendorId;

    const { dueToday, overdue } = await this.getDueAndOverdueOrders(vendorId);

    const [totalRevenueResult, activeRentalsCount, pendingPickupsCount, totalDepositsResult, totalLateFeesResult] = await Promise.all([
      prisma.order.aggregate({
        where: { ...whereBase, state: { in: ['SALES_ORDER', 'PICKED_UP', 'RETURNED'] } },
        _sum: { total_amount: true },
      }),

      prisma.order.count({
        where: { ...whereBase, state: { in: ['SALES_ORDER', 'PICKED_UP'] } },
      }),

      prisma.order.count({
        where: { ...whereBase, state: 'SALES_ORDER' },
      }),

      prisma.payment.aggregate({
        where: { order: whereBase, type: 'DEPOSIT' },
        _sum: { amount: true },
      }),

      prisma.payment.aggregate({
        where: { order: whereBase, type: 'LATE_FEE' },
        _sum: { amount: true },
      }),
    ]);

    return {
      activeRentals: activeRentalsCount,
      rentalsDueToday: dueToday.length,
      upcomingPickups: pendingPickupsCount,
      overdueRentals: overdue.length,
      totalRevenue: totalRevenueResult._sum.total_amount || 0,
      securityDepositsHeld: totalDepositsResult._sum.amount || 0,
      lateFeeCollection: totalLateFeesResult._sum.amount || 0,
      dueTodayOrders: dueToday,
      overdueOrders: overdue,
    };
  }

  async getReportingData(metric: string, fromDate?: string, toDate?: string, vendorId?: string) {
    const where: any = {};
    if (vendorId) where.vendor_id = vendorId;

    if (fromDate || toDate) {
      where.created_at = {};
      if (fromDate) where.created_at.gte = new Date(fromDate);
      if (toDate) where.created_at.lte = new Date(toDate);
    }

    const orders = await prisma.order.findMany({
      where,
      include: { vendor: { select: { company_name: true } } },
      orderBy: { created_at: 'asc' },
    });

    const monthlyMap: Record<string, { label: string; value: number }> = {};

    orders.forEach((ord) => {
      const monthKey = new Date(ord.created_at).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { label: monthKey, value: 0 };
      }

      if (metric === 'revenue') {
        monthlyMap[monthKey].value += ord.total_amount;
      } else if (metric === 'orders') {
        monthlyMap[monthKey].value += 1;
      }
    });

    return Object.values(monthlyMap);
  }
}
