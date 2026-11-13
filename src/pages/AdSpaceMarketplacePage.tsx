import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Sparkles,
  Users,
  CheckCircle,
  ExternalLink,
  DollarSign,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdInventoryItem } from '../types';
import { formatCurrency, formatCompactNumber } from '../utils';

export const AdSpaceMarketplacePage: React.FC = () => {
  const { adInventory, bookAdInventory } = useApp();
  const [selectedItem, setSelectedItem] = useState<AdInventoryItem | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleOpenBooking = (item: AdInventoryItem) => {
    setSelectedItem(item);
    setSelectedDate(item.datesAvailable[0] || '');
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedDate) return;
    bookAdInventory(selectedItem.id, selectedDate);
    alert(`Slot confirmed for ${selectedDate} with ${selectedItem.creatorName}! A deal room has been reserved for your brand.`);
    setShowBookingModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
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
                  <img src={item.creatorAvatar} alt="" className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-50" />
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
                      {item.datesAvailable.map((d, i) => (
                        <span key={i} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                          📅 {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Book CTA */}
              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Fixed Slot Price</span>
                  <span className="text-xl font-black text-indigo-700">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(item)}
                  disabled={item.slotsRemaining <= 0}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition"
                >
                  Reserve Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOOKING MODAL */}
        {showBookingModal && selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Book Ad Space</h3>
                  <span className="text-xs text-slate-500">{selectedItem.format} by {selectedItem.creatorName}</span>
                </div>
                <button onClick={() => setShowBookingModal(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Scheduled Broadcast Date *</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {selectedItem.datesAvailable.map((d) => (
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
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
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
      </div>
    </div>
  );
};
