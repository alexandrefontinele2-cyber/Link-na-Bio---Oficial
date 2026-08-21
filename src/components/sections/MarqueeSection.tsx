import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ROW1_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
];

const ROW2_IMAGES = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

// Tripled sets to ensure seamless scroll coverage
const TRIPLED_ROW1 = [...ROW1_IMAGES, ...ROW1_IMAGES, ...ROW1_IMAGES];
const TRIPLED_ROW2 = [...ROW2_IMAGES, ...ROW2_IMAGES, ...ROW2_IMAGES];

interface MarqueeSectionProps {
  onImageClick?: (url: string) => void;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({ onImageClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Row 1: Moves RIGHT on scroll (e.g. from -500px to 0px or -30% to 10%)
  const xRow1 = useTransform(scrollYProgress, [0, 1], ['-35%', '5%']);
  // Row 2: Moves LEFT on scroll (e.g. from 5% to -35%)
  const xRow2 = useTransform(scrollYProgress, [0, 1], ['5%', '-35%']);

  return (
    <section
      ref={sectionRef}
      className="bg-[#060e1d] py-8 overflow-hidden relative select-none w-full"
    >
      {/* Subtle vignette gradient on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#060e1d] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#060e1d] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-3">
        {/* Row 1 - Moves RIGHT on scroll */}
        <motion.div
          style={{ x: xRow1 }}
          className="flex gap-2.5 w-max will-change-transform"
        >
          {TRIPLED_ROW1.map((url, index) => (
            <div
              key={`row1-${index}`}
              onClick={() => onImageClick?.(url)}
              className="relative w-[220px] h-[140px] rounded-xl overflow-hidden shrink-0 border border-[#262626] bg-[#141414] group cursor-pointer"
            >
              <img
                src={url}
                alt="3D Work preview"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-200" />
            </div>
          ))}
        </motion.div>

        {/* Row 2 - Moves LEFT on scroll */}
        <motion.div
          style={{ x: xRow2 }}
          className="flex gap-2.5 w-max will-change-transform"
        >
          {TRIPLED_ROW2.map((url, index) => (
            <div
              key={`row2-${index}`}
              onClick={() => onImageClick?.(url)}
              className="relative w-[220px] h-[140px] rounded-xl overflow-hidden shrink-0 border border-[#262626] bg-[#141414] group cursor-pointer"
            >
              <img
                src={url}
                alt="3D Work preview"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-200" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
