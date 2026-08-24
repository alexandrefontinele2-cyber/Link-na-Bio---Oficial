import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  User,
  FolderKanban,
  Camera,
  Loader2,
  Cloud,
} from 'lucide-react';
import { saveMediaItem } from '../../utils/mediaDb';
import { BASE_PROJECTS } from '../sections/ProjectsSection';
import { saveGlobalSiteData } from '../../lib/firebase';
import { optimizeImageForCloud } from '../../utils/imageOptimizer';

interface AdminMediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
  onUpdateAvatar: (url: string) => void;
  projectImages: Record<string, string>;
  onUpdateProjectImage: (projectNumber: string, url: string) => void;
  onToast: (msg: string) => void;
}

export const AdminMediaManagerModal: React.FC<AdminMediaManagerModalProps> = ({
  isOpen,
  onClose,
  avatarUrl,
  onUpdateAvatar,
  projectImages,
  onUpdateProjectImage,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cases'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const projectInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!isOpen) return null;

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      onToast('Otimizando e enviando foto para o banco de dados em nuvem...');
      const optimizedUrl = await optimizeImageForCloud(file, 800, 800, 0.88);

      onUpdateAvatar(optimizedUrl);
      await saveMediaItem('alexandre_fontinele_avatar_photo', optimizedUrl);
      
      // Save globally to Firebase Cloud Firestore
      await saveGlobalSiteData({ avatarUrl: optimizedUrl });

      onToast('Foto de perfil salva na nuvem e visível para todos os visitantes!');
    } catch (err) {
      console.error('Error saving avatar:', err);
      onToast('Erro ao sincronizar com a nuvem. Tentando salvar localmente.');
    } finally {
      setIsSaving(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleProjectFile = async (projectNumber: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      onToast(`Otimizando e enviando imagem do Case ${projectNumber}...`);
      const optimizedUrl = await optimizeImageForCloud(file, 1280, 800, 0.85);

      onUpdateProjectImage(projectNumber, optimizedUrl);
      
      const current = { ...projectImages, [projectNumber]: optimizedUrl };
      await saveMediaItem('af_project_custom_images', current);
      
      // Save globally to Firebase Cloud Firestore
      await saveGlobalSiteData({ projectImages: current });

      onToast(`Imagem do Case ${projectNumber} salva na nuvem para todos os usuários!`);
    } catch (err) {
      console.error('Error saving project image:', err);
      onToast('Erro ao sincronizar com a nuvem.');
    } finally {
      setIsSaving(false);
      if (projectInputRefs.current[projectNumber]) {
        projectInputRefs.current[projectNumber]!.value = '';
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-[#0a192f] border border-[#1e3a5f] p-5 sm:p-6 text-[#D7E2EA] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1e3a5f]/80">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#38bdf8] font-bold mb-0.5">
                <Cloud className="w-3.5 h-3.5" />
                <span>Painel do Administrador &bull; Sincronização em Nuvem</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white m-0">
                Gerenciar Mídias e Imagens
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#93c5fd]/70 hover:text-white rounded-full bg-[#060e1d] border border-[#1e3a5f] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cloud status banner */}
          <div className="mt-3 py-1.5 px-3 rounded-xl bg-[#060e1d] border border-[#1e3a5f] flex items-center justify-between text-xs text-[#93c5fd]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Banco de dados em nuvem conectado
            </span>
            {isSaving && (
              <span className="flex items-center gap-1 text-[11px] text-[#38bdf8] font-semibold">
                <Loader2 className="w-3 h-3 animate-spin" />
                Sincronizando...
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#1e3a5f] border-[#38bdf8] text-white shadow-sm'
                  : 'bg-[#060e1d] border-[#1e3a5f]/60 text-[#93c5fd]/70 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Foto de Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                activeTab === 'cases'
                  ? 'bg-[#1e3a5f] border-[#38bdf8] text-white shadow-sm'
                  : 'bg-[#060e1d] border-[#1e3a5f]/60 text-[#93c5fd]/70 hover:text-white'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Cases &amp; Soluções</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Tab 1: Profile Photo */}
            {activeTab === 'profile' && (
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#060e1d] border border-[#1e3a5f]/60">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />

                <div className="relative group cursor-pointer mb-4" onClick={() => avatarInputRef.current?.click()}>
                  <img
                    src={avatarUrl}
                    alt="Alexandre Fontinele"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#38bdf8] shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold uppercase tracking-wider">
                    <Camera className="w-5 h-5 mb-1 text-[#38bdf8]" />
                    <span>Trocar Foto</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white mb-1">
                  Foto de Perfil (Avatar Superior)
                </p>
                <p className="text-xs text-[#93c5fd]/70 mb-4 max-w-xs">
                  Envie sua foto em alta resolução. A alteração é salva no banco de dados em nuvem e fica visível para todos os navegadores.
                </p>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => avatarInputRef.current?.click()}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white font-medium text-xs uppercase tracking-wider hover:opacity-95 flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Salvando na Nuvem...' : 'Selecionar Foto do Computador'}</span>
                </button>
              </div>
            )}

            {/* Tab 2: Cases & Soluções Images */}
            {activeTab === 'cases' && (
              <div className="space-y-3">
                <p className="text-xs text-[#93c5fd]/80">
                  Clique no botão de upload de cada case para substituir pela sua imagem personalizada:
                </p>

                {BASE_PROJECTS.map((proj) => {
                  const currentImg = projectImages[proj.number] || proj.imageUrl;
                  return (
                    <div
                      key={proj.number}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#060e1d] border border-[#1e3a5f]/70"
                    >
                      <input
                        ref={(el) => (projectInputRefs.current[proj.number] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProjectFile(proj.number, e)}
                        className="hidden"
                      />

                      <img
                        src={currentImg}
                        alt={proj.title}
                        className="w-16 h-14 rounded-xl object-cover border border-[#1e3a5f] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#38bdf8] font-mono">
                            {proj.number}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate">
                            {proj.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-[#93c5fd]/70 truncate">
                          {proj.category}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => projectInputRefs.current[proj.number]?.click()}
                        className="py-1.5 px-3 rounded-lg bg-[#1e3a5f] hover:bg-[#2563eb] text-white text-[11px] font-semibold flex items-center gap-1.5 shrink-0 border border-[#38bdf8]/40 transition-colors disabled:opacity-50"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Trocar</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 mt-2 border-t border-[#1e3a5f]/60 flex items-center justify-between text-xs text-[#93c5fd]/70">
            <span>Sincronizado automaticamente com o banco global</span>
            <button
              onClick={onClose}
              className="py-1.5 px-4 rounded-xl bg-[#1e3a5f] text-white font-medium text-xs hover:bg-[#38bdf8] hover:text-black transition-colors"
            >
              Concluir
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
