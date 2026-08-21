import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface LiveProjectButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  label = 'View',
  onClick,
  className = '',
  showIcon = false,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-full border border-[#D7E2EA] text-[#D7E2EA] font-bold uppercase tracking-widest text-[10px] px-3.5 py-1.5 hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${className}`}
    >
      <span>{label}</span>
      {showIcon && <ExternalLink className="w-3 h-3" />}
    </motion.button>
  );
};
