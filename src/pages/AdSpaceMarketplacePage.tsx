import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Sparkles,
  Users,
  CheckCircle,
  ExternalLink,
  DollarSign,
  X,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdInventoryItem } from '../types';
import { formatCurrency, formatCompactNumber } from '../utils';

export const AdSpaceMarketplacePage: React.FC = () => {
  const { adInventory, bookAdInventory, createAdInventoryItem, isLoggedIn, setShowLoginModal, currentUser } = useApp();
  const [selectedItem, setSelectedItem] = useState<AdInventoryItem | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Ad Slot Form State
  const [newFormat, setNewFormat] = useState('Instagram Story (24h Prime Slot)');
  const [newPlatform, setNewPlatform] = useState<'Instagram' | 'YouTube' | 'Podcast' | 'Newsletter' | 'Website' | 'LinkedIn'>('Instagram');
  const [newPrice, setNewPrice] = useState(2500);
  const [newReach, setNewReach] = useState(85000);
  const [newDates, setNewDates] = useState('This Sunday, Next Wednesday, Next Friday');
  const [newDesc, setNewDesc] = useState('Prime time story feature with swipe-up link, tag, and 3-part sequence for maximum CTR.');
  const [newSlots, setNewSlots] = useState(3);

  const handleOpenBooking = (item: AdInventoryItem) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedItem(item);
    setSelectedDate(item.datesAvailable[0] || '');
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedDate) return;
    bookAdInventory(selectedItem.id, selectedDate);
    alert(`Slot confirmed for ${selectedDate} with ${selectedItem.creatorName}! A deal room has been reserved for your brand in colab.db.`);
    setShowBookingModal(false);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) {
      setShowLoginModal(true);
      return;
    }

    createAdInventoryItem({
      format: newFormat,
      platform: newPlatform,
      price: Number(newPrice),
      estimatedReach: Number(newReach),
      datesAvailable: newDates.split(',').map(s => s.trim()).filter(Boolean),
      description: newDesc,
      slotsTotal: Number(newSlots)
    });

    alert("Ad Slot successfully published to colab.db! Advertisers can now view and book it.");
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Guaranteed Inventory Slots</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Ad Space & Inventory Marketplace
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Book specific high-converting ad spots: prime Sunday evening Instagram stories, YouTube mid-rolls, and high-readership newsletter banners.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                setShowLoginModal(true);
                return;
              }
              setShowCreateModal(true);
            }}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-indigo-200 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Ad Space Slot</span>
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                    {item.platform}
                  </span>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    {item.slotsRemaining} of {item.slotsTotal} Slots Left
                  </span>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <img src={item.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} alt="" className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-50" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{item.creatorName}</h3>
                    <span className="text-xs text-slate-500 font-medium">{item.format}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Reach & Dates box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Estimated Audience Reach:</span>
                    <span className="font-extrabold text-slate-900">{formatCompactNumber(item.estimatedReach)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Available Dates</span>
                    <div className="flex flex-wrap gap-1">
                      {item.datesAvailable?.map((d, i) => (
                        <span key={i} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                          📅 {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Booking CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Slot Price</span>
                  <span className="text-xl font-extrabold text-slate-900">{formatCurrency(item.price)}</span>
                </div>

                <button
                  onClick={() => handleOpenBooking(item)}
                  disabled={item.slotsRemaining <= 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  {item.slotsRemaining > 0 ? 'Book Spot' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Book Slot */}
        {showBookingModal && selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">Book Ad Space</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Creator / Publisher:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedItem.creatorName}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Placement Date *</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {selectedItem.datesAvailable?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-indigo-950">
                  <div className="flex justify-between font-bold">
                    <span>Slot Fee:</span>
                    <span>{formatCurrency(selectedItem.price)}</span>
                  </div>
                  <span className="text-[10px] text-indigo-700 block">
                    Secured by co-lab milestone escrow protection.
                  </span>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Confirm & Reserve Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: List New Ad Slot */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    AD
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">List New Ad Space Slot</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Platform</label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Newsletter">Newsletter</option>
                      <option value="Podcast">Podcast</option>
                      <option value="Telegram">Telegram Channel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slot Format / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunday Evening Dedicated Reel + 2 Stories"
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Estimated Reach</label>
                    <input
                      type="number"
                      required
                      value={newReach}
                      onChange={(e) => setNewReach(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Total Slots</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={20}
                      value={newSlots}
                      onChange={(e) => setNewSlots(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Dates (comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 20, Nov 27, Dec 04"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description & Deliverables</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what the sponsor will receive in this ad placement..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition"
                  >
                    Publish Ad Slot to colab.db
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
