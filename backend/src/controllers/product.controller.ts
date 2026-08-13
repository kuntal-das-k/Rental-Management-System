import { Response } from 'express';
import { ProductService } from '../services/product.service';
import { AuthenticatedRequest } from '../middleware/auth';

const productService = new ProductService();

export class ProductController {
  async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const { vendorId, categoryId, productType, isPublished, search, minPrice, maxPrice, sortBy, page, limit } = req.query;
      const filters = {
        vendorId: vendorId as string,
        categoryId: categoryId as string,
        productType: productType as any,
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        sortBy: sortBy as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      };

      const result = await productService.getProducts(filters);
      return res.status(200).json({ success: true, data: result.products, meta: result.meta });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getProductById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      return res.status(200).json({ success: true, data: product });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;
      let vendorId = user.role === 'VENDOR' ? user.vendorId : req.body.vendorId;

      if (!vendorId && user.role === 'VENDOR') {
        const vendorRepo = await import('../config').then((m) => m.prisma.vendor.findUnique({ where: { user_id: user.userId } }));
        if (vendorRepo) {
          vendorId = vendorRepo.id;
        }
      }

      if (!vendorId) {
        return res.status(400).json({ success: false, error: 'Vendor profile not found or Vendor ID is required' });
      }

      const product = await productService.createProduct(vendorId, user.role, req.body);
      return res.status(201).json({ success: true, data: product });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;
      const product = await productService.updateProduct(id, user.vendorId, user.role, req.body);
      return res.status(200).json({ success: true, data: product });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async togglePublish(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;
      const user = req.user!;
      const product = await productService.togglePublishStatus(id, isPublished, user.vendorId, user.role);
      return res.status(200).json({ success: true, data: product });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;
      await productService.deleteProduct(id, user.vendorId, user.role);
      return res.status(200).json({ success: true, data: { message: 'Product deleted successfully' } });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getAttributes(req: AuthenticatedRequest, res: Response) {
    try {
      const attributes = await productService.getAttributes();
      return res.status(200).json({ success: true, data: attributes });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getCategories(req: AuthenticatedRequest, res: Response) {
    try {
      const categories = await productService.getCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
