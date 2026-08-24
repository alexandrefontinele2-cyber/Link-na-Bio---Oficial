import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ADMIN_MASTER_PIN = '2026';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_MASTER_PIN) {
      if (rememberSession) {
        localStorage.setItem('af_admin_authenticated', 'true');
      } else {
        sessionStorage.setItem('af_admin_authenticated', 'true');
      }
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm rounded-3xl bg-[#0a192f] border border-[#1e3a5f] p-6 text-[#D7E2EA] shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#93c5fd]/70 hover:text-white rounded-full bg-[#060e1d] border border-[#1e3a5f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f]/50 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] mb-4 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-1">
              Acesso do Administrador
            </h3>
            <p className="text-xs text-[#93c5fd]/80 mb-5 leading-relaxed">
              Digite o seu PIN de segurança exclusivo para gerenciar sua foto, vídeos e imagens de cases.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="PIN (padrão: 2026)"
                  className="w-full text-center tracking-[0.3em] font-mono text-xl py-3 px-4 rounded-xl bg-[#060e1d] border border-[#1e3a5f] focus:border-[#38bdf8] focus:outline-none text-white placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
                />
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>PIN incorreto. Use o PIN 2026.</span>
                </div>
              )}

              <label className="flex items-center justify-center gap-2 text-xs text-[#93c5fd]/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-[#1e3a5f] bg-[#060e1d] text-[#38bdf8] focus:ring-0"
                />
                <span>Lembrar login neste dispositivo</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white font-semibold text-sm uppercase tracking-wider hover:opacity-95 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Desbloquear Edição</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
