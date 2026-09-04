'use client';

import React from 'react';

interface CreatorFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const CreatorFlowLogo: React.FC<CreatorFlowLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  }[size];

  const textSizes = {
    sm: 'text-base sm:text-lg font-medium',
    md: 'text-xl sm:text-2xl font-medium',
    lg: 'text-2xl sm:text-3xl font-medium',
    xl: 'text-4xl font-medium',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Vector Brand Mark (Big Prominent Symbol) */}
      <div className={`relative ${iconDimensions} rounded-xl bg-[#0c0e15] border border-[#232736] flex items-center justify-center overflow-hidden shadow-lg group-hover:border-[#3880ff] group-hover:shadow-[0_0_18px_rgba(59,130,246,0.3)] transition-all shrink-0`}>
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/30 via-[#2563eb]/10 to-transparent opacity-90" />
        
        {/* SVG Dynamic Flow Mark */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-[82%] h-[82%] relative z-10 drop-shadow-sm"
        >
          <defs>
            <linearGradient id="cf-blue-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="cf-white-grad" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Background Loop Wave (Fluid Flow stream) */}
          <path
            d="M6 16C6 10.4772 10.4772 6 16 6C20.5 6 23.5 8.5 25 11.5"
            stroke="url(#cf-blue-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Primary Forward Cutting Ribbon forming play chevron */}
          <path
            d="M10 22C12 24.5 14.5 26 17.5 26C22.5 26 26 21.5 26 16.5C26 13 23.5 10 20.5 10L12 18L10 22Z"
            fill="url(#cf-white-grad)"
            fillOpacity="0.18"
          />

          <path
            d="M9 21.5C12 24.5 15 25.5 18 25.5C23 25.5 26 21.5 26 16.5"
            stroke="url(#cf-white-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Central Play/Cut Indicator */}
          <polygon
            points="14,12.5 21,16.5 14,20.5"
            fill="url(#cf-blue-grad)"
          />
        </svg>
      </div>

      {/* Brand Name with Medium Font Weight and Readable Scaling */}
      {showText && (
        <div className="flex items-baseline tracking-tight">
          <span className={`${textSizes} text-white tracking-tight font-medium`}>
            Creator
          </span>
          <span className={`${textSizes} text-[#3b82f6] tracking-tight ml-0.5 font-medium`}>
            Flow
          </span>
        </div>
      )}
    </div>
  );
};
