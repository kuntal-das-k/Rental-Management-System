import React, { useState } from 'react';
import { Order } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

interface SchedulerCalendarProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const SchedulerCalendar: React.FC<SchedulerCalendarProps> = ({ orders, onSelectOrder }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get status color tag
  const getStatusBadge = (order: Order, date: Date) => {
    const pickupDate = new Date(order.scheduled_pickup_at);
    const returnDate = new Date(order.scheduled_return_at);
    const isPickupDay = isSameDay(pickupDate, date);
    const isReturnDay = isSameDay(returnDate, date);

    if (order.is_late) {
      return { label: 'Late Delivery', bg: 'bg-red-500/20 text-red-400 border-red-500/40' };
    }
    if (isPickupDay && order.state === 'SALES_ORDER') {
      return { label: 'Pick up', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
    if (isReturnDay) {
      return { label: 'Due Return', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' };
    }
    return { label: 'Booked', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
  };

  const selectedDayOrders = orders.filter((o) => {
    const pDate = new Date(o.scheduled_pickup_at);
    const rDate = new Date(o.scheduled_return_at);
    return (
      isSameDay(pDate, selectedDate) ||
      isSameDay(rDate, selectedDate) ||
      (selectedDate >= pDate && selectedDate <= rDate)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            Rental Scheduler Calendar
          </h3>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-slate-200 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Booked
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pick up
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Due Return
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Late Delivery
          </span>
        </div>

        {/* Calendar Grid Days */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-500 mb-2">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const dayOrders = orders.filter((o) => {
              const pDate = new Date(o.scheduled_pickup_at);
              const rDate = new Date(o.scheduled_return_at);
              return isSameDay(pDate, day) || isSameDay(rDate, day) || (day >= pDate && day <= rDate);
            });

            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[70px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500'
                    : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    isSameDay(day, new Date())
                      ? 'w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center'
                      : 'text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                <div className="space-y-1 w-full mt-1">
                  {dayOrders.slice(0, 2).map((ord) => {
                    const badge = getStatusBadge(ord, day);
                    return (
                      <div
                        key={ord.id}
                        className={`text-[9px] font-extrabold truncate px-1 py-0.5 rounded border ${badge.bg}`}
                      >
                        {ord.customer?.name || 'Order'}
                      </div>
                    );
                  })}
                  {dayOrders.length > 2 && (
                    <span className="text-[9px] font-bold text-slate-500 block">
                      +{dayOrders.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Bookings Detail Drawer */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col">
        <h4 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Bookings on {format(selectedDate, 'MMMM d, yyyy')}
        </h4>
        <p className="text-xs text-slate-400 mb-4">{selectedDayOrders.length} active rental events</p>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {selectedDayOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              No pickups, returns, or active rentals scheduled for this date.
            </div>
          ) : (
            selectedDayOrders.map((ord) => {
              const badge = getStatusBadge(ord, selectedDate);
              return (
                <div
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="glass-card rounded-xl p-3.5 border border-slate-800 hover:border-cyan-500/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      #{ord.id.slice(0, 8)}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-200">{ord.customer?.name}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {ord.order_items?.[0]?.product?.name}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                    <span>${ord.total_amount.toFixed(2)}</span>
                    <span className="text-cyan-400 font-semibold uppercase">{ord.state}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
