import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  User,
  FolderKanban,
  Video,
  Camera,
  Loader2,
  Cloud,
  Link as LinkIcon,
  RotateCcw,
  Film,
  Sparkles,
} from 'lucide-react';
import { saveMediaItem } from '../../utils/mediaDb';
import { BASE_PROJECTS } from '../sections/ProjectsSection';
import { MarqueeMediaItem } from '../sections/MarqueeSection';
import { EMBEDDED_MARQUEE_ROW1, EMBEDDED_MARQUEE_ROW2 } from '../../data/defaultMedia';
import { saveGlobalSiteData } from '../../lib/firebase';
import { optimizeImageForCloud } from '../../utils/imageOptimizer';

interface AdminMediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
  onUpdateAvatar: (url: string) => void;
  projectImages: Record<string, string>;
  onUpdateProjectImage: (projectNumber: string, url: string) => void;
  marqueeRow1: MarqueeMediaItem[];
  marqueeRow2: MarqueeMediaItem[];
  onUpdateMarqueeRow1: (items: MarqueeMediaItem[]) => void;
  onUpdateMarqueeRow2: (items: MarqueeMediaItem[]) => void;
  onToast: (msg: string) => void;
}

export const AdminMediaManagerModal: React.FC<AdminMediaManagerModalProps> = ({
  isOpen,
  onClose,
  avatarUrl,
  onUpdateAvatar,
  projectImages,
  onUpdateProjectImage,
  marqueeRow1,
  marqueeRow2,
  onUpdateMarqueeRow1,
  onUpdateMarqueeRow2,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cases' | 'marquee'>('profile');
  const [marqueeSelectedRow, setMarqueeSelectedRow] = useState<1 | 2>(1);
  const [editingUrlIndex, setEditingUrlIndex] = useState<{ row: 1 | 2; index: number } | null>(null);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const projectInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const marqueeInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!isOpen) return null;

  // 1. Profile Avatar
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      onToast('Otimizando e enviando foto para o banco de dados em nuvem...');
      const optimizedUrl = await optimizeImageForCloud(file, 800, 800, 0.88);

      onUpdateAvatar(optimizedUrl);
      await saveMediaItem('alexandre_fontinele_avatar_photo', optimizedUrl);
      await saveGlobalSiteData({ avatarUrl: optimizedUrl });

      onToast('Foto de perfil salva na nuvem e visível para todos os visitantes!');
    } catch (err) {
      console.error('Error saving avatar:', err);
      onToast('Erro ao sincronizar com a nuvem.');
    } finally {
      setIsSaving(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // 2. Projects / Cases
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

  // 3. Marquee / Palestras & Mídias File Upload
  const handleMarqueeFile = async (row: 1 | 2, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo =
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.mov') ||
      file.name.endsWith('.webm');
    const isGif = file.type === 'image/gif' || file.name.endsWith('.gif');
    const mediaType: 'image' | 'video' | 'gif' = isVideo ? 'video' : isGif ? 'gif' : 'image';

    try {
      setIsSaving(true);

      if (isVideo) {
        onToast(`Enviando vídeo para a Linha ${row}, Item #${index + 1}...`);
        const reader = new FileReader();
        reader.onload = async () => {
          const result = reader.result as string;
          await applyMarqueeUpdate(row, index, result, 'video');
        };
        reader.readAsDataURL(file);
      } else if (isGif) {
        onToast(`Enviando GIF animado para a Linha ${row}, Item #${index + 1}...`);
        const reader = new FileReader();
        reader.onload = async () => {
          const result = reader.result as string;
          await applyMarqueeUpdate(row, index, result, 'gif');
        };
        reader.readAsDataURL(file);
      } else {
        onToast(`Otimizando foto para a Linha ${row}, Item #${index + 1}...`);
        const optimizedUrl = await optimizeImageForCloud(file, 800, 600, 0.82);
        await applyMarqueeUpdate(row, index, optimizedUrl, 'image');
      }
    } catch (err) {
      console.error('Error uploading marquee media:', err);
      onToast('Erro ao salvar arquivo na nuvem.');
      setIsSaving(false);
    } finally {
      const key = `r${row}-${index}`;
      if (marqueeInputRefs.current[key]) {
        marqueeInputRefs.current[key]!.value = '';
      }
    }
  };

  const applyMarqueeUpdate = async (
    row: 1 | 2,
    index: number,
    url: string,
    type: 'image' | 'video' | 'gif'
  ) => {
    if (row === 1) {
      const updated = [...marqueeRow1];
      updated[index] = {
        id: `r1-${index}-${Date.now()}`,
        url,
        type,
        title: updated[index]?.title || `Mídia Linha 1 #${index + 1}`,
      };
      onUpdateMarqueeRow1(updated);
      await saveMediaItem('af_marquee_row1_media', updated);
      await saveGlobalSiteData({ marqueeRow1: updated });
    } else {
      const updated = [...marqueeRow2];
      updated[index] = {
        id: `r2-${index}-${Date.now()}`,
        url,
        type,
        title: updated[index]?.title || `Mídia Linha 2 #${index + 1}`,
      };
      onUpdateMarqueeRow2(updated);
      await saveMediaItem('af_marquee_row2_media', updated);
      await saveGlobalSiteData({ marqueeRow2: updated });
    }
    setIsSaving(false);
    onToast(`Mídia #${index + 1} da Linha ${row} salva na nuvem com sucesso!`);
  };

  const handleSaveUrlInput = async () => {
    if (!editingUrlIndex || !urlInputValue.trim()) return;
    const { row, index } = editingUrlIndex;
    const url = urlInputValue.trim();
    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('video');
    const isGif = url.endsWith('.gif');
    const type: 'image' | 'video' | 'gif' = isVideo ? 'video' : isGif ? 'gif' : 'image';

    setIsSaving(true);
    await applyMarqueeUpdate(row, index, url, type);
    setEditingUrlIndex(null);
    setUrlInputValue('');
  };

  const handleResetMarqueeSlot = async (row: 1 | 2, index: number) => {
    const original = row === 1 ? EMBEDDED_MARQUEE_ROW1[index] : EMBEDDED_MARQUEE_ROW2[index];
    if (!original) return;
    setIsSaving(true);
    await applyMarqueeUpdate(row, index, original.url, original.type);
  };

  const currentMarqueeItems = marqueeSelectedRow === 1 ? marqueeRow1 : marqueeRow2;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-[#0a192f] border border-[#1e3a5f] p-4 sm:p-6 text-[#D7E2EA] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]/80">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#38bdf8] font-bold mb-0.5">
                <Cloud className="w-3.5 h-3.5" />
                <span>Painel do Administrador &bull; Sincronização Global</span>
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
              Banco de dados em nuvem ativo
            </span>
            {isSaving && (
              <span className="flex items-center gap-1 text-[11px] text-[#38bdf8] font-semibold">
                <Loader2 className="w-3 h-3 animate-spin" />
                Salvando na Nuvem...
              </span>
            )}
          </div>

          {/* 3 Tabs */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 mb-3">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#1e3a5f] border-[#38bdf8] text-white shadow-sm'
                  : 'bg-[#060e1d] border-[#1e3a5f]/60 text-[#93c5fd]/70 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Foto Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab('marquee')}
              className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
                activeTab === 'marquee'
                  ? 'bg-[#1e3a5f] border-[#38bdf8] text-white shadow-sm'
                  : 'bg-[#060e1d] border-[#1e3a5f]/60 text-[#93c5fd]/70 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="truncate">Vídeos &amp; Mídias</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
                activeTab === 'cases'
                  ? 'bg-[#1e3a5f] border-[#38bdf8] text-white shadow-sm'
                  : 'bg-[#060e1d] border-[#1e3a5f]/60 text-[#93c5fd]/70 hover:text-white'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Cases</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* TAB 1: Profile Photo */}
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

            {/* TAB 2: Marquee / Vídeos e Fotos abaixo de Palestras e Oficinas */}
            {activeTab === 'marquee' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#060e1d] border border-[#1e3a5f]/70">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-white">
                      Carrossel de Mídias (Abaixo de Palestras &amp; Oficinas)
                    </p>
                    {/* Row Selector Pill */}
                    <div className="flex gap-1 bg-[#0a192f] p-0.5 rounded-lg border border-[#1e3a5f]">
                      <button
                        onClick={() => setMarqueeSelectedRow(1)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                          marqueeSelectedRow === 1
                            ? 'bg-[#38bdf8] text-black shadow-sm'
                            : 'text-[#93c5fd]/70 hover:text-white'
                        }`}
                      >
                        Linha 1
                      </button>
                      <button
                        onClick={() => setMarqueeSelectedRow(2)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                          marqueeSelectedRow === 2
                            ? 'bg-[#38bdf8] text-black shadow-sm'
                            : 'text-[#93c5fd]/70 hover:text-white'
                        }`}
                      >
                        Linha 2
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#93c5fd]/80">
                    Você pode enviar vídeos (.mp4, .mov, .webm), GIFs ou fotos do computador, ou colar um link direto de vídeo/imagem.
                  </p>
                </div>

                {/* Direct URL input modal overlay if open */}
                {editingUrlIndex && (
                  <div className="p-3 rounded-2xl bg-[#060e1d] border-2 border-[#38bdf8] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <LinkIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                        Colar URL para Linha {editingUrlIndex.row} &bull; Item #{editingUrlIndex.index + 1}
                      </span>
                      <button
                        onClick={() => setEditingUrlIndex(null)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                    <input
                      type="url"
                      autoFocus
                      placeholder="https://exemplo.com/meu-video.mp4 ou link de imagem"
                      value={urlInputValue}
                      onChange={(e) => setUrlInputValue(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-lg bg-[#0a192f] border border-[#1e3a5f] text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                    <button
                      onClick={handleSaveUrlInput}
                      disabled={!urlInputValue.trim() || isSaving}
                      className="py-1.5 px-3 rounded-lg bg-[#38bdf8] text-black font-bold text-xs uppercase tracking-wider hover:bg-sky-300 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Salvar URL na Nuvem
                    </button>
                  </div>
                )}

                {/* List of 8 slots in the active row */}
                <div className="space-y-2">
                  {currentMarqueeItems.map((item, index) => {
                    const isVideo =
                      item.type === 'video' ||
                      item.url.startsWith('data:video') ||
                      item.url.endsWith('.mp4') ||
                      item.url.endsWith('.webm') ||
                      item.url.endsWith('.mov');
                    const key = `r${marqueeSelectedRow}-${index}`;

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#060e1d] border border-[#1e3a5f]/70"
                      >
                        {/* Hidden file input */}
                        <input
                          ref={(el) => (marqueeInputRefs.current[key] = el)}
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/*,image/*,image/gif"
                          onChange={(e) => handleMarqueeFile(marqueeSelectedRow, index, e)}
                          className="hidden"
                        />

                        {/* Thumbnail / Video */}
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-[#0a192f] border border-[#1e3a5f] shrink-0 relative">
                          {isVideo ? (
                            <video
                              src={item.url}
                              muted
                              loop
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title || `Slot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-[#38bdf8] uppercase">
                            {item.type}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-[#38bdf8] font-mono">
                              #{index + 1}
                            </span>
                            <h4 className="text-xs font-semibold text-white truncate">
                              {item.title || `Mídia Linha ${marqueeSelectedRow} #${index + 1}`}
                            </h4>
                          </div>
                          <p className="text-[10px] text-[#93c5fd]/60 truncate font-mono">
                            {item.url.startsWith('data:') ? 'Arquivo em Nuvem (Base64)' : item.url}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Upload File */}
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => marqueeInputRefs.current[key]?.click()}
                            title="Enviar vídeo ou foto do computador"
                            className="p-1.5 rounded-lg bg-[#1e3a5f] hover:bg-[#2563eb] text-white text-[10px] font-bold flex items-center gap-1 border border-[#38bdf8]/30 transition-colors"
                          >
                            <Upload className="w-3 h-3 text-[#38bdf8]" />
                            <span className="hidden sm:inline">Upload</span>
                          </button>

                          {/* URL Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUrlIndex({ row: marqueeSelectedRow, index });
                              setUrlInputValue(item.url.startsWith('data:') ? '' : item.url);
                            }}
                            title="Colar URL direto de vídeo ou foto"
                            className="p-1.5 rounded-lg bg-[#0a192f] hover:bg-[#1e3a5f] text-[#93c5fd] hover:text-white text-[10px] border border-[#1e3a5f] transition-colors"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>

                          {/* Reset Slot */}
                          <button
                            type="button"
                            onClick={() => handleResetMarqueeSlot(marqueeSelectedRow, index)}
                            title="Restaurar padrão original deste slot"
                            className="p-1.5 rounded-lg bg-[#0a192f] hover:bg-rose-950 text-[#93c5fd]/50 hover:text-rose-400 text-[10px] border border-[#1e3a5f] transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Cases & Soluções Images */}
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
          <div className="pt-3 mt-2 border-t border-[#1e3a5f]/60 flex items-center justify-between text-xs text-[#93c5fd]/70">
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
