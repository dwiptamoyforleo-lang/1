import React from 'react';
import { ShoppingBag, Heart, Search, Sparkles, Globe, Menu, X } from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/products';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenBespoke: () => void;
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenBespoke,
  selectedCurrency,
  onSelectCurrency,
  onNavigate,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  setIsSearchOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#09080b]/90 backdrop-blur-md border-b border-white/[0.08] transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-[#121016] text-[#c9a84c] text-[11px] tracking-[0.2em] uppercase py-1.5 px-4 text-center border-b border-white/[0.05] flex items-center justify-center gap-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse"></span>
        <span>Maison BrandName — Complimentary Bespoke White-Glove Global Delivery on all Editions</span>
        <span className="hidden md:inline text-white/40">|</span>
        <button 
          onClick={onOpenBespoke}
          className="hidden md:inline underline hover:text-white transition-colors cursor-pointer"
        >
          Book Atelier Salon
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-white/80 hover:text-white"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('hero')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-display-luxury text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#f4efe6] group-hover:text-[#c9a84c] transition-colors">
                BRANDNAME
              </span>
              <span className="text-[#c9a84c] text-xs font-serif italic tracking-widest hidden sm:inline">
                सर्वत्
              </span>
            </div>
            <p className="text-[9px] tracking-[0.35em] text-white/40 uppercase">
              Haute Couture & Atelier
            </p>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('capsules')}
            className="text-xs uppercase tracking-[0.25em] text-white/70 hover:text-[#c9a84c] transition-colors cursor-pointer py-1"
          >
            Editions
          </button>
          <button
            onClick={() => onNavigate('lookbook')}
            className="text-xs uppercase tracking-[0.25em] text-white/70 hover:text-[#c9a84c] transition-colors cursor-pointer py-1"
          >
            Lookbook
          </button>
          <button
            onClick={() => onNavigate('manifesto')}
            className="text-xs uppercase tracking-[0.25em] text-white/70 hover:text-[#c9a84c] transition-colors cursor-pointer py-1"
          >
            Manifesto
          </button>
          <button
            onClick={() => onNavigate('journal')}
            className="text-xs uppercase tracking-[0.25em] text-white/70 hover:text-[#c9a84c] transition-colors cursor-pointer py-1"
          >
            Journal
          </button>
          <button
            onClick={onOpenBespoke}
            className="text-xs uppercase tracking-[0.25em] text-[#c9a84c] hover:text-[#e4c975] transition-colors cursor-pointer py-1 flex items-center gap-1.5"
          >
            <Sparkles size={12} />
            Bespoke Salon
          </button>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors p-2 rounded-sm"
            aria-label="Search Collection"
          >
            <Search size={18} />
          </button>

          {/* Currency Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-[11px] font-medium tracking-wider text-white/70 hover:text-[#c9a84c] border border-white/10 px-2.5 py-1.5 rounded-sm bg-white/[0.02]">
              <Globe size={13} className="text-[#c9a84c]" />
              <span>{selectedCurrency}</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-28 bg-[#131118] border border-white/10 shadow-2xl rounded-sm py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
              {Object.keys(CURRENCIES).map((cur) => (
                <button
                  key={cur}
                  onClick={() => onSelectCurrency(cur as CurrencyCode)}
                  className={`w-full text-left px-3 py-1.5 text-xs tracking-wider flex items-center justify-between hover:bg-white/[0.08] transition-colors ${
                    selectedCurrency === cur ? 'text-[#c9a84c] font-semibold' : 'text-white/70'
                  }`}
                >
                  <span>{cur}</span>
                  <span className="text-white/40">{CURRENCIES[cur].symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-white/70 hover:text-[#c9a84c] transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#c9a84c] text-[#09080b] font-bold text-[10px] rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] px-3.5 py-1.5 rounded-sm font-medium transition-colors text-xs tracking-widest uppercase cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#09080b]/15 px-1.5 py-0.5 rounded text-[11px] font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="border-t border-white/10 bg-[#0f0d14] px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <Search size={18} className="absolute left-3 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by silhouete, silk, cashmere, obsidian, wool or capsule..."
              className="w-full bg-white/[0.05] border border-white/15 text-sm text-white placeholder-white/30 pl-10 pr-10 py-2.5 rounded-sm focus:outline-none focus:border-[#c9a84c]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-white/40 hover:text-white text-xs tracking-wider uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0e0c12] px-6 py-6 space-y-4">
          <button
            onClick={() => { onNavigate('capsules'); setMobileMenuOpen(false); }}
            className="block w-full text-left text-sm uppercase tracking-[0.2em] text-white/80 py-2"
          >
            Editions & Archive
          </button>
          <button
            onClick={() => { onNavigate('lookbook'); setMobileMenuOpen(false); }}
            className="block w-full text-left text-sm uppercase tracking-[0.2em] text-white/80 py-2"
          >
            Lookbook
          </button>
          <button
            onClick={() => { onNavigate('manifesto'); setMobileMenuOpen(false); }}
            className="block w-full text-left text-sm uppercase tracking-[0.2em] text-white/80 py-2"
          >
            Atelier Manifesto
          </button>
          <button
            onClick={() => { onNavigate('journal'); setMobileMenuOpen(false); }}
            className="block w-full text-left text-sm uppercase tracking-[0.2em] text-white/80 py-2"
          >
            Craft Journal
          </button>
          <button
            onClick={() => { onOpenBespoke(); setMobileMenuOpen(false); }}
            className="block w-full text-left text-sm uppercase tracking-[0.2em] text-[#c9a84c] py-2 font-medium"
          >
            ✦ Book Bespoke Salon Appointment
          </button>
        </div>
      )}
    </header>
  );
};
