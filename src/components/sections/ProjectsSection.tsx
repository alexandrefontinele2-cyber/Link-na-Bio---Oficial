import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiveProjectButton } from '../common/LiveProjectButton';
import { FadeIn } from '../common/FadeIn';

export interface ProjectData {
  number: string;
  title: string;
  category: string;
  imageUrl: string;
  year: string;
  description: string;
  tags: string[];
  link?: string;
}

export const PROJECTS: ProjectData[] = [
  {
    number: '01',
    title: 'Fontenelle Academy',
    category: 'Ecossistema de Treinamentos & Mentorias',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1280&auto=format&fit=crop',
    year: '2026',
    description:
      'Plataforma e metodologia completa para formação de líderes, capacitação de equipes corporativas e mentoria executiva focada em resultados acelerados.',
    tags: ['Liderança', 'Mentoria', 'Estratégia', 'Gestão'],
    link: 'https://fontenelleacademy.com.br/',
  },
  {
    number: '02',
    title: 'Curso Simetria Perfeita',
    category: 'Gestão e Vendas para Clínicas de Estética',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1280&auto=format&fit=crop',
    year: '2026',
    description:
      'Método validado para atração de pacientes de alto ticket, fidelização, vendas consultivas e diferenciação no concorrido mercado de estética.',
    tags: ['Estética Premium', 'Vendas Consultivas', 'Alto Ticket'],
    link: 'https://pay.cakto.com.br/3czvimn_919773',
  },
  {
    number: '03',
    title: 'Script Comercial WhatsApp',
    category: 'Metodologia de Conversão & Fechamento',
    imageUrl:
      'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=1280&auto=format&fit=crop',
    year: '2025',
    description:
      'Estrutura comprovada passo a passo para dobrar a taxa de fechamento de mensagens comerciais, contornar objeções e acelerar o ciclo de vendas.',
    tags: ['WhatsApp Business', 'Copywriting', 'Gatilhos de Venda'],
    link: 'https://script.fontenelleacademy.com.br/',
  },
];

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
  onViewProject: (project: ProjectData) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  total,
  onViewProject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [0.94 + index * 0.02, 1]
  );

  const stickyTop = 24 + index * 16;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex: 10 + index,
      }}
      className="mb-6 last:mb-0"
    >
      <motion.div
        style={{ scale }}
        className="rounded-2xl border border-[#1e3a5f]/80 bg-[#0a192f]/90 backdrop-blur-md p-4 text-[#D7E2EA] shadow-xl hover:border-[#60a5fa]/60 transition-colors group cursor-pointer"
        onClick={() => onViewProject(project)}
      >
        {/* Main tall image */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3 bg-[#071324]">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040a17]/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-mono tracking-wider text-[#D7E2EA]">
            {project.year}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-black text-xl text-[#93c5fd] tracking-tighter shrink-0">
              {project.number}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-[#D7E2EA] group-hover:text-white truncate">
                {project.title}
              </h3>
              <p className="text-xs text-[#93c5fd]/70 font-light truncate">
                {project.category}
              </p>
            </div>
          </div>

          <LiveProjectButton
            label="Ver Detalhes"
            onClick={() => {
              onViewProject(project);
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

interface ProjectsSectionProps {
  onViewProject: (project: ProjectData) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onViewProject }) => {
  return (
    <section className="bg-[#060e1d] rounded-t-[32px] -mt-8 pt-8 px-5 pb-12 z-10 relative border-t border-[#1a2c4e]">
      {/* Heading */}
      <FadeIn delay={0.1} y={15}>
        <h2 className="hero-heading font-black uppercase text-3xl text-center mb-6 tracking-tight">
          CASES &amp; SOLUÇÕES
        </h2>
      </FadeIn>

      {/* Stacking Project Cards */}
      <div className="relative">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            total={PROJECTS.length}
            onViewProject={onViewProject}
          />
        ))}
      </div>
    </section>
  );
};
