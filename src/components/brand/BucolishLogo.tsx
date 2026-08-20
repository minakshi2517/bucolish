import React from 'react';

interface BucolishLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'white';
  className?: string;
}

export default function BucolishLogo({
  size = 'md',
  showTagline = false,
  variant = 'full',
  className = '',
}: BucolishLogoProps) {
  const iconSizes = {
    sm: { w: 28, h: 28 },
    md: { w: 40, h: 40 },
    lg: { w: 56, h: 56 },
    xl: { w: 72, h: 72 },
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const primaryColor = '#5E17EB'; // Bucolish Brand Purple
  const darkColor = variant === 'white' ? '#FFFFFF' : '#12111A'; // Deep Slate Onyx
  const windowColor = variant === 'white' ? '#FFFFFF' : '#5E17EB';

  const { w, h } = iconSizes[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* SVG Monogram of Bucolish 'B' House */}
        <svg
          width={w}
          height={h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-200 hover:scale-105"
        >
          {/* Top Violet Half of 'B' */}
          <path
            d="M20 12 H62 C78 12 88 22 88 36 C88 48 80 56 68 58 L50 40 L20 40 Z"
            fill={primaryColor}
          />
          
          {/* Bottom Dark Slate Half of 'B' */}
          <path
            d="M20 45 L50 45 L68 62 C80 64 88 72 88 84 C88 94 76 98 60 98 H20 Z"
            fill={darkColor}
          />

          {/* Roof Peaked House Silhouette in Center */}
          <path
            d="M32 58 L50 42 L68 58 V86 H32 Z"
            fill="#FFFFFF"
          />

          {/* 4-Pane Window */}
          <rect x="44" y="60" width="5" height="5" rx="0.5" fill={windowColor} />
          <rect x="51" y="60" width="5" height="5" rx="0.5" fill={windowColor} />
          <rect x="44" y="67" width="5" height="5" rx="0.5" fill={windowColor} />
          <rect x="51" y="67" width="5" height="5" rx="0.5" fill={windowColor} />
        </svg>

        {variant !== 'icon' && (
          <div className="flex flex-col">
            <div className={`font-black tracking-widest leading-none flex items-center ${textSizes[size]}`}>
              <span style={{ color: darkColor }}>BUCO</span>
              <span style={{ color: primaryColor }}>LISH</span>
            </div>
          </div>
        )}
      </div>

      {showTagline && (
        <div className="mt-1.5 flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
          <span className="w-4 sm:w-6 h-[1px] bg-gray-400"></span>
          <span>Find your place. Find your people.</span>
          <span className="w-4 sm:w-6 h-[1px] bg-gray-400"></span>
        </div>
      )}
    </div>
  );
}
