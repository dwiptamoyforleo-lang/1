import React from 'react';
import { Compass, Feather, Clock, Sparkles } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  return (
    <section id="manifesto" className="py-24 sm:py-32 bg-[#09080b] border-b border-white/[0.08] relative overflow-hidden">
      {/* Background Subtle Sanskrit Motif */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-serif-luxury text-[14rem] sm:text-[22rem] text-white/[0.015] select-none pointer-events-none font-bold">
        सर्वत्
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
            <Sparkles size={12} />
            <span>The BrandName Doctrine</span>
          </div>

          <h2 className="font-display-luxury text-3xl sm:text-5xl text-white font-light tracking-wide leading-tight">
            THE ARCHITECTURE OF OMNIPRESENCE:
            <br />
            <span className="font-serif-luxury italic text-[#c9a84c]">
              From Ancient Loom to Brutalist Form.
            </span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            BrandName derives from the timeless axiom denoting the universal, all-pervading state of being. We reject the cyclical disposability of fast fashion to cultivate garments as armored sanctuaries of stillness.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white/[0.02] border border-white/[0.07] rounded-sm space-y-4 hover:border-[#c9a84c]/30 transition-all">
            <div className="w-10 h-10 rounded-sm bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center">
              <Feather size={20} />
            </div>
            <h3 className="font-display-luxury text-lg text-white tracking-wider">
              I. Sovereign Fibres
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              We exclusively commission non-violent wild Muga silks from the Brahmaputra, Changthangi goat underfleece hand-loomed in Ladakh, and bonded Italian virgin wools. No synthetic substitutes are ever permitted.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/[0.07] rounded-sm space-y-4 hover:border-[#c9a84c]/30 transition-all">
            <div className="w-10 h-10 rounded-sm bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="font-display-luxury text-lg text-white tracking-wider">
              II. Slow Benchwork
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Each coat, jacket, and jewelry piece demands between 20 to 65 benchwork hours. Milanese buttonholes, floating horsehair canvases, and hand-finished blind seams executed by masters of their guilds.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/[0.07] rounded-sm space-y-4 hover:border-[#c9a84c]/30 transition-all">
            <div className="w-10 h-10 rounded-sm bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center">
              <Compass size={20} />
            </div>
            <h3 className="font-display-luxury text-lg text-white tracking-wider">
              III. Numbered Editions
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Never mass-manufactured. Every silhouette is capped between 20 and 75 numbered pieces globally. Once an archive run is complete, the patterns are sealed in our vault to ensure lifetime uniqueness.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/[0.07] rounded-sm space-y-4 hover:border-[#c9a84c]/30 transition-all">
            <div className="w-10 h-10 rounded-sm bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display-luxury text-lg text-white tracking-wider">
              IV. Living Patina
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Engineered to gather personal narrative over decades. Hot-waxed bullhide softens to your contours, unrefined brass catches warm lustre, and pure wild silk grows more golden with each passing year.
            </p>
          </div>
        </div>

        {/* Quote Block */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 bg-[#121016] border border-white/10 text-center max-w-4xl mx-auto relative">
          <p className="font-serif-luxury italic text-xl sm:text-2xl text-white/90 leading-relaxed">
            &ldquo;In a world intoxicated by acceleration, true power resides in the immovable drape of silence. BrandName is not an ornament—it is a monument to sovereign grace.&rdquo;
          </p>
          <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-[#c9a84c]">
            — Dwiptamoy, Creative Director & Founder
          </div>
        </div>
      </div>
    </section>
  );
};
