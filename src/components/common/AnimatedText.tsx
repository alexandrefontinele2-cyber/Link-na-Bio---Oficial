import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  // High-performance word-level animation with viewport trigger (zero scroll-locking overhead)
  const words = text.split(' ');

  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.025,
          },
        },
      }}
      className={`relative select-none text-balance leading-relaxed ${className}`}
      style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
    >
      {words.map((word, wordIdx) => (
        <React.Fragment key={`word-${wordIdx}`}>
          <motion.span
            variants={{
              hidden: { opacity: 0.15, y: 3 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
            className="inline-block whitespace-nowrap"
          >
            {word}
          </motion.span>
          {wordIdx < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </motion.p>
  );
};
