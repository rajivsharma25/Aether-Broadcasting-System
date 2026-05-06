'use client';
// Basic container component for grouped information with consistent padding and styling.
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
