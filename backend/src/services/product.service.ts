import { ProductRepository } from '../repositories/product.repository';

const productRepo = new ProductRepository();

export class ProductService {
  async getProducts(filters: any) {
    return productRepo.findAll(filters);
  }

  async getProductById(id: string) {
    const product = await productRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(vendorId: string, userRole: string, data: any) {
    const isPublished = typeof data.is_published === 'boolean' ? data.is_published : true;

    return productRepo.create({
      ...data,
      vendor_id: vendorId,
      is_published: isPublished,
    });
  }

  async updateProduct(id: string, userVendorId: string | undefined, userRole: string, data: any) {
    const existing = await productRepo.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    if (userRole !== 'ADMIN' && existing.vendor_id !== userVendorId) {
      throw new Error('Unauthorized to modify this product');
    }

    if (userRole !== 'ADMIN') {
      delete data.is_published;
    }

    return productRepo.update(id, data);
  }

  async togglePublishStatus(id: string, isPublished: boolean) {
    const existing = await productRepo.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }
    return productRepo.togglePublish(id, isPublished);
  }

  async deleteProduct(id: string, userVendorId: string | undefined, userRole: string) {
    const existing = await productRepo.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    if (userRole !== 'ADMIN' && existing.vendor_id !== userVendorId) {
      throw new Error('Unauthorized to delete this product');
    }

    return productRepo.delete(id);
  }

  async getAttributes() {
    return productRepo.findAllAttributes();
  }

  async getCategories() {
    return productRepo.findAllCategories();
  }
}
