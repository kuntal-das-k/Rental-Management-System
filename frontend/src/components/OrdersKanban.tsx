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
  { state: 'QUOTATION', title: 'Quotations', color: 'border-slate-700 bg-slate-900/50 text-slate-300', icon: FileText },
  { state: 'QUOTATION_SENT', title: 'Quotation Sent', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400', icon: Send },
  { state: 'SALES_ORDER', title: 'Sales Orders', color: 'border-blue-500/40 bg-blue-950/20 text-blue-400', icon: CheckCircle2 },
  { state: 'PICKED_UP', title: 'Picked Up (Active)', color: 'border-amber-500/40 bg-amber-950/20 text-amber-400', icon: Truck },
  { state: 'RETURNED', title: 'Returned', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400', icon: RotateCcw },
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
          <div key={col.state} className="glass-panel rounded-2xl p-3 border border-slate-800 flex flex-col min-w-[260px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl border mb-3 ${col.color}`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                <ColumnIcon className="w-4 h-4" />
                <span>{col.title}</span>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-950/60">
                {colOrders.length}
              </span>
            </div>

            {/* Column Order Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
              {colOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl">
                  No orders in this state
                </div>
              ) : (
                colOrders.map((order) => (
                  <div
                    key={order.id}
                    className="glass-card rounded-xl p-3.5 border cursor-pointer group hover:border-cyan-500/50"
                    onClick={() => onSelectOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        #{order.id.slice(0, 8)}
                      </span>
                      {order.is_late && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          LATE
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-cyan-300">
                      {order.customer?.name || 'Customer'}
                    </h4>

                    <div className="text-[11px] text-slate-400 my-1.5 space-y-0.5">
                      <p className="line-clamp-1 font-medium text-slate-300">
                        {order.order_items?.[0]?.product?.name || 'Rental Item'}
                      </p>
                      <p>
                        {new Date(order.scheduled_pickup_at).toLocaleDateString()} -{' '}
                        {new Date(order.scheduled_return_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                      <span className="text-xs font-extrabold text-slate-100">
                        ${order.total_amount.toFixed(2)}
                      </span>

                      {/* Quick State Action Buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {order.state === 'QUOTATION' && (
                          <button
                            onClick={() => onSendQuotation(order.id)}
                            className="px-2 py-1 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 rounded"
                          >
                            Send
                          </button>
                        )}
                        {order.state === 'QUOTATION_SENT' && (
                          <button
                            onClick={() => onConfirmOrder(order.id)}
                            className="px-2 py-1 text-[10px] font-bold bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded"
                          >
                            Confirm
                          </button>
                        )}
                        {order.state === 'SALES_ORDER' && (
                          <>
                            <button
                              onClick={() => onCreateInvoice(order.id)}
                              className="p-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded"
                              title="Create Invoice"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenPickupModal(order)}
                              className="px-2 py-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded"
                            >
                              Pickup
                            </button>
                          </>
                        )}
                        {order.state === 'PICKED_UP' && (
                          <button
                            onClick={() => onOpenReturnModal(order)}
                            className="px-2 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded"
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
