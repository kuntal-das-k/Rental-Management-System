import React, { useState } from 'react';
import { Order } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';

interface SchedulerCalendarProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const SchedulerCalendar: React.FC<SchedulerCalendarProps> = ({ orders, onSelectOrder }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Determine badge for order on specific date
  const getStatusBadge = (order: Order, date: Date) => {
    const pickupDate = new Date(order.scheduled_pickup_at);
    const returnDate = new Date(order.scheduled_return_at);
    const isPickupDay = isSameDay(pickupDate, date);

    if (order.is_late) {
      return { label: 'Late', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
    }
    if (isPickupDay) {
      return { label: 'Pickup', bg: 'bg-slate-900 text-white border-slate-900', dot: 'bg-slate-900' };
    }
    return { label: 'Due Return', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Calendar Grid */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* Controls Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayOrders = orders.filter((o) => {
              const pDate = new Date(o.scheduled_pickup_at);
              const rDate = new Date(o.scheduled_return_at);
              return isSameDay(pDate, day) || isSameDay(rDate, day) || (day >= pDate && day <= rDate);
            });

            const isSelected = isSameDay(day, selectedDate);
            const isTodayDay = isSameDay(day, new Date());

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[85px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50/70'
                }`}
              >
                <span
                  className={`text-xs font-extrabold ${
                    isTodayDay
                      ? 'w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center'
                      : 'text-slate-800'
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
                        className={`text-[9px] font-extrabold truncate px-1.5 py-0.5 rounded-lg border ${badge.bg}`}
                      >
                        {badge.label} ({dayOrders.length})
                      </div>
                    );
                  })}
                  {dayOrders.length > 2 && (
                    <span className="text-[9px] font-bold text-slate-400 block px-1">
                      +{dayOrders.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Day Events & Legend */}
      <div className="lg:col-span-4 space-y-6">
        {/* Selected Date Event List Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {selectedDayOrders.length} Total Events Scheduled
            </p>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {selectedDayOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                No pickups, returns, or active rentals scheduled for this date.
              </div>
            ) : (
              selectedDayOrders.map((ord) => {
                const badge = getStatusBadge(ord, selectedDate);
                return (
                  <div
                    key={ord.id}
                    onClick={() => onSelectOrder(ord)}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-400 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {format(new Date(ord.scheduled_pickup_at), 'hh:mm a')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Ord #{ord.id.slice(0, 5).toUpperCase()} - {ord.order_items?.[0]?.product?.name || 'Rental Item'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Client: {ord.customer?.name || 'Customer'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Legend Box */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Legend</h4>
          <div className="space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-slate-900 inline-block"></span>
              <span>Scheduled Pickup</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400 inline-block"></span>
              <span>Due Return</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span>Overdue / Late</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
