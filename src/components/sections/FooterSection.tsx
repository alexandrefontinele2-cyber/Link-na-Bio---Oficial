import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface FooterSectionProps {
  onScrollTop: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onScrollTop }) => {
  return (
    <footer className="text-center px-5 py-6 border-t border-[#1a2c4e] flex flex-col items-center gap-3 relative z-10 bg-[#060e1d]">
      {/* Copyright */}
      <p className="text-[9px] text-[#93c5fd] opacity-60 uppercase tracking-widest m-0 font-light">
        &copy; {new Date().getFullYear()} Alexandre Fontinele &mdash; Todos os direitos reservados
      </p>

      {/* Back to Top Smooth Button */}
      <motion.button
        whileHover={{ scale: 1.06, y: -1 }}
        whileTap={{ scale: 0.94 }}
        onClick={onScrollTop}
        className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold text-[#D7E2EA] opacity-75 hover:opacity-100 transition-opacity cursor-pointer pt-1"
        aria-label="Voltar ao topo"
      >
        <span>VOLTAR AO TOPO</span>
        <ChevronUp className="w-3 h-3 stroke-[2.5]" />
      </motion.button>
    </footer>
  );
};
