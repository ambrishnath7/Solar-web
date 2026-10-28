import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ToggleButtonProps {
  label?: string;
  type?: 'GOOD_DEFECT' | 'YES_NO';
  value: string;
  onChange: (val: any) => void;
  disabled?: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  type = 'GOOD_DEFECT',
  value,
  onChange,
  disabled = false,
}) => {
  if (type === 'YES_NO') {
    const isYes = value === 'YES';
    const isNo = value === 'NO';

    return (
      <div className="flex flex-col gap-1.5">
        {label && <span className="text-sm font-semibold text-slate-700">{label}</span>}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange('YES')}
            className={`py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              isYes
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isYes ? 'text-white' : 'text-slate-400'}`} />
            YES
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange('NO')}
            className={`py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              isNo
                ? 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-400'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            NO
          </button>
        </div>
      </div>
    );
  }

  // GOOD / DEFECT mode
  const isGood = value === 'GOOD';
  const isDefect = value === 'DEFECT';

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-semibold text-slate-700">{label}</span>}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('GOOD')}
          className={`py-2.5 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
            isGood
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isGood ? 'text-white' : 'text-slate-400'}`} />
          GOOD
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('DEFECT')}
          className={`py-2.5 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
            isDefect
              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${isDefect ? 'text-white' : 'text-slate-400'}`} />
          DEFECT
        </button>
      </div>
    </div>
  );
};
