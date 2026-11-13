import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ConfettiBurstProps {
  triggerKey: number;
}

const COLORS = ['#FF7A1A', '#2F6BFF', '#16A36E', '#FFBE2E', '#7C3AED'];

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ triggerKey }) => {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  useEffect(() => {
    if (triggerKey <= 0 || reducedMotion) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 950);
    return () => window.clearTimeout(t);
  }, [triggerKey, reducedMotion]);

  if (!visible || reducedMotion) return null;

  const pieces = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist = 46 + (i % 3) * 24;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 18,
      rot: i * 35,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <div className="relative">
        {pieces.map((p, idx) => (
          <motion.span
            key={`${triggerKey}-${idx}`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.7, rotate: 0 }}
            animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 1.1, rotate: p.rot }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </div>
    </div>
  );
};
