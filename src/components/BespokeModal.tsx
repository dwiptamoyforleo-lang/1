import React, { useState } from 'react';
import { X, Sparkles, Calendar, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { BespokeBooking } from '../types';

interface BespokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess?: (booking: BespokeBooking) => void;
}

export const BespokeModal: React.FC<BespokeModalProps> = ({
  isOpen,
  onClose,
  onBookSuccess,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Paris' as const,
    garmentInterest: 'Architectural Overcoat & Trench Tailoring',
    preferredDate: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingToken, setBookingToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `SALON-${Math.floor(1000 + Math.random() * 9000)}-${formData.city.substring(0, 3).toUpperCase()}`;
    setBookingToken(token);
    setSubmitted(true);

    const booking: BespokeBooking = {
      id: token,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      garmentInterest: formData.garmentInterest,
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      notes: formData.notes,
      timestamp: Date.now(),
    };

    if (onBookSuccess) onBookSuccess(booking);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-[#0d0b11] border border-white/15 text-[#f4efe6] shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#09080b]/80 hover:bg-[#09080b] border border-white/10 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c] flex items-center justify-center text-[#c9a84c] mx-auto">
              <CheckCircle size={36} />
            </div>
            <h2 className="font-display-luxury text-2xl text-white">
              Private Salon Confirmed
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
              Appointment Access Pass: {bookingToken}
            </p>
            <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed font-light">
              Maison BrandName looks forward to welcoming you at our {formData.city} salon. Our Master Tailor and Fabric Archivist have reserved your private session for {formData.preferredDate}.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-8 py-3.5 bg-[#c9a84c] text-[#09080b] font-bold text-xs uppercase tracking-[0.25em] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
                <Sparkles size={13} />
                <span>Atelier Sartorial Service</span>
              </div>
              <h2 className="font-display-luxury text-2xl sm:text-3xl text-white">
                Book Private Salon & Fitting
              </h2>
              <p className="text-xs text-white/50 font-light leading-relaxed">
                Meet one-on-one with our creative director and master artisans to commission one-of-one silhouettes, rare vintage weaves, and anatomical tailoring.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lorde Sterling"
                    className="w-full bg-white/[0.04] border border-white/15 px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="concierge@example.com"
                    className="w-full bg-white/[0.04] border border-white/15 px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">
                    Telephone (WhatsApp / Direct)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 1 42 68 00 00"
                    className="w-full bg-white/[0.04] border border-white/15 px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1">
                    <MapPin size={11} className="text-[#c9a84c]" />
                    <span>Salon Location *</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value as any })}
                    className="w-full bg-[#14121a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]"
                  >
                    <option value="Paris">Paris (Place Vendôme Atelier)</option>
                    <option value="London">London (Savile Row Private Suite)</option>
                    <option value="Tokyo">Tokyo (Ginza Sanctum)</option>
                    <option value="New York">New York (Madison Avenue Studio)</option>
                    <option value="Mumbai">Mumbai (Colaba Heritage Atelier)</option>
                    <option value="Online Virtual Salon">Online Virtual Private Room (HD Video & Swatch Kit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">
                    Sartorial Focus
                  </label>
                  <select
                    value={formData.garmentInterest}
                    onChange={(e) => setFormData({ ...formData, garmentInterest: e.target.value })}
                    className="w-full bg-[#14121a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]"
                  >
                    <option value="Architectural Overcoat & Trench Tailoring">Architectural Overcoat & Trench Tailoring</option>
                    <option value="High-Armhole Celestial Evening Suiting">High-Armhole Celestial Evening Suiting</option>
                    <option value="Himalayan Pashmina & Draped Silks">Himalayan Pashmina & Draped Silks</option>
                    <option value="Bespoke Volcanic Obsidian & Fine Jewelry">Bespoke Volcanic Obsidian & Fine Jewelry</option>
                    <option value="Full Wardrobe Capsule Commission">Full Wardrobe Capsule Commission</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1">
                    <Calendar size={11} className="text-[#c9a84c]" />
                    <span>Preferred Consultation Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">
                  Specific Requests or Fabric Preferences
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share details regarding your silhouette preferences, measurements, or special occasion dates..."
                  className="w-full bg-white/[0.04] border border-white/15 px-3.5 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
                <ShieldCheck size={13} className="text-[#c9a84c]" />
                <span>Strict Discretion & VIP Non-Disclosure Standards Honored</span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-bold text-xs uppercase tracking-[0.25em] transition-all cursor-pointer shadow-lg"
                >
                  Request Salon Reservation
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
