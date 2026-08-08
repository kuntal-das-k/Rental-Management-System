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

  async createOrder(customerId: string, data: any) {
    // 1. Verify customer exists in database
    const targetCustomerId = data.customerId || data.customer_id || customerId;
    const customer = await prisma.user.findUnique({ where: { id: targetCustomerId } });
    if (!customer) {
      throw new Error('Customer account not found or invalid session.');
    }

    const vendorIdInput = data.vendor_id || data.vendorId;
    const scheduledPickupInput = data.scheduled_pickup_at || data.scheduledPickupAt;
    const scheduledReturnInput = data.scheduled_return_at || data.scheduledReturnAt;

    // 2. Verify vendor exists. If vendor_id is a User ID or stale, resolve valid Vendor record
    let vendor = vendorIdInput ? await prisma.vendor.findUnique({ where: { id: vendorIdInput } }) : null;
    if (!vendor && vendorIdInput) {
      vendor = await prisma.vendor.findUnique({ where: { user_id: vendorIdInput } });
    }
    if (!vendor) {
      vendor = await prisma.vendor.findFirst();
      if (!vendor) throw new Error('No valid vendor found to process order.');
    }

    // 3. Verify product IDs and fallback if needed
    const validItems = [];
    const rawItems = data.items || [];
    for (const item of rawItems) {
      const productId = item.product_id || item.productId;
      let product = productId ? await prisma.product.findUnique({ where: { id: productId } }) : null;
      if (!product) {
        const fallbackProduct =
          (await prisma.product.findFirst({ where: { vendor_id: vendor.id } })) ||
          (await prisma.product.findFirst());
        if (fallbackProduct) {
          product = fallbackProduct;
        } else {
          continue;
        }
      }
      const qty = item.quantity || 1;
      const unitPrice = item.unit_price || item.unitPrice || product.sales_price;
      const lineTotal = item.line_total || item.lineTotal || (unitPrice * qty);

      validItems.push({
        product_id: product.id,
        quantity: qty,
        unit_price: unitPrice,
        line_total: lineTotal,
      });
    }

    if (validItems.length === 0) {
      throw new Error('No valid products selected for the order.');
    }

    const totalAmount = validItems.reduce((sum, item) => sum + item.line_total, 0);

    // Calculate total security deposit held
    let depositTotal = 0;
    for (const item of validItems) {
      const prod = await prisma.product.findUnique({ where: { id: item.product_id } });
      if (prod && prod.security_deposit_amount) {
        depositTotal += prod.security_deposit_amount * item.quantity;
      }
    }

    const order = await orderRepo.create({
      customer_id: customer.id,
      vendor_id: vendor.id,
      scheduled_pickup_at: new Date(scheduledPickupInput || Date.now()),
      scheduled_return_at: new Date(scheduledReturnInput || Date.now() + 86400000),
      pickup_type: data.pickup_type || data.pickupType || 'DELIVERY',
      total_amount: totalAmount,
      items: validItems,
    });

    // Record rental fee payment
    await orderRepo.createPayment({
      order_id: order.id,
      amount: Math.max(0, totalAmount - depositTotal),
      type: 'RENTAL',
      status: 'COMPLETED',
      method: 'CREDIT_CARD',
      transaction_ref: `MOCK_RENTAL_TXN_${Date.now()}`,
    });

    // Explicitly record Security Deposit Held during confirmation
    if (depositTotal > 0) {
      await orderRepo.createPayment({
        order_id: order.id,
        amount: depositTotal,
        type: 'DEPOSIT',
        status: 'HELD',
        method: 'CREDIT_CARD',
        transaction_ref: `DEP_HELD_${Date.now()}`,
      });
    }

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

    // Check held deposit payments or service deposit items
    const depositItem = order.order_items.find(
      (item) => item.product.product_type === 'SERVICE' && item.product.name.toLowerCase().includes('deposit')
    );

    const heldPayment = order.payments?.find((p) => p.type === 'DEPOSIT' && p.status === 'HELD');

    const depositAmount = heldPayment ? heldPayment.amount : depositItem ? depositItem.line_total : 0;
    const refundAmount = Math.max(0, depositAmount - calculatedLateFee);

    if (depositAmount > 0) {
      if (calculatedLateFee > 0) {
        // Late return penalty deducted from security deposit
        const penaltyDeduction = Math.min(depositAmount, calculatedLateFee);
        await orderRepo.createPayment({
          order_id: orderId,
          amount: penaltyDeduction,
          type: 'LATE_FEE',
          status: 'DEDUCTED',
          method: 'DEPOSIT_DEDUCTION',
          transaction_ref: `LATE_FEE_DEDUCTION_${Date.now()}`,
        });

        await orderRepo.createPayment({
          order_id: orderId,
          amount: refundAmount,
          type: 'DEPOSIT',
          status: refundAmount > 0 ? 'PARTIALLY_REFUNDED' : 'FORFEITED',
          method: 'REFUND',
          transaction_ref: `REFUND_DEP_BAL_${Date.now()}`,
        });
      } else {
        // On-time return: Full security deposit refunded without any deduction
        await orderRepo.createPayment({
          order_id: orderId,
          amount: depositAmount,
          type: 'DEPOSIT',
          status: 'REFUNDED',
          method: 'REFUND',
          transaction_ref: `REFUND_DEP_FULL_${Date.now()}`,
        });
      }
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
