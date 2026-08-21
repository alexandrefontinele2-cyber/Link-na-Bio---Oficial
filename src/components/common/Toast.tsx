import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          onClick={onDismiss}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#18181B] border border-[#3F3F46] text-[#D7E2EA] text-xs font-medium shadow-2xl flex items-center gap-2 cursor-pointer max-w-[90vw] truncate"
        >
          <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <Check className="w-3 h-3" />
          </span>
          <span className="truncate">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
