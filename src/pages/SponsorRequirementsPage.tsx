import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Check,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  MapPin,
  Tag,
  ArrowRight,
  TrendingUp,
  Award,
  Filter,
  Layers,
  ChevronRight,
  Send,
  Sliders,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCompactNumber, formatDate } from '../utils';
import { SponsorRequirementRFP } from '../types';

export const SponsorRequirementsPage: React.FC = () => {
  const {
    sponsorRfps,
    currentUser,
    isLoggedIn,
    setShowLoginModal,
    createSponsorRfp
  } = useApp();
  const navigate = useNavigate();

  // Form State
  const [brandName, setBrandName] = useState(currentUser?.name || 'Voltix Energy');
  const [industry, setIndustry] = useState('Consumer Beverages & Lifestyle');
  const [rfpTitle, setRfpTitle] = useState('Campus Youth Festival & Battle of the Bands Title Sponsor');
  const [budgetMin, setBudgetMin] = useState(100000);
  const [budgetMax, setBudgetMax] = useState(250000);
  const [minFootfall, setMinFootfall] = useState(6000);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    'College Cultural Fest',
    'Music Concert'
  ]);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([
    'Title / Powered-by Naming Rights',
    '10x10 ft Physical Stall for Sampling',
    '30s Video Spot on Main Stage LED Wall',
    'Logo on Event Passes & Wristbands'
  ]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    'Mumbai',
    'Bengaluru',
    'Kochi',
    'Thiruvananthapuram'
  ]);
  const [brief, setBrief] = useState(
    'We are looking to sponsor 5-8 college fests across South & West India. We provide cold drink sampling cans, energy zone tents, and direct financial sponsorship to verified college unions.'
  );

  const [publishedNotice, setPublishedNotice] = useState<string | null>(null);

  // Detailed Modal First -> Pitch Modal Second State
  const [selectedDetailRfp, setSelectedDetailRfp] = useState<SponsorRequirementRFP | null>(null);
  const [selectedPitchRfp, setSelectedPitchRfp] = useState<SponsorRequirementRFP | null>(null);
  const [pitchForm, setPitchForm] = useState({
    eventName: '',
    eventDate: '2026-12-20',
    venueCity: 'Bengaluru',
    expectedFootfall: 5000,
    requestedAmount: 150000,
    deckUrl: '',
    pitchNote: ''
  });
  const [pitchSubmittedNotice, setPitchSubmittedNotice] = useState<string | null>(null);

  const handleOpenDetail = (rfp: SponsorRequirementRFP) => {
    setSelectedDetailRfp(rfp);
    setSelectedPitchRfp(null);
  };

  const handleProceedToPitch = (rfp: SponsorRequirementRFP) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedDetailRfp(null);
    setSelectedPitchRfp(rfp);
    setPitchForm({
      eventName: '',
      eventDate: '2026-12-20',
      venueCity: rfp.targetLocations[0] || 'Bengaluru',
      expectedFootfall: rfp.minFootfall,
      requestedAmount: Math.round((rfp.budgetMin + rfp.budgetMax) / 2),
      deckUrl: '',
      pitchNote: ''
    });
  };

  const handleClosePitch = () => {
    setSelectedPitchRfp(null);
    setSelectedDetailRfp(null);
  };

  const handleSubmitPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchForm.eventName.trim()) {
      alert('Please enter your event name.');
      return;
    }
    setPitchSubmittedNotice(`Official sponsorship proposal for "${pitchForm.eventName}" submitted to ${selectedPitchRfp?.sponsorName}!`);
    setSelectedPitchRfp(null);
    setSelectedDetailRfp(null);
    setTimeout(() => setPitchSubmittedNotice(null), 7000);
  };

  const availableEventTypes = [
    'College Cultural Fest',
    'Tech Conference & Hackathon',
    'Sports Tournament & Marathon',
    'Music Concert & Stand-Up',
    'Esports & Gaming Expo',
    'Business Conclave / Summit'
  ];

  const availablePerks = [
    'Title / Powered-by Naming Rights',
    '10x10 ft Physical Stall for Sampling',
    '30s Video Spot on Main Stage LED Wall',
    'Logo on Event Passes & Wristbands',
    'Main Stage Chief Guest / Keynote Slot',
    'Runner / Delegate Kit Bag Inserts',
    'Student Lead Collection & Survey Desk',
    'Dedicated Social Media Shoutouts'
  ];

  const availableCities = [
    'Mumbai',
    'Delhi NCR',
    'Bengaluru',
    'Kochi',
    'Thiruvananthapuram',
    'Hyderabad',
    'Chennai',
    'Pune'
  ];

  const toggleEventType = (type: string) => {
    if (selectedEventTypes.includes(type)) {
      setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
    } else {
      setSelectedEventTypes([...selectedEventTypes, type]);
    }
  };

  const togglePerk = (perk: string) => {
    if (selectedPerks.includes(perk)) {
      setSelectedPerks(selectedPerks.filter(p => p !== perk));
    } else {
      setSelectedPerks([...selectedPerks, perk]);
    }
  };

  const toggleCity = (city: string) => {
    if (selectedLocations.includes(city)) {
      setSelectedLocations(selectedLocations.filter(c => c !== city));
    } else {
      setSelectedLocations([...selectedLocations, city]);
    }
  };

  const handlePublishRfp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const created = createSponsorRfp({
      brandIndustry: industry,
      title: rfpTitle,
      targetEventTypes: selectedEventTypes,
      budgetMin,
      budgetMax,
      minFootfall,
      requiredPerks: selectedPerks,
      targetLocations: selectedLocations,
      brief,
      status: 'open',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString()
    });

    setPublishedNotice(`Sponsorship RFP "${created.title}" successfully published! College fests and organisers can now submit proposals.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setPublishedNotice(null), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Sponsor Activation & RFP Hub</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Publish Your Brand Sponsorship Requirements & Discover Top Events
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect directly with verified college fest committees, sports tournament organizers, and tech conferences. Specify your target footfall, required stage perks, and budget to receive structured proposals.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Active Brand RFPs</span>
              <span className="font-extrabold text-amber-300">{sponsorRfps.length} Open Requests</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Verified Organisers</span>
              <span className="font-extrabold text-white">850+ Campus Committees</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Escrow Release</span>
              <span className="font-extrabold text-emerald-300">Deliverable Proof Verified</span>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        {publishedNotice && (
          <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-bold shadow-md animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>{publishedNotice}</span>
          </div>
        )}

        {/* 2-Column Layout: Form to Post RFP + Live Feed of RFPs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form to Post Sponsor Requirements (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <span>Post Sponsoring Brand Requirements (Call for Proposals)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in your commercial criteria so university fest teams and event organisers can submit exact bids.
              </p>
            </div>

            <form onSubmit={handlePublishRfp} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Sponsoring Brand Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Red Bull Energy India"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Industry / Category *</label>
                  <input
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. FMCG / Consumer Electronics"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Campaign Sponsorship Title *</label>
                <input
                  type="text"
                  required
                  value={rfpTitle}
                  onChange={(e) => setRfpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. National Campus Energy Activation & Music Stage Title Sponsor"
                />
              </div>

              {/* Target Event Types */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Target Event Types (Select all that apply) *</label>
                <div className="flex flex-wrap gap-2">
                  {availableEventTypes.map((type) => {
                    const isSelected = selectedEventTypes.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => toggleEventType(type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-amber-600 text-white font-bold shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget & Footfall Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Min Budget (₹)</label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Max Budget (₹)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Min Footfall Needed</label>
                  <input
                    type="number"
                    value={minFootfall}
                    onChange={(e) => setMinFootfall(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Required Perks Multi-Select */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Required Deliverables & Sponsorship Perks *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availablePerks.map((perk) => {
                    const isSelected = selectedPerks.includes(perk);
                    return (
                      <div
                        key={perk}
                        onClick={() => togglePerk(perk)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2 text-xs ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 font-bold text-amber-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-amber-600 text-white font-bold' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && '✓'}
                        </div>
                        <span className="truncate">{perk}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Cities */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Target Cities & Geographies</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableCities.map((city) => {
                    const isSelected = selectedLocations.includes(city);
                    return (
                      <button
                        type="button"
                        key={city}
                        onClick={() => toggleCity(city)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition ${
                          isSelected
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brief */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">RFP Brief & Special Instructions for Organisers</label>
                <textarea
                  rows={3}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Outline brand sampling guidelines, VIP seating requirements, and milestone proof verification..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Brand Sponsorship RFP</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Feed of Active Brand RFPs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Active Brand Sponsorship RFPs</h3>
                <p className="text-xs text-slate-500">Live requests from corporate sponsors looking for events</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {sponsorRfps.length} Open
              </span>
            </div>

            {pitchSubmittedNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center space-x-3 text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{pitchSubmittedNotice}</span>
              </div>
            )}

            <div className="space-y-4">
              {sponsorRfps.map((rfp) => (
                <div
                  key={rfp.id}
                  onClick={() => handleOpenDetail(rfp)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-3 cursor-pointer group hover:border-amber-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={rfp.sponsorLogo} alt="" className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{rfp.sponsorName}</h4>
                        <span className="text-[10px] text-slate-400 block">{rfp.brandIndustry}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {rfp.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-amber-800 transition">{rfp.title}</h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rfp.brief}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Range</span>
                      <strong className="text-amber-800">
                        {formatCurrency(rfp.budgetMin)} - {formatCurrency(rfp.budgetMax)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Min Footfall</span>
                      <strong className="text-slate-900">{formatCompactNumber(rfp.minFootfall)}+ People</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <span className="font-bold block text-slate-800 text-[10px] uppercase">Required Stage Perks:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {rfp.requiredPerks.slice(0, 3).map((perk, i) => (
                        <li key={i} className="truncate">{perk}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {rfp.proposalsCount} Proposals Received
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(rfp);
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <span>View Brief & Pitch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1. DETAILED RFP BRIEF MODAL (OPENS FIRST) */}
      {selectedDetailRfp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-amber-50 to-orange-50/40">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedDetailRfp.sponsorLogo}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                      {selectedDetailRfp.brandIndustry}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      {selectedDetailRfp.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedDetailRfp.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Sponsor: {selectedDetailRfp.sponsorName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailRfp(null)}
                className="p-1.5 rounded-xl hover:bg-white text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Sponsorship Requirement Brief
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedDetailRfp.brief}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Sponsorship Budget</span>
                  <span className="text-sm font-black text-amber-950 block mt-0.5">
                    {formatCurrency(selectedDetailRfp.budgetMin)} - {formatCurrency(selectedDetailRfp.budgetMax)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Min Audience Footfall</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {formatCompactNumber(selectedDetailRfp.minFootfall)}+ Attendees
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Proposals Received</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {selectedDetailRfp.proposalsCount} proposals
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Cities & Locations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailRfp.targetLocations.map((loc) => (
                    <span key={loc} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                      📍 {loc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Required Stage Deliverables & Perks
                </h4>
                <div className="space-y-1.5">
                  {selectedDetailRfp.requiredPerks.map((perk, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedDetailRfp(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleProceedToPitch(selectedDetailRfp)}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-amber-200"
              >
                <span>Proceed to Submit Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PITCH SUBMISSION FORM MODAL (OPENS AFTER EXPLICIT PROCEED) */}
      {selectedPitchRfp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-extrabold text-sm text-white">Submit Event Sponsorship Proposal</h3>
                <p className="text-[11px] text-slate-400">Target Sponsor: {selectedPitchRfp.sponsorName}</p>
              </div>
              <button
                onClick={handleClosePitch}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPitch} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">College Festival / Event Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhwani 2026 / TechFest Annual"
                  value={pitchForm.eventName}
                  onChange={(e) => setPitchForm({ ...pitchForm, eventName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Event Date</label>
                  <input
                    type="date"
                    value={pitchForm.eventDate}
                    onChange={(e) => setPitchForm({ ...pitchForm, eventDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Venue City</label>
                  <input
                    type="text"
                    value={pitchForm.venueCity}
                    onChange={(e) => setPitchForm({ ...pitchForm, venueCity: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expected Footfall</label>
                  <input
                    type="number"
                    value={pitchForm.expectedFootfall}
                    onChange={(e) => setPitchForm({ ...pitchForm, expectedFootfall: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Requested Sponsorship (₹)</label>
                  <input
                    type="number"
                    value={pitchForm.requestedAmount}
                    onChange={(e) => setPitchForm({ ...pitchForm, requestedAmount: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pitch Deck / Brochure Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={pitchForm.deckUrl}
                  onChange={(e) => setPitchForm({ ...pitchForm, deckUrl: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Custom Note / Tailored Perks</label>
                <textarea
                  rows={2}
                  placeholder="Tell the brand how your crowd matches their target demographic..."
                  value={pitchForm.pitchNote}
                  onChange={(e) => setPitchForm({ ...pitchForm, pitchNote: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClosePitch}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Event Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

