import { prisma } from '../config';

export class OrderRepository {
  async findAll(filters: {
    vendorId?: string;
    customerId?: string;
    state?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.vendorId) where.vendor_id = filters.vendorId;
    if (filters.customerId) where.customer_id = filters.customerId;
    if (filters.state) where.state = filters.state;

    if (filters.search) {
      where.OR = [
        { id: { contains: filters.search } },
        { customer: { name: { contains: filters.search } } },
        { customer: { email: { contains: filters.search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          vendor: { select: { id: true, company_name: true, gst_no: true } },
          order_items: { include: { product: true } },
          invoices: true,
          payments: true,
          pickup_return_logs: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        vendor: { select: { id: true, company_name: true, gst_no: true } },
        order_items: { include: { product: true } },
        invoices: true,
        payments: true,
        pickup_return_logs: true,
      },
    });
  }

  async create(data: {
    customer_id: string;
    vendor_id: string;
    scheduled_pickup_at: Date;
    scheduled_return_at: Date;
    pickup_type?: string;
    total_amount: number;
    items: {
      product_id: string;
      quantity: number;
      unit_price: number;
      tax?: number;
      line_total: number;
    }[];
  }) {
    return prisma.order.create({
      data: {
        customer_id: data.customer_id,
        vendor_id: data.vendor_id,
        scheduled_pickup_at: data.scheduled_pickup_at,
        scheduled_return_at: data.scheduled_return_at,
        pickup_type: data.pickup_type || 'DELIVERY',
        total_amount: data.total_amount,
        state: 'QUOTATION',
        order_items: {
          create: data.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax: item.tax || 0,
            line_total: item.line_total,
          })),
        },
      },
      include: {
        order_items: { include: { product: true } },
        customer: true,
        vendor: true,
      },
    });
  }

  async updateState(orderId: string, state: string, actualReturnAt?: Date, isLate?: boolean) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        state,
        actual_return_at: actualReturnAt,
        is_late: isLate !== undefined ? isLate : undefined,
      },
      include: {
        order_items: { include: { product: true } },
        invoices: true,
        payments: true,
      },
    });
  }

  async updateStockOnPickupOrReturn(orderId: string, isReturn: boolean) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { order_items: true },
    });

    if (!order) return;

    for (const item of order.order_items) {
      await prisma.product.update({
        where: { id: item.product_id },
        data: {
          stock_qty: {
            [isReturn ? 'increment' : 'decrement']: item.quantity,
          },
        },
      });
    }
  }

  async createInvoice(orderId: string, pdfUrl?: string) {
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count();
    const sequence = String(count + 1).padStart(5, '0');
    const invoiceNumber = `INV/${year}/${sequence}`;

    return prisma.invoice.create({
      data: {
        order_id: orderId,
        invoice_number: invoiceNumber,
        status: 'POSTED',
        pdf_url: pdfUrl,
      },
    });
  }

  async createPayment(data: {
    order_id: string;
    amount: number;
    type: 'RENTAL' | 'DEPOSIT' | 'LATE_FEE';
    method?: string;
    transaction_ref?: string;
    status?: string;
  }) {
    return prisma.payment.create({
      data: {
        order_id: data.order_id,
        amount: data.amount,
        type: data.type,
        method: data.method || 'CREDIT_CARD',
        transaction_ref: data.transaction_ref || `TXN_${Date.now()}`,
        status: data.status || 'COMPLETED',
      },
    });
  }

  async addPickupReturnLog(data: {
    order_id: string;
    type: 'PICKUP' | 'RETURN';
    condition_notes?: string;
    photo_urls?: string[];
  }) {
    return prisma.pickupReturnLog.create({
      data: {
        order_id: data.order_id,
        type: data.type,
        condition_notes: data.condition_notes,
        photo_urls: JSON.stringify(data.photo_urls || []),
      },
    });
  }
}
