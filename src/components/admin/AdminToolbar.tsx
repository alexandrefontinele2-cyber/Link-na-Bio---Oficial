import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Image as ImageIcon, LogOut, Settings2 } from 'lucide-react';

interface AdminToolbarProps {
  onOpenManager: () => void;
  onLogout: () => void;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({
  onOpenManager,
  onLogout,
}) => {
  return (
    <motion.aside
      aria-label="Barra do Administrador"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[420px] bg-[#0a192f]/95 border border-[#38bdf8]/60 backdrop-blur-md rounded-2xl py-2 px-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-between gap-2 text-white select-none"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white tracking-wide truncate flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
            <span>MODO ADMIN ATIVO</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenManager}
          className="py-1 px-2.5 rounded-lg bg-[#1e3a5f] hover:bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#38bdf8]/40 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-3 h-3 text-[#38bdf8]" />
          <span>Editar Mídias</span>
        </button>

        <button
          onClick={onLogout}
          title="Sair do modo administrador"
          className="p-1 text-[#93c5fd]/70 hover:text-rose-400 rounded-lg hover:bg-[#060e1d] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.aside>
  );
};
