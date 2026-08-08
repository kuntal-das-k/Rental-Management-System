import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../api/client';
import { Calendar, BarChart3, Filter } from 'lucide-react';

interface ReusableBarChartProps {
  defaultMetric?: string;
  vendorId?: string;
}

export const ReusableBarChart: React.FC<ReusableBarChartProps> = ({ defaultMetric = 'revenue', vendorId }) => {
  const [metric, setMetric] = useState<string>(defaultMetric);
  const [fromDate, setFromDate] = useState<string>('2026-01-01');
  const [toDate, setToDate] = useState<string>('2026-12-31');

  const { data, isLoading } = useQuery({
    queryKey: ['reporting', metric, fromDate, toDate, vendorId],
    queryFn: async () => {
      const res = await api.get('/dashboard/reporting', {
        params: { metric, from: fromDate, to: toDate, vendorId },
      });
      return res.data.data || [];
    },
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Performance & Revenue Analytics
          </h3>
          <p className="text-xs text-slate-400">Dynamic metric breakdown across selected date timeframe</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="revenue" className="bg-slate-900 text-slate-200">Revenue ($)</option>
              <option value="orders" className="bg-slate-900 text-slate-200">Order Count</option>
            </select>
          </div>

          {/* Date range filters */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-200 cursor-pointer"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-200 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Loading analytics chart...
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No data available for selected metric & date range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.75rem',
                }}
                formatter={(val: number) => [metric === 'revenue' ? `$${val.toFixed(2)}` : val, metric.toUpperCase()]}
              />
              <Bar dataKey="value" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
