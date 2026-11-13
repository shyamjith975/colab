import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Megaphone,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Building,
  ShieldCheck,
  PlusCircle,
  X,
  Send,
  Sparkles,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Campaign } from '../types';
import { formatCurrency, formatDate } from '../utils';

export const CampaignsPage: React.FC = () => {
  const { campaigns, currentUser, applyToCampaign, settings } = useApp();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minBudget, setMinBudget] = useState(0);

  // Selected campaign for detail modal / apply modal
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form fields
  const [proposedRate, setProposedRate] = useState<number>(3500);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [pitch, setPitch] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const categories = ['All', ...settings.categories];

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedPlatform !== 'All' && c.requirements.platform.toLowerCase() !== selectedPlatform.toLowerCase()) return false;
      if (c.budget.maxAmount < minBudget) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchBiz = c.businessName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBiz) return false;
      }
      return true;
    });
  }, [campaigns, selectedCategory, selectedPlatform, searchQuery, minBudget]);

  const handleOpenApply = (camp: Campaign, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCampaign(camp);
    setProposedRate(camp.budget.minAmount);
    setPitch('');
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCampaign) return;

    applyToCampaign({
      campaignId: activeCampaign.id,
      campaignTitle: activeCampaign.title,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorHandle: `@${currentUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      creatorAvatar: currentUser.avatar,
      creatorCategory: activeCampaign.category,
      creatorFollowers: 45000,
      creatorRating: 4.9,
      proposedRate,
      deliveryDays,
      pitch,
      portfolioLinks: portfolioLink ? [portfolioLink] : [],
      answers: Object.entries(answers).map(([question, answer]) => ({ question, answer }))
    });

    alert(`Application submitted successfully for "${activeCampaign.title}"! You will be notified in your Deal Room when the brand reviews your proposal.`);
    setShowApplyModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Open Advertising Campaigns
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Apply to verified brand sponsorships, product gifting, and paid promotional deliverables.
            </p>
          </div>

          {(currentUser.role === 'business' || currentUser.role === 'agency') && (
            <button
              onClick={() => navigate('/create-campaign')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Campaign</span>
            </button>
          )}
        </div>

        {/* Search & Filter Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search campaigns by brand, keyword, product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="w-full md:w-48">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Formats / Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="X">X (Twitter)</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-600 font-semibold shrink-0 mr-1">Niche:</span>
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg shrink-0 transition font-medium ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => setActiveCampaign(camp)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Brand header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={camp.businessLogo}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                          {camp.businessName}
                        </span>
                        {camp.businessVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-600 font-medium">
                        {camp.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Open
                  </span>
                </div>

                {/* Campaign Title */}
                <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                  {camp.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {camp.description}
                </p>

                {/* Deliverables Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                    📱 {camp.requirements.platform}
                  </span>
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    🎬 {camp.requirements.contentFormat}
                  </span>
                  {camp.requirements.storeVisitRequired && (
                    <span className="text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                      📍 Store Visit Required
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Creator Budget</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatCurrency(camp.budget.minAmount)} - {formatCurrency(camp.budget.maxAmount)}
                  </span>
                </div>

                <button
                  onClick={(e) => handleOpenApply(camp, e)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CAMPAIGN DETAILS MODAL */}
        {activeCampaign && !showApplyModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeCampaign.businessLogo}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeCampaign.businessName}
                    </h3>
                    <span className="text-xs text-slate-500">{activeCampaign.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCampaign(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                  {activeCampaign.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeCampaign.description}
                </p>
              </div>

              {/* Requirements & Target Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Target Audience</span>
                  <p className="text-slate-800 font-medium">Locations: {activeCampaign.targetAudience.locations.join(', ')}</p>
                  <p className="text-slate-800 font-medium">Age: {activeCampaign.targetAudience.ageRange} ({activeCampaign.targetAudience.gender})</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Deliverables & Rights</span>
                  <p className="text-slate-800 font-medium">{activeCampaign.requirements.contentFormat}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{activeCampaign.requirements.licensingTerms}</p>
                </div>
              </div>

              {/* Budget Details */}
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-xs space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Compensation Details</span>
                <div className="text-base font-extrabold text-indigo-950">
                  {formatCurrency(activeCampaign.budget.minAmount)} to {formatCurrency(activeCampaign.budget.maxAmount)}
                </div>
                <p className="text-indigo-800">{activeCampaign.budget.compensationDetails}</p>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  onClick={() => setActiveCampaign(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
                >
                  Apply to this Campaign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPLY MODAL */}
        {showApplyModal && activeCampaign && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Apply: {activeCampaign.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Propose your rate and submit your pitch to {activeCampaign.businessName}.
                  </p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Proposed Rate (₹ INR)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={proposedRate}
                      onChange={(e) => setProposedRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-600 mt-0.5 block">
                      Campaign range: {formatCurrency(activeCampaign.budget.minAmount)} - {formatCurrency(activeCampaign.budget.maxAmount)}
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Delivery Days
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Pitch & Collaboration Idea
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Describe how you will introduce this product to your audience and why your followers will convert..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Relevant Portfolio Sample Link
                  </label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://instagram.com/reel/sample"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {activeCampaign.settings.customQuestions.map((q, idx) => (
                  <div key={idx}>
                    <label className="block font-bold text-slate-700 mb-1">
                      {q}
                    </label>
                    <input
                      type="text"
                      required
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
                  >
                    Submit Application
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
