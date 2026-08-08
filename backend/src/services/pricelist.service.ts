import { PricelistRepository } from '../repositories/pricelist.repository';

const pricelistRepo = new PricelistRepository();

export class PricelistService {
  async getPricelists(vendorId: string) {
    return pricelistRepo.findByVendor(vendorId);
  }

  async createPricelist(vendorId: string, name: string, isDefault: boolean) {
    return pricelistRepo.createPricelist(vendorId, name, isDefault);
  }

  async addRule(data: any) {
    return pricelistRepo.addRule(data);
  }

  async deleteRule(ruleId: string) {
    return pricelistRepo.deleteRule(ruleId);
  }

  /**
   * Evaluates effective price for a product based on vendor's active default pricelist
   */
  async calculateEffectivePrice(vendorId: string, productId: string, basePrice: number, quantity: number): Promise<number> {
    const pricelist = await pricelistRepo.findDefaultPricelist(vendorId);
    if (!pricelist || !pricelist.rules || pricelist.rules.length === 0) {
      return basePrice;
    }

    const now = new Date();

    const validRules = pricelist.rules.filter((rule) => {
      if (rule.product_id && rule.product_id !== productId) return false;
      if (rule.min_qty > quantity) return false;
      if (rule.valid_from && new Date(rule.valid_from) > now) return false;
      if (rule.valid_to && new Date(rule.valid_to) < now) return false;
      return true;
    });

    if (validRules.length === 0) {
      return basePrice;
    }

    validRules.sort((a, b) => {
      if (a.product_id && !b.product_id) return -1;
      if (!a.product_id && b.product_id) return 1;
      return b.min_qty - a.min_qty;
    });

    const bestRule = validRules[0];
    if (bestRule.price_type === 'DISCOUNT') {
      const discount = (basePrice * bestRule.value) / 100;
      return Math.max(0, basePrice - discount);
    } else if (bestRule.price_type === 'FIXED') {
      return bestRule.value;
    }

    return basePrice;
  }
}
