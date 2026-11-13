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
  const { sponsorships, submitSponsorshipProposal, currentUser, isLoggedIn, setShowLoginModal } = useApp();

  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOpportunity, setActiveOpportunity] = useState<SponsorshipOpportunity | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SponsorshipPackage | null>(null);
  const [proposalNote, setProposalNote] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);

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

  const handleOpenProposal = (opp: SponsorshipOpportunity, pkg: SponsorshipPackage) => {
    if (!isLoggedIn || !currentUser) {
      setShowLoginModal(true);
      return;
    }
    setActiveOpportunity(opp);
    setSelectedPackage(pkg);
    setProposalNote('');
    setShowProposalModal(true);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOpportunity || !selectedPackage) return;

    submitSponsorshipProposal(activeOpportunity.id, selectedPackage.id, proposalNote);
    alert(`Sponsorship proposal for ${selectedPackage.tier} submitted to ${activeOpportunity.organiserName}! The organiser will review your brand details.`);
    setShowProposalModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
                            onClick={() => handleOpenProposal(opp, pkg)}
                            disabled={pkg.claimedSlots >= pkg.availableSlots}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
                          >
                            Propose Deal
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
                <span>Deadline: {formatDate(opp.deadline)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PROPOSAL MODAL */}
        {showProposalModal && activeOpportunity && selectedPackage && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Sponsorship Offer: {selectedPackage.tier}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Propose partnership to {activeOpportunity.organiserName}.
                  </p>
                </div>
                <button onClick={() => setShowProposalModal(false)}>
                  <X className="w-5 h-5 text-slate-500" />
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
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Send Sponsorship Proposal
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

