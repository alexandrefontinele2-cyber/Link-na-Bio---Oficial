import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Lock } from 'lucide-react';

interface FooterSectionProps {
  onScrollTop: () => void;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onScrollTop,
  onOpenAdmin,
  isAdmin = false,
}) => {
  const [clickCount, setClickCount] = useState(0);

  const handleCopyrightClick = () => {
    const next = clickCount + 1;
    if (next >= 3) {
      setClickCount(0);
      onOpenAdmin?.();
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 3000);
    }
  };

  return (
    <footer className="text-center px-5 py-6 border-t border-[#1a2c4e] flex flex-col items-center gap-3 relative z-10 bg-[#060e1d]">
      {/* Copyright with subtle admin trigger */}
      <div className="flex items-center justify-center gap-1.5">
        <p
          onClick={handleCopyrightClick}
          className="text-[9px] text-[#93c5fd] opacity-60 hover:opacity-90 transition-opacity uppercase tracking-widest m-0 font-light cursor-pointer select-none"
          title="Alexandre Fontinele"
        >
          &copy; {new Date().getFullYear()} Alexandre Fontinele &mdash; Todos os direitos reservados
        </p>

        {/* Discreet admin lock icon */}
        <button
          type="button"
          onClick={onOpenAdmin}
          className="text-[#93c5fd]/30 hover:text-[#38bdf8] transition-colors p-0.5"
          title="Acesso Administrativo"
          aria-label="Acesso Admin"
        >
          <Lock className="w-2.5 h-2.5" />
        </button>
      </div>

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
