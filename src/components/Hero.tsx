import React from 'react';
import { ArrowDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { Capsule } from '../types';

interface HeroProps {
  onExplore: () => void;
  onOpenLookbook: () => void;
  onOpenBespoke: () => void;
  capsules: Capsule[];
  activeCapsule: string;
  onSelectCapsule: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onOpenLookbook,
  onOpenBespoke,
  capsules,
  activeCapsule,
  onSelectCapsule,
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#09080b] border-b border-white/[0.08]">
      {/* Background Ambience & Editorial Imagery Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
          alt="Template Couture Silhouette"
          className="w-full h-full object-cover object-top opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09080b] via-[#09080b]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09080b] via-[#09080b]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.06)_0,transparent_70%)]"></div>
      </div>

      {/* Top Floating Ticker */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]"></span>
          <span>Atelier Opus MMXXVI</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>Paris 16:24</span>
          <span className="text-white/20">/</span>
          <span>Mumbai 20:54</span>
          <span className="text-white/20">/</span>
          <span>Tokyo 00:24</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#c9a84c]">
          <ShieldCheck size={13} />
          <span>Numbered Provenance</span>
        </div>
      </div>

      {/* Center Grand Typography */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/[0.04] border border-[#c9a84c]/30 text-[#c9a84c] text-xs uppercase tracking-[0.25em]">
            <Sparkles size={12} />
            <span>The Omnipresent Form • Template</span>
          </div>

          <h1 className="font-display-luxury text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.08em] text-[#fbf8f3] leading-[1.08]">
            MONOLITHIC DRAPERY.
            <br />
            <span className="font-serif-luxury italic text-[#c9a84c] font-normal tracking-wider">
              Artisanal Permanence.
            </span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg max-w-xl font-light leading-relaxed font-body">
            Bridging ancestral Vedic fibre craft with brutalist architectural silhouettes. 
            Numbered editions hand-sculpted in raw Ahimsa silk, Himalayan 12-micron cashmere, and volcanic obsidian.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onExplore}
              className="px-8 py-4 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-medium text-xs tracking-[0.25em] uppercase transition-all shadow-[0_0_30px_rgba(201,168,76,0.25)] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] cursor-pointer"
            >
              Explore Archive & Editions
            </button>
            <button
              onClick={onOpenLookbook}
              className="px-7 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white/90 border border-white/15 hover:border-white/30 text-xs tracking-[0.25em] uppercase transition-all cursor-pointer flex items-center gap-2"
            >
              <Compass size={14} className="text-[#c9a84c]" />
              <span>Editorial Lookbook</span>
            </button>
            <button
              onClick={onOpenBespoke}
              className="px-6 py-4 text-xs tracking-[0.2em] uppercase text-white/60 hover:text-[#c9a84c] transition-colors cursor-pointer"
            >
              Private Salon Inquiries →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Capsule Selector Bar */}
      <div className="relative z-10 border-t border-white/[0.08] bg-[#0c0a10]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
            <span>Capsule Suites:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={() => onSelectCapsule('all')}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition-all cursor-pointer rounded-sm ${
                activeCapsule === 'all'
                  ? 'bg-white/10 text-[#c9a84c] border border-[#c9a84c]/40 font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All Artifacts
            </button>
            {capsules.map((cap) => (
              <button
                key={cap.id}
                onClick={() => onSelectCapsule(cap.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition-all cursor-pointer rounded-sm flex items-center gap-2 ${
                  activeCapsule === cap.id
                    ? 'bg-white/10 text-[#c9a84c] border border-[#c9a84c]/40 font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{cap.title}</span>
                <span className="text-[10px] text-white/30 font-serif italic">{cap.sanskrit}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onExplore}
            className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40 hover:text-[#c9a84c] transition-colors cursor-pointer"
          >
            <span>Scroll to Collection</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
