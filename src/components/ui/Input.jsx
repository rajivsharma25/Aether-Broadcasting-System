'use client';
import { clsx } from 'clsx';

export const Input = ({ label, error, className, icon, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-muted-foreground ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary outline-none disabled:opacity-50',
            error ? 'border-destructive' : 'border-border',
            icon ? 'pl-9' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-semibold text-red-600 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};
