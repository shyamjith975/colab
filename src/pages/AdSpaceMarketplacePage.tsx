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
  PlusCircle,
  ShieldCheck,
  Tag,
  Clock,
  Briefcase,
  Send,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdInventoryItem, Campaign } from '../types';
import { formatCurrency, formatCompactNumber } from '../utils';

export const AdSpaceMarketplacePage: React.FC = () => {
  const {
    adInventory,
    bookAdInventory,
    createAdInventoryItem,
    campaigns,
    applyToCampaign,
    isLoggedIn,
    setShowLoginModal,
    currentUser
  } = useApp();

  const isCreator = currentUser?.role === 'creator';

  // Creator Hub Sub-tabs
  const [creatorTab, setCreatorTab] = useState<'brand_requests' | 'my_slots'>('brand_requests');

  // Ad Slot Selection & Modals for Advertisers & Creators
  const [selectedItem, setSelectedItem] = useState<AdInventoryItem | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Platform Filter for Advertisers
  const [platformFilter, setPlatformFilter] = useState('All');

  // Brand Ad Request Pitching for Creators
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetailModal, setShowCampaignDetailModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchRate, setPitchRate] = useState<number>(3500);
  const [pitchDays, setPitchDays] = useState<number>(3);
  const [pitchText, setPitchText] = useState('');
  const [pitchLink, setPitchLink] = useState('');

  // New Ad Slot Form State
  const [newFormat, setNewFormat] = useState('Instagram Story (24h Prime Slot)');
  const [newPlatform, setNewPlatform] = useState<'Instagram' | 'YouTube' | 'Podcast' | 'Newsletter' | 'Website' | 'LinkedIn'>('Instagram');
  const [newPrice, setNewPrice] = useState(2500);
  const [newReach, setNewReach] = useState(85000);
  const [newDates, setNewDates] = useState('This Sunday, Next Wednesday, Next Friday');
  const [newDesc, setNewDesc] = useState('Prime time story feature with swipe-up link, tag, and 3-part sequence for maximum CTR.');
  const [newSlots, setNewSlots] = useState(3);

  // 1. OPEN DETAIL MODAL FIRST (Ad Space)
  const handleOpenAdDetail = (item: AdInventoryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedItem(item);
    setSelectedDate(item.datesAvailable[0] || '');
    setShowDetailModal(true);
    setShowBookingModal(false);
  };

  // 2. PROCEED TO BOOKING FORM FROM DETAIL MODAL
  const handleProceedToBooking = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowDetailModal(false);
    setShowBookingModal(true);
  };

  // 3. CONFIRM BOOKING & CLOSE CLEANLY
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedDate) return;
    bookAdInventory(selectedItem.id, selectedDate);
    alert(`Slot confirmed for ${selectedDate} with ${selectedItem.creatorName}! A deal room has been reserved for your brand in colab.db.`);
    setShowBookingModal(false);
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  // 4. CREATOR PITCHING TO BRAND REQUEST: OPEN DETAIL FIRST
  const handleOpenCampaignDetail = (camp: Campaign, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCampaign(camp);
    setPitchRate(camp.budget.minAmount || 3500);
    setShowCampaignDetailModal(true);
    setShowPitchModal(false);
  };

  // 5. PROCEED TO PITCH FORM FROM CAMPAIGN DETAIL
  const handleProceedToPitch = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowCampaignDetailModal(false);
    setShowPitchModal(true);
  };

  // 6. SUBMIT PITCH & CLOSE CLEANLY
  const handleConfirmPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    const creatorName = currentUser?.name || 'Creator';
    applyToCampaign({
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      creatorId: currentUser?.id || 'guest-creator',
      creatorName,
      creatorHandle: `@${creatorName.toLowerCase().replace(/\s+/g, '_')}`,
      creatorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      creatorCategory: selectedCampaign.category,
      creatorFollowers: 50000,
      creatorRating: 4.9,
      proposedRate: Number(pitchRate),
      deliveryDays: Number(pitchDays),
      pitch: pitchText || `Offering dedicated ad inventory slot for ${selectedCampaign.title}. Verified audience match.`,
      portfolioLinks: pitchLink ? [pitchLink] : []
    });

    alert(`Ad Space Pitch submitted to ${selectedCampaign.businessName}! Check your dashboard deals for updates.`);
    setShowPitchModal(false);
    setShowCampaignDetailModal(false);
    setSelectedCampaign(null);
    setPitchText('');
  };

  // 7. CREATE NEW AD SLOT
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

  // Filter listings based on role
  // For creators: only their own items (competitor prices/slots are hidden)
  const myOwnAdItems = adInventory.filter(
    item => item.creatorId === currentUser?.id || (currentUser?.name && item.creatorName?.toLowerCase() === currentUser?.name?.toLowerCase())
  );

  // For advertisers: show all creator inventory filtered by platform
  const advertiserListings = adInventory.filter(item => {
    if (platformFilter !== 'All' && item.platform !== platformFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isCreator ? 'Creator Ad Space Hub' : 'Guaranteed Inventory Slots'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isCreator ? 'Creator Ad Inventory & Brand Requests' : 'Ad Space & Inventory Marketplace'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {isCreator
                ? 'Pitch your available ad inventory to verified brand briefs, or manage your published rate cards and slot availability with complete pricing privacy.'
                : 'Book specific high-converting ad spots: prime Sunday evening Instagram stories, YouTube mid-rolls, and high-readership newsletter banners.'}
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

        {/* CREATOR VIEW: SEGREGATED HUBS (NO COMPETITOR PRICING SHOWN) */}
        {isCreator ? (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 space-x-4">
              <button
                onClick={() => setCreatorTab('brand_requests')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
                  creatorTab === 'brand_requests'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Brand & Sponsor Ad Requirements ({campaigns.length})</span>
              </button>

              <button
                onClick={() => setCreatorTab('my_slots')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
                  creatorTab === 'my_slots'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>My Listed Ad Inventory ({myOwnAdItems.length})</span>
              </button>
            </div>

            {/* TAB 1: BRAND & SPONSOR AD REQUIREMENTS */}
            {creatorTab === 'brand_requests' && (
              <div className="space-y-4">
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 flex items-center justify-between">
                  <span className="font-semibold">
                    📢 Open calls from brands looking for creator ad inventory placements. Inspect briefs and pitch your ad spots.
                  </span>
                  <span className="text-[11px] bg-white text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                    {campaigns.length} Active Briefs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      onClick={() => handleOpenCampaignDetail(camp)}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                            {camp.requirements.platform}
                          </span>
                          <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            Open Brief
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 pt-1">
                          <img
                            src={camp.businessLogo}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition line-clamp-1">
                              {camp.title}
                            </h3>
                            <span className="text-xs text-slate-500">{camp.businessName} • {camp.category}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {camp.description}
                        </p>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>Format:</span>
                            <span className="font-semibold text-slate-800">{camp.requirements.contentFormat}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Audience:</span>
                            <span className="font-semibold text-slate-800">{camp.targetAudience.ageRange}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Ad Budget</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatCurrency(camp.budget.minAmount)} - {formatCurrency(camp.budget.maxAmount)}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleOpenCampaignDetail(camp, e)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                          View Brief & Pitch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: MY OWN AD INVENTORY */}
            {creatorTab === 'my_slots' && (
              <div className="space-y-4">
                {myOwnAdItems.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                    <Layers className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="font-bold text-slate-900 text-base">No Ad Spaces Listed Yet</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      List your prime Instagram story slots, YouTube mid-rolls, or newsletter banners to get direct bookings from advertisers.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>List First Ad Space</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myOwnAdItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenAdDetail(item)}
                        className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                              {item.platform}
                            </span>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                              {item.slotsRemaining} of {item.slotsTotal} Slots Left
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base">{item.format}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Reach:</span>
                              <span className="font-bold text-slate-800">{formatCompactNumber(item.estimatedReach)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Available Dates:</span>
                              <span className="font-medium text-slate-800">{item.datesAvailable?.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Price</span>
                            <span className="text-base font-extrabold text-slate-900">{formatCurrency(item.price)}</span>
                          </div>

                          <button
                            onClick={(e) => handleOpenAdDetail(item, e)}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                          >
                            View Specs
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ADVERTISER / BRAND VIEW: BROWSE CREATOR INVENTORY */
          <div className="space-y-6">
            {/* Platform Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              {['All', 'Instagram', 'YouTube', 'Podcast', 'Newsletter', 'Website'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-3.5 py-2 rounded-xl font-bold transition ${
                    platformFilter === plat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertiserListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenAdDetail(item)}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
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
                      <img
                        src={item.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-50"
                      />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition">
                          {item.creatorName}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">{item.format}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
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
                          {item.datesAvailable?.slice(0, 3).map((d, i) => (
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
                      onClick={(e) => handleOpenAdDetail(item, e)}
                      disabled={item.slotsRemaining <= 0}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      {item.slotsRemaining > 0 ? 'View Details & Book' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: AD SPACE DETAILED VIEW FIRST (FOR ADVERTISERS & CREATORS)        */}
        {/* ========================================================================= */}
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedItem.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-50"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedItem.creatorName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                        {selectedItem.platform}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Verified Inventory</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedItem(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">{selectedItem.format}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Estimated Audience Reach</span>
                  <span className="font-extrabold text-indigo-700 text-base">
                    {formatCompactNumber(selectedItem.estimatedReach)} Impressions
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Remaining Availability</span>
                  <span className="font-bold text-emerald-700 text-base">
                    {selectedItem.slotsRemaining} of {selectedItem.slotsTotal} Slots
                  </span>
                </div>
              </div>

              {/* Placement Dates */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Available Placement Dates</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.datesAvailable?.map((d, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg font-semibold">
                      📅 {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Protection & Escrow Note */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>co-lab Milestone Escrow Guarantee:</strong> Funds held safely in scheduled escrow and only released after proof-of-placement link verification.
                </span>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Placement Fee</span>
                  <span className="text-2xl font-black text-slate-900">{formatCurrency(selectedItem.price)}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>

                  {!isCreator && selectedItem.slotsRemaining > 0 && (
                    <button
                      onClick={handleProceedToBooking}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
                    >
                      Proceed to Book Slot →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: BOOKING / RESERVATION MODAL (OPENS AFTER PROCEEDING)             */}
        {/* ========================================================================= */}
        {showBookingModal && selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setShowDetailModal(true);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-1 flex items-center space-x-1"
                  >
                    <span>← Back to Ad Space Details</span>
                  </button>
                  <h3 className="font-extrabold text-slate-900 text-base">Book Ad Placement</h3>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setShowDetailModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Creator / Publisher:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedItem.creatorName}</span>
                  <span className="text-[11px] text-slate-400 block">{selectedItem.format}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Placement Date *</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {selectedItem.datesAvailable?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-indigo-950">
                  <div className="flex justify-between font-bold text-sm">
                    <span>Slot Fee:</span>
                    <span>{formatCurrency(selectedItem.price)}</span>
                  </div>
                  <span className="text-[10px] text-indigo-700 block">
                    Secured by co-lab milestone escrow protection. Funds released only after delivery verification.
                  </span>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setShowDetailModal(false);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition"
                  >
                    Confirm & Reserve Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: CAMPAIGN / BRIEF DETAILED VIEW FIRST (FOR CREATORS PITCHING)     */}
        {/* ========================================================================= */}
        {showCampaignDetailModal && selectedCampaign && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedCampaign.businessLogo}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedCampaign.businessName}</h3>
                    <span className="text-xs text-slate-500">{selectedCampaign.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCampaignDetailModal(false);
                    setSelectedCampaign(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">{selectedCampaign.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedCampaign.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Audience</span>
                  <p className="font-semibold text-slate-800">{selectedCampaign.targetAudience.ageRange} ({selectedCampaign.targetAudience.gender})</p>
                  <p className="text-slate-600 text-[11px]">{selectedCampaign.targetAudience.locations.join(', ')}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Format & Rights</span>
                  <p className="font-semibold text-slate-800">{selectedCampaign.requirements.contentFormat}</p>
                  <p className="text-slate-600 text-[11px]">{selectedCampaign.requirements.licensingTerms}</p>
                </div>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-xs space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Budget Allocation</span>
                <div className="text-base font-extrabold text-indigo-950">
                  {formatCurrency(selectedCampaign.budget.minAmount)} to {formatCurrency(selectedCampaign.budget.maxAmount)}
                </div>
                <p className="text-indigo-800">{selectedCampaign.budget.compensationDetails}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowCampaignDetailModal(false);
                    setSelectedCampaign(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>

                <button
                  onClick={handleProceedToPitch}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
                >
                  Proceed to Pitch Ad Spot →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: CREATOR PITCH FORM (OPENS AFTER PROCEEDING)                      */}
        {/* ========================================================================= */}
        {showPitchModal && selectedCampaign && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPitchModal(false);
                      setShowCampaignDetailModal(true);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-1 flex items-center space-x-1"
                  >
                    <span>← Back to Campaign Brief</span>
                  </button>
                  <h3 className="text-lg font-bold text-slate-900">
                    Pitch Ad Inventory: {selectedCampaign.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Propose your rate and placement slot to {selectedCampaign.businessName}.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPitchModal(false);
                    setShowCampaignDetailModal(false);
                    setSelectedCampaign(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmPitch} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Proposed Rate (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={pitchRate}
                      onChange={(e) => setPitchRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Range: {formatCurrency(selectedCampaign.budget.minAmount)} - {formatCurrency(selectedCampaign.budget.maxAmount)}
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Turnaround (Days) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={pitchDays}
                      onChange={(e) => setPitchDays(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Ad Placement Pitch & Delivery Plan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    placeholder="Describe which ad format you will allocate (e.g. 60s mid-roll, swipe-up story sequence), your past CTR stats, and the date you can publish..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Link to Relevant Previous Ad Placement
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/reel/... or YouTube video link"
                    value={pitchLink}
                    onChange={(e) => setPitchLink(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPitchModal(false);
                      setShowCampaignDetailModal(false);
                      setSelectedCampaign(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
                  >
                    Submit Pitch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 5: LIST NEW AD SLOT MODAL                                           */}
        {/* ========================================================================= */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    AD
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">List New Ad Space Slot</h3>
                    <p className="text-xs text-slate-500">Publish bookable inventory slots with escrow protection</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
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
