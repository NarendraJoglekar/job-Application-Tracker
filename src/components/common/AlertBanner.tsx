import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const AlertBanner: React.FC = () => {
  const { alert, clearAlert } = useAuth();

  if (!alert) return null;

  const bgStyles = {
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  }[alert.type];

  const Icon = {
    error: AlertCircle,
    success: CheckCircle2,
    info: Info,
  }[alert.type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-200 shadow-lg">
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${bgStyles}`}>
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm font-medium leading-relaxed">{alert.message}</div>
        <button
          onClick={clearAlert}
          className="text-slate-500 hover:text-slate-800 p-0.5 rounded transition"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
