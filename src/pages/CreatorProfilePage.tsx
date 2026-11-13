import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Languages,
  MessageSquare,
  Send,
  CheckCircle,
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
  X,
  Plus,
  Lock,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCompactNumber, formatDate } from '../utils';

export const CreatorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    creators,
    reviews,
    currentUser,
    isLoggedIn,
    setShowLoginModal,
    createOrGetConversation,
    campaigns,
    applyToCampaign
  } = useApp();

  const creator = creators.find((c) => c.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'demographics' | 'reviews'>('services');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [customProposalText, setCustomProposalText] = useState('');

  if (!creator) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Creator profile not found</h2>
        <button
          onClick={() => navigate('/creators')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Creators
        </button>
      </div>
    );
  }

  // Profile is gated: view profile only after logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xl space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-50 blur-[2px]"
            />
            <div className="absolute inset-0 bg-slate-900/40 rounded-3xl flex items-center justify-center text-white">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Login Required</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              View Profile Only After Login
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sign in to view <span className="font-bold text-slate-700">{creator.name}</span> ({creator.handle})'s full media kit, verified audience demographics, rate cards, and direct collaboration options.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to View Profile</span>
            </button>

            <button
              onClick={() => navigate('/creators')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Back to Creators Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter verified reviews for this creator
  const creatorReviews = reviews.filter((r) => r.targetId === creator.id);

  const handleStartMessage = () => {
    const convId = createOrGetConversation(creator.id);
    navigate(`/messages?conv=${convId}`);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      alert("Please select one of your active campaigns to invite the creator.");
      return;
    }
    const camp = campaigns.find(c => c.id === selectedCampaignId);
    if (camp) {
      applyToCampaign({
        campaignId: camp.id,
        campaignTitle: camp.title,
        creatorId: creator.id,
        creatorName: creator.name,
        creatorHandle: creator.handle,
        creatorAvatar: creator.avatar,
        creatorCategory: creator.category,
        creatorFollowers: creator.socialAccounts[0]?.followersCount || 10000,
        creatorRating: creator.rating,
        proposedRate: selectedService ? selectedService.price : creator.minPrice,
        deliveryDays: selectedService ? selectedService.deliveryDays : 5,
        pitch: `Direct Brand Invitation from ${currentUser?.name || 'Brand Partner'}: ${customProposalText || 'We would love to collaborate with you on this campaign!'}`,
        portfolioLinks: []
      });
      alert(`Invitation sent to ${creator.name} for campaign "${camp.title}"!`);
      setShowInviteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner */}
      <div className="h-60 sm:h-80 w-full relative z-0">
        <img
          src={creator.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-black/20 to-transparent"></div>

        <button
          onClick={() => navigate('/creators')}
          className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to directory</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-premium">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl -mt-16 sm:-mt-20 bg-white relative z-30"
              />
              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {creator.name}
                  </h1>
                  {creator.verified && (
                    <span className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Creator</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-500">{creator.handle}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{creator.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Languages className="w-3.5 h-3.5 text-slate-400" />
                    <span>{creator.languages.join(', ')}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {creator.category}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleStartMessage}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Message</span>
              </button>

              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-200"
              >
                <Send className="w-4 h-4" />
                <span>Book / Invite</span>
              </button>
            </div>
          </div>

          {/* Social Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Followers / Audience</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatCompactNumber(creator.socialAccounts[0]?.followersCount || 10000)}
              </span>
              <span className="text-[11px] text-slate-500 block capitalize mt-0.5">Primary {creator.socialAccounts[0]?.platform}</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Engagement Rate</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600">
                {creator.socialAccounts[0]?.engagementRate || 5.0}%
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">Above category avg</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Average Video Views</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatCompactNumber(creator.socialAccounts[0]?.avgViews || 45000)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Per dedicated reel</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Collaborations Done</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-700">
                {creator.completedDeals} Deals
              </span>
              <div className="flex items-center space-x-1 text-[11px] text-amber-700 mt-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span className="font-bold">{creator.rating} Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 mt-8 mb-6 overflow-x-auto scrollbar-none text-sm font-semibold">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 shrink-0 ${
              activeTab === 'services'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Rate Cards & Services</span>
            <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{creator.services.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 shrink-0 ${
              activeTab === 'portfolio'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Portfolio & Work</span>
            <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{creator.portfolio.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('demographics')}
            className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 shrink-0 ${
              activeTab === 'demographics'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Audience Demographics</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 shrink-0 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Verified Brand Reviews</span>
            <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{creatorReviews.length}</span>
          </button>
        </div>

        {/* Tab 1: Rate Cards & Services */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creator.services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                      {srv.platform} • {srv.format}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatCurrency(srv.price)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.description}</p>

                  <div className="space-y-1.5 mb-6 text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Deliverables</span>
                    {srv.deliverables.map((del, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <span>⚡ {srv.deliveryDays} Days Turnaround</span>
                    <span>•</span>
                    <span>↺ {srv.revisions} Free Revisions</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService(srv);
                      setShowInviteModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Portfolio & Past Work */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creator.portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <div className="h-44 w-full relative">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.platform}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  {item.brandWorkedWith && (
                    <div className="text-xs text-slate-500">
                      Collaborated with: <span className="font-semibold text-slate-800">{item.brandWorkedWith}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-bold text-indigo-700">{item.reach}</span>
                    <span className="font-bold text-emerald-600">{item.engagement} Eng.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Audience Demographics */}
        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Audience Age</h4>
              <div className="text-3xl font-extrabold text-slate-900">{creator.demographics.topAudienceAge}</div>
              <p className="text-xs text-slate-600">
                Core collegiate & young working professional demographic with high disposable income.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender Breakdown</h4>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-indigo-600">Female: {creator.demographics.genderRatio.female}%</span>
                  <span className="text-slate-600">Male: {creator.demographics.genderRatio.male}%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full"
                    style={{ width: `${creator.demographics.genderRatio.female}%` }}
                  ></div>
                  <div
                    className="bg-slate-400 h-full"
                    style={{ width: `${creator.demographics.genderRatio.male}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Geographic Cities</h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {creator.demographics.topLocations.map((loc) => (
                  <span key={loc} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                    📍 {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Verified Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {creatorReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No reviews yet. Be the first brand to collaborate and leave a review!
              </div>
            ) : (
              creatorReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.reviewerName}</h4>
                      <span className="text-[11px] text-slate-500">{formatDate(rev.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center space-x-2 pt-2 text-[11px] text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified co-lab Commercial Deal Review</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* DIRECT INVITATION / HIRE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Invite {creator.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Select your active campaign and propose terms.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Your Brand Campaign
                </label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Campaign --</option>
                  {campaigns.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.title} ({formatCurrency(camp.budget.minAmount)} - {formatCurrency(camp.budget.maxAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selected Service Package
                </label>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex justify-between items-center">
                  <span className="font-semibold">
                    {selectedService ? selectedService.title : `Standard Rate Card (${formatCurrency(creator.minPrice)})`}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(selectedService ? selectedService.price : creator.minPrice)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Personal Invitation Message / Brief
                </label>
                <textarea
                  rows={3}
                  value={customProposalText}
                  onChange={(e) => setCustomProposalText(e.target.value)}
                  placeholder="Tell the creator why their audience is a great fit for your product..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
                >
                  Send Collaboration Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

