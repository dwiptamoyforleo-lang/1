import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Gift, CheckCircle2 } from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [includeWoodenBox, setIncludeWoodenBox] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: 'Dwiptamoy Atelier Guest',
    email: 'dwiptamoyforleo@gmail.com',
    address: '7 Boulevard Saint-Germain, Paris',
    specialDeliveryNotes: 'Hand-deliver with wax seal packaging',
  });
  const [orderSerial, setOrderSerial] = useState('');

  if (!isOpen) return null;

  const subtotalUSD = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotalConverted = Math.round(subtotalUSD * currency.rate);
  const boxFeeConverted = includeWoodenBox ? 0 : 0; // Complimentary atelier wooden case
  const totalConverted = subtotalConverted + boxFeeConverted;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serial = `SRVT-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    setOrderSerial(serial);
    setCheckoutComplete(true);
    onClearCart();
  };

  const handleFinish = () => {
    setCheckoutComplete(false);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-[#0d0b11] border-l border-white/10 text-[#f4efe6] flex flex-col justify-between shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display-luxury text-xl text-white tracking-widest">
                  ATELIER BAG
                </span>
                <span className="text-xs text-[#c9a84c] font-serif italic">({items.length} Pieces)</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-0.5">
                Maison BrandName Private Cart
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full border border-white/10 transition-colors cursor-pointer"
              aria-label="Close Bag"
            >
              <X size={18} />
            </button>
          </div>

          {/* Checkout Screen or Cart Item List */}
          {checkoutComplete ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c] flex items-center justify-center text-[#c9a84c]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-display-luxury text-2xl text-white">
                Acquisition Confirmed
              </h3>
              <p className="text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
                Order Dossier: {orderSerial}
              </p>
              <p className="text-sm text-white/70 max-w-xs font-light leading-relaxed">
                Your archival piece is being prepared by our master tailors. White-glove concierge dispatch details have been dispatched to {checkoutData.email}.
              </p>
              <button
                onClick={handleFinish}
                className="mt-4 px-8 py-3.5 bg-[#c9a84c] text-[#09080b] font-semibold text-xs uppercase tracking-[0.25em] transition-all cursor-pointer"
              >
                Return to Atelier
              </button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleCheckoutSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
                  Delivery Dossier
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                >
                  ← Back to Bag
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/60 mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={checkoutData.name}
                    onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={checkoutData.email}
                    onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1 uppercase tracking-wider">Shipping Address & City</label>
                  <input
                    type="text"
                    required
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1 uppercase tracking-wider">Concierge Courier Instructions</label>
                  <textarea
                    rows={2}
                    value={checkoutData.specialDeliveryNotes}
                    onChange={(e) => setCheckoutData({ ...checkoutData, specialDeliveryNotes: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Total Due:</span>
                  <span className="font-semibold text-white text-sm">
                    {currency.symbol}{totalConverted.toLocaleString()} {currency.code}
                  </span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Complimentary worldwide courier via DHL Carbon-Neutral Priority. Includes sealed certificate of numbered provenance.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-bold text-xs uppercase tracking-[0.25em] transition-all cursor-pointer shadow-lg"
              >
                Place Acquisition Order
              </button>
            </form>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                  <p className="font-display-luxury text-lg text-white/40">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-white/40 max-w-xs font-light">
                    Explore our numbered capsule editions and select an architectural piece to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemPriceConverted = Math.round(item.product.price * currency.rate);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-sm relative"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-24 object-cover rounded-sm bg-black"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h4 className="text-xs font-semibold text-white tracking-wider line-clamp-1">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-white/30 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                              Size: <span className="text-[#c9a84c]">{item.size}</span>
                            </p>
                            {item.monogram && (
                              <p className="text-[10px] text-[#c9a84c] tracking-widest">
                                Monogram: &quot;{item.monogram}&quot;
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                            <div className="flex items-center gap-2 border border-white/10 px-2 py-0.5 rounded text-xs">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="text-white/60 hover:text-white px-1 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-white font-medium">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="text-white/60 hover:text-white px-1 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs font-semibold text-[#c9a84c]">
                              {currency.symbol}{(itemPriceConverted * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Atelier Wooden Box Toggle */}
                  <div className="border border-white/10 p-3 rounded-sm bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={15} className="text-[#c9a84c]" />
                      <div>
                        <p className="text-xs text-white tracking-wide">Archival Cedar Casket Box</p>
                        <p className="text-[10px] text-white/40">Handmade with velvet dustbag & wax seal</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeWoodenBox(!includeWoodenBox)}
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border transition-colors cursor-pointer ${
                        includeWoodenBox
                          ? 'border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10'
                          : 'border-white/20 text-white/40'
                      }`}
                    >
                      {includeWoodenBox ? 'Included' : 'Add Box'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer summary */}
          {!checkoutComplete && !isCheckingOut && items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#09080b] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{currency.symbol}{subtotalConverted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Global Express Courier</span>
                  <span className="text-[#c9a84c] uppercase text-[10px] tracking-wider">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[#c9a84c] font-display-luxury text-base">
                    {currency.symbol}{totalConverted.toLocaleString()} {currency.code}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-4 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Proceed to Acquisition</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                <ShieldCheck size={12} className="text-[#c9a84c]" />
                <span>Private & Encrypted Concierge Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
