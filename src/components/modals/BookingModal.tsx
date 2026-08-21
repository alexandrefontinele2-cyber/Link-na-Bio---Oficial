import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  onSuccessToast: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
  onSuccessToast,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initialService || 'Mentoria Executiva');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccessToast(`Obrigado ${name}! Sua solicitação para ${service} foi registrada.`);

      // Also generate direct WhatsApp redirection
      const encodedMsg = encodeURIComponent(
        `Olá Alexandre Fontinele! Meu nome é ${name}. Gostaria de informações sobre ${service}. Detalhes: ${message || 'Solicitação via Link da Bio'}`
      );
      window.open(`https://wa.me/5543988628997?text=${encodedMsg}`, '_blank');

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setName('');
        setPhone('');
        setMessage('');
      }, 1600);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-[#0a192f] border border-[#1e3a5f] rounded-3xl p-6 shadow-2xl text-[#D7E2EA] z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#132742] text-[#D7E2EA]/70 hover:text-white hover:bg-[#1e3a5f] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl uppercase tracking-tight text-white mb-1">
                  Mensagem Enviada!
                </h3>
                <p className="text-xs text-[#93c5fd] max-w-xs">
                  Você será redirecionado para o WhatsApp de Alexandre Fontinele.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-blue-900/40 border border-blue-500/30 text-blue-300">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-lg uppercase tracking-tight text-white">
                    Fale com Alexandre Fontinele
                  </h3>
                </div>
                <p className="text-xs text-[#93c5fd]/80 mb-5">
                  Preencha os dados abaixo para conversar diretamente via WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd] mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      className="w-full bg-[#06101e] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd] mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-[#06101e] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd] mb-1">
                      Interesse Principal
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-[#06101e] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38bdf8] transition-colors cursor-pointer"
                    >
                      <option value="Fontenelle Academy">Fontenelle Academy</option>
                      <option value="Curso Simetria Perfeita">Curso Simetria Perfeita</option>
                      <option value="Script Comercial para WhatsApp">Script Comercial para WhatsApp</option>
                      <option value="Treinamentos para Empresas">Treinamentos para Empresas</option>
                      <option value="Palestras e Oficinas">Palestras e Oficinas</option>
                      <option value="Mentoria Individual">Mentoria Individual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd] mb-1">
                      Mensagem / Objetivo
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Conte um pouco sobre sua empresa ou o que busca desenvolver..."
                      className="w-full bg-[#06101e] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-btn relative w-full rounded-full py-3.5 px-6 font-bold uppercase tracking-[0.2em] text-[11px] text-white text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Iniciando...' : 'Conversar no WhatsApp'}</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
