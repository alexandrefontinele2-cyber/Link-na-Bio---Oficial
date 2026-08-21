import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  MessageSquareText,
  Building2,
  Mic2,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { ContactButton } from '../common/ContactButton';
import { FadeIn } from '../common/FadeIn';

interface BioLinksSectionProps {
  onOpenLink: (url: string, title: string) => void;
}

const WHATSAPP_BASE = 'https://wa.me/5543988628997';

export const BioLinksSection: React.FC<BioLinksSectionProps> = ({ onOpenLink }) => {
  return (
    <section className="px-5 py-4 flex flex-col gap-3 relative z-10">
      {/* Botão 1 (Destaque Principal): Conheça Fontenelle Academy */}
      <FadeIn delay={0.1} y={15}>
        <ContactButton
          label="Conheça Fontenelle Academy"
          onClick={() => onOpenLink('https://fontenelleacademy.com.br/', 'Fontenelle Academy')}
          showArrow={true}
        />
      </FadeIn>

      {/* Botão 2: Curso Simetria Perfeita - Para clínicas de estética */}
      <FadeIn delay={0.2} y={15}>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            onOpenLink(
              'https://pay.cakto.com.br/3czvimn_919773',
              'Curso Simetria Perfeita'
            )
          }
          className="glass-card w-full p-4 flex items-center justify-between group transition-all duration-200 text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 bg-[#0f2347] border border-[#234375] rounded-xl flex items-center justify-center text-[#93c5fd] group-hover:text-white group-hover:border-[#60a5fa] transition-colors shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#D7E2EA] group-hover:text-white transition-colors m-0 truncate">
                Curso Simetria Perfeita
              </h4>
              <p className="text-[10px] text-[#93c5fd]/80 m-0 font-light mt-0.5 truncate">
                Para clínicas de estética de alto padrão
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#D7E2EA]/60 group-hover:text-[#BBCCD7] group-hover:translate-x-0.5 transition-all shrink-0">
            <ExternalLink className="w-4 h-4" />
          </div>
        </motion.button>
      </FadeIn>

      {/* Botão 3: Script Comercial para WhatsApp */}
      <FadeIn delay={0.25} y={15}>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            onOpenLink(
              'https://script.fontenelleacademy.com.br/',
              'Script Comercial para WhatsApp'
            )
          }
          className="glass-card w-full p-4 flex items-center justify-between group transition-all duration-200 text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 bg-[#0f2347] border border-[#234375] rounded-xl flex items-center justify-center text-[#93c5fd] group-hover:text-white group-hover:border-[#60a5fa] transition-colors shrink-0">
              <MessageSquareText className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#D7E2EA] group-hover:text-white transition-colors m-0 truncate">
                Script Comercial para WhatsApp
              </h4>
              <p className="text-[10px] text-[#93c5fd]/80 m-0 font-light mt-0.5 truncate">
                Metodologia de conversão e fechamento rápido
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#D7E2EA]/60 group-hover:text-[#BBCCD7] group-hover:translate-x-0.5 transition-all shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.button>
      </FadeIn>

      {/* Botão 4: Treinamentos para empresas */}
      <FadeIn delay={0.3} y={15}>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            onOpenLink(
              `${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20Treinamentos%20para%20Empresas%20com%20Alexandre%20Fontinele.`,
              'Treinamentos para Empresas'
            )
          }
          className="glass-card w-full p-4 flex items-center justify-between group transition-all duration-200 text-left cursor-pointer shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 bg-[#0f2347] border border-[#234375] rounded-xl flex items-center justify-center text-[#93c5fd] group-hover:text-white group-hover:border-[#60a5fa] transition-colors shrink-0">
              <Building2 className="w-5 h-5 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#D7E2EA] group-hover:text-white transition-colors m-0 truncate">
                  Treinamentos para Empresas
                </h4>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-950/90 border border-sky-500/40 text-sky-300 shrink-0">
                  In-Company
                </span>
              </div>
              <p className="text-[10px] text-[#93c5fd]/80 m-0 font-light mt-0.5 truncate">
                Capacitação corporativa de equipes e vendas
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#D7E2EA]/60 group-hover:text-[#BBCCD7] group-hover:translate-x-0.5 transition-all shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </FadeIn>

      {/* Botão 5: Palestras e oficinas */}
      <FadeIn delay={0.35} y={15}>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            onOpenLink(
              `${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20Palestras%20e%20Oficinas%20com%20Alexandre%20Fontinele.`,
              'Palestras e Oficinas'
            )
          }
          className="glass-card w-full p-4 flex items-center justify-between group transition-all duration-200 text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 bg-[#0f2347] border border-[#234375] rounded-xl flex items-center justify-center text-[#93c5fd] group-hover:text-white group-hover:border-[#60a5fa] transition-colors shrink-0">
              <Mic2 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#D7E2EA] group-hover:text-white transition-colors m-0 truncate">
                  Palestras e Oficinas
                </h4>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-950/90 border border-purple-500/40 text-purple-300 shrink-0">
                  Ao Vivo
                </span>
              </div>
              <p className="text-[10px] text-[#93c5fd]/80 m-0 font-light mt-0.5 truncate">
                Eventos de alto impacto, liderança e resultados
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#D7E2EA]/60 group-hover:text-[#BBCCD7] group-hover:translate-x-0.5 transition-all shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.button>
      </FadeIn>
    </section>
  );
};
