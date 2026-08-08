export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';
export type OrderState = 'QUOTATION' | 'QUOTATION_SENT' | 'SALES_ORDER' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';
export type ProductType = 'GOODS' | 'SERVICE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  vendorId?: string;
  companyName?: string;
  is_active?: boolean;
}

export interface Product {
  id: string;
  vendor_id: string;
  vendor?: { company_name: string; logo_url?: string };
  category_id?: string;
  category?: { id?: string; name: string };
  name: string;
  description: string;
  product_type: ProductType;
  sku?: string;
  stock_qty: number;
  sales_price: number;
  cost_price: number;
  is_published: boolean;
  pickup_time?: string;
  return_time?: string;
  late_fee_per_unit?: number;
  security_deposit_amount?: number;
  image_urls: string[];
  attribute_values?: {
    attribute_value: {
      id: string;
      value: string;
      attribute: { name: string; display_type: string };
    };
  }[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  tax: number;
  line_total: number;
}

export interface Order {
  id: string;
  customer_id: string;
  customer: { id: string; name: string; email: string };
  vendor_id: string;
  vendor: { company_name: string; gst_no: string };
  state: OrderState;
  pickup_type: 'DELIVERY' | 'STORE';
  scheduled_pickup_at: string;
  scheduled_return_at: string;
  actual_return_at?: string;
  total_amount: number;
  is_late: boolean;
  created_at: string;
  order_items: OrderItem[];
  invoices?: { id: string; invoice_number: string; status: string; pdf_url?: string }[];
  payments?: { id: string; amount: number; type: string; status?: string; method: string; transaction_ref?: string }[];
}
