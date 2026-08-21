import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { FadeIn } from '../common/FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
  tags: string[];
  deliverables: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: '01',
    name: 'Mentoria Executiva & Liderança',
    description: 'Acompanhamento individual e estratégico para gestores, diretores e empreendedores.',
    tags: ['Estratégia', 'Gestão de Pessoas', 'Tomada de Decisão', 'OKRs & Metas'],
    deliverables: 'Diagnóstico empresarial, plano de ação quinzenal e suporte direto via WhatsApp.',
  },
  {
    number: '02',
    name: 'Treinamentos de Vendas & WhatsApp',
    description: 'Capacitação prática para times comerciais baterem metas com scripts de alta conversão.',
    tags: ['Script WhatsApp', 'Negociação', 'Gatilhos Mentais', 'Fechamento Rápido'],
    deliverables: 'Playbook comercial customizado, workshops práticos e métricas de conversão.',
  },
  {
    number: '03',
    name: 'Palestras de Alto Impacto',
    description: 'Apresentações inspiradoras e técnicas para convenções, eventos corporativos e congressos.',
    tags: ['In-Company', 'Convenções', 'Motivação & Ação', 'Resultados Reais'],
    deliverables: 'Palestra presencial ou online personalizada para os objetivos da sua empresa.',
  },
  {
    number: '04',
    name: 'Consultoria para Clínicas & Negócios',
    description: 'Estruturação de processos, posicionamento premium e retenção de clientes.',
    tags: ['Simetria Perfeita', 'Clínicas Estéticas', 'Experiência do Cliente', 'LTV'],
    deliverables: 'Mapeamento de jornada do paciente/cliente e implementação de rotinas comerciais.',
  },
  {
    number: '05',
    name: 'Workshops & Oficinas Práticas',
    description: 'Dinâmicas imersivas focadas na resolução de gargalos e aceleração de resultados.',
    tags: ['Imersão', 'Mão na Massa', 'Liderança Ágil', 'Cultura de Performance'],
    deliverables: 'Material didático exclusivo, exercícios práticos e plano de sustentação de resultados.',
  },
];

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#FFFFFF] rounded-t-[32px] px-5 py-10 my-6 text-[#0C0C0C] relative shadow-2xl">
      {/* Heading */}
      <FadeIn delay={0.1} y={15}>
        <h2 className="text-[#0C0C0C] font-black uppercase text-center text-3xl mb-8 tracking-tight">
          SERVIÇOS &amp; SOLUÇÕES
        </h2>
      </FadeIn>

      {/* Services List / Accordion */}
      <div className="flex flex-col divide-y divide-black/10">
        {SERVICES.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <FadeIn key={item.number} delay={0.08 * index} y={15}>
              <div
                onClick={() => toggleExpand(index)}
                className="py-4.5 cursor-pointer group transition-colors select-none"
              >
                {/* Header Row: Number + Service Name + Toggle icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="font-black text-2xl tracking-tighter text-[#0C0C0C]/80 group-hover:text-black transition-colors">
                      {item.number}
                    </span>
                    <span className="font-medium uppercase text-base text-[#0C0C0C] group-hover:translate-x-0.5 transition-transform">
                      {item.name}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-[#0C0C0C] group-hover:bg-black/10 transition-colors shrink-0">
                    {isExpanded ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Subtitle / Description */}
                <p className="font-light text-xs text-[#0C0C0C] opacity-70 mt-1 pl-7.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden pl-7.5 pt-3"
                    >
                      <div className="pt-2 pb-1 border-t border-black/5">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-black/50 mb-1.5">
                          Metodologias &amp; Ferramentas
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/5 border border-black/10 text-black/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-[11px] font-semibold uppercase tracking-wider text-black/50 mb-1">
                          Entregáveis &amp; Benefícios
                        </div>
                        <div className="text-xs text-black/75 font-normal mb-3">
                          {item.deliverables}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectService(item.name);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#0a192f] hover:bg-[#1e40af] px-3.5 py-2 rounded-full transition-colors cursor-pointer"
                        >
                          <span>Solicitar {item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
};
