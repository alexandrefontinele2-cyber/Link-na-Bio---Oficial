import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Char: React.FC<CharProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block transition-colors duration-100"
    >
      {children}
    </motion.span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 50%'],
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
    >
      {characters.map((char, index) => {
        const start = index / totalChars;
        const end = start + 1 / totalChars;
        return (
          <Char
            key={index}
            progress={scrollYProgress}
            range={[start, end]}
          >
            {char === ' ' ? '\u00A0' : char}
          </Char>
        );
      })}
    </p>
  );
};
