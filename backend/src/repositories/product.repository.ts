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

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { sku: { contains: filters.search } },
      ];
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
        orderBy: { created_at: 'desc' },
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
    cost_price: number;
    is_published?: boolean;
    pickup_time?: string;
    return_time?: string;
    late_fee_per_unit?: number;
    security_deposit_amount?: number;
    image_urls: string[];
    attribute_value_ids?: string[];
  }) {
    const { attribute_value_ids, image_urls, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        image_urls: JSON.stringify(image_urls || []),
        attribute_values: attribute_value_ids && attribute_value_ids.length > 0 ? {
          create: attribute_value_ids.map((id) => ({
            attribute_value_id: id,
          })),
        } : undefined,
      },
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
    attribute_value_ids: string[];
  }>) {
    const { attribute_value_ids, image_urls, ...productData } = data;

    if (attribute_value_ids) {
      await prisma.productAttributeValue.deleteMany({ where: { product_id: id } });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        image_urls: image_urls ? JSON.stringify(image_urls) : undefined,
        attribute_values: attribute_value_ids ? {
          create: attribute_value_ids.map((valId) => ({
            attribute_value_id: valId,
          })),
        } : undefined,
      },
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
