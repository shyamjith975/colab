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
  LogIn,
  Clock,
  Check,
  Tag,
  DollarSign,
  Share2,
  Copy,
  FileText,
  CheckCircle2
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
    applyToCampaign,
    bookingSlots,
    bookConsultationSlot,
    bookServiceWithConditions,
    sendStructuredEnquiry
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

  // Public Profile Link Copy Feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Structured Collaboration Enquiry Modal
  const [showStructuredEnquiryModal, setShowStructuredEnquiryModal] = useState(false);
  const [enquiryNeed, setEnquiryNeed] = useState('');
  const [enquiryBudget, setEnquiryBudget] = useState<string>('8000');
  const [enquiryDeliverables, setEnquiryDeliverables] = useState('1x Dedicated Reel (60s), 2x Stories with link, High-res stills');
  const [enquiryDates, setEnquiryDates] = useState('Dec 01, 2026 - Dec 15, 2026');
  const [enquiryLocation, setEnquiryLocation] = useState('Remote (Product Shipping)');
  const [enquiryRights, setEnquiryRights] = useState('90 Days Digital & Paid Ad Rights');
  const [enquiryResults, setEnquiryResults] = useState('50,000+ targeted impressions & 400+ website visits');

  // 2. Request a Quote Modal
  const [showQuoteRequestModal, setShowQuoteRequestModal] = useState(false);
  const [quoteScope, setQuoteScope] = useState('');
  const [quoteBudgetExpectation, setQuoteBudgetExpectation] = useState('6000');
  const [quoteTimeline, setQuoteTimeline] = useState('7 business days');
  const [quoteRightsNeeded, setQuoteRightsNeeded] = useState('Organic Social + 30 Days Ads');

  // 3. Request Sponsorship Modal
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);
  const [sponsorshipType, setSponsorshipType] = useState('Podcast & YouTube Integration');
  const [sponsorshipBudget, setSponsorshipBudget] = useState('25000');
  const [sponsorshipDuration, setSponsorshipDuration] = useState('2 Episodes / 1 Month');
  const [sponsorshipNotes, setSponsorshipNotes] = useState('');

  // 4. Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-1');
  const [bookingClientName, setBookingClientName] = useState(currentUser?.name || 'Local Business');
  const [bookingClientNote, setBookingClientNote] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [lastBookedCollabId, setLastBookedCollabId] = useState<string>('');

  // Unified Professional Identity Sub-Profile State
  const [activePersona, setActivePersona] = useState<'influencer' | 'ugc' | 'stylist'>('influencer');

  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/creators/${creator?.id || id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/creators/${creator?.id || id}`;
    if (navigator.share) {
      navigator.share({
        title: `${creator?.name} - Verified Creator Profile on co-lab`,
        text: `Hire ${creator?.name} for brand collaborations, UGC, consultations & sponsorships:`,
        url
      }).catch(() => {});
    } else {
      handleCopyProfileLink();
    }
  };

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

  const handleSendStructuredEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryNeed.trim()) {
      alert('Please describe what you need for this collaboration.');
      return;
    }
    const deliverablesList = enquiryDeliverables
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const convId = sendStructuredEnquiry({
      targetId: creator.id,
      targetName: creator.name,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorAvatar: creator.avatar,
      senderId: currentUser?.id || 'biz-user-1',
      senderName: currentUser?.name || 'Commercial Partner',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      businessId: currentUser?.id || 'biz-user-1',
      businessName: currentUser?.name || 'Commercial Partner',
      businessAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      projectNeed: enquiryNeed,
      budget: Number(enquiryBudget) || creator.minPrice,
      expectedDeliverables: deliverablesList.length > 0 ? deliverablesList : ['1x Dedicated Reel (60s)', '2x Instagram Stories with Link'],
      campaignDates: enquiryDates,
      location: enquiryLocation,
      contentUsageRights: enquiryRights,
      expectedResults: enquiryResults
    });

    setShowStructuredEnquiryModal(false);
    navigate(`/messages?conv=${convId}`);
  };

  const handleSendQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteScope.trim()) {
      alert('Please describe the service scope for this quote request.');
      return;
    }
    const convId = sendStructuredEnquiry({
      targetId: creator.id,
      targetName: creator.name,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorAvatar: creator.avatar,
      senderId: currentUser?.id || 'biz-user-1',
      senderName: currentUser?.name || 'Commercial Partner',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      businessId: currentUser?.id || 'biz-user-1',
      businessName: currentUser?.name || 'Commercial Partner',
      businessAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      projectNeed: `Formal Quotation Request: ${quoteScope}`,
      budget: Number(quoteBudgetExpectation) || creator.minPrice,
      expectedDeliverables: ['Custom Quotation as requested', 'Deliverable Breakdown & Milestones'],
      campaignDates: `Required within: ${quoteTimeline}`,
      location: 'Remote Deliverable',
      contentUsageRights: quoteRightsNeeded,
      expectedResults: 'Awaiting itemized creator quote & milestones'
    });

    setShowQuoteRequestModal(false);
    navigate(`/messages?conv=${convId}`);
  };

  const handleSendSponsorshipRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const convId = sendStructuredEnquiry({
      targetId: creator.id,
      targetName: creator.name,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorAvatar: creator.avatar,
      senderId: currentUser?.id || 'sponsor-user-1',
      senderName: currentUser?.name || 'Sponsoring Partner',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
      businessId: currentUser?.id || 'sponsor-user-1',
      businessName: currentUser?.name || 'Sponsoring Partner',
      businessAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
      projectNeed: `Sponsorship Request: ${sponsorshipType}. ${sponsorshipNotes ? `Special Requirements: ${sponsorshipNotes}` : ''}`,
      budget: Number(sponsorshipBudget) || 25000,
      expectedDeliverables: [`Title Sponsor integration for ${sponsorshipDuration}`, 'Prominent Logo & link in show notes/description'],
      campaignDates: sponsorshipDuration,
      location: 'Channel / Media Asset',
      contentUsageRights: 'Sponsorship Branding Rights',
      expectedResults: 'High-visibility sponsor brand placement & click conversions'
    });

    setShowSponsorshipModal(false);
    navigate(`/messages?conv=${convId}`);
  };

  const handleConfirmBookingWithEscrow = () => {
    const slot = bookingSlots.find((s) => s.id === selectedSlotId) || bookingSlots[0];
    if (!slot) return;
    const newCollab = bookServiceWithConditions(
      creator.id,
      slot.id,
      slot.serviceTitle,
      slot.date,
      slot.timeSlot,
      slot.price,
      slot.bookingConditions || 'Standard co-lab Escrow booking terms',
      bookingClientNote
    );
    setLastBookedCollabId(newCollab.id);
    setBookingConfirmed(true);
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

                {/* 1. Unified Professional Identity: Persona Sub-Profile Switcher */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Identity:</span>
                  <button
                    onClick={() => setActivePersona('influencer')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      activePersona === 'influencer'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>🌟 Influencer (185k)</span>
                  </button>

                  <button
                    onClick={() => setActivePersona('ugc')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      activePersona === 'ugc'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>🎬 UGC Video Creator</span>
                  </button>

                  <button
                    onClick={() => setActivePersona('stylist')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      activePersona === 'stylist'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>👗 Stylist & Director</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions / Direct Message */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                onClick={handleStartMessage}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Quick Chat</span>
              </button>
            </div>
          </div>

          {/* 1. Public Profile Link Banner */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-slate-50 border border-indigo-100/80 rounded-2xl p-3 sm:px-4 sm:py-3">
            <div className="flex items-center space-x-2 text-xs text-slate-700 min-w-0">
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md shrink-0">
                Public Profile
              </span>
              <span className="font-mono text-indigo-900 truncate font-semibold">
                colab.in/creators/{creator.id}
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyProfileLink}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs"
                title="Copy public link to share with brands or sponsors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleShareProfile}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs transition"
                title="Share via native share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5 Professional Contact & Collaboration Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Professional Collaboration & Booking Actions:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Button 1: Contact for collaboration */}
              <button
                onClick={() => setShowStructuredEnquiryModal(true)}
                className="flex items-center justify-center space-x-1.5 px-3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow-sm shadow-indigo-200"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Contact for collaboration</span>
              </button>

              {/* Button 2: Request a quote */}
              <button
                onClick={() => setShowQuoteRequestModal(true)}
                className="flex items-center justify-center space-x-1.5 px-3 py-3 bg-white hover:bg-indigo-50/40 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                <span className="truncate">Request a quote</span>
              </button>

              {/* Button 3: Book a service */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center justify-center space-x-1.5 px-3 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Book a service</span>
              </button>

              {/* Button 4: Invite to campaign */}
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center justify-center space-x-1.5 px-3 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span className="truncate">Invite to campaign</span>
              </button>

              {/* Button 5: Request sponsorship */}
              <button
                onClick={() => setShowSponsorshipModal(true)}
                className="flex items-center justify-center space-x-1.5 px-3 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold transition shadow-xs col-span-2 sm:col-span-1"
              >
                <Award className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                <span className="truncate">Request sponsorship</span>
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

      {/* 1. STRUCTURED COLLABORATION ENQUIRY MODAL (AVIOID CASUAL "HI" SPAM) */}
      {showStructuredEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider block">
                  Structured Enquiry Engine
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Contact {creator.name} for Collaboration
                </h3>
                <p className="text-xs text-slate-500">
                  Provide exact campaign parameters so {creator.name} can review and respond with formal terms.
                </p>
              </div>
              <button
                onClick={() => setShowStructuredEnquiryModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendStructuredEnquiry} className="space-y-3.5 text-xs">
              {/* Field 1: What they need */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  1. What do you need? (Project Overview & Concept) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={enquiryNeed}
                  onChange={(e) => setEnquiryNeed(e.target.value)}
                  placeholder="e.g. Looking for a dedicated 60-second Instagram Reel showcasing our new pastel summer handloom collection with styling tips..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Field 2 & 3: Budget and Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    2. Collaboration Budget (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min={500}
                      value={enquiryBudget}
                      onChange={(e) => setEnquiryBudget(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    3. Target Campaign Dates *
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryDates}
                    onChange={(e) => setEnquiryDates(e.target.value)}
                    placeholder="e.g. Dec 01 - Dec 15, 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 4: Expected Deliverables */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  4. Expected Deliverables (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={enquiryDeliverables}
                  onChange={(e) => setEnquiryDeliverables(e.target.value)}
                  placeholder="e.g. 1x Dedicated Reel (60s), 2x Stories with link, High-res stills"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Field 5 & 6: Location & Usage Rights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    5. Shoot Location / Mode *
                  </label>
                  <select
                    value={enquiryLocation}
                    onChange={(e) => setEnquiryLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Remote (Product Shipping)">Remote (Product Shipped to Creator)</option>
                    <option value="In-Studio Mumbai">In-Studio (Creator Studio)</option>
                    <option value="On-Ground Delhi (Brand Store)">On-Ground (Brand Store / Event)</option>
                    <option value="Hybrid / Virtual Session">Hybrid / Virtual Session</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    6. Content Usage Rights *
                  </label>
                  <select
                    value={enquiryRights}
                    onChange={(e) => setEnquiryRights(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Organic Social Only">Organic Social Only</option>
                    <option value="30 Days Digital Ad Rights">30 Days Digital Ad Rights</option>
                    <option value="90 Days Digital & Paid Ad Rights">90 Days Digital & Paid Ad Rights</option>
                    <option value="1 Year Full Digital Commercial Rights">1 Year Full Digital Commercial Rights</option>
                    <option value="Perpetual Commercial Buyout">Perpetual Commercial Buyout</option>
                  </select>
                </div>
              </div>

              {/* Field 7: Expected Results / Target KPIs */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  7. Expected Results / Target KPIs *
                </label>
                <input
                  type="text"
                  required
                  value={enquiryResults}
                  onChange={(e) => setEnquiryResults(e.target.value)}
                  placeholder="e.g. 50,000+ views, 400+ swipe-ups to website, 3.5% engagement"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900">
                <span className="font-bold block">✓ Professional Enquiry Guarantee:</span>
                This enquiry will arrive directly in {creator.name}'s Unified Inbox under <strong>Enquiries</strong> with all details pre-filled.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStructuredEnquiryModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition"
                >
                  Send Structured Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. REQUEST A QUOTE MODAL */}
      {showQuoteRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider block">
                  Rate Quotation Engine
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Request a Formal Quote from {creator.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Describe what you need and {creator.name} will prepare an itemized quote with pricing.
                </p>
              </div>
              <button
                onClick={() => setShowQuoteRequestModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendQuoteRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Deliverables & Creative Scope Needed *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quoteScope}
                  onChange={(e) => setQuoteScope(e.target.value)}
                  placeholder="e.g. 2 Dedicated YouTube Shorts + 1 Instagram Reel for our upcoming product launch. Looking for honest review & styling demonstration."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Target Budget Range (₹)
                  </label>
                  <input
                    type="number"
                    value={quoteBudgetExpectation}
                    onChange={(e) => setQuoteBudgetExpectation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Timeline / Turnaround Needed
                  </label>
                  <input
                    type="text"
                    value={quoteTimeline}
                    onChange={(e) => setQuoteTimeline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Usage Rights Required
                </label>
                <input
                  type="text"
                  value={quoteRightsNeeded}
                  onChange={(e) => setQuoteRightsNeeded(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition"
                >
                  Request Formal Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. REQUEST SPONSORSHIP MODAL */}
      {showSponsorshipModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-purple-600 font-extrabold uppercase tracking-wider block">
                  Commercial Sponsorship
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Request Sponsorship with {creator.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Sponsor creator channels, podcast episodes, community events, or YouTube series.
                </p>
              </div>
              <button
                onClick={() => setShowSponsorshipModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSponsorshipRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Sponsorship Format / Channel *
                </label>
                <select
                  value={sponsorshipType}
                  onChange={(e) => setSponsorshipType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Podcast & YouTube Integration">Podcast & YouTube Integration (60s mid-roll + host read)</option>
                  <option value="Title Sponsor for Video Series">Title Sponsor for Video Series (Powered by [Brand])</option>
                  <option value="Live Event / College Fest Presence">Live Event / College Fest / Booth Sponsor</option>
                  <option value="Community Newsletter Sponsor">Community Newsletter Header Feature & Dedicated Link</option>
                  <option value="360 Multi-Platform Sponsorship">360° Multi-Platform Exclusive Category Sponsorship</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Proposed Sponsorship Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={sponsorshipBudget}
                    onChange={(e) => setSponsorshipBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Campaign Scope / Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={sponsorshipDuration}
                    onChange={(e) => setSponsorshipDuration(e.target.value)}
                    placeholder="e.g. 2 Episodes / 1 Month"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Brand Guidelines & Key Call to Action
                </label>
                <textarea
                  rows={2}
                  value={sponsorshipNotes}
                  onChange={(e) => setSponsorshipNotes(e.target.value)}
                  placeholder="e.g. Include exclusive promo discount code in description, 15s verbal mention in first 3 minutes."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSponsorshipModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Submit Sponsorship Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DIRECT INVITATION / HIRE MODAL */}
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

      {/* 5. DIRECT BOOKING & AVAILABILITY SYSTEM MODAL WITH CONDITIONS & ESCROW */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
                  Direct Availability & Instant Booking
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Book Service or Slot with {creator.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingConfirmed(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-base">Booking Confirmed & Escrow Held!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your appointment with {creator.name} is locked. A Smart Deal Room has been automatically created.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  {lastBookedCollabId && (
                    <button
                      onClick={() => {
                        setShowBookingModal(false);
                        navigate(`/collaborations/${lastBookedCollabId}`);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1"
                    >
                      <span>Go to Deal Room</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      navigate('/messages');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    View in Messages
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Select Available Service / Date Slot:
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {bookingSlots.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                          selectedSlotId === slot.id
                            ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-200'
                            : 'border-slate-200 bg-slate-50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-extrabold text-slate-900 text-xs">{slot.serviceTitle}</span>
                              {slot.instantBookable && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                                  ⚡ Instant
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{slot.date}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{slot.timeSlot} ({slot.durationMinutes}m)</span>
                              </span>
                              {slot.serviceLocation && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-600 font-medium">📍 {slot.serviceLocation}</span>
                                </>
                              )}
                            </div>
                            {slot.bookingConditions && (
                              <p className="text-[10px] text-slate-600 bg-white/80 p-1.5 rounded-lg border border-slate-100 mt-1 italic">
                                📋 Condition: {slot.bookingConditions}
                              </p>
                            )}
                          </div>
                          <span className="font-black text-slate-900 text-sm shrink-0 ml-2">
                            {formatCurrency(slot.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Your Business / Brand Legal Name:
                  </label>
                  <input
                    type="text"
                    value={bookingClientName}
                    onChange={(e) => setBookingClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Aroma Threads Boutique"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Special Instructions / Deliverable Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={bookingClientNote}
                    onChange={(e) => setBookingClientNote(e.target.value)}
                    placeholder="e.g. Will provide brand moodboard and sample outfits 3 days prior..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                  <span className="font-bold block">🛡️ Integrated Escrow Guarantee:</span>
                  <p>
                    Payment is held securely in platform escrow and will only be disbursed to {creator.name} after the scheduled consultation or deliverable is completed.
                  </p>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBookingWithEscrow}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition"
                  >
                    Confirm Booking & Deposit Escrow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

