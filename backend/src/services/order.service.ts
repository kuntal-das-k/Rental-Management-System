import { OrderRepository } from '../repositories/order.repository';
import { generateInvoicePDF } from '../utils/pdf';
import { prisma } from '../config';

const orderRepo = new OrderRepository();

export class OrderService {
  async getOrders(filters: any) {
    return orderRepo.findAll(filters);
  }

  async getOrderById(id: string) {
    const order = await orderRepo.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async createOrder(customerId: string, data: {
    vendor_id: string;
    scheduled_pickup_at: string;
    scheduled_return_at: string;
    pickup_type?: any;
    items: {
      product_id: string;
      quantity: number;
      unit_price: number;
      line_total: number;
    }[];
  }) {
    const totalAmount = data.items.reduce((sum, item) => sum + item.line_total, 0);

    const order = await orderRepo.create({
      customer_id: customerId,
      vendor_id: data.vendor_id,
      scheduled_pickup_at: new Date(data.scheduled_pickup_at),
      scheduled_return_at: new Date(data.scheduled_return_at),
      pickup_type: data.pickup_type,
      total_amount: totalAmount,
      items: data.items,
    });

    await orderRepo.createPayment({
      order_id: order.id,
      amount: totalAmount,
      type: 'RENTAL',
      method: 'CREDIT_CARD',
      transaction_ref: `MOCK_TXN_${Date.now()}`,
    });

    return order;
  }

  async sendQuotation(orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.state !== 'QUOTATION') {
      throw new Error(`Cannot send quotation for order in state ${order.state}`);
    }
    return orderRepo.updateState(orderId, 'QUOTATION_SENT');
  }

  async confirmOrder(orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.state !== 'QUOTATION' && order.state !== 'QUOTATION_SENT') {
      throw new Error(`Cannot confirm order in state ${order.state}`);
    }
    return orderRepo.updateState(orderId, 'SALES_ORDER');
  }

  async createInvoice(orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    const validStates = ['SALES_ORDER', 'PICKED_UP', 'RETURNED'];
    if (!validStates.includes(order.state)) {
      throw new Error(`Invoices can only be generated for confirmed Sales Orders or later.`);
    }

    if (order.invoices && order.invoices.length > 0) {
      return order.invoices[0];
    }

    const pdfUrl = await generateInvoicePDF({
      invoiceNumber: `INV/${new Date().getFullYear()}/TEMP`,
      issuedAt: new Date(),
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      companyName: order.vendor.company_name,
      gstNo: order.vendor.gst_no,
      items: order.order_items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.line_total,
      })),
      totalAmount: order.total_amount,
      pickupDate: order.scheduled_pickup_at,
      returnDate: order.scheduled_return_at,
      status: 'POSTED',
    });

    const invoice = await orderRepo.createInvoice(orderId, pdfUrl);

    const finalPdfUrl = await generateInvoicePDF({
      invoiceNumber: invoice.invoice_number,
      issuedAt: invoice.issued_at,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      companyName: order.vendor.company_name,
      gstNo: order.vendor.gst_no,
      items: order.order_items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.line_total,
      })),
      totalAmount: order.total_amount,
      pickupDate: order.scheduled_pickup_at,
      returnDate: order.scheduled_return_at,
      status: 'POSTED',
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdf_url: finalPdfUrl },
    });

    return { ...invoice, pdf_url: finalPdfUrl };
  }

  async markPickedUp(orderId: string, notes?: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.state !== 'SALES_ORDER') {
      throw new Error(`Pickup requires order to be in Sales Order state.`);
    }

    await orderRepo.updateStockOnPickupOrReturn(orderId, false);

    await orderRepo.addPickupReturnLog({
      order_id: orderId,
      type: 'PICKUP',
      condition_notes: notes || 'Item picked up in clean, good condition.',
    });

    return orderRepo.updateState(orderId, 'PICKED_UP');
  }

  async markReturned(orderId: string, notes?: string, conditionPass: boolean = true) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.state !== 'PICKED_UP' && order.state !== 'SALES_ORDER') {
      throw new Error(`Return requires order to be Picked Up or in Sales Order state.`);
    }

    const actualReturnAt = new Date();
    const scheduledReturnAt = new Date(order.scheduled_return_at);
    const isLate = actualReturnAt > scheduledReturnAt;

    let calculatedLateFee = 0;
    if (isLate) {
      const diffMs = actualReturnAt.getTime() - scheduledReturnAt.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let dailyLateFeeRate = 25;
      for (const item of order.order_items) {
        if (item.product.late_fee_per_unit) {
          dailyLateFeeRate = item.product.late_fee_per_unit;
          break;
        }
      }

      calculatedLateFee = diffDays * dailyLateFeeRate;
    }

    const depositItem = order.order_items.find(
      (item) => item.product.product_type === 'SERVICE' && item.product.name.toLowerCase().includes('deposit')
    );

    const depositAmount = depositItem ? depositItem.line_total : 0;
    const refundAmount = Math.max(0, depositAmount - calculatedLateFee);

    if (depositAmount > 0) {
      await orderRepo.createPayment({
        order_id: orderId,
        amount: refundAmount,
        type: 'DEPOSIT',
        method: 'REFUND',
        transaction_ref: `REFUND_DEP_${Date.now()}`,
      });
    }

    if (calculatedLateFee > 0) {
      await orderRepo.createPayment({
        order_id: orderId,
        amount: calculatedLateFee,
        type: 'LATE_FEE',
        method: 'DEPOSIT_DEDUCTION',
        transaction_ref: `LATE_FEE_${Date.now()}`,
      });
    }

    await orderRepo.updateStockOnPickupOrReturn(orderId, true);

    await orderRepo.addPickupReturnLog({
      order_id: orderId,
      type: 'RETURN',
      condition_notes: notes || (conditionPass ? 'Returned on-time in pristine condition.' : 'Returned with notes/inspection check.'),
    });

    return orderRepo.updateState(orderId, 'RETURNED', actualReturnAt, isLate);
  }

  async cancelOrder(orderId: string) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.state === 'RETURNED') {
      throw new Error(`Cannot cancel an order that has already been returned.`);
    }
    return orderRepo.updateState(orderId, 'CANCELLED');
  }
}
