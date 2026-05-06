'use client';
// Reusable Modal component with glassmorphism overlay and smooth entry animations.
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full bg-white/95 backdrop-blur-xl max-w-lg rounded-2xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-white/50">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-slate-100 transition-all cursor-pointer group"
              >
                <X className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-colors">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
