import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { BespokeModal } from './components/BespokeModal';
import { ManifestoSection } from './components/ManifestoSection';
import { LookbookSection } from './components/LookbookSection';
import { JournalSection } from './components/JournalSection';
import { Footer } from './components/Footer';

import { 
  Product, 
  Category, 
  CapsuleId, 
  CartItem, 
  CurrencyCode, 
  BespokeBooking 
} from './types';
import { PRODUCTS, CAPSULES, CURRENCIES } from './data/products';
import { SlidersHorizontal, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('brandname_currency') as CurrencyCode) || 'USD';
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('brandname_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('brandname_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Filter state
  const [activeCapsule, setActiveCapsule] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modal / Drawer state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isBespokeOpen, setIsBespokeOpen] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('brandname_currency', selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    localStorage.setItem('brandname_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('brandname_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToCart = (product: Product, size: string, monogram?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.monogram === monogram
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${monogram || 'none'}-${Date.now()}`,
          product,
          size,
          monogram,
          quantity: 1,
        },
      ];
    });
    showToast(`Added ${product.name} to your Atelier Bag`);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'Default');
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from Saved Archives`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved ${product.name} to Personal Archive`);
        return [...prev, product];
      }
    });
  };

  const isProductWishlisted = (id: string) => {
    return wishlist.some((p) => p.id === id);
  };

  const handleNavigate = (section: string) => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered & sorted products
  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCapsule = activeCapsule === 'all' || item.capsule === activeCapsule;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabricDetails.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capsuleName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCapsule && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const currentCapsuleInfo = CAPSULES.find((c) => c.id === activeCapsule);

  const categories: Category[] = [
    'All',
    'Outerwear',
    'Tailoring',
    'Silks & Knits',
    'Fine Jewelry',
    'Leather & Artifacts',
  ];

  return (
    <div className="min-h-screen bg-[#09080b] text-[#eae7e1] flex flex-col font-body selection:bg-[#c9a84c]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14121a] border border-[#c9a84c] text-white px-5 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300">
          <Sparkles size={16} className="text-[#c9a84c]" />
          <span className="text-xs uppercase tracking-wider font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenBespoke={() => setIsBespokeOpen(true)}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={setSelectedCurrency}
        activeSection="capsules"
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      <main className="flex-1">
        {/* Editorial Hero */}
        <Hero
          onExplore={() => handleNavigate('capsules')}
          onOpenLookbook={() => handleNavigate('lookbook')}
          onOpenBespoke={() => setIsBespokeOpen(true)}
          capsules={CAPSULES}
          activeCapsule={activeCapsule}
          onSelectCapsule={(id) => {
            setActiveCapsule(id);
            handleNavigate('capsules');
          }}
        />

        {/* Editions Collection & Gallery Section */}
        <section id="capsules" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Spotlight for selected capsule */}
          {currentCapsuleInfo && (
            <div className="mb-14 p-6 sm:p-10 bg-[#0f0d14] border border-white/10 rounded-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
                <img src={currentCapsuleInfo.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 max-w-2xl space-y-2">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
                  <span>{currentCapsuleInfo.season}</span>
                  <span>•</span>
                  <span className="font-serif italic">{currentCapsuleInfo.sanskrit}</span>
                </div>
                <h2 className="font-display-luxury text-3xl sm:text-4xl text-white">
                  {currentCapsuleInfo.title} — {currentCapsuleInfo.subtitle}
                </h2>
                <p className="text-sm text-white/60 font-light leading-relaxed pt-1">
                  {currentCapsuleInfo.story}
                </p>
              </div>
            </div>
          )}

          {/* Controls Bar: Categories & Sorting */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.08] mb-10">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] transition-all cursor-pointer rounded-sm ${
                    selectedCategory === cat
                      ? 'bg-[#c9a84c] text-[#09080b] font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sorting & Count */}
            <div className="flex items-center justify-between lg:justify-end gap-4 text-xs">
              <span className="text-white/40 uppercase tracking-widest text-[11px]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Artifact' : 'Artifacts'} Catalogued
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#c9a84c]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#121017] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c] rounded-sm uppercase tracking-wider"
                >
                  <option value="featured">Archival Priority</option>
                  <option value="price-asc">Price: Ascending</option>
                  <option value="price-desc">Price: Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="font-display-luxury text-xl text-white/40">
                No artifacts match your current filter parameters.
              </p>
              <button
                onClick={() => {
                  setActiveCapsule('all');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#c9a84c] text-[#09080b] font-medium text-xs uppercase tracking-widest cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={CURRENCIES[selectedCurrency]}
                  isWishlisted={isProductWishlisted(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </section>

        {/* Editorial Lookbook */}
        <LookbookSection
          products={PRODUCTS}
          onInspectProduct={(p) => setSelectedProduct(p)}
        />

        {/* The Atelier Doctrine / Manifesto */}
        <ManifestoSection />

        {/* Craft Field Journal */}
        <JournalSection />

        {/* Private Salon Banner Callout */}
        <section className="py-16 sm:py-20 bg-[#121016] border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
                Bespoke Made-To-Measure
              </span>
              <h3 className="font-display-luxury text-2xl sm:text-3xl text-white">
                Commission a One-of-One Silhouette
              </h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Schedule a private salon session with our master pattern-makers in Paris, London, Tokyo, New York, or Mumbai.
              </p>
            </div>
            <button
              onClick={() => setIsBespokeOpen(true)}
              className="px-8 py-4 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-bold text-xs uppercase tracking-[0.25em] transition-all cursor-pointer whitespace-nowrap shadow-lg flex items-center gap-2"
            >
              <span>Reserve Private Salon</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenBespoke={() => setIsBespokeOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Product Spec Modal */}
      <ProductModal
        product={selectedProduct}
        currency={CURRENCIES[selectedCurrency]}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? isProductWishlisted(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenBespoke={() => {
          setSelectedProduct(null);
          setIsBespokeOpen(true);
        }}
      />

      {/* Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={CURRENCIES[selectedCurrency]}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        currency={CURRENCIES[selectedCurrency]}
        onRemove={(id) => setWishlist((prev) => prev.filter((p) => p.id !== id))}
        onMoveToCart={(prod) => {
          handleQuickAdd(prod);
          setIsCartOpen(true);
        }}
      />

      {/* Bespoke Salon Modal */}
      <BespokeModal
        isOpen={isBespokeOpen}
        onClose={() => setIsBespokeOpen(false)}
        onBookSuccess={() => {
          showToast('Private Salon Appointment dossier registered');
        }}
      />
    </div>
  );
};

export default App;
