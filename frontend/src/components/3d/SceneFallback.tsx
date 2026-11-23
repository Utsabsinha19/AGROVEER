'use client';

import React from 'react';

export const SceneFallback = ({ text = 'Initializing 3D Environment...' }: { text?: string }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 flex flex-col items-center justify-center pointer-events-none z-0">
      {/* Background warm radial light */}
      <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-leaf/10 to-amber-500/10 blur-3xl animate-pulse-subtle" />

      {/* Loading ring */}
      <div className="relative flex flex-col items-center gap-4 z-10">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-leaf/20 animate-ping" />
          <div className="w-16 h-16 rounded-full border-2 border-t-leaf border-r-transparent border-b-leaf/40 border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-sand-gold shadow-botanical-glow" />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-sand/70 font-sans">
          {text}
        </p>
      </div>
    </div>
  );
};

