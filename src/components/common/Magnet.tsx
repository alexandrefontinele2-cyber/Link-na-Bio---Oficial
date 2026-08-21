import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagnetProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  strength = 30,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    mouseX.set(deltaX * strength);
    mouseY.set(deltaY * strength);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ref.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    mouseX.set(deltaX * strength * 0.8);
    mouseY.set(deltaY * strength * 0.8);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
