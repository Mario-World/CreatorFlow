'use client';

import React from 'react';

interface CreatorFlowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const CreatorFlowLogo: React.FC<CreatorFlowLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-lg sm:text-xl font-bold',
    lg: 'text-2xl font-bold',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Vector Brand Mark */}
      <div className={`relative ${iconDimensions} rounded-lg bg-[#0c0e15] border border-[#232736] flex items-center justify-center overflow-hidden shadow-md group-hover:border-[#3880ff] transition-all`}>
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2b7fff]/20 via-transparent to-transparent opacity-75" />
        
        {/* SVG Dynamic Flow Mark */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-4/5 h-4/5 relative z-10"
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
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          
          {/* Primary Forward Cutting Ribbon forming play chevron */}
          <path
            d="M10 22C12 24.5 14.5 26 17.5 26C22.5 26 26 21.5 26 16.5C26 13 23.5 10 20.5 10L12 18L10 22Z"
            fill="url(#cf-white-grad)"
            fillOpacity="0.15"
          />

          <path
            d="M9 21.5C12 24.5 15 25.5 18 25.5C23 25.5 26 21.5 26 16.5"
            stroke="url(#cf-white-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Central Play/Cut Indicator */}
          <polygon
            points="14,12.5 21,16.5 14,20.5"
            fill="url(#cf-blue-grad)"
          />
        </svg>
      </div>

      {/* Brand Name */}
      {showText && (
        <div className="flex items-baseline tracking-tight">
          <span className={`${textSizes} font-bold text-white tracking-tight`}>
            Creator
          </span>
          <span className={`${textSizes} font-semibold text-[#3b82f6] tracking-tight ml-0.5`}>
            Flow
          </span>
        </div>
      )}
    </div>
  );
};
