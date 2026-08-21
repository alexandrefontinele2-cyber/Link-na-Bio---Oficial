import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = 'Get in Touch',
  onClick,
  className = '',
  showArrow = false,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`contact-btn relative w-full rounded-full py-3.5 px-6 font-bold uppercase tracking-[0.2em] text-[11px] text-white text-center flex items-center justify-center gap-2 cursor-pointer select-none ${className}`}
    >
      <span className="relative z-10 leading-none">{label}</span>
      {showArrow && (
        <ArrowUpRight className="w-3.5 h-3.5 relative z-10 shrink-0" />
      )}
    </motion.button>
  );
};
