import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';
import { X, Plus, Package } from 'lucide-react';
import { api } from '../api/client';

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSaveSuccess }) => {
  const isEditing = !!product;
  const queryClient = useQueryClient();

  // Fetch product categories
  const { data: categories = [] } = useQuery({
    queryKey: ['modal-categories'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return (res.data.data as any[]) || [];
    },
  });

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || (product as any)?.category?.id || '',
    sales_price: product?.sales_price || 50,
    stock_qty: product?.stock_qty || 1,
    product_type: product?.product_type || 'GOODS',
    late_fee_per_unit: product?.late_fee_per_unit || 20,
    security_deposit_amount: product?.security_deposit_amount || 150,
    is_published: product?.is_published !== undefined ? product.is_published : true,
    image_url: product?.image_urls?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        category_id: formData.category_id || (categories[0]?.id || undefined),
        sales_price: Number(formData.sales_price),
        stock_qty: Number(formData.stock_qty),
        late_fee_per_unit: Number(formData.late_fee_per_unit),
        security_deposit_amount: Number(formData.security_deposit_amount),
        is_published: Boolean(formData.is_published),
        image_urls: [formData.image_url],
      };

      if (isEditing) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      await queryClient.invalidateQueries();
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              {isEditing ? 'Edit Product & Rental Specs' : 'Create New Rentable Product'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sony FX3 Cinema Camera Kit"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Product Category *</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Select Product Category --</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.description || 'Equipment Category'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed specifications, accessories included..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Product Type</label>
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="GOODS">GOODS (Physical Rentable Item)</option>
                <option value="SERVICE">SERVICE (Security Deposit / Ancillary)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                min={1}
                value={formData.stock_qty}
                onChange={(e) => setFormData({ ...formData, stock_qty: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Daily Rent (₹) *</label>
              <input
                type="number"
                required
                value={formData.sales_price}
                onChange={(e) => setFormData({ ...formData, sales_price: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Deposit (₹)</label>
              <input
                type="number"
                value={formData.security_deposit_amount}
                onChange={(e) => setFormData({ ...formData, security_deposit_amount: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Late Fee/Day (₹)</label>
              <input
                type="number"
                value={formData.late_fee_per_unit}
                onChange={(e) => setFormData({ ...formData, late_fee_per_unit: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_published_checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
            />
            <label htmlFor="is_published_checkbox" className="font-bold text-cyan-400 cursor-pointer text-xs">
              Publish immediately to Customer Storefront
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
