import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
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

export const BASE_PROJECTS: ProjectData[] = [
  {
    number: '01',
    title: 'Manual prático de IA para clínicas',
    category: 'Inteligência Artificial & Produtividade',
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
    year: '2026',
    description:
      'Guia completo e descomplicado para implementação de IA na rotina de clínicas, automação de processos e atendimento de alta conversão.',
    tags: ['Inteligência Artificial', 'Automação', 'Clínicas', 'Produtividade'],
    link: 'https://pay.cakto.com.br/p3vfhui_918609',
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
  {
    number: '04',
    title: 'Instagram profissional - Plano prático',
    category: 'Posicionamento Digital & Atração',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1280&auto=format&fit=crop',
    year: '2026',
    description:
      'Plano prático passo a passo para transformar o seu perfil do Instagram em uma máquina de atração de clientes qualificados e autoridade.',
    tags: ['Instagram', 'Posicionamento', 'Autoridade', 'Captação'],
    link: 'https://pay.cakto.com.br/3dqnh7i_919104',
  },
];

export const PROJECTS = BASE_PROJECTS;

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
  isAdmin?: boolean;
  onViewProject: (project: ProjectData) => void;
  onUpdateImage?: (projectNumber: string, url: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isAdmin = false,
  onViewProject,
  onUpdateImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stickyTop = 16 + index * 12;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateImage) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateImage(project.number, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex: 10 + index,
        transform: 'translateZ(0)',
      }}
      className="mb-5 last:mb-0"
    >
      {/* Hidden file input for admin update */}
      {isAdmin && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Upload imagem do case ${project.number}`}
        />
      )}

      <div
        className="rounded-2xl border border-[#1e3a5f] bg-[#0a192f] p-4 text-[#D7E2EA] shadow-xl hover:border-[#60a5fa]/60 transition-all duration-200 group cursor-pointer"
        onClick={() => onViewProject(project)}
      >
        {/* Main tall image */}
        <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-[#071324] group/img">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040a17]/80 via-transparent to-transparent pointer-events-none" />

          {/* Admin Edit Button on top-left of image */}
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 border border-[#38bdf8] text-[10px] uppercase font-bold text-[#38bdf8] flex items-center gap-1 hover:bg-[#38bdf8] hover:text-black transition-colors z-20 shadow-md"
              title="Trocar imagem deste case"
            >
              <Camera className="w-3 h-3" />
              <span>Trocar Imagem</span>
            </button>
          )}

          {/* Year badge */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 border border-white/10 text-[10px] uppercase font-mono tracking-wider text-[#D7E2EA]">
            {project.year}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 min-w-0 pr-1">
            <span className="font-black text-xl text-[#93c5fd] tracking-tighter shrink-0 font-mono">
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
      </div>
    </div>
  );
};

interface ProjectsSectionProps {
  projectImages?: Record<string, string>;
  isAdmin?: boolean;
  onViewProject: (project: ProjectData) => void;
  onUpdateImage?: (projectNumber: string, url: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projectImages = {},
  isAdmin = false,
  onViewProject,
  onUpdateImage,
}) => {
  const projects: ProjectData[] = BASE_PROJECTS.map((proj) => ({
    ...proj,
    imageUrl: projectImages[proj.number] || proj.imageUrl,
  }));

  return (
    <section className="bg-[#060e1d] rounded-t-[32px] -mt-8 pt-8 px-5 pb-12 z-10 relative border-t border-[#1a2c4e]">
      {/* Heading */}
      <FadeIn delay={0.05} y={12}>
        <h2 className="hero-heading font-black uppercase text-3xl text-center mb-6 tracking-tight">
          CASES &amp; SOLUÇÕES
        </h2>
      </FadeIn>

      {/* Stacking Project Cards */}
      <div className="relative">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            total={projects.length}
            isAdmin={isAdmin}
            onViewProject={onViewProject}
            onUpdateImage={onUpdateImage}
          />
        ))}
      </div>
    </section>
  );
};
