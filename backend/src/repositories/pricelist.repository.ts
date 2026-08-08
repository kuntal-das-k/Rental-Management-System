import { prisma } from '../config';

export class PricelistRepository {
  async findByVendor(vendorId: string) {
    return prisma.pricelist.findMany({
      where: { vendor_id: vendorId },
      include: {
        rules: {
          include: { product: { select: { id: true, name: true, sales_price: true } } },
        },
      },
      orderBy: { is_default: 'desc' },
    });
  }

  async findDefaultPricelist(vendorId: string) {
    return prisma.pricelist.findFirst({
      where: { vendor_id: vendorId, is_default: true },
      include: { rules: true },
    });
  }

  async createPricelist(vendorId: string, name: string, isDefault: boolean) {
    if (isDefault) {
      await prisma.pricelist.updateMany({
        where: { vendor_id: vendorId },
        data: { is_default: false },
      });
    }

    return prisma.pricelist.create({
      data: {
        vendor_id: vendorId,
        name,
        is_default: isDefault,
      },
    });
  }

  async addRule(data: {
    pricelist_id: string;
    product_id?: string;
    price_type: 'DISCOUNT' | 'FIXED';
    value: number;
    min_qty: number;
    valid_from?: Date;
    valid_to?: Date;
    selectable?: boolean;
  }) {
    return prisma.pricelistRule.create({
      data,
      include: { product: true },
    });
  }

  async deleteRule(ruleId: string) {
    return prisma.pricelistRule.delete({ where: { id: ruleId } });
  }
}
