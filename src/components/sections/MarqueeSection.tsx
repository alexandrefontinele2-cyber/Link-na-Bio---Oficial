import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getMediaItem, saveMediaItem } from '../../utils/mediaDb';
import { EMBEDDED_MARQUEE_ROW1, EMBEDDED_MARQUEE_ROW2, MediaAsset } from '../../data/defaultMedia';

export interface MarqueeMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  title?: string;
}

const STORAGE_KEY_ROW1 = 'af_marquee_row1_media';
const STORAGE_KEY_ROW2 = 'af_marquee_row2_media';

interface MarqueeSectionProps {
  isAdmin?: boolean;
  onToast?: (msg: string) => void;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({ isAdmin = false, onToast }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<{ row: 1 | 2; index: number } | null>(null);

  const [row1Items, setRow1Items] = useState<MarqueeMediaItem[]>(EMBEDDED_MARQUEE_ROW1);
  const [row2Items, setRow2Items] = useState<MarqueeMediaItem[]>(EMBEDDED_MARQUEE_ROW2);

  // Load from IndexedDB / LocalStorage if user has custom uploads, otherwise fallback to embedded
  useEffect(() => {
    let isMounted = true;
    async function loadStoredMedia() {
      const savedRow1 = await getMediaItem<MarqueeMediaItem[]>(STORAGE_KEY_ROW1, EMBEDDED_MARQUEE_ROW1);
      const savedRow2 = await getMediaItem<MarqueeMediaItem[]>(STORAGE_KEY_ROW2, EMBEDDED_MARQUEE_ROW2);
      if (isMounted) {
        if (savedRow1 && savedRow1.length > 0) setRow1Items(savedRow1);
        if (savedRow2 && savedRow2.length > 0) setRow2Items(savedRow2);
      }
    }
    loadStoredMedia();
    return () => {
      isMounted = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Row 1: Moves RIGHT on scroll
  const xRow1 = useTransform(scrollYProgress, [0, 1], ['-35%', '5%']);
  // Row 2: Moves LEFT on scroll
  const xRow2 = useTransform(scrollYProgress, [0, 1], ['5%', '-35%']);

  const handleCardClick = (row: 1 | 2, index: number) => {
    if (!isAdmin) return;
    setSelectedSlotIndex({ row, index });
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlotIndex) return;

    const isVideo =
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.mov') ||
      file.name.endsWith('.webm');
    const isGif = file.type === 'image/gif' || file.name.endsWith('.gif');
    const mediaType: 'image' | 'video' | 'gif' = isVideo ? 'video' : isGif ? 'gif' : 'image';

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const { row, index } = selectedSlotIndex;

      if (row === 1) {
        const updated = [...row1Items];
        updated[index] = {
          id: `r1-custom-${Date.now()}`,
          url: result,
          type: mediaType,
        };
        setRow1Items(updated);
        await saveMediaItem(STORAGE_KEY_ROW1, updated);
      } else {
        const updated = [...row2Items];
        updated[index] = {
          id: `r2-custom-${Date.now()}`,
          url: result,
          type: mediaType,
        };
        setRow2Items(updated);
        await saveMediaItem(STORAGE_KEY_ROW2, updated);
      }

      onToast?.(isVideo ? 'Vídeo salvo e fixado com sucesso!' : 'Mídia salva e fixada com sucesso!');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsDataURL(file);
  };

  // Repeated sets to ensure seamless scroll coverage
  const displayRow1 = [...row1Items, ...row1Items, ...row1Items];
  const displayRow2 = [...row2Items, ...row2Items, ...row2Items];

  const renderMedia = (item: MarqueeMediaItem) => {
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
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <img
        src={item.url}
        alt={item.title || "Preview de trabalho e mídia animada"}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        {/* Row 1 - Moves RIGHT on scroll */}
        <motion.div
          style={{ x: xRow1 }}
          className="flex gap-2.5 w-max will-change-transform"
        >
          {displayRow1.map((item, index) => {
            const originalIndex = index % row1Items.length;
            return (
              <div
                key={`row1-${index}-${item.id}`}
                onClick={() => handleCardClick(1, originalIndex)}
                className={`relative w-[220px] h-[140px] rounded-xl overflow-hidden shrink-0 border border-[#1e3a5f] bg-[#0a192f] group shadow-md ${
                  isAdmin ? 'cursor-pointer' : ''
                }`}
                title={isAdmin ? 'Clique caso queira reanexar ou ajustar seu vídeo/foto' : undefined}
              >
                {renderMedia(item)}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />
              </div>
            );
          })}
        </motion.div>

        {/* Row 2 - Moves LEFT on scroll */}
        <motion.div
          style={{ x: xRow2 }}
          className="flex gap-2.5 w-max will-change-transform"
        >
          {displayRow2.map((item, index) => {
            const originalIndex = index % row2Items.length;
            return (
              <div
                key={`row2-${index}-${item.id}`}
                onClick={() => handleCardClick(2, originalIndex)}
                className={`relative w-[220px] h-[140px] rounded-xl overflow-hidden shrink-0 border border-[#1e3a5f] bg-[#0a192f] group shadow-md ${
                  isAdmin ? 'cursor-pointer' : ''
                }`}
                title={isAdmin ? 'Clique caso queira reanexar ou ajustar seu vídeo/foto' : undefined}
              >
                {renderMedia(item)}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
