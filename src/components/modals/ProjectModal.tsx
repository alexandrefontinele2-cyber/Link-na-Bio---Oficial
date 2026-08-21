import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag } from 'lucide-react';
import { ProjectData } from '../sections/ProjectsSection';
import { ContactButton } from '../common/ContactButton';

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onBookSimilar: (title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onBookSimilar,
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#0a192f] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl text-[#D7E2EA] z-10 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col gap-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-[#D7E2EA] hover:text-white hover:bg-black/90 transition-colors cursor-pointer border border-white/10"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero Image */}
          <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-[#06101e] shrink-0 border border-[#1e3a5f]">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040915] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 pr-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 border border-white/15 text-[#93c5fd]">
                Solução {project.number} &bull; {project.year}
              </span>
              <h3 className="font-bold text-xl text-white mt-1">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd]/70 block mb-1">
                Segmento &amp; Escopo
              </span>
              <p className="text-sm font-medium text-white">
                {project.category}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd]/70 block mb-1">
                Sobre a Solução
              </span>
              <p className="text-xs text-[#D7E2EA]/90 font-light leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tags */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd]/70 block mb-1.5">
                Competências &amp; Tópicos
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#06101e] border border-[#1e3a5f] text-[#93c5fd]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 px-4 rounded-full bg-[#1e40af] hover:bg-[#2563eb] text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Acessar Página Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            <ContactButton
              label={`Falar sobre ${project.title}`}
              onClick={() => onBookSimilar(project.title)}
              showArrow={true}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
