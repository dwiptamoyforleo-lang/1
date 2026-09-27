import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Shield, Compass, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBespoke: () => void;
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBespoke, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#060508] text-white border-t border-white/[0.08] relative">
      {/* Newsletter / Archival Dispatch Banner */}
      <div className="border-b border-white/[0.08] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
                <Sparkles size={12} />
                <span>The Private Dispatch</span>
              </div>
              <h3 className="font-display-luxury text-2xl sm:text-3xl text-[#f4efe6]">
                Receive Notice of Numbered Archive Drops
              </h3>
              <p className="text-white/50 text-xs sm:text-sm font-light max-w-md leading-relaxed">
                Secret capsule launches, seasonal trunk showings, and exclusive invites to private atelier salons. No unsolicited dispatches.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 bg-[#c9a84c]/10 border border-[#c9a84c]/40 text-[#c9a84c] rounded-sm">
                  <Check size={18} />
                  <span className="text-xs uppercase tracking-widest font-medium">
                    You have been admitted to the Private Client Archive.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter client concierge email address..."
                    className="flex-1 bg-white/[0.04] border border-white/15 px-4 py-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Request Entry</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display-luxury text-2xl font-bold tracking-[0.25em] text-[#f4efe6]">
                TEMPLATE
              </span>
              <span className="text-[#c9a84c] text-xs font-serif italic tracking-widest">
                Template
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed font-light max-w-sm">
              An avant-garde luxury atelier bridging timeless Vedic fibre mastery with brutalist architectural silhouettes. Hand-numbered editions sculpted for eternity.
            </p>
            <div className="pt-2 text-xs text-[#c9a84c] tracking-widest">
              <span>CONCIERGE: </span>
              <a href="mailto:hello@example.com" className="underline hover:text-white">
                hello@example.com
              </a>
            </div>
          </div>

          {/* Salons */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#c9a84c] font-semibold">
              Atelier Salons
            </h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li>
                <span className="text-white block font-medium">Paris Salon</span>
                12 Place Vendôme, 75001 Paris
              </li>
              <li>
                <span className="text-white block font-medium">London Suite</span>
                14 Savile Row, Mayfair, London
              </li>
              <li>
                <span className="text-white block font-medium">Tokyo Sanctum</span>
                6-10-1 Ginza, Chuo-ku, Tokyo
              </li>
              <li>
                <span className="text-white block font-medium">Mumbai Heritage</span>
                Dhanraj Mahal, Colaba, Mumbai
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#c9a84c] font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li>
                <button
                  onClick={() => onNavigate('capsules')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Capsule Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lookbook')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Seasonal Lookbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manifesto')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Atelier Manifesto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('journal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Field Craft Journal
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBespoke}
                  className="text-[#c9a84c] hover:underline transition-colors cursor-pointer"
                >
                  Private Bespoke Salon
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#c9a84c] font-semibold">
              Client Service
            </h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li className="flex items-center gap-1.5">
                <Shield size={12} className="text-[#c9a84c]" />
                <span>Numbered Provenance Dossier</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Compass size={12} className="text-[#c9a84c]" />
                <span>Carbon-Neutral Global Courier</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart size={12} className="text-[#c9a84c]" />
                <span>Complimentary Lifetime Repairs</span>
              </li>
              <li>
                <span className="block mt-2 text-white/40">VIP Concierge WhatsApp:</span>
                <span className="text-white">+33 1 42 68 00 00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} STUDIO TEMPLATE ATELIER (Template). All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Discretion & Privacy Protocol</span>
            <span>Ethical Fibre Covenant</span>
            <span>Archival Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
