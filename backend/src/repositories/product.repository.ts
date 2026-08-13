import { prisma } from '../config';

type ProductType = 'GOODS' | 'SERVICE';

function formatProduct(p: any) {
  if (!p) return null;
  let parsedUrls: string[] = [];
  try {
    parsedUrls = typeof p.image_urls === 'string' ? JSON.parse(p.image_urls) : p.image_urls || [];
  } catch {
    parsedUrls = [p.image_urls];
  }
  return {
    ...p,
    image_urls: parsedUrls,
  };
}

export class ProductRepository {
  async findAll(filters: {
    vendorId?: string;
    categoryId?: string;
    productType?: ProductType;
    isPublished?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.vendorId) where.vendor_id = filters.vendorId;
    if (filters.categoryId) where.category_id = filters.categoryId;
    if (filters.productType) where.product_type = filters.productType;
    if (typeof filters.isPublished === 'boolean') where.is_published = filters.isPublished;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.sales_price = {};
      if (filters.minPrice !== undefined) where.sales_price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.sales_price.lte = filters.maxPrice;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { sku: { contains: filters.search } },
      ];
    }

    let orderBy: any = { created_at: 'desc' };
    if (filters.sortBy === 'PriceLowHigh' || filters.sortBy === 'price_asc') {
      orderBy = { sales_price: 'asc' };
    } else if (filters.sortBy === 'PriceHighLow' || filters.sortBy === 'price_desc') {
      orderBy = { sales_price: 'desc' };
    } else if (filters.sortBy === 'Newest' || filters.sortBy === 'newest') {
      orderBy = { created_at: 'desc' };
    }

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          vendor: { select: { company_name: true, logo_url: true } },
          category: true,
          attribute_values: {
            include: {
              attribute_value: {
                include: { attribute: true },
              },
            },
          },
        },
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: rawProducts.map(formatProduct),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: { select: { id: true, company_name: true, logo_url: true } },
        category: true,
        attribute_values: {
          include: {
            attribute_value: {
              include: { attribute: true },
            },
          },
        },
        late_fee_rules: true,
      },
    });
    return formatProduct(product);
  }

  async create(data: {
    vendor_id: string;
    category_id?: string;
    name: string;
    description: string;
    product_type?: ProductType;
    sku?: string;
    stock_qty: number;
    sales_price: number;
    cost_price?: number;
    is_published?: boolean;
    pickup_time?: string;
    return_time?: string;
    late_fee_per_unit?: number;
    security_deposit_amount?: number;
    image_urls?: string[];
    image_url?: string;
    attribute_value_ids?: string[];
  }) {
    const rawData = data as any;
    const { attribute_value_ids, image_urls, image_url, vendorId, categoryId, vendor_id, category_id, ...rest } = rawData;

    const urls = image_urls || (image_url ? [image_url] : []);

    const cleanData: any = {
      vendor_id: vendor_id || vendorId,
      category_id: category_id || categoryId || null,
      name: rest.name,
      description: rest.description || '',
      product_type: rest.product_type || 'GOODS',
      sku: rest.sku || null,
      stock_qty: Number(rest.stock_qty) || 1,
      sales_price: Number(rest.sales_price) || 0,
      cost_price: Number(rest.cost_price) || 0,
      is_published: typeof rest.is_published === 'boolean' ? rest.is_published : false,
      pickup_time: rest.pickup_time || null,
      return_time: rest.return_time || null,
      late_fee_per_unit: rest.late_fee_per_unit !== undefined && rest.late_fee_per_unit !== null ? Number(rest.late_fee_per_unit) : null,
      security_deposit_amount: rest.security_deposit_amount !== undefined && rest.security_deposit_amount !== null ? Number(rest.security_deposit_amount) : null,
      image_urls: JSON.stringify(urls),
    };

    if (attribute_value_ids && attribute_value_ids.length > 0) {
      cleanData.attribute_values = {
        create: attribute_value_ids.map((id: string) => ({
          attribute_value_id: id,
        })),
      };
    }

    const product = await prisma.product.create({
      data: cleanData,
      include: {
        category: true,
        attribute_values: {
          include: {
            attribute_value: { include: { attribute: true } },
          },
        },
      },
    });
    return formatProduct(product);
  }

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    category_id: string;
    product_type: ProductType;
    sku: string;
    stock_qty: number;
    sales_price: number;
    cost_price: number;
    is_published: boolean;
    pickup_time: string;
    return_time: string;
    late_fee_per_unit: number;
    security_deposit_amount: number;
    image_urls: string[];
    image_url: string;
    attribute_value_ids: string[];
  }>) {
    const rawData = data as any;
    const { attribute_value_ids, image_urls, image_url, vendorId, categoryId, vendor_id, category_id, ...rest } = rawData;

    if (attribute_value_ids) {
      await prisma.productAttributeValue.deleteMany({ where: { product_id: id } });
    }

    const urls = image_urls || (image_url ? [image_url] : undefined);

    const updateData: any = {};
    if (rest.name !== undefined) updateData.name = rest.name;
    if (rest.description !== undefined) updateData.description = rest.description;
    if (rest.product_type !== undefined) updateData.product_type = rest.product_type;
    if (rest.sku !== undefined) updateData.sku = rest.sku;
    if (rest.stock_qty !== undefined) updateData.stock_qty = Number(rest.stock_qty);
    if (rest.sales_price !== undefined) updateData.sales_price = Number(rest.sales_price);
    if (rest.cost_price !== undefined) updateData.cost_price = Number(rest.cost_price);
    if (rest.is_published !== undefined) updateData.is_published = rest.is_published;
    if (rest.pickup_time !== undefined) updateData.pickup_time = rest.pickup_time;
    if (rest.return_time !== undefined) updateData.return_time = rest.return_time;
    if (rest.late_fee_per_unit !== undefined && rest.late_fee_per_unit !== null) updateData.late_fee_per_unit = Number(rest.late_fee_per_unit);
    if (rest.security_deposit_amount !== undefined && rest.security_deposit_amount !== null) updateData.security_deposit_amount = Number(rest.security_deposit_amount);
    if (category_id || categoryId) updateData.category_id = category_id || categoryId;
    if (urls !== undefined) updateData.image_urls = JSON.stringify(urls);

    if (attribute_value_ids && attribute_value_ids.length > 0) {
      updateData.attribute_values = {
        create: attribute_value_ids.map((valId: string) => ({
          attribute_value_id: valId,
        })),
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        attribute_values: {
          include: {
            attribute_value: { include: { attribute: true } },
          },
        },
      },
    });
    return formatProduct(product);
  }

  async togglePublish(id: string, isPublished: boolean) {
    const product = await prisma.product.update({
      where: { id },
      data: { is_published: isPublished },
    });
    return formatProduct(product);
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  async findAllAttributes() {
    return prisma.attribute.findMany({
      include: { values: true },
      orderBy: { name: 'asc' },
    });
  }

  async findAllCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  }
}
