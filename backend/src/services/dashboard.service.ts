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

  async getDashboardMetrics(vendorId?: string, timeframe: string = 'week') {
    const whereBase: any = {};
    if (vendorId) whereBase.vendor_id = vendorId;

    const now = new Date();
    const { dueToday, overdue } = await this.getDueAndOverdueOrders(vendorId);

    // Completed orders count
    const completedCount = await prisma.order.count({
      where: { ...whereBase, state: 'RETURNED' },
    });

    const [
      totalRevenueResult,
      activeRentalsCount,
      upcomingPickupsCount,
      upcomingReturnsCount,
      totalDepositsResult,
      totalDepositsCount,
      totalLateFeesResult,
      recentOrders,
    ] = await Promise.all([
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

      prisma.order.count({
        where: { ...whereBase, state: 'PICKED_UP', scheduled_return_at: { gte: now } },
      }),

      prisma.payment.aggregate({
        where: { order: whereBase, type: 'DEPOSIT' },
        _sum: { amount: true },
      }),

      prisma.payment.count({
        where: { order: whereBase, type: 'DEPOSIT' },
      }),

      prisma.payment.aggregate({
        where: { order: whereBase, type: 'LATE_FEE' },
        _sum: { amount: true },
      }),

      prisma.order.findMany({
        where: whereBase,
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          vendor: { select: { id: true, company_name: true } },
          order_items: { include: { product: true } },
        },
      }),
    ]);

    // Total orders across system
    const totalOrdersCount = activeRentalsCount + completedCount + overdue.length;
    const calcPct = (cnt: number) => (totalOrdersCount > 0 ? Math.round((cnt / totalOrdersCount) * 100) : 0);

    const statusDistribution = [
      { key: 'active', label: 'Active Rentals', count: activeRentalsCount, percentage: calcPct(activeRentalsCount), color: '#0F172A' },
      { key: 'upcoming_returns', label: 'Upcoming Returns', count: upcomingReturnsCount, percentage: calcPct(upcomingReturnsCount), color: '#475569' },
      { key: 'upcoming_pickups', label: 'Upcoming Pickups', count: upcomingPickupsCount, percentage: calcPct(upcomingPickupsCount), color: '#94A3B8' },
      { key: 'overdue', label: 'Overdue Rentals', count: overdue.length, percentage: calcPct(overdue.length), color: '#CBD5E1' },
      { key: 'completed', label: 'Completed Rentals', count: completedCount, percentage: calcPct(completedCount), color: '#E2E8F0' },
    ];

    // Generate Overview Line/Area Chart points
    const chartPoints: Array<{ label: string; fullDate: string; revenue: number; orders: number }> = [];
    const daysToGenerate = timeframe === 'month' ? 30 : 7;

    if (timeframe === 'year') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthLabel = d.toLocaleString('default', { month: 'short' });

        const agg = await prisma.order.aggregate({
          where: {
            ...whereBase,
            created_at: { gte: d, lt: nextD },
            state: { in: ['SALES_ORDER', 'PICKED_UP', 'RETURNED'] },
          },
          _sum: { total_amount: true },
          _count: { id: true },
        });

        chartPoints.push({
          label: monthLabel,
          fullDate: monthLabel,
          revenue: agg._sum.total_amount || 0,
          orders: agg._count.id || 0,
        });
      }
    } else {
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);

        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isoDate = d.toISOString().split('T')[0];

        const agg = await prisma.order.aggregate({
          where: {
            ...whereBase,
            created_at: { gte: dayStart, lte: dayEnd },
            state: { in: ['SALES_ORDER', 'PICKED_UP', 'RETURNED'] },
          },
          _sum: { total_amount: true },
          _count: { id: true },
        });

        chartPoints.push({
          label: dateLabel,
          fullDate: isoDate,
          revenue: agg._sum.total_amount || 0,
          orders: agg._count.id || 0,
        });
      }
    }

    return {
      activeRentals: activeRentalsCount,
      rentalsDueToday: dueToday.length,
      upcomingPickups: upcomingPickupsCount,
      upcomingReturns: upcomingReturnsCount,
      overdueRentals: overdue.length,
      totalRevenue: totalRevenueResult._sum.total_amount || 0,
      thisWeekRevenue: totalRevenueResult._sum.total_amount || 0,
      securityDepositsHeld: totalDepositsResult._sum.amount || 0,
      securityDepositsCount: totalDepositsCount,
      lateFeeCollection: totalLateFeesResult._sum.amount || 0,
      totalOrdersCount,
      dueTodayOrders: dueToday,
      overdueOrders: overdue,
      recentOrders,
      statusDistribution,
      overviewChart: chartPoints,
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
