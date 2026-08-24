/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { HeroProfileSection } from './components/sections/HeroProfileSection';
import { BioLinksSection } from './components/sections/BioLinksSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection, ProjectData } from './components/sections/ProjectsSection';
import { FooterSection } from './components/sections/FooterSection';
import { BookingModal } from './components/modals/BookingModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { AdminMediaManagerModal } from './components/modals/AdminMediaManagerModal';
import { AdminToolbar } from './components/admin/AdminToolbar';
import { Toast } from './components/common/Toast';
import { getMediaItem, saveMediaItem } from './utils/mediaDb';
import { subscribeToSiteData, saveGlobalSiteData, getGlobalSiteData } from './lib/firebase';
import { optimizeImageForCloud } from './utils/imageOptimizer';

const STORAGE_AVATAR_KEY = 'alexandre_fontinele_avatar_photo';
const STORAGE_PROJECTS_KEY = 'af_project_custom_images';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';

export default function App() {
  const topRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('Mentoria Executiva');
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin and Media Customization States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});

  // 1. Initial load from LocalStorage / IndexedDB + Cloud Firestore Realtime Sync
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      // Step A: Load local fast cache first so there's zero flicker
      const cachedAvatar = await getMediaItem<string>(STORAGE_AVATAR_KEY, DEFAULT_AVATAR);
      if (cachedAvatar && isMounted) setAvatarUrl(cachedAvatar);

      const cachedProjects = await getMediaItem<Record<string, string>>(STORAGE_PROJECTS_KEY, {});
      if (cachedProjects && isMounted) setProjectImages(cachedProjects);

      // Step B: Fetch direct from Firestore
      const cloudData = await getGlobalSiteData();
      if (cloudData && isMounted) {
        if (cloudData.avatarUrl) {
          setAvatarUrl(cloudData.avatarUrl);
          await saveMediaItem(STORAGE_AVATAR_KEY, cloudData.avatarUrl);
        }
        if (cloudData.projectImages) {
          setProjectImages(cloudData.projectImages);
          await saveMediaItem(STORAGE_PROJECTS_KEY, cloudData.projectImages);
        }
      }

      // Check if previously logged in as admin
      const isAuthStored =
        localStorage.getItem('af_admin_authenticated') === 'true' ||
        sessionStorage.getItem('af_admin_authenticated') === 'true';

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') {
        if (isAuthStored) {
          if (isMounted) setIsAdmin(true);
        } else {
          if (isMounted) setIsAdminAuthOpen(true);
        }
      } else if (isAuthStored) {
        if (isMounted) setIsAdmin(true);
      }
    }

    initData();

    // Step C: Subscribe to Realtime Updates from Cloud Firestore across all devices
    const unsubscribe = subscribeToSiteData((cloudData) => {
      if (!isMounted || !cloudData) return;
      if (cloudData.avatarUrl) {
        setAvatarUrl(cloudData.avatarUrl);
        saveMediaItem(STORAGE_AVATAR_KEY, cloudData.avatarUrl);
      }
      if (cloudData.projectImages) {
        setProjectImages(cloudData.projectImages);
        saveMediaItem(STORAGE_PROJECTS_KEY, cloudData.projectImages);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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

  const handleOpenSocial = (platform: string, url: string) => {
    showToast(`Abrindo ${platform}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenLink = (url: string, title: string) => {
    showToast(`Redirecionando para ${title}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    showToast('Modo Administrador ativado! Alterações agora são salvas na nuvem.');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('af_admin_authenticated');
    sessionStorage.removeItem('af_admin_authenticated');
    showToast('Modo Administrador desativado com sucesso.');
  };

  const handleUpdateAvatar = async (newUrl: string) => {
    try {
      showToast('Otimizando e sincronizando foto na nuvem...');
      const optimizedUrl = await optimizeImageForCloud(newUrl, 800, 800, 0.88);
      setAvatarUrl(optimizedUrl);
      await saveMediaItem(STORAGE_AVATAR_KEY, optimizedUrl);
      await saveGlobalSiteData({ avatarUrl: optimizedUrl });
      showToast('Foto de perfil salva na nuvem para todos os visitantes!');
    } catch (err) {
      console.error('Error updating avatar:', err);
      setAvatarUrl(newUrl);
      await saveMediaItem(STORAGE_AVATAR_KEY, newUrl);
      showToast('Foto de perfil salva!');
    }
  };

  const handleUpdateProjectImage = async (projectNum: string, newUrl: string) => {
    try {
      showToast(`Otimizando e enviando imagem do Case ${projectNum}...`);
      const optimizedUrl = await optimizeImageForCloud(newUrl, 1280, 800, 0.85);
      const updated = { ...projectImages, [projectNum]: optimizedUrl };
      setProjectImages(updated);
      await saveMediaItem(STORAGE_PROJECTS_KEY, updated);
      await saveGlobalSiteData({ projectImages: updated });
      showToast(`Imagem do Case ${projectNum} salva na nuvem para todos os usuários!`);
    } catch (err) {
      console.error('Error updating project image:', err);
      const updated = { ...projectImages, [projectNum]: newUrl };
      setProjectImages(updated);
      await saveMediaItem(STORAGE_PROJECTS_KEY, updated);
      showToast(`Imagem do Case ${projectNum} salva!`);
    }
  };

  return (
    <div className="min-h-screen w-full deep-navy-mesh text-[#D7E2EA] font-['Kanit',sans-serif] flex justify-center items-start sm:py-6 px-0 sm:px-4 selection:bg-[#1e40af] selection:text-white relative">
      {/* Floating Admin Toolbar (Visible only when Alexandre is logged in) */}
      {isAdmin && (
        <AdminToolbar
          onOpenManager={() => setIsAdminManagerOpen(true)}
          onLogout={handleAdminLogout}
        />
      )}

      {/* 
        Container com sobreposição de tons azul marinho e azul meia noite:
        - Mobile View: 100% de largura fluida
        - Desktop: 400px phone canvas com moldura meia noite e acabamento elegante
      */}
      <main
        ref={topRef}
        className={`w-full max-w-[400px] min-h-screen sm:min-h-[844px] bg-[#060e1d] border-x sm:border-[8px] border-[#0e1d38] sm:rounded-[40px] relative overflow-x-hidden flex flex-col shadow-[0_50px_100px_-20px_rgba(2,6,23,0.9),0_0_50px_rgba(30,64,175,0.2)] ${
          isAdmin ? 'mt-10 sm:mt-8' : ''
        }`}
      >
        {/* 1. HeroProfileSection (Avatar com Alexandre Fontinele + Subtítulo) */}
        <HeroProfileSection
          avatarUrl={avatarUrl}
          isAdmin={isAdmin}
          onOpenContact={() => handleOpenContact()}
          onOpenSocial={handleOpenSocial}
          onUpdateAvatar={handleUpdateAvatar}
        />

        {/* 2. BioLinksSection (Links específicos em Português) */}
        <BioLinksSection onOpenLink={handleOpenLink} />

        {/* 3. MarqueeSection (Mídias e animações contínuas em loop) */}
        <MarqueeSection isAdmin={isAdmin} onToast={showToast} />

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
            projectImages={projectImages}
            isAdmin={isAdmin}
            onViewProject={(project) => {
              setActiveProject(project);
            }}
            onUpdateImage={handleUpdateProjectImage}
          />
        </div>

        {/* 7. FooterSection (Rodapé em Português com gatilho discreto de Admin) */}
        <FooterSection
          isAdmin={isAdmin}
          onScrollTop={handleScrollToTop}
          onOpenAdmin={() => {
            if (isAdmin) {
              setIsAdminManagerOpen(true);
            } else {
              setIsAdminAuthOpen(true);
            }
          }}
        />
      </main>

      {/* Modais Interativos de Clientes/Visitantes */}
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

      {/* Modais Administrativos Exclusivos de Alexandre Fontinele */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <AdminMediaManagerModal
        isOpen={isAdminManagerOpen}
        onClose={() => setIsAdminManagerOpen(false)}
        avatarUrl={avatarUrl}
        onUpdateAvatar={handleUpdateAvatar}
        projectImages={projectImages}
        onUpdateProjectImage={handleUpdateProjectImage}
        onToast={showToast}
      />

      {/* Notificação Toast */}
      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
