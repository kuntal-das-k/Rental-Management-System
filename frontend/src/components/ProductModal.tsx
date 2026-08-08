import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';
import { X, Plus, Package, Loader2 } from 'lucide-react';
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
    image_url:
      product?.image_urls?.[0] ||
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

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

      if (isEditing && product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      await queryClient.invalidateQueries();
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Failed to save product. Please check form fields.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isEditing ? 'Edit Rentable Item' : 'Create New Rentable Product'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing ? 'Update pricing, availability, and item details' : 'Add a new asset to your store inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Product Title */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sony FX3 Cinema Camera Kit"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Product Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed specs, included accessories, or rental condition notes..."
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 text-slate-900 text-xs font-semibold placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Product Type & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Product Type
              </label>
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              >
                <option value="GOODS">GOODS (Physical Rentable Asset)</option>
                <option value="SERVICE">SERVICE (Deposit / Service)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                min={1}
                value={formData.stock_qty}
                onChange={(e) => setFormData({ ...formData, stock_qty: Number(e.target.value) })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Rates & Deposits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Daily Rent (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.sales_price}
                onChange={(e) => setFormData({ ...formData, sales_price: Number(e.target.value) })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                value={formData.security_deposit_amount}
                onChange={(e) => setFormData({ ...formData, security_deposit_amount: Number(e.target.value) })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Late Fee/Day (₹)
              </label>
              <input
                type="number"
                value={formData.late_fee_per_unit}
                onChange={(e) => setFormData({ ...formData, late_fee_per_unit: Number(e.target.value) })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Product Image URL
            </label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-semibold focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all"
            />
          </div>

          {/* Storefront Checkbox Card */}
          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-all">
            <input
              type="checkbox"
              id="is_published_checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-slate-900 block">
                Publish immediately to Customer Storefront
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Item will be instantly searchable and rentable by customers.
              </span>
            </div>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                <span>Update Item</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Rentable Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
