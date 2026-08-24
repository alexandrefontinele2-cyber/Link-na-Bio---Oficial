import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedText } from '../common/AnimatedText';
import { ContactButton } from '../common/ContactButton';
import { FadeIn } from '../common/FadeIn';

interface AboutSectionProps {
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact }) => {
  return (
    <section className="relative px-5 py-12 text-center overflow-hidden z-10">
      {/* Decorative Floating 3D Moon Icon (Top-Left) */}
      <motion.img
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
        alt="Decorative 3D Moon"
        className="w-16 h-16 object-contain absolute -top-2 left-2 opacity-40 pointer-events-none select-none drop-shadow-xl"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Decorative Floating 3D Lego Icon (Bottom-Right) */}
      <motion.img
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
        alt="Decorative 3D Lego"
        className="w-16 h-16 object-contain absolute -bottom-2 right-2 opacity-40 pointer-events-none select-none drop-shadow-xl"
        animate={{
          y: [0, 8, 0],
          rotate: [0, -6, 6, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">
        {/* Heading */}
        <FadeIn delay={0.1} y={15}>
          <h2 className="hero-heading font-black uppercase text-3xl text-center mb-6 tracking-tight">
            SOBRE MIM
          </h2>
        </FadeIn>

        {/* Character-by-character Animated Paragraph with unbroken words */}
        <div className="mb-8 px-1 w-full text-center">
          <AnimatedText
            text="Com vasta trajetória em mentoria estratégica, liderança e treinamentos de vendas, capacito profissionais e empresas a alcançarem resultados exponenciais e alta performance."
            className="text-[#D7E2EA] font-medium text-center leading-relaxed text-sm text-balance"
          />
        </div>

        {/* Contact CTA Button */}
        <FadeIn delay={0.2} y={15} className="w-full">
          <ContactButton
            label="Fale Comigo no WhatsApp"
            onClick={onOpenContact}
            showArrow={true}
          />
        </FadeIn>
      </div>
    </section>
  );
};
