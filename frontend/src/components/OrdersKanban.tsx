import React from 'react';
import { Order, OrderState } from '../types';
import { FileText, Send, CheckCircle2, Truck, RotateCcw, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface OrdersKanbanProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onSendQuotation: (id: string) => void;
  onConfirmOrder: (id: string) => void;
  onCreateInvoice: (id: string) => void;
  onOpenPickupModal: (order: Order) => void;
  onOpenReturnModal: (order: Order) => void;
}

const KANBAN_COLUMNS: { state: OrderState; title: string; color: string; icon: any }[] = [
  { state: 'QUOTATION', title: 'Quotations', color: 'border-slate-200 bg-slate-100 text-slate-700', icon: FileText },
  { state: 'QUOTATION_SENT', title: 'Quotation Sent', color: 'border-sky-200 bg-sky-50 text-sky-800', icon: Send },
  { state: 'SALES_ORDER', title: 'Sales Orders', color: 'border-blue-200 bg-blue-50 text-blue-800', icon: CheckCircle2 },
  { state: 'PICKED_UP', title: 'Picked Up (Active)', color: 'border-amber-200 bg-amber-50 text-amber-800', icon: Truck },
  { state: 'RETURNED', title: 'Returned', color: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: RotateCcw },
];

export const OrdersKanban: React.FC<OrdersKanbanProps> = ({
  orders,
  onSelectOrder,
  onSendQuotation,
  onConfirmOrder,
  onCreateInvoice,
  onOpenPickupModal,
  onOpenReturnModal,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.state === col.state);
        const ColumnIcon = col.icon;

        return (
          <div key={col.state} className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col min-w-[260px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-2xl border mb-3 ${col.color}`}>
              <div className="flex items-center gap-2 font-extrabold text-xs">
                <ColumnIcon className="w-4 h-4" />
                <span>{col.title}</span>
              </div>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-900 shadow-2xs">
                {colOrders.length}
              </span>
            </div>

            {/* Column Order Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
              {colOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  No orders in this state
                </div>
              ) : (
                colOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 cursor-pointer group hover:border-slate-400 hover:shadow-xs transition-all space-y-2"
                    onClick={() => onSelectOrder(order)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-900 font-extrabold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      {order.is_late && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          LATE
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700">
                      {order.customer?.name || 'Customer'}
                    </h4>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p className="line-clamp-1 font-semibold text-slate-700">
                        {order.order_items?.[0]?.product?.name || 'Rental Item'}
                      </p>
                      <p className="text-[10px]">
                        {new Date(order.scheduled_pickup_at).toLocaleDateString()} -{' '}
                        {new Date(order.scheduled_return_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 mt-2">
                      <span className="text-xs font-black text-slate-900">
                        ₹{order.total_amount.toFixed(2)}
                      </span>

                      {/* Quick State Action Buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {order.state === 'QUOTATION' && (
                          <button
                            onClick={() => onSendQuotation(order.id)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 rounded-lg transition-colors"
                          >
                            Send
                          </button>
                        )}
                        {order.state === 'QUOTATION_SENT' && (
                          <button
                            onClick={() => onConfirmOrder(order.id)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 rounded-lg transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {order.state === 'SALES_ORDER' && (
                          <>
                            <button
                              onClick={() => onCreateInvoice(order.id)}
                              className="p-1 text-slate-600 hover:text-slate-900 transition-colors"
                              title="Create Invoice"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenPickupModal(order)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors"
                            >
                              Pickup
                            </button>
                          </>
                        )}
                        {order.state === 'PICKED_UP' && (
                          <button
                            onClick={() => onOpenReturnModal(order)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors"
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
