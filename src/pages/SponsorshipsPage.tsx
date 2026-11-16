import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Send,
  X,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SponsorshipOpportunity, SponsorshipPackage } from '../types';
import { formatCurrency, formatCompactNumber, formatDate } from '../utils';

export const SponsorshipsPage: React.FC = () => {
  const {
    sponsorships,
    submitSponsorshipProposal,
    createSponsorshipOpportunity,
    currentUser,
    isLoggedIn,
    setShowLoginModal
  } = useApp();

  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOpportunity, setActiveOpportunity] = useState<SponsorshipOpportunity | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SponsorshipPackage | null>(null);
  const [proposalNote, setProposalNote] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Sponsorship Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'college_fest' | 'conference' | 'podcast' | 'sports_tournament' | 'cultural'>('college_fest');
  const [newLocation, setNewLocation] = useState('Bengaluru, Karnataka');
  const [newDate, setNewDate] = useState('2026-12-15');
  const [newFootfall, setNewFootfall] = useState(25000);
  const [newDesc, setNewDesc] = useState('');
  const [newPackageTitle, setNewPackageTitle] = useState<'Title Sponsor' | 'Presenting Sponsor' | 'Gold Sponsor' | 'Silver Sponsor' | 'Product Partner' | 'Media Partner' | 'Custom'>('Title Sponsor');
  const [newPackagePrice, setNewPackagePrice] = useState(150000);

  const types = ['All', 'college_fest', 'conference', 'podcast', 'sports_tournament', 'cultural'];

  const filtered = sponsorships.filter((s) => {
    if (selectedType !== 'All' && s.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenDetails = (opp: SponsorshipOpportunity, pkg?: SponsorshipPackage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveOpportunity(opp);
    setSelectedPackage(pkg || opp.packages[0] || null);
    setShowDetailModal(true);
    setShowProposalModal(false);
  };

  const handleProceedToProposal = (pkg?: SponsorshipPackage) => {
    if (!isLoggedIn || !currentUser) {
      setShowLoginModal(true);
      return;
    }
    if (pkg) setSelectedPackage(pkg);
    setShowDetailModal(false);
    setShowProposalModal(true);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOpportunity || !selectedPackage) return;

    submitSponsorshipProposal(activeOpportunity.id, selectedPackage.id, proposalNote);
    alert(`Sponsorship proposal for ${selectedPackage.tier} submitted to ${activeOpportunity.organiserName}! The organiser will review your brand details.`);
    setShowProposalModal(false);
    setShowDetailModal(false);
    setActiveOpportunity(null);
    setSelectedPackage(null);
    setProposalNote('');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sponsorship & Event Marketplace</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sponsor Events, Podcasts & Festivals
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Connect directly with college cultural fests, business conferences, sports tournaments and digital media owners.
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
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-indigo-200 transition shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Event Sponsorship</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search by event name, city, college, or conference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none text-xs">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-2 rounded-xl font-medium shrink-0 capitalize transition ${
                  selectedType === t
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Sponsorship Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Banner Image */}
                <div className="h-48 w-full relative">
                  <img src={opp.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {opp.category}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center space-x-1.5 font-bold">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span>{opp.location}</span>
                    </span>
                    <span className="bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-lg text-[11px]">
                      {formatDate(opp.eventDate)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img src={opp.organiserAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                        {opp.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">Organised by {opp.organiserName}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Footfall & Audience Box */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase font-bold block">Expected Reach / Footfall</span>
                      <span className="font-extrabold text-indigo-700 text-sm">
                        {formatCompactNumber(opp.expectedFootfall)}+ Attendees
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase font-bold block">Audience Focus</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {opp.targetAudience}
                      </span>
                    </div>
                  </div>

                  {/* Available Packages */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                      Available Sponsorship Tiers ({opp.packages.length})
                    </span>

                    <div className="space-y-2">
                      {opp.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900">{pkg.tier}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                {pkg.availableSlots - pkg.claimedSlots} left
                              </span>
                            </div>
                            <span className="text-indigo-700 font-extrabold text-sm block mt-0.5">
                              {formatCurrency(pkg.price)}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleOpenDetails(opp, pkg, e)}
                            disabled={pkg.claimedSlots >= pkg.availableSlots}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
                          >
                            View Tier & Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{opp.proposalCount} Brand Proposals Submitted</span>
                <button
                  onClick={() => handleOpenDetails(opp)}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  View Event Details & All Tiers →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: SPONSORSHIP OPPORTUNITY DETAILED VIEW FIRST                      */}
        {/* ========================================================================= */}
        {showDetailModal && activeOpportunity && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeOpportunity.organiserAvatar}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{activeOpportunity.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">Organised by {activeOpportunity.organiserName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setActiveOpportunity(null);
                    setSelectedPackage(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden relative h-48 border border-slate-100">
                <img src={activeOpportunity.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>{activeOpportunity.location}</span>
                  </span>
                  <span className="bg-indigo-600 px-3 py-1 rounded-lg font-bold">
                    Event Date: {formatDate(activeOpportunity.eventDate)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">About the Opportunity</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeOpportunity.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Expected Footfall / Audience</span>
                  <span className="font-extrabold text-indigo-700 text-base">
                    {formatCompactNumber(activeOpportunity.expectedFootfall)}+ Attendees
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Demographic Target</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {activeOpportunity.targetAudience}
                  </span>
                </div>
              </div>

              {/* Tiers List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select a Sponsorship Package ({activeOpportunity.packages.length} Options)
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeOpportunity.packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    const isSoldOut = pkg.claimedSlots >= pkg.availableSlots;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => !isSoldOut && setSelectedPackage(pkg)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-900 text-sm">{pkg.tier}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                              {pkg.availableSlots - pkg.claimedSlots} of {pkg.availableSlots} Slots Left
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                            {pkg.perks.map((p, i) => (
                              <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                ✓ {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0">
                          <span className="text-base font-black text-indigo-700">
                            {formatCurrency(pkg.price)}
                          </span>
                          <button
                            type="button"
                            disabled={isSoldOut}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProceedToProposal(pkg);
                            }}
                            className={`mt-1 text-xs font-bold px-4 py-1.5 rounded-xl transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSoldOut ? 'Sold Out' : 'Select Tier →'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setActiveOpportunity(null);
                    setSelectedPackage(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>

                {selectedPackage && selectedPackage.claimedSlots < selectedPackage.availableSlots && (
                  <button
                    onClick={() => handleProceedToProposal(selectedPackage)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
                  >
                    Proceed with {selectedPackage.tier} Proposal →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: PROPOSAL MODAL (OPENS AFTER PROCEEDING FROM DETAILS)             */}
        {/* ========================================================================= */}
        {showProposalModal && activeOpportunity && selectedPackage && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProposalModal(false);
                      setShowDetailModal(true);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-1 flex items-center space-x-1"
                  >
                    <span>← Back to Event Details</span>
                  </button>
                  <h3 className="text-lg font-bold text-slate-900">
                    Sponsorship Offer: {selectedPackage.tier}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Propose partnership to {activeOpportunity.organiserName}.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowProposalModal(false);
                    setShowDetailModal(false);
                    setActiveOpportunity(null);
                    setSelectedPackage(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Package Tier: {selectedPackage.tier}</span>
                    <span>{formatCurrency(selectedPackage.price)}</span>
                  </div>
                  <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-amber-800">
                    {selectedPackage.perks.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Brand Name / Sponsoring Entity
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={currentUser?.name || ''}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sponsorship Objectives & Message to Organisers
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposalNote}
                    onChange={(e) => setProposalNote(e.target.value)}
                    placeholder="Describe how your brand would like to activate at the event (e.g. booth placement, sampling, stage branding)..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProposalModal(false);
                      setShowDetailModal(false);
                      setActiveOpportunity(null);
                      setSelectedPackage(null);
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition"
                  >
                    Send Sponsorship Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: List New Event Sponsorship Opportunity */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    FEST
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">List Event Sponsorship Package</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTitle.trim()) return;
                  createSponsorshipOpportunity({
                    title: newTitle.trim(),
                    type: newType,
                    category: 'College & Youth Festivals',
                    location: newLocation,
                    eventDate: newDate,
                    expectedFootfall: Number(newFootfall),
                    targetAudience: 'College Students & Youth Demographic',
                    description: newDesc || `${newTitle} is one of the premier events in ${newLocation}.`,
                    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
                    createdAt: new Date().toISOString(),
                    packages: [
                      {
                        id: `pkg-${Date.now()}-1`,
                        tier: newPackageTitle,
                        price: Number(newPackagePrice),
                        perks: ['Main stage backdrop naming', '10x10 sampling stall', 'Wristband branding'],
                        availableSlots: 2,
                        claimedSlots: 0
                      }
                    ]
                  });
                  alert(`Event Sponsorship "${newTitle}" published to colab.db! Sponsors can now view and submit proposals.`);
                  setShowCreateModal(false);
                  setNewTitle('');
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event / Fest / Media Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Waves BITS Pilani Annual Cultural Fest"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Event Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="college_fest">College Cultural Fest</option>
                      <option value="conference">Conference / Summit</option>
                      <option value="sports_tournament">Sports Tournament</option>
                      <option value="podcast">Podcast / Media</option>
                      <option value="cultural">Concert & Standup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / Venue</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Goa, India"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expected Footfall</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={newFootfall}
                      onChange={(e) => setNewFootfall(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Package Tier Name</label>
                    <select
                      value={newPackageTitle}
                      onChange={(e) => setNewPackageTitle(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Title Sponsor">Title Sponsor</option>
                      <option value="Presenting Sponsor">Presenting Sponsor</option>
                      <option value="Gold Sponsor">Gold Sponsor</option>
                      <option value="Silver Sponsor">Silver Sponsor</option>
                      <option value="Product Partner">Product Partner</option>
                      <option value="Media Partner">Media Partner</option>
                      <option value="Custom">Custom Tier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sponsorship Fee (₹)</label>
                    <input
                      type="number"
                      required
                      min={5000}
                      value={newPackagePrice}
                      onChange={(e) => setNewPackagePrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Description & Sponsor Visibility</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe footfall demographics, key highlights, past sponsors..."
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
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
                  >
                    Publish Sponsorship to colab.db
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

