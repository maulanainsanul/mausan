import React from 'react';

export type VoltaExpression = 'senang' | 'berpikir' | 'kaget' | 'bangga' | 'menyemangati';

interface VoltaMascotProps {
  expression?: VoltaExpression;
  speaking?: boolean;
  mouthOpen?: boolean;
  size?: number;
  className?: string;
}

export const VoltaMascot: React.FC<VoltaMascotProps> = ({
  expression = 'senang',
  speaking = false,
  mouthOpen = false,
  size = 76,
  className = '',
}) => {
  const isHappy = expression === 'senang' || expression === 'bangga';
  const isThinking = expression === 'berpikir';
  const isSurprised = expression === 'kaget';
  const isCheering = expression === 'menyemangati';

  const eyeColor = isSurprised
    ? '#FFBE2E'
    : isThinking
      ? '#60A5FA'
      : expression === 'bangga'
        ? '#16A36E'
        : '#38BDF8';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Maskot Volta berekspresi ${expression}`}
    >
      {/* Antenna stem & lightning bolt */}
      <g
        style={{
          transformOrigin: '60px 30px',
          transform: speaking && mouthOpen ? 'rotate(-6deg) translateY(-1px)' : 'rotate(0deg)',
          transition: 'transform 140ms ease',
        }}
      >
        <rect x="57" y="18" width="6" height="14" rx="3" fill="#FF7A1A" />
        <path
          d="M64 4 L52 17 H61 L56 26 L70 13 H61 Z"
          fill="#FFBE2E"
          stroke="#E07A00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Ear bolts */}
      <rect x="13" y="54" width="10" height="22" rx="5" fill="#2F6BFF" />
      <rect x="97" y="54" width="10" height="22" rx="5" fill="#2F6BFF" />

      {/* Head shell */}
      <rect
        x="21"
        y="30"
        width="78"
        height="72"
        rx="32"
        fill="#FFFFFF"
        stroke="#2F6BFF"
        strokeWidth="4"
      />

      {/* Visor LED screen */}
      <rect x="31" y="45" width="58" height="28" rx="13" fill="#13203B" />

      {/* Left & Right LED eyes */}
      {isThinking ? (
        <>
          <circle cx="46" cy="59" r="5.5" fill={eyeColor} />
          <path d="M67 59 H79" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : isSurprised ? (
        <>
          <circle cx="46" cy="59" r="7" fill={eyeColor} />
          <circle cx="74" cy="59" r="7" fill={eyeColor} />
          <circle cx="46" cy="59" r="2.5" fill="#13203B" />
          <circle cx="74" cy="59" r="2.5" fill="#13203B" />
        </>
      ) : isCheering ? (
        <>
          <path d="M40 61 Q46 53 52 61" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M68 61 Q74 53 80 61" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="46" cy="59" r="6" fill={eyeColor} />
          <circle cx="74" cy="59" r="6" fill={eyeColor} />
          <circle cx="48" cy="57" r="2" fill="#FFFFFF" />
          <circle cx="76" cy="57" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Cheek blush when happy/proud */}
      {(isHappy || isCheering) && (
        <>
          <circle cx="35" cy="79" r="4" fill="#FF7A1A" fillOpacity="0.28" />
          <circle cx="85" cy="79" r="4" fill="#FF7A1A" fillOpacity="0.28" />
        </>
      )}

      {/* Mouth with lip-sync */}
      {speaking && mouthOpen ? (
        <ellipse cx="60" cy="85" rx="9" ry="6" fill="#FF7A1A" stroke="#13203B" strokeWidth="2" />
      ) : isSurprised ? (
        <circle cx="60" cy="85" r="5" fill="#FF7A1A" />
      ) : isThinking ? (
        <path d="M52 86 Q60 83 68 86" stroke="#FF7A1A" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path
          d="M49 82 Q60 92 71 82"
          stroke="#FF7A1A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Star badge when proud */}
      {expression === 'bangga' && (
        <path
          d="M95 28 L98 34 L105 35 L100 40 L101 47 L95 43 L89 47 L90 40 L85 35 L92 34 Z"
          fill="#FFBE2E"
          stroke="#E07A00"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
};
