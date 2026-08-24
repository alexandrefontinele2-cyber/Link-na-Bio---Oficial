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
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [3, 0]);

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
    offset: ['start 90%', 'end 55%'],
  });

  // Split text into words to prevent breaking words across lines
  const words = text.split(' ');
  const totalChars = text.length;

  let globalCharIndex = 0;

  return (
    <p
      ref={containerRef}
      className={`relative select-none text-balance leading-relaxed ${className}`}
      style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
    >
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        const renderedWord = (
          <span key={`w-${wordIdx}`} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const charPosition = globalCharIndex++;
              const start = charPosition / totalChars;
              const end = start + 1 / totalChars;
              return (
                <Char
                  key={`c-${wordIdx}-${charIdx}`}
                  progress={scrollYProgress}
                  range={[start, end]}
                >
                  {char}
                </Char>
              );
            })}
          </span>
        );

        // Account for the space in index count
        globalCharIndex++;

        return (
          <React.Fragment key={`frag-${wordIdx}`}>
            {renderedWord}
            {wordIdx < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </p>
  );
};
