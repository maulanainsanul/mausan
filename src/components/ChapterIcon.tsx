import React from 'react';
import type { BabId } from '../types/physics';

interface ChapterIconProps {
  babId: BabId;
  color: string;
  size?: number;
}

export const ChapterIcon: React.FC<ChapterIconProps> = ({ babId, color, size = 36 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  };

  switch (babId) {
    case 'A': // Roda gigi (Gerak & Gaya)
      return (
        <svg {...common}>
          <path
            d="M24 8V12M24 36V40M8 24H12M36 24H40M12.7 12.7L15.5 15.5M32.5 32.5L35.3 35.3M35.3 12.7L32.5 15.5M15.5 32.5L12.7 35.3"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="3.5" fill={color} fillOpacity="0.14" />
          <circle cx="24" cy="24" r="3.5" fill={color} />
        </svg>
      );
    case 'B': // Termometer (Suhu & Kalor)
      return (
        <svg {...common}>
          <path
            d="M20 10C20 7.8 21.8 6 24 6C26.2 6 28 7.8 28 10V26.2C30.4 27.6 32 30.1 32 33C32 37.4 28.4 41 24 41C19.6 41 16 37.4 16 33C16 30.1 17.6 27.6 20 26.2V10Z"
            stroke={color}
            strokeWidth="3"
            fill={color}
            fillOpacity="0.12"
          />
          <circle cx="24" cy="33" r="4" fill={color} />
          <path d="M24 16V30" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'C': // Tetes air (Fluida)
      return (
        <svg {...common}>
          <path
            d="M24 7C24 7 12 21 12 29.5C12 36.1 17.4 41 24 41C30.6 41 36 36.1 36 29.5C36 21 24 7 24 7Z"
            stroke={color}
            strokeWidth="3"
            fill={color}
            fillOpacity="0.16"
          />
          <path d="M19 30C19 33 21 35 24 35.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    case 'D': // Gelombang (Gelombang & Bunyi)
      return (
        <svg {...common}>
          <path
            d="M6 24C10 12 14 12 18 24C22 36 26 36 30 24C34 12 38 12 42 24"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line x1="6" y1="24" x2="42" y2="24" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
        </svg>
      );
    case 'E': // Kilat (Listrik & Magnet)
      return (
        <svg {...common}>
          <path
            d="M26 6L12 26H24L21 42L36 21H24L26 6Z"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
          />
        </svg>
      );
    case 'F': // Tuas (Pesawat Sederhana)
      return (
        <svg {...common}>
          <path d="M8 29L40 19" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 24L18 37H30L24 24Z" stroke={color} strokeWidth="3" strokeLinejoin="round" fill={color} fillOpacity="0.2" />
          <rect x="8" y="21" width="7" height="7" rx="1.5" fill={color} />
        </svg>
      );
    case 'G': // Planet (Astronomi & Bumi)
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="3" fill={color} fillOpacity="0.18" />
          <ellipse cx="24" cy="24" rx="19" ry="6" transform="rotate(-20 24 24)" stroke={color} strokeWidth="2.8" />
        </svg>
      );
    case 'H': // Lensa (Alat Optik)
      return (
        <svg {...common}>
          <path
            d="M24 7C30 14 30 34 24 41C18 34 18 14 24 7Z"
            stroke={color}
            strokeWidth="3"
            fill={color}
            fillOpacity="0.18"
          />
          <path d="M8 18H18M8 30H18M30 24H40" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'I': // Penggaris (Pengukuran)
      return (
        <svg {...common}>
          <rect
            x="9"
            y="16"
            width="30"
            height="16"
            rx="3"
            stroke={color}
            strokeWidth="3"
            fill={color}
            fillOpacity="0.15"
          />
          <path d="M16 16V23M22 16V21M28 16V23M34 16V21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
};
