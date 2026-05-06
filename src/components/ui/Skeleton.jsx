'use client';
import { clsx } from 'clsx';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        'animate-shimmer rounded-lg',
        className
      )}
      {...props}
    />
  );
};

export const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4 rounded-xl border border-border p-6">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="flex items-center space-x-4 rounded-xl border border-border p-6">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (type === 'approval') {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-border p-4">
        <div className="flex items-center space-x-6 flex-1">
          <Skeleton className="h-20 w-32 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-3 md:mt-0">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="bg-slate-50 border-b border-border px-6 py-4">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <Skeleton className="h-4 w-full" />;
};
