import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Globe, Mail, Camera } from 'lucide-react';
import { FadeIn } from '../common/FadeIn';
import { Magnet } from '../common/Magnet';

interface HeroProfileSectionProps {
  avatarUrl: string;
  isAdmin?: boolean;
  onOpenContact: () => void;
  onOpenSocial: (platform: string, url: string) => void;
  onUpdateAvatar?: (url: string) => void;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';

export const HeroProfileSection: React.FC<HeroProfileSectionProps> = ({
  avatarUrl,
  isAdmin = false,
  onOpenContact,
  onOpenSocial,
  onUpdateAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/fontenelleacademy/',
    },
    {
      name: 'Linkedin',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/alexandre-fontinele-964463208/',
    },
    {
      name: 'Site',
      icon: Globe,
      url: 'https://fontenelleacademy.com.br/',
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:contato@fontenelleacademy.com.br',
      isMail: true,
    },
  ];

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateAvatar) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="px-5 pt-8 pb-4 flex flex-col items-center text-center relative z-20">
      {/* Hidden file input for Admin avatar change */}
      {isAdmin && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarFile}
          className="hidden"
          aria-label="Upload de foto de perfil"
        />
      )}

      {/* 1. Status Badge */}
      <FadeIn delay={0} y={-10}>
        <div
          onClick={onOpenContact}
          className="status-badge px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 uppercase tracking-widest font-bold cursor-pointer hover:border-[#38bdf8]/60 transition-colors shadow-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] tracking-[0.15em] text-[#D7E2EA]">
            DISPONÍVEL PARA PROJETOS &amp; PALESTRAS
          </span>
        </div>
      </FadeIn>

      {/* 2. Hero Portrait with Magnet effect */}
      <FadeIn delay={0.15} y={20} className="mt-4 mb-3">
        <Magnet strength={22}>
          <div
            className={`relative group ${isAdmin ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (isAdmin) {
                fileInputRef.current?.click();
              }
            }}
            title={isAdmin ? 'Clique para trocar sua foto de perfil' : undefined}
          >
            {/* Glow halo */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#1e40af]/40 via-[#B600A8]/30 to-[#3b82f6]/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            <img
              src={avatarUrl || DEFAULT_AVATAR}
              alt="Alexandre Fontinele"
              loading="eager"
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#93c5fd]/80 object-cover shadow-2xl transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />

            {/* Admin camera badge overlay (Visible ONLY when admin is logged in) */}
            {isAdmin && (
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[9px] font-bold uppercase tracking-wider">
                <Camera className="w-5 h-5 mb-0.5 text-[#38bdf8]" />
                <span>Trocar Foto</span>
              </div>
            )}
          </div>
        </Magnet>
      </FadeIn>

      {/* 3. Hero Heading */}
      <FadeIn delay={0.3} y={20}>
        <h1 className="hero-heading text-4xl sm:text-5xl font-black uppercase tracking-tight m-0 select-none px-2">
          ALEXANDRE FONTINELE
        </h1>
      </FadeIn>

      {/* 4. Subtitle / Role */}
      <FadeIn delay={0.4} y={20}>
        <p className="text-[#93c5fd] text-xs uppercase tracking-widest mt-1.5 opacity-90 font-medium">
          Mentor &bull; Palestrante &bull; Estrategista
        </p>
      </FadeIn>

      {/* 5. Social Links Bar */}
      <FadeIn delay={0.5} y={20}>
        <div className="flex flex-row gap-3 justify-center items-center mt-4">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (item.isMail) {
                    window.location.href = item.url;
                  } else {
                    onOpenSocial(item.name, item.url);
                  }
                }}
                aria-label={item.name}
                title={item.name}
                className="w-8 h-8 rounded-full bg-[#0a182e]/80 border border-[#1e3a5f] text-[#D7E2EA] opacity-85 hover:opacity-100 hover:bg-[#1e3a5f] hover:border-[#38bdf8]/60 transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center"
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            );
          })}
        </div>
      </FadeIn>
    </header>
  );
};
