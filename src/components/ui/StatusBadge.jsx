'use client';
// Reusable status indicator badge with standardized color tokens and optional icons.
import { clsx } from 'clsx';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const icons = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <div className={clsx(
      "inline-flex items-center space-x-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize transition-all",
      styles[status] || styles.pending
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{status}</span>
    </div>
  );
};
