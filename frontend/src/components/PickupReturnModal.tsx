import React, { useState } from 'react';
import { Order } from '../types';
import { CheckSquare, Square, X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PickupReturnModalProps {
  type: 'PICKUP' | 'RETURN';
  order: Order | null;
  onClose: () => void;
  onConfirm: (notes: string, conditionPass: boolean) => void;
}

export const PickupReturnModal: React.FC<PickupReturnModalProps> = ({
  type,
  order,
  onClose,
  onConfirm,
}) => {
  const [checklist, setChecklist] = useState({
    serialNumberVerified: false,
    accessoriesIncluded: false,
    noVisibleDamage: false,
    functionalTestPassed: false,
  });

  const [notes, setNotes] = useState('');

  if (!order) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            {type === 'PICKUP' ? (
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="text-base font-bold text-slate-100">
              Confirm {type === 'PICKUP' ? 'Item Pickup' : 'Item Return'} Inspection
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order details summary */}
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 mb-4 text-xs space-y-1">
          <div className="flex justify-between font-bold text-slate-200">
            <span>Order #{order.id.slice(0, 8)}</span>
            <span className="text-cyan-400">{order.customer?.name}</span>
          </div>
          <p className="text-slate-400">
            Rental Period: {new Date(order.scheduled_pickup_at).toLocaleDateString()} to{' '}
            {new Date(order.scheduled_return_at).toLocaleDateString()}
          </p>
        </div>

        {/* Inspection Checklist */}
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Condition Inspection Checklist
          </h4>

          {[
            { key: 'serialNumberVerified', label: 'Verified product SKU & serial number matched' },
            { key: 'accessoriesIncluded', label: 'All chargers, lenses, cables & accessories present' },
            { key: 'noVisibleDamage', label: 'Inspected body & components for scratch/dents' },
            { key: 'functionalTestPassed', label: 'Powered on & verified core operations' },
          ].map((item) => {
            const isChecked = checklist[item.key as keyof typeof checklist];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  setChecklist((prev) => ({ ...prev, [item.key]: !isChecked }))
                }
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-left transition-colors"
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                <span className={`text-xs ${isChecked ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Condition Notes */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Inspection Notes & Free-Text Observations
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Log any minor wear, scratch notes, or technician remarks..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(notes, allChecked)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
              type === 'PICKUP'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            Confirm {type === 'PICKUP' ? 'Pickup' : 'Return'}
          </button>
        </div>
      </div>
    </div>
  );
};
