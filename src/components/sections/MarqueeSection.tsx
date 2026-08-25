import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { EMBEDDED_MARQUEE_ROW1, EMBEDDED_MARQUEE_ROW2 } from '../../data/defaultMedia';
import { optimizeImageForCloud } from '../../utils/imageOptimizer';

export interface MarqueeMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  title?: string;
}

interface MarqueeSectionProps {
  isAdmin?: boolean;
  row1Items?: MarqueeMediaItem[];
  row2Items?: MarqueeMediaItem[];
  onUpdateSlot?: (row: 1 | 2, index: number, newItem: MarqueeMediaItem) => void;
  onToast?: (msg: string) => void;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({
  isAdmin = false,
  row1Items = EMBEDDED_MARQUEE_ROW1,
  row2Items = EMBEDDED_MARQUEE_ROW2,
  onUpdateSlot,
  onToast,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<{ row: 1 | 2; index: number } | null>(null);
  const [isInView, setIsInView] = useState(true);

  // Performance: Pause video rendering when out of viewport to save CPU/GPU and ensure 60fps scrolling
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (row: 1 | 2, index: number) => {
    if (!isAdmin) return;
    setSelectedSlotIndex({ row, index });
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlotIndex || !onUpdateSlot) return;

    const isVideo =
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.mov') ||
      file.name.endsWith('.webm');
    const isGif = file.type === 'image/gif' || file.name.endsWith('.gif');
    const mediaType: 'image' | 'video' | 'gif' = isVideo ? 'video' : isGif ? 'gif' : 'image';

    const { row, index } = selectedSlotIndex;

    try {
      if (isVideo) {
        onToast?.('Processando e enviando vídeo para a nuvem...');
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          onUpdateSlot(row, index, {
            id: `r${row}-${index}-${Date.now()}`,
            url: result,
            type: 'video',
            title: `Vídeo ${row === 1 ? 'Linha 1' : 'Linha 2'} #${index + 1}`,
          });
        };
        reader.readAsDataURL(file);
      } else if (isGif) {
        onToast?.('Processando GIF animado...');
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          onUpdateSlot(row, index, {
            id: `r${row}-${index}-${Date.now()}`,
            url: result,
            type: 'gif',
            title: `GIF ${row === 1 ? 'Linha 1' : 'Linha 2'} #${index + 1}`,
          });
        };
        reader.readAsDataURL(file);
      } else {
        onToast?.('Otimizando imagem para nuvem...');
        const optimizedUrl = await optimizeImageForCloud(file, 800, 600, 0.82);
        onUpdateSlot(row, index, {
          id: `r${row}-${index}-${Date.now()}`,
          url: optimizedUrl,
          type: 'image',
          title: `Foto ${row === 1 ? 'Linha 1' : 'Linha 2'} #${index + 1}`,
        });
      }
    } catch (err) {
      console.error('Error uploading marquee media:', err);
      onToast?.('Erro ao processar arquivo.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Only 2 duplicate sets for infinite loop (slashes DOM elements & video decoders by over 50%)
  const displayRow1 = [...row1Items, ...row1Items];
  const displayRow2 = [...row2Items, ...row2Items];

  const renderMedia = (item: MarqueeMediaItem, isFirstInstance: boolean) => {
    const isVideo =
      item.type === 'video' ||
      item.url.startsWith('data:video') ||
      item.url.endsWith('.mp4') ||
      item.url.endsWith('.webm') ||
      item.url.endsWith('.mov');

    if (isVideo) {
      return (
        <video
          src={item.url}
          autoPlay={isInView}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover pointer-events-none"
        />
      );
    }

    return (
      <img
        src={item.url}
        alt={item.title || 'Mídia'}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
        onError={(e) => {
          e.currentTarget.src =
            'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop';
        }}
      />
    );
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#060e1d] py-6 overflow-hidden relative select-none w-full border-y border-[#1a2c4e]/50"
    >
      {/* Hidden file input for uploading and saving video or image when admin is logged in */}
      {isAdmin && (
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*,image/*,image/gif"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload de vídeo ou foto"
        />
      )}

      {/* Subtle vignette gradient on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#060e1d] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#060e1d] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-3">
        {/* Row 1 - Smooth CSS Hardware-Accelerated 60FPS Scroll */}
        <div className="overflow-hidden flex w-full">
          <div className="animate-marquee-left flex gap-2.5">
            {displayRow1.map((item, index) => {
              const originalIndex = index % row1Items.length;
              const isFirst = index < row1Items.length;
              return (
                <div
                  key={`row1-${index}-${item.id}`}
                  onClick={() => handleCardClick(1, originalIndex)}
                  className={`relative w-[210px] h-[135px] rounded-xl overflow-hidden shrink-0 border border-[#1e3a5f] bg-[#0a192f] group shadow-md ${
                    isAdmin ? 'cursor-pointer' : ''
                  }`}
                  title={isAdmin ? 'Clique para trocar o vídeo ou foto deste slot' : undefined}
                >
                  {renderMedia(item, isFirst)}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />

                  {/* Admin indicator overlay on hover */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white pointer-events-none">
                      <Camera className="w-4 h-4 text-[#38bdf8]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        Editar Mídia
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2 - Smooth CSS Hardware-Accelerated 60FPS Scroll */}
        <div className="overflow-hidden flex w-full">
          <div className="animate-marquee-right flex gap-2.5">
            {displayRow2.map((item, index) => {
              const originalIndex = index % row2Items.length;
              const isFirst = index < row2Items.length;
              return (
                <div
                  key={`row2-${index}-${item.id}`}
                  onClick={() => handleCardClick(2, originalIndex)}
                  className={`relative w-[210px] h-[135px] rounded-xl overflow-hidden shrink-0 border border-[#1e3a5f] bg-[#0a192f] group shadow-md ${
                    isAdmin ? 'cursor-pointer' : ''
                  }`}
                  title={isAdmin ? 'Clique para trocar o vídeo ou foto deste slot' : undefined}
                >
                  {renderMedia(item, isFirst)}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />

                  {/* Admin indicator overlay on hover */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white pointer-events-none">
                      <Camera className="w-4 h-4 text-[#38bdf8]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        Editar Mídia
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
