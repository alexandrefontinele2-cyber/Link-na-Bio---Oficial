/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { HeroProfileSection } from './components/sections/HeroProfileSection';
import { BioLinksSection } from './components/sections/BioLinksSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection, ProjectData } from './components/sections/ProjectsSection';
import { FooterSection } from './components/sections/FooterSection';
import { BookingModal } from './components/modals/BookingModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { Toast } from './components/common/Toast';

export default function App() {
  const topRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Mentoria Executiva');
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleOpenContact = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  const handleOpenSocial = (platform: string) => {
    showToast(`Abrindo perfil de Alexandre Fontinele no ${platform}...`);
    window.open(`https://${platform.toLowerCase()}.com`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenLink = (url: string, title: string) => {
    showToast(`Redirecionando para ${title}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full deep-navy-mesh text-[#D7E2EA] font-['Kanit',sans-serif] flex justify-center items-start sm:py-6 px-0 sm:px-4 selection:bg-[#1e40af] selection:text-white">
      {/* 
        Container com sobreposição de tons azul marinho e azul meia noite:
        - Mobile View: 100% de largura fluida
        - Desktop: 400px phone canvas com moldura meia noite e acabamento elegante
      */}
      <main
        ref={topRef}
        className="w-full max-w-[400px] min-h-screen sm:min-h-[844px] bg-[#060e1d] border-x sm:border-[8px] border-[#0e1d38] sm:rounded-[40px] relative overflow-x-hidden flex flex-col shadow-[0_50px_100px_-20px_rgba(2,6,23,0.9),0_0_50px_rgba(30,64,175,0.2)]"
      >
        {/* 1. HeroProfileSection (Avatar com Alexandre Fontinele + Subtítulo) */}
        <HeroProfileSection
          onOpenContact={() => handleOpenContact()}
          onOpenSocial={handleOpenSocial}
        />

        {/* 2. BioLinksSection (Links específicos em Português) */}
        <BioLinksSection onOpenLink={handleOpenLink} />

        {/* 3. MarqueeSection (Mídias e animações contínuas em loop) */}
        <MarqueeSection onToast={showToast} />

        {/* 4. AboutSection (Sobre Mim com texto alinhado sem quebra) */}
        <AboutSection onOpenContact={() => handleOpenContact()} />

        {/* 5. ServicesSection (Serviços e Soluções com Treinamentos Corporativos) */}
        <div ref={servicesRef}>
          <ServicesSection
            onSelectService={(serviceName) => {
              handleOpenContact(serviceName);
            }}
          />
        </div>

        {/* 6. ProjectsSection (Cases & Metodologias com Solução 1 Manual de IA e Solução 4 Instagram) */}
        <div ref={projectsRef}>
          <ProjectsSection
            onViewProject={(project) => {
              setActiveProject(project);
            }}
          />
        </div>

        {/* 7. FooterSection (Rodapé em Português) */}
        <FooterSection onScrollTop={handleScrollToTop} />
      </main>

      {/* Modais Interativos */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedService}
        onSuccessToast={showToast}
      />

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onBookSimilar={(title) => {
          setActiveProject(null);
          handleOpenContact(`Interesse em ${title}`);
        }}
      />

      {/* Notificação Toast */}
      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
