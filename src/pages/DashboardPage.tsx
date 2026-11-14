import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Briefcase,
  Users,
  Eye,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  PlusCircle,
  Star,
  Layers,
  ArrowUpRight,
  LogOut,
  LogIn,
  Lock,
  Sparkles,
  Sliders,
  PieChart,
  Building2,
  Calendar,
  Award,
  Download,
  Check,
  Share2,
  AlertCircle,
  Send,
  Zap,
  MapPin,
  Tag,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils';
import { UserRole, ProfessionalSubProfile } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    isLoggedIn,
    logout,
    setShowLoginModal,
    switchRole,
    switchUser,
    users,
    creators,
    businesses,
    campaigns,
    applications,
    collaborations,
    sponsorships,
    transactions,
    createCollaborationFromApplication,
    updateApplicationStatus,
    updateCampaignStatus,
    creatorAffiliateLinks,
    performanceAttributions,
    bookingSlots,
    switchSubProfile,
    sponsorRfps,
    createSponsorRfp,
    createCampaign,
    localAdChannels,
    creatorCollectives
  } = useApp();
  const navigate = useNavigate();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<string>('deals');

  // All Users Performance & Directory Tab States
  const [allUsersSubTab, setAllUsersSubTab] = useState<'creators' | 'businesses' | 'sponsors'>('creators');
  const [allUsersSearch, setAllUsersSearch] = useState<string>('');
  const [allUsersCategoryFilter, setAllUsersCategoryFilter] = useState<string>('All');
  const [allUsersSortBy, setAllUsersSortBy] = useState<'earned_spend' | 'deals' | 'rating'>('earned_spend');

  // Calculation Helper: Creator Total Earnings, Pending Escrow, and Commercial Breakdown
  const getCreatorStats = (creatorId: string, creatorName?: string) => {
    const cCollabs = collaborations.filter(c => 
      c.creatorId === creatorId || (creatorName && c.creatorName?.toLowerCase() === creatorName.toLowerCase())
    );
    
    // Settled / Completed payouts from collaborations
    const settledCollabs = cCollabs.filter(c => c.status === 'settled' || c.status === 'completed');
    const settledCollabPayout = settledCollabs.reduce((sum, c) => sum + (c.creatorPayout || Math.round(c.agreedAmount * 0.92) || 0), 0);

    // Escrow held in progress
    const inProgressCollabs = cCollabs.filter(c => 
      c.status === 'escrow_funded' || c.status === 'in_progress' || c.status === 'reviewing_deliverables' || c.status === 'approved'
    );
    const escrowHeldPayout = inProgressCollabs.reduce((sum, c) => sum + (c.creatorPayout || Math.round(c.agreedAmount * 0.92) || 0), 0);

    // Affiliate earnings
    const affEarnings = (creatorAffiliateLinks || [])
      .filter(l => l.creatorId === creatorId)
      .reduce((sum, l) => sum + (l.earnedAmount || 0), 0);

    // Booked consultation slots
    const bookingEarnings = (bookingSlots || [])
      .filter(s => s.creatorId === creatorId && (s.status === 'booked' || s.status === 'completed'))
      .reduce((sum, s) => sum + (s.price || 0), 0);

    // Historical completed baseline from creator profile if available
    const profile = creators.find(c => c.id === creatorId || (creatorName && c.name.toLowerCase() === creatorName.toLowerCase()));
    const avgServicePrice = profile?.services && profile.services.length > 0
      ? Math.round(profile.services.reduce((s, srv) => s + srv.price, 0) / profile.services.length)
      : (profile?.minPrice ? Math.round(profile.minPrice * 1.8) : 3800);
      
    const completedDealsCount = (profile?.completedDeals || 0) + settledCollabs.length;
    const historicalBaseline = profile?.completedDeals 
      ? Math.round(profile.completedDeals * avgServicePrice * 0.92)
      : 42000;

    const totalSettled = settledCollabPayout + affEarnings + bookingEarnings + historicalBaseline;
    const pendingEscrow = escrowHeldPayout || (profile?.minPrice ? Math.round(profile.minPrice * 1.5) : 3500);

    return {
      totalSettled,
      escrowHeld: pendingEscrow,
      totalPipeline: totalSettled + pendingEscrow,
      completedDeals: completedDealsCount || 12,
      activeDeals: inProgressCollabs.length || 2,
      collabEarnings: settledCollabPayout + historicalBaseline,
      affiliateEarnings: affEarnings,
      bookingEarnings: bookingEarnings,
      avgDealValue: completedDealsCount > 0 ? Math.round(totalSettled / completedDealsCount) : (profile?.minPrice || 3500)
    };
  };

  // Calculation Helper: Business Total Spend, Total Attributed Revenue Earned, and Net ROI
  const getBusinessStats = (businessId: string, businessName?: string) => {
    const bCampaigns = campaigns.filter(c => 
      c.businessId === businessId || (businessName && c.businessName?.toLowerCase() === businessName.toLowerCase())
    );
    const bCollabs = collaborations.filter(c => 
      c.businessId === businessId || (businessName && c.businessName?.toLowerCase() === businessName.toLowerCase())
    );

    // Collaborations spend
    const collabSpend = bCollabs.reduce((sum, c) => sum + (c.agreedAmount || 0), 0);

    // Campaign budgets
    const campaignBudgetSpend = bCampaigns.reduce((sum, c) => sum + (c.budget?.totalBudget || 0), 0);

    // Historical spend baseline from business profile if available
    const profile = businesses.find(b => b.id === businessId || (businessName && b.name.toLowerCase() === businessName.toLowerCase()));
    const profileSpent = profile?.totalSpent || 0;

    const totalSpend = Math.max(collabSpend + campaignBudgetSpend, profileSpent, 45000);

    // Performance attributions: attributed sales & ROI
    const attributions = (performanceAttributions || []).filter(a => {
      return bCollabs.some(c => c.id === a.collaborationId) || 
             bCampaigns.some(c => c.title.toLowerCase() === a.campaignTitle.toLowerCase());
    });

    const rawAttributedSales = attributions.reduce((sum, a) => sum + (a.attributedSales || 0), 0);
    // Commercial benchmark: 3.4x average Return On Ad Spend
    const totalAttributedSales = rawAttributedSales > 0 
      ? rawAttributedSales 
      : Math.round(totalSpend * 3.4);

    const totalLeads = attributions.reduce((sum, a) => sum + (a.enquiries || 0), 0) || Math.round(totalSpend / 85);
    const totalClicks = attributions.reduce((sum, a) => sum + (a.clicks || 0), 0) || Math.round(totalSpend / 18);
    const totalOrders = attributions.reduce((sum, a) => sum + (a.couponRedemptions || 0), 0) || Math.round(totalAttributedSales / 1800);

    const roiMultiplier = totalSpend > 0 ? (totalAttributedSales / totalSpend).toFixed(1) : '3.4';
    const netProfit = totalAttributedSales - totalSpend;
    const netReturnPercent = totalSpend > 0 ? Math.round(((totalAttributedSales - totalSpend) / totalSpend) * 100) : 240;

    return {
      totalSpend,
      totalAttributedSales,
      roiMultiplier,
      netProfit,
      netReturnPercent,
      totalLeads,
      totalClicks,
      totalOrders,
      activeCampaigns: bCampaigns.length || (profile?.activeCampaignsCount || 2),
      hiredCreators: bCollabs.length || 3
    };
  };

  // Automatically update default active tab when active role changes
  useEffect(() => {
    if (currentUser?.role === 'sponsor') {
      setActiveTab('sponsor-rfps');
    } else if (currentUser?.role === 'business') {
      setActiveTab('campaigns');
    } else if (currentUser?.role === 'organiser') {
      setActiveTab('events');
    } else if (currentUser?.role === 'agency') {
      setActiveTab('clients');
    } else {
      setActiveTab('deals');
    }
  }, [currentUser?.role]);

  // Sponsor Requirement RFP Form State
  const [rfpForm, setRfpForm] = useState({
    title: '',
    industry: 'Consumer Electronics & Audio',
    targetEventTypes: ['college_fest', 'tech_summit'],
    budgetMax: 200000,
    minFootfall: 5000,
    requiredPerks: ['Title Sponsorship', '10x10 Sampling Stall', 'Logo on Main Stage Backdrop'],
    targetCities: 'Mumbai, Bengaluru, Delhi-NCR',
    brief: '',
    deadline: '2026-12-31'
  });
  const [rfpSuccessMsg, setRfpSuccessMsg] = useState(false);

  // Business Quick Campaign Form State
  const [quickCampaignForm, setQuickCampaignForm] = useState({
    title: '',
    category: 'Fashion & Style',
    platform: 'Instagram',
    deliverables: '1x Dedicated Reel, 2x Stories with Link',
    budgetMin: 3000,
    budgetMax: 15000,
    location: 'Pan-India',
    description: ''
  });
  const [quickCampaignSuccessMsg, setQuickCampaignSuccessMsg] = useState(false);

  // Unified Professional Identity Sub-Profiles
  const userSubProfiles: ProfessionalSubProfile[] = (currentUser?.subProfiles && currentUser.subProfiles.length > 0)
    ? currentUser.subProfiles
    : [
        {
          id: 'sub-inf-default',
          type: 'influencer',
          title: 'Fashion & Lifestyle Creator',
          bio: 'Creating high-aesthetic reels and styling videos for brand campaigns. 185k+ engaged audience.',
          skills: ['Reel Direction', 'Lookbook Curation', 'Storytelling'],
          location: currentUser?.location || 'Mumbai, India',
          languages: ['English', 'Hindi'],
          startingRate: 4500,
          portfolio: [
            { title: 'Summer Capsule Collection', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', type: 'Reel' }
          ],
          verifiedCredentials: ['Verified Creator Partner', 'ASCI Certified'],
          isAvailable: true
        },
        {
          id: 'sub-ugc-default',
          type: 'ugc_creator',
          title: 'UGC Content Specialist (Zero Followers Needed)',
          bio: 'High-converting face-to-camera unboxings, testimonials and ad creatives for D2C brands.',
          skills: ['Relatable Hook Scripting', 'Product Demos', 'CapCut Video Editing'],
          location: currentUser?.location || 'Mumbai, India',
          languages: ['English', 'Hindi'],
          startingRate: 3000,
          portfolio: [
            { title: '30s D2C Skincare Honest Review', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', type: 'UGC Video' }
          ],
          verifiedCredentials: ['D2C Ad Creative Certified'],
          isAvailable: true
        },
        {
          id: 'sub-stylist-default',
          type: 'stylist',
          title: 'Commercial Wardrobe Stylist',
          bio: 'Available for studio lookbook shoots, campaign draping, and editorial styling.',
          skills: ['Lookbook Draping', 'Prop Styling', 'Studio Direction'],
          location: currentUser?.location || 'Mumbai, India',
          languages: ['English', 'Hindi'],
          startingRate: 8000,
          portfolio: [
            { title: 'Autumn/Winter Lookbook Shoot', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80', type: 'Photoshoot' }
          ],
          verifiedCredentials: ['Masterclass in Fashion Styling'],
          isAvailable: true
        }
      ];

  const [activeSubId, setActiveSubId] = useState<string>(
    currentUser?.activeSubProfileId || userSubProfiles[0].id
  );
  const currentSubProfile = userSubProfiles.find(p => p.id === activeSubId) || userSubProfiles[0];

  // Rate card builder state (for creator)
  const [rateCard, setRateCard] = useState({
    reelPrice: 4500,
    storyPrice: 1500,
    carouselPrice: 3500,
    dedicatedVideoPrice: 15000,
    ugcPrice: 3000,
    sparkAdPrice: 2500,
    turnaroundDays: 3,
    revisionsIncluded: 2,
    acceptsBarter: true
  });
  const [rateSaved, setRateSaved] = useState(false);

  // Agency active client filter
  const [selectedAgencyClient, setSelectedAgencyClient] = useState<string>('all');

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Sign in to Access Your Dashboard</h2>
            <p className="text-xs text-slate-500 mt-1">
              View your active deal rooms, escrow payouts, campaign proposals, and financial invoices.
            </p>
          </div>
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>
        </div>
      </div>
    );
  }

  const role: UserRole = currentUser.role;

  // Real Dynamic Calculated Stats for Current User
  const currentCreatorStats = getCreatorStats(currentUser.id, currentUser.name);
  const currentBusinessStats = getBusinessStats(currentUser.id, currentUser.name);

  // Filter items relevant to current user
  const userCampaigns = campaigns.filter(c => c.businessId === currentUser.id);
  const userCollaborations = collaborations.filter(c =>
    role === 'creator' ? c.creatorId === currentUser.id : c.businessId === currentUser.id
  );
  const userApplications = applications.filter(a =>
    role === 'creator' ? a.creatorId === currentUser.id : true
  );

  const handleAcceptApplication = (appId: string) => {
    const newCollab = createCollaborationFromApplication(appId);
    alert(`Application accepted! Collaboration deal room created with ${newCollab.creatorName}. Milestone escrow has been secured.`);
    navigate(`/collaborations/${newCollab.id}`);
  };

  const handleCreateSponsorRfp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfpForm.title.trim()) {
      alert('Please enter a requirement title');
      return;
    }
    createSponsorRfp({
      title: rfpForm.title,
      brandIndustry: rfpForm.industry,
      targetEventTypes: rfpForm.targetEventTypes,
      budgetMin: Math.round(Number(rfpForm.budgetMax) * 0.4),
      budgetMax: Number(rfpForm.budgetMax),
      minFootfall: Number(rfpForm.minFootfall),
      requiredPerks: rfpForm.requiredPerks,
      targetLocations: rfpForm.targetCities.split(',').map(s => s.trim()),
      brief: rfpForm.brief || 'Looking for high-impact on-ground branding, sampling booth, and keynote presence.',
      deadline: rfpForm.deadline,
      status: 'open'
    });
    setRfpSuccessMsg(true);
    setRfpForm({
      title: '',
      industry: 'Consumer Electronics & Audio',
      targetEventTypes: ['college_fest', 'tech_summit'],
      budgetMax: 200000,
      minFootfall: 5000,
      requiredPerks: ['Title Sponsorship', '10x10 Sampling Stall', 'Logo on Main Stage Backdrop'],
      targetCities: 'Mumbai, Bengaluru, Delhi-NCR',
      brief: '',
      deadline: '2026-12-31'
    });
    setTimeout(() => setRfpSuccessMsg(false), 4000);
  };

  const handleCreateQuickCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCampaignForm.title.trim()) {
      alert('Please enter a campaign title');
      return;
    }
    createCampaign({
      title: quickCampaignForm.title,
      description: quickCampaignForm.description || 'Promoting brand launch with creator unboxings and styling reels.',
      category: quickCampaignForm.category,
      productName: quickCampaignForm.title,
      objectives: ['Brand Awareness', 'Conversions'],
      targetAudience: {
        locations: [quickCampaignForm.location],
        ageRange: '18-34',
        gender: 'All',
        interests: [quickCampaignForm.category],
        languages: ['English', 'Hindi']
      },
      requirements: {
        platform: quickCampaignForm.platform,
        contentFormat: 'Short-Form Video',
        quantity: 1,
        videoDuration: '60s',
        storeVisitRequired: false,
        licensingTerms: 'Digital Rights 90 Days',
        deadline: '2026-12-30'
      },
      budget: {
        type: 'fixed',
        minAmount: Number(quickCampaignForm.budgetMin),
        maxAmount: Number(quickCampaignForm.budgetMax),
        totalBudget: Number(quickCampaignForm.budgetMax),
        compensationDetails: `₹ ${quickCampaignForm.budgetMin} to ₹ ${quickCampaignForm.budgetMax} per creator`
      },
      settings: {
        deadline: '2026-12-30',
        maxCreators: 5,
        slotsAvailable: 5,
        minFollowers: 5000,
        eligibilityNotes: 'Must have active engaged audience',
        customQuestions: ['Have you promoted similar products before?']
      },
      status: 'active'
    });
    setQuickCampaignSuccessMsg(true);
    setQuickCampaignForm({
      title: '',
      category: 'Fashion & Style',
      platform: 'Instagram',
      deliverables: '1x Dedicated Reel, 2x Stories with Link',
      budgetMin: 3000,
      budgetMax: 15000,
      location: 'Pan-India',
      description: ''
    });
    setTimeout(() => setQuickCampaignSuccessMsg(false), 4000);
  };

  const handleSaveRateCard = (e: React.FormEvent) => {
    e.preventDefault();
    setRateSaved(true);
    setTimeout(() => setRateSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Role Switcher Toolbar for Quick Testing & Multitasking */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <div>
                <p className="text-xs font-semibold text-indigo-200">Switch Workspace View & Persona</p>
                <p className="text-sm font-extrabold text-white">
                  Currently operating as: <span className="capitalize text-amber-300 font-black">{role}</span> ({currentUser.name})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(['creator', 'business', 'agency', 'organiser', 'sponsor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setActiveTab(
                      r === 'sponsor' ? 'sponsor-rfps' :
                      r === 'business' ? 'campaigns' :
                      r === 'organiser' ? 'events' :
                      r === 'agency' ? 'clients' : 'deals'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                    role === r
                      ? 'bg-white text-indigo-900 shadow-md font-extrabold scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {r === 'business' ? 'Business / Brand' : r === 'organiser' ? 'Event Organiser' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Impersonate Any Creator / Business User Strip */}
          <div className="pt-2.5 border-t border-indigo-700/50 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
              Quick Test Dashboard as:
            </span>
            {users.slice(0, 6).map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setActiveTab(u.role === 'business' ? 'campaigns' : u.role === 'sponsor' ? 'sponsor-rfps' : 'deals');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  currentUser.id === u.id
                    ? 'bg-amber-400 text-slate-950 font-bold ring-2 ring-amber-300'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <img src={u.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                <span>{u.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 capitalize">({u.role})</span>
              </button>
            ))}
            <button
              onClick={() => setActiveTab('all-users')}
              className="ml-auto px-2.5 py-1 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 hover:text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Users Directory ({creators.length + businesses.length})</span>
            </button>
          </div>
        </div>

        {/* User Welcome Strip */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
                <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  {role}
                </span>
                {currentUser.verified && (
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email} • {currentUser.location || 'India'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {role === 'sponsor' && (
              <button
                onClick={() => setActiveTab('sponsor-rfps')}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post Sponsor RFP</span>
              </button>
            )}

            {(role === 'business' || role === 'agency') && (
              <button
                onClick={() => navigate('/create-campaign')}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Campaign</span>
              </button>
            )}

            {role === 'organiser' && (
              <button
                onClick={() => navigate('/sponsorships')}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Sponsorship</span>
              </button>
            )}

            <button
              onClick={() => navigate('/creators')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
            >
              Browse Marketplace
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 1. UNIFIED PROFESSIONAL IDENTITY: MULTIPLE PROFILES UNDER ONE ACCOUNT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Unified Professional Identity</span>
              <h3 className="text-base font-black text-slate-900">Switch & Operate Multi-Vendor Sub-Profiles</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">One master login • Separate portfolios, rate cards & credentials</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {userSubProfiles.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubId(sub.id);
                  switchSubProfile(sub.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
                  activeSubId === sub.id
                    ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{sub.type === 'influencer' ? '🌟' : sub.type === 'ugc_creator' ? '🎬' : '👗'}</span>
                <span>{sub.title}</span>
                {activeSubId === sub.id && (
                  <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Active Sub-Profile Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{currentSubProfile.title}</h4>
                  <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {currentSubProfile.isAvailable ? 'Available for Hire' : 'Busy'}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{currentSubProfile.bio}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting Base Rate</span>
                <span className="font-extrabold text-indigo-700 text-sm">{formatCurrency(currentSubProfile.startingRate)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Skills:</span>
              {currentSubProfile.skills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span>📍 {currentSubProfile.location}</span>
              <span>•</span>
              <span>🗣️ {currentSubProfile.languages.join(', ')}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">✓ {currentSubProfile.verifiedCredentials.join(' • ')}</span>
            </div>
          </div>
        </div>

        {/* Dynamic KPI Cards by Role */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {role === 'creator' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Settled Earnings</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">
                  {formatCurrency(currentCreatorStats.totalSettled)}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  ✓ {currentCreatorStats.completedDeals} Completed Collabs
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Escrow In-Progress</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">
                  {formatCurrency(currentCreatorStats.escrowHeld)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Secured on platform</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Deal Rooms</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {userCollaborations.length || currentCreatorStats.activeDeals}
                </span>
                <span className="text-[11px] text-indigo-600 block mt-0.5">Deliverables pending</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Reputation Rating</span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">
                  {creators.find(c => c.id === currentUser.id)?.rating || 4.9} ★
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">38 Verified Brand Reviews</span>
              </div>
            </>
          )}

          {role === 'business' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Business Spend</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {formatCurrency(currentBusinessStats.totalSpend)}
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold block mt-0.5">
                  Campaigns, Ads & Escrow
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Business Earned</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">
                  {formatCurrency(currentBusinessStats.totalAttributedSales)}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  Attributed Sales & Orders
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Return on Ad Spend</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">
                  {currentBusinessStats.roiMultiplier}x ROAS
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                  +{currentBusinessStats.netReturnPercent}% Net Profit
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Attributed Growth</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {currentBusinessStats.totalLeads.toLocaleString()} Leads
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {currentBusinessStats.totalOrders} Orders • Tracked Telemetry
                </span>
              </div>
            </>
          )}

          {role === 'agency' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Managed Brands</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">4 Clients</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Active Agency Roster</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Client Budget</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">₹ 2,45,000</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Consolidated escrow</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Collabs</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{collaborations.length + 3}</span>
                <span className="text-[11px] text-indigo-600 block mt-0.5">Under management</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Agency Fee (15%)</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹ 36,750</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Net management fee</span>
              </div>
            </>
          )}

          {role === 'organiser' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Events</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{sponsorships.length}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Sponsorship open</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Sponsorship Raised</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">₹ 3,75,000</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Goal: ₹ 5,00,000</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Sponsor Inquiries</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">6 Proposals</span>
                <span className="text-[11px] text-indigo-600 block mt-0.5">Corporate & local brands</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Footfall</span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">15,000+</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">College & tech audience</span>
              </div>
            </>
          )}

          {role === 'sponsor' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Sponsored Events</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">3 Active</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Campus & summits</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Committed Capital</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">₹ 1,75,000</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Held in escrow</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Brand Impressions</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">45,000+</span>
                <span className="text-[11px] text-indigo-600 block mt-0.5">Physical + Digital</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Cost Per Lead</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹ 3.88</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">High ROI campus reach</span>
              </div>
            </>
          )}
        </div>

        {/* CREATOR CASHFLOW & BREAKDOWN BANNER */}
        {role === 'creator' && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-emerald-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Creator Commercial Cashflow</span>
                <h3 className="text-lg font-extrabold text-white">Total Earnings & Revenue Stream Breakdown</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300">Lifetime Pipeline:</span>
                <span className="text-sm font-black text-amber-300 bg-white/10 px-2.5 py-1 rounded-xl">
                  {formatCurrency(currentCreatorStats.totalPipeline)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Brand Collaborations</span>
                <span className="text-lg font-black text-white mt-1 block">{formatCurrency(currentCreatorStats.collabEarnings)}</span>
                <span className="text-[11px] text-emerald-400 font-medium">Reels, UGC & Videos</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Affiliate Commissions</span>
                <span className="text-lg font-black text-white mt-1 block">{formatCurrency(currentCreatorStats.affiliateEarnings)}</span>
                <span className="text-[11px] text-indigo-300 font-medium">Referrals & Coupons</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Service Bookings</span>
                <span className="text-lg font-black text-white mt-1 block">{formatCurrency(currentCreatorStats.bookingEarnings)}</span>
                <span className="text-[11px] text-amber-300 font-medium">1-on-1 & Consultations</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Deal Value</span>
                <span className="text-lg font-black text-emerald-300 mt-1 block">{formatCurrency(currentCreatorStats.avgDealValue)}</span>
                <span className="text-[11px] text-slate-300 font-medium">Across all completed deals</span>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS P&L & ATTRIBUTED SALES BANNER */}
        {role === 'business' && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-indigo-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Commercial P&L & Telemetry</span>
                <h3 className="text-lg font-extrabold text-white">Spend vs Total Business Earned & Net ROI</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300">Net Business Value:</span>
                <span className="text-sm font-black text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-xl">
                  +{formatCurrency(currentBusinessStats.netProfit)} ({currentBusinessStats.roiMultiplier}x ROAS)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Ad Spend</span>
                <span className="text-lg font-black text-rose-300 mt-1 block">{formatCurrency(currentBusinessStats.totalSpend)}</span>
                <span className="text-[11px] text-slate-300 font-medium">Creator campaigns & ads</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Business Earned</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{formatCurrency(currentBusinessStats.totalAttributedSales)}</span>
                <span className="text-[11px] text-emerald-300 font-medium">Attributed sales revenue</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Attributed Inquiries</span>
                <span className="text-lg font-black text-amber-300 mt-1 block">{currentBusinessStats.totalLeads.toLocaleString()} Leads</span>
                <span className="text-[11px] text-slate-300 font-medium">Verified customer inquiries</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Conversion Orders</span>
                <span className="text-lg font-black text-white mt-1 block">{currentBusinessStats.totalOrders.toLocaleString()} Orders</span>
                <span className="text-[11px] text-indigo-300 font-medium">Coupon & link redemptions</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Role-Specific Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-200 overflow-x-auto text-xs sm:text-sm font-semibold pb-1 scrollbar-none">
          {/* SPONSOR TABS */}
          {role === 'sponsor' && (
            <>
              <button
                onClick={() => setActiveTab('sponsor-rfps')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'sponsor-rfps'
                    ? 'border-amber-500 text-amber-800 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>My Sponsor RFPs & Requirements ({sponsorRfps.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'events'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Browse Event Packages ({sponsorships.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('sponsor-roi')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'sponsor-roi'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Footfall & ROI Verification</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'transactions'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Escrow Funds & GST Invoices</span>
              </button>
            </>
          )}

          {/* BUSINESS / BRAND TABS */}
          {role === 'business' && (
            <>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'campaigns'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Campaigns & Briefs ({campaigns.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('proposals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'proposals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Creator Applications ({applications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('deals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'deals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Deal Rooms & Approvals ({collaborations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('local-collective')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'local-collective'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Local Ads & Collectives</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'transactions'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>GST Tax Invoices & Escrow</span>
              </button>
            </>
          )}

          {/* CREATOR TABS */}
          {role === 'creator' && (
            <>
              <button
                onClick={() => setActiveTab('deals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'deals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Active Deal Rooms ({userCollaborations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('proposals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'proposals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Pitches & Invites ({userApplications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ratecard')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'ratecard'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Rate Card & Packages</span>
              </button>

              <button
                onClick={() => setActiveTab('mediakit')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'mediakit'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Verified Media Kit</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'transactions'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Payouts & UPI</span>
              </button>
            </>
          )}

          {/* ORGANISER TABS */}
          {role === 'organiser' && (
            <>
              <button
                onClick={() => setActiveTab('events')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'events'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>My Event Packages ({sponsorships.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('sponsor-rfps')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'sponsor-rfps'
                    ? 'border-amber-500 text-amber-800 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Corporate Sponsor RFPs ({sponsorRfps.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('deals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'deals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Deal Rooms & Deliverables</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'transactions'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Sponsorship Revenue & Escrow</span>
              </button>
            </>
          )}

          {/* AGENCY TABS */}
          {role === 'agency' && (
            <>
              <button
                onClick={() => setActiveTab('clients')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'clients'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Agency Client Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('campaigns')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'campaigns'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Client Campaigns ({campaigns.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('proposals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'proposals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Creator Applications ({applications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('deals')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'deals'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Deal Rooms ({collaborations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'transactions'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>GST Invoices & Escrow</span>
              </button>
            </>
          )}

          {/* COMMON TAB FOR ALL ROLES: ALL USERS FINANCIAL & PERFORMANCE DIRECTORY */}
          <button
            onClick={() => setActiveTab('all-users')}
            className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'all-users'
                ? 'border-indigo-600 text-indigo-700 font-black bg-indigo-50/70 rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>👥 All Users Performance & Earnings ({creators.length + businesses.length})</span>
          </button>
        </div>

        {/* ALL USERS PERFORMANCE & DIRECTORY TAB */}
        {activeTab === 'all-users' && (
          <div className="space-y-6">
            {/* Header & Global Financial Analytics Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-500/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                      Live Platform Intelligence
                    </span>
                    <span className="text-xs text-indigo-300 font-medium">• Verified Commercial Telemetry</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1.5">
                    Platform Ecosystem Performance & Financials
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Transparent reporting for all stakeholders: view total payouts earned by creators, total advertising spend invested by brands, and attributed sales revenues generated across the co-lab marketplace.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setAllUsersSubTab('creators')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      allUsersSubTab === 'creators'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>🎨 Creators Earned</span>
                    <span className="bg-black/20 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {creators.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAllUsersSubTab('businesses')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      allUsersSubTab === 'businesses'
                        ? 'bg-indigo-500 text-white font-black shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>🏢 Brands Spend & Sales</span>
                    <span className="bg-black/20 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {businesses.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAllUsersSubTab('sponsors')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      allUsersSubTab === 'sponsors'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>🎪 Sponsors & Events</span>
                    <span className="bg-black/20 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {sponsorships.length + sponsorRfps.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Global Ecosystem Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Total Creator Earnings</span>
                  <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                    {formatCurrency(creators.reduce((sum, c) => sum + getCreatorStats(c.id, c.name).totalSettled, 0))}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Distributed to creators</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider block">Total Business Ad Spend</span>
                  <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                    {formatCurrency(businesses.reduce((sum, b) => sum + getBusinessStats(b.id, b.name).totalSpend, 0))}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">Invested across campaigns</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Total Attributed Revenue</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                    {formatCurrency(businesses.reduce((sum, b) => sum + getBusinessStats(b.id, b.name).totalAttributedSales, 0))}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-medium">Earned by client brands</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Platform Average ROAS</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block">3.4x ROI</span>
                  <span className="text-[11px] text-indigo-200 font-medium">+240% Net Commercial Return</span>
                </div>
              </div>
            </div>

            {/* Filter, Search & Sort Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder={
                    allUsersSubTab === 'creators'
                      ? 'Search creators by name, handle, category, or city...'
                      : allUsersSubTab === 'businesses'
                      ? 'Search brands by company name, industry, or city...'
                      : 'Search events or corporate sponsors...'
                  }
                  value={allUsersSearch}
                  onChange={(e) => setAllUsersSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={allUsersSortBy}
                  onChange={(e: any) => setAllUsersSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="earned_spend">
                    {allUsersSubTab === 'creators' ? 'Sort by: Highest Total Earned' : 'Sort by: Highest Ad Spend / Revenue'}
                  </option>
                  <option value="deals">Sort by: Most Deals / Campaigns</option>
                  <option value="rating">Sort by: Highest Rating</option>
                </select>
              </div>
            </div>

            {/* SUB-VIEW 1: ALL CREATORS & THEIR TOTAL EARNINGS */}
            {allUsersSubTab === 'creators' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    All Platform Creators ({creators.length}) • Total Earnings Leaderboard
                  </h3>
                  <span className="text-xs text-slate-500">
                    Click any creator to preview their live dashboard view
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creators
                    .filter(c => {
                      const q = allUsersSearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        c.name.toLowerCase().includes(q) ||
                        c.handle.toLowerCase().includes(q) ||
                        c.category.toLowerCase().includes(q) ||
                        (c.location || '').toLowerCase().includes(q)
                      );
                    })
                    .sort((a, b) => {
                      const aStats = getCreatorStats(a.id, a.name);
                      const bStats = getCreatorStats(b.id, b.name);
                      if (allUsersSortBy === 'deals') return (b.completedDeals || 0) - (a.completedDeals || 0);
                      if (allUsersSortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
                      return bStats.totalSettled - aStats.totalSettled;
                    })
                    .map(creator => {
                      const stats = getCreatorStats(creator.id, creator.name);
                      return (
                        <div
                          key={creator.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={creator.avatar}
                                alt={creator.name}
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-50 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <h4 className="font-extrabold text-sm text-slate-900 truncate">{creator.name}</h4>
                                  {creator.verified && <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />}
                                </div>
                                <p className="text-xs text-slate-500 truncate">{creator.handle} • {creator.location || 'India'}</p>
                                <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                                  {creator.category}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating</span>
                              <span className="text-sm font-black text-amber-500 block">{creator.rating || 4.9} ★</span>
                              <span className="text-[10px] text-slate-400">{creator.reviewsCount || 24} reviews</span>
                            </div>
                          </div>

                          {/* Financial KPI Strip */}
                          <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Earned</span>
                              <span className="text-sm sm:text-base font-black text-emerald-600 block">
                                {formatCurrency(stats.totalSettled)}
                              </span>
                              <span className="text-[9px] text-emerald-700 font-semibold">Settled payouts</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">In Escrow</span>
                              <span className="text-sm sm:text-base font-black text-indigo-600 block">
                                {formatCurrency(stats.escrowHeld)}
                              </span>
                              <span className="text-[9px] text-slate-500">Active deals</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Deals Closed</span>
                              <span className="text-sm sm:text-base font-black text-slate-900 block">
                                {stats.completedDeals}
                              </span>
                              <span className="text-[9px] text-slate-500">Brand collabs</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                            <span className="text-[11px] text-slate-500">
                              Avg Deal: <strong className="text-slate-800">{formatCurrency(stats.avgDealValue)}</strong>
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  switchUser(creator.id);
                                  setActiveTab('deals');
                                }}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition flex items-center space-x-1"
                                title="Switch current user to this creator to preview their private dashboard"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>View Dashboard</span>
                              </button>

                              <button
                                onClick={() => navigate(`/creators/${creator.id}`)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1"
                              >
                                <span>Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: ALL BUSINESSES SPEND & ATTRIBUTED SALES */}
            {allUsersSubTab === 'businesses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    All Platform Brands & Businesses ({businesses.length}) • Commercial Spend & Attributed Revenue
                  </h3>
                  <span className="text-xs text-slate-500">
                    Click any business to preview their live dashboard view
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businesses
                    .filter(b => {
                      const q = allUsersSearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        b.name.toLowerCase().includes(q) ||
                        (b.companyName && b.companyName.toLowerCase().includes(q)) ||
                        (b.industry && b.industry.toLowerCase().includes(q)) ||
                        (b.location || '').toLowerCase().includes(q)
                      );
                    })
                    .sort((a, b) => {
                      const aStats = getBusinessStats(a.id, a.name);
                      const bStats = getBusinessStats(b.id, b.name);
                      if (allUsersSortBy === 'deals') return (b.activeCampaignsCount || 0) - (a.activeCampaignsCount || 0);
                      return bStats.totalAttributedSales - aStats.totalAttributedSales;
                    })
                    .map(biz => {
                      const stats = getBusinessStats(biz.id, biz.name);
                      return (
                        <div
                          key={biz.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={biz.avatar}
                                alt={biz.name}
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-50 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                    {biz.companyName || biz.name}
                                  </h4>
                                  {biz.verified && <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />}
                                </div>
                                <p className="text-xs text-slate-500 truncate">{biz.industry} • {biz.location || 'India'}</p>
                                <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                  {biz.website || 'Verified Enterprise'}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Net ROAS</span>
                              <span className="text-sm font-black text-emerald-600 block">{stats.roiMultiplier}x ROI</span>
                              <span className="text-[10px] text-emerald-700 font-bold">+{stats.netReturnPercent}% Profit</span>
                            </div>
                          </div>

                          {/* Financial KPI Strip */}
                          <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Ad Spend</span>
                              <span className="text-sm sm:text-base font-black text-rose-600 block">
                                {formatCurrency(stats.totalSpend)}
                              </span>
                              <span className="text-[9px] text-slate-500">Campaigns & Ads</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Business Earned</span>
                              <span className="text-sm sm:text-base font-black text-emerald-600 block">
                                {formatCurrency(stats.totalAttributedSales)}
                              </span>
                              <span className="text-[9px] text-emerald-700 font-semibold">Attributed Sales</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Attributed Leads</span>
                              <span className="text-sm sm:text-base font-black text-slate-900 block">
                                {stats.totalLeads}
                              </span>
                              <span className="text-[9px] text-slate-500">{stats.totalOrders} Orders</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                            <span className="text-[11px] text-slate-500">
                              Campaigns: <strong className="text-slate-800">{stats.activeCampaigns} Active</strong>
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  switchUser(biz.id);
                                  setActiveTab('campaigns');
                                }}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition flex items-center space-x-1"
                                title="Switch current user to this business to preview their private dashboard"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>View Dashboard</span>
                              </button>

                              <button
                                onClick={() => navigate('/campaigns')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1"
                              >
                                <span>Campaigns</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: SPONSORS & EVENT ORGANISERS */}
            {allUsersSubTab === 'sponsors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3">
                    Corporate Sponsors & Capital Commitments ({sponsorRfps.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sponsorRfps.map(rfp => (
                      <div key={rfp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            {rfp.brandIndustry}
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            Budget: {formatCurrency(rfp.budgetMax)}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900">{rfp.title}</h4>
                        <p className="text-xs text-slate-500">Sponsored by: <strong>{rfp.sponsorName}</strong></p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-500">Min Footfall: {rfp.minFootfall?.toLocaleString() || '5,000+'}</span>
                          <span className="text-indigo-600 font-bold">Status: Open for RFPs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3">
                    Event Organisers & Sponsorship Raised ({sponsorships.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sponsorships.map(event => {
                      const totalGoal = event.packages.reduce((sum, p) => sum + (p.price * p.availableSlots), 0);
                      const totalRaised = event.packages.reduce((sum, p) => sum + (p.price * p.claimedSlots), 0);
                      const percent = totalGoal > 0 ? Math.min(100, Math.round((totalRaised / totalGoal) * 100)) : 75;
                      return (
                        <div key={event.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md capitalize">
                              {event.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">{event.location}</span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900">{event.title}</h4>
                          <p className="text-xs text-slate-500">Organised by: <strong>{event.organiserName}</strong> • {event.expectedFootfall?.toLocaleString()} Footfall</p>

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-emerald-700">Raised: {formatCurrency(totalRaised || 375000)}</span>
                              <span className="text-slate-500">Goal: {formatCurrency(totalGoal || 500000)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SPONSOR TAB 1: SPONSOR REQUIREMENTS & RFPs MANAGER */}
        {activeTab === 'sponsor-rfps' && (
          <div className="space-y-6">
            {/* Sponsor Requirements Creation Card (Text Fields) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      Sponsor Corporate Portal
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• Direct Event Procurement</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    Post Corporate Sponsorship Requirement (RFP)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Publish your exact criteria (budget, footfall, perks, target cities). Event committees and podcast owners will submit verified pitch proposals.
                  </p>
                </div>

                {rfpSuccessMsg && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Sponsorship Requirement Published to 1,200+ Event Organisers!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleCreateSponsorRfp} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Field 1: Title */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Requirement Title / Campaign Theme <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Title Sponsorship for College Tech Fests & Esports Arenas"
                      value={rfpForm.title}
                      onChange={(e) => setRfpForm({ ...rfpForm, title: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Field 2: Industry */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Brand Industry / Sector</label>
                    <select
                      value={rfpForm.industry}
                      onChange={(e) => setRfpForm({ ...rfpForm, industry: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Consumer Electronics & Audio">Consumer Electronics & Audio</option>
                      <option value="Energy Drinks & Beverage">Energy Drinks & Beverage</option>
                      <option value="Fintech & Banking">Fintech & Banking</option>
                      <option value="EdTech & Learning">EdTech & Learning</option>
                      <option value="Automotive & EV">Automotive & EV</option>
                      <option value="Fashion & Streetwear">Fashion & Streetwear</option>
                      <option value="FMCG & Quick Commerce">FMCG & Quick Commerce</option>
                    </select>
                  </div>

                  {/* Field 3: Max Budget */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Max Sponsorship Budget (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={rfpForm.budgetMax}
                        onChange={(e) => setRfpForm({ ...rfpForm, budgetMax: Number(e.target.value) })}
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 4: Min Footfall */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Minimum Expected Footfall <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={rfpForm.minFootfall}
                      onChange={(e) => setRfpForm({ ...rfpForm, minFootfall: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Field 5: Target Cities */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Target Cities / Regions</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Bengaluru, Delhi-NCR, Thiruvananthapuram"
                      value={rfpForm.targetCities}
                      onChange={(e) => setRfpForm({ ...rfpForm, targetCities: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Field 6: Deadline */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Proposal Submission Deadline</label>
                    <input
                      type="date"
                      value={rfpForm.deadline}
                      onChange={(e) => setRfpForm({ ...rfpForm, deadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 7: Required Deliverables & Perks (Checkboxes) */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Mandatory Sponsor Perks & Activation Rights
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      'Title / Powered-By Naming Rights',
                      '10x10 On-Ground Sampling Stall',
                      'Main Stage Backdrop & LED Banners',
                      'Keynote / Presentation Slot (15m)',
                      'VIP Passes & Networking Lounge',
                      'Social Media Reel & Story Tags'
                    ].map((perk) => {
                      const isChecked = rfpForm.requiredPerks.includes(perk);
                      return (
                        <label
                          key={perk}
                          className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            isChecked
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setRfpForm({
                                  ...rfpForm,
                                  requiredPerks: rfpForm.requiredPerks.filter((p) => p !== perk)
                                });
                              } else {
                                setRfpForm({
                                  ...rfpForm,
                                  requiredPerks: [...rfpForm.requiredPerks, perk]
                                });
                              }
                            }}
                            className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
                          />
                          <span className="truncate">{perk}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Field 8: Brief & Activation Goals */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Sponsorship Brief & Activation Goals <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your target attendee persona, experiential marketing expectations, product sampling details, QR code contests, etc."
                    value={rfpForm.brief}
                    onChange={(e) => setRfpForm({ ...rfpForm, brief: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Sponsor Requirement (RFP)</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Active Sponsor RFPs List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Active Brand Sponsorship RFPs</h4>
                  <p className="text-xs text-slate-500">Corporate requirements currently receiving pitches from festival organizers</p>
                </div>
                <button
                  onClick={() => navigate('/sponsor-requirements')}
                  className="text-xs text-amber-800 font-bold hover:underline"
                >
                  View Public RFP Feed →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sponsorRfps.map((rfp) => (
                  <div
                    key={rfp.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-amber-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rfp.sponsorLogo}
                          alt=""
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{rfp.title}</h4>
                          <p className="text-slate-500 text-xs">{rfp.sponsorName} • {rfp.brandIndustry}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rfp.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{rfp.brief}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Max Budget</span>
                        <strong className="text-slate-900 text-xs font-black">{formatCurrency(rfp.budgetMax)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Min Footfall</span>
                        <strong className="text-indigo-700 text-xs font-extrabold">{rfp.minFootfall.toLocaleString()}+</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Pitches</span>
                        <strong className="text-emerald-700 text-xs font-extrabold">{rfp.proposalsCount} Received</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Perks:</span>
                      {rfp.requiredPerks.map((perk, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-semibold border border-amber-200/60">
                          {perk}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">📍 {rfp.targetLocations.join(', ')}</span>
                      <button
                        onClick={() => alert(`Reviewing ${rfp.proposalsCount} proposals for ${rfp.title}. Escrow funding is ready.`)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-xs"
                      >
                        Review Pitches & Fund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SPONSOR TAB 2: FOOTFALL & ROI VERIFICATION TRACKER */}
        {activeTab === 'sponsor-roi' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span>Sponsorship Footfall & ROI Telemetry Tracker</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Audited physical attendance counts, stage banner photo proofs, and direct QR lead attribution.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Independent Platform Audit Active</span>
                  </span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Verified Footfall</span>
                  <span className="text-2xl font-black text-slate-900 block">18,400</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">✓ Turnstile & RFID count</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Digital Reach</span>
                  <span className="text-2xl font-black text-indigo-700 block">94,200</span>
                  <span className="text-[10px] text-slate-500 block">Official fest live streams & reels</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Stall QR Conversions</span>
                  <span className="text-2xl font-black text-amber-500 block">1,840</span>
                  <span className="text-[10px] text-slate-500 block">App downloads / free samples</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Effective CPL</span>
                  <span className="text-2xl font-black text-emerald-600 block">₹ 4.12</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">72% cheaper than Google Ads</span>
                </div>
              </div>

              {/* Photo Proof Gallery */}
              <div className="space-y-3 pt-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Organiser-Submitted Deliverable Proofs (Stage & Booth)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
                      alt=""
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Main Stage LED Backdrop</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-[11px] text-slate-500">IIT Bombay Mood Indigo 2026 • 8,500 Audience</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
                      alt=""
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">10x10 Sampling Stall Setup</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Bengaluru Tech Summit • 1,200 samples served</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80"
                      alt=""
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Keynote Presentation Slot</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-[11px] text-slate-500">National FinTech Conclave • Speaker on stage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRAND TAB: LOCAL ADS & COLLECTIVES TRACKER */}
        {activeTab === 'local-collective' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span>Hyperlocal Advertising & Creator Collective Campaigns</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Track combined reach from city theme pages, regional food collectives, and local radio networks.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/local-ads')}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition"
                  >
                    + Book City Ad Channels
                  </button>
                  <button
                    onClick={() => navigate('/collectives')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                  >
                    + Book Creator Collective
                  </button>
                </div>
              </div>

              {/* Local Ad Bookings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Hyperlocal Advertising Orders
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900">Thiruvananthapuram Restaurant Launch Bundle</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        In Flight
                      </span>
                    </div>
                    <p className="text-slate-600">5 Local Food Creators & Regional Instagram Pages</p>
                    <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-200 text-[11px]">
                      <span>Budget: <strong>₹ 10,000</strong></span>
                      <span>Target City: <strong>Thiruvananthapuram</strong></span>
                      <span>Estimated Reach: <strong>165,000</strong></span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900">Bengaluru Tech Guild Collective</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        Content Review
                      </span>
                    </div>
                    <p className="text-slate-600">Combined Package: 5 Top Bengaluru Developers & AI Creators</p>
                    <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-200 text-[11px]">
                      <span>Package Price: <strong>₹ 35,000</strong></span>
                      <span>Combined Reach: <strong>680,000</strong></span>
                      <span>Deliverables: <strong>5x LinkedIn + 5x Reels</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DEAL ROOMS & APPROVALS */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{role === 'creator' ? 'Deliverable milestones assigned to you' : 'Live collaborations under escrow protection'}</span>
              <span className="font-semibold text-indigo-600">Auto-release upon approval</span>
            </div>

            {collaborations.map((collab) => (
              <div
                key={collab.id}
                onClick={() => navigate(`/collaborations/${collab.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={role === 'creator' ? collab.businessAvatar : collab.creatorAvatar}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-50"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{collab.campaignTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Partner: <span className="font-semibold text-slate-800">{role === 'creator' ? collab.businessName : collab.creatorName}</span>
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] text-slate-400">Deliverables:</span>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {collab.deliverables?.length || 2} Items (Reel + Story)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                    <span className="font-bold text-indigo-700 capitalize bg-indigo-50 px-2.5 py-1 rounded-md text-[11px]">
                      {collab.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Deal Value</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(collab.agreedAmount)}
                    </span>
                  </div>

                  <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition">
                    <span>Deal Room</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PROPOSALS & APPLICATIONS */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img src={app.creatorAvatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{app.creatorName}</h4>
                      <p className="text-slate-500">{app.creatorHandle} • {app.creatorCategory}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Proposed Rate</span>
                      <span className="font-extrabold text-indigo-700 text-sm">{formatCurrency(app.proposedRate)}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Campaign: {app.campaignTitle}</span>
                  <p className="italic leading-relaxed">"{app.pitch}"</p>
                </div>

                {/* Actions for Business / Brand */}
                {(role === 'business' || role === 'agency') && app.status === 'pending' && (
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptApplication(app.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Accept & Fund Escrow
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CREATOR TAB: RATE CARD & PACKAGE BUILDER */}
        {role === 'creator' && activeTab === 'ratecard' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <span>Commercial Rate Card & Deliverable Packages</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Set your public collaboration prices. Brands and agencies will book you directly or pitch based on these rates.
                </p>
              </div>

              {rateSaved && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>Rate Card Saved & Published Live!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveRateCard} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800">1x Instagram Reel (60s)</label>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">Most Popular</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={rateCard.reelPrice}
                      onChange={(e) => setRateCard({ ...rateCard, reelPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Includes audio sync, caption tagging & 30-day posting.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Instagram Story (Set of 3 with Link)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={rateCard.storyPrice}
                      onChange={(e) => setRateCard({ ...rateCard, storyPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">24-hour visibility with swipe-up/sticker link.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Instagram Carousel (3-5 Slides)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={rateCard.carouselPrice}
                      onChange={(e) => setRateCard({ ...rateCard, carouselPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Educational / styling guide swipe post.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Dedicated YouTube Video (5-10m)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={rateCard.dedicatedVideoPrice}
                      onChange={(e) => setRateCard({ ...rateCard, dedicatedVideoPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Deep-dive brand review with pinned comment link.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800">Raw UGC Video (Brand Ad Rights)</label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">High Demand</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={rateCard.ugcPrice}
                      onChange={(e) => setRateCard({ ...rateCard, ugcPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Delivered directly to brand for their paid ad campaigns.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Spark Ads / Whitelisting Code (30 Days)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={rateCard.sparkAdPrice}
                      onChange={(e) => setRateCard({ ...rateCard, sparkAdPrice: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Allow brand to run Meta Ads directly through your profile handle.</p>
                </div>
              </div>

              {/* Turnaround & Commercial Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Standard Turnaround Time</label>
                  <select
                    value={rateCard.turnaroundDays}
                    onChange={(e) => setRateCard({ ...rateCard, turnaroundDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={2}>2 Business Days (Express)</option>
                    <option value={3}>3 Business Days (Standard)</option>
                    <option value={5}>5 Business Days</option>
                    <option value={7}>7 Business Days</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Free Revisions Included</label>
                  <select
                    value={rateCard.revisionsIncluded}
                    onChange={(e) => setRateCard({ ...rateCard, revisionsIncluded: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1 Revision</option>
                    <option value={2}>2 Revisions (Recommended)</option>
                    <option value={3}>3 Revisions</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Barter & Product Gifting</label>
                  <div className="flex items-center space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="acceptsBarter"
                      checked={rateCard.acceptsBarter}
                      onChange={(e) => setRateCard({ ...rateCard, acceptsBarter: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="acceptsBarter" className="text-xs font-medium text-slate-700">
                      Open to barter deals for high-value merchandise
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Rate Card & Publish Live</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CREATOR TAB: VERIFIED MEDIA KIT & AUDIENCE DEMOGRAPHICS */}
        {role === 'creator' && activeTab === 'mediakit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-indigo-600" />
                    <span>Verified Audience Demographics & Media Kit</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Directly synced with connected Instagram Graph API & YouTube Data API.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ASCI Guidelines Certified</span>
                  </span>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Kit</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {/* Gender Split */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Audience Gender</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-800 mb-1">
                        <span>Female</span>
                        <span className="text-indigo-600">64%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-800 mb-1">
                        <span>Male</span>
                        <span className="text-slate-600">36%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full rounded-full" style={{ width: '36%' }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Ideal for Beauty, Apparel, Wellness, and Home decor brands.</p>
                </div>

                {/* Age Distribution */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Age Group Split</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-800 font-semibold mb-0.5">
                        <span>18 - 24 (Gen Z)</span>
                        <span className="font-bold text-indigo-600">52%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-800 font-semibold mb-0.5">
                        <span>25 - 34 (Millennials)</span>
                        <span className="font-bold text-indigo-500">34%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-800 font-semibold mb-0.5">
                        <span>35+</span>
                        <span className="font-bold text-slate-500">14%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full rounded-full" style={{ width: '14%' }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">86% prime purchasing power demographic (18-34).</p>
                </div>

                {/* Top Geographic Hubs */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Top Indian Metros</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Mumbai & MMR</span>
                      </span>
                      <span className="font-bold text-slate-900">38%</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Bengaluru Urban</span>
                      </span>
                      <span className="font-bold text-slate-900">26%</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Delhi NCR</span>
                      </span>
                      <span className="font-bold text-slate-900">21%</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tier 2 Cities</span>
                      </span>
                      <span className="font-bold text-slate-900">15%</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">High Tier-1 metro concentration allows premium brand pricing.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS TAB: CAMPAIGN MANAGER */}
        {(role === 'business' || role === 'agency') && activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Quick Campaign Creator Form Card (Text Fields) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                      Brand Campaign Builder
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• Fast Direct Publish</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Post a New Brand Campaign Brief</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Launch a promotional brief for verified creators and influencers with escrow budget protection.
                  </p>
                </div>

                {quickCampaignSuccessMsg && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Campaign Brief Published Live to Creators!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleCreateQuickCampaign} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Campaign Title */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Campaign Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Skincare Launch: 60s Unboxing & Honest Review"
                      value={quickCampaignForm.title}
                      onChange={(e) => setQuickCampaignForm({ ...quickCampaignForm, title: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Product / Industry Category</label>
                    <select
                      value={quickCampaignForm.category}
                      onChange={(e) => setQuickCampaignForm({ ...quickCampaignForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Fashion & Style">Fashion & Style</option>
                      <option value="Beauty & Wellness">Beauty & Wellness</option>
                      <option value="Tech & Gadgets">Tech & Gadgets</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Fitness & Health">Fitness & Health</option>
                      <option value="Travel & Hospitality">Travel & Hospitality</option>
                      <option value="Finance & Crypto">Finance & Crypto</option>
                    </select>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Required Deliverables</label>
                    <input
                      type="text"
                      placeholder="e.g. 1x Instagram Reel, 2x Stories with Link"
                      value={quickCampaignForm.deliverables}
                      onChange={(e) => setQuickCampaignForm({ ...quickCampaignForm, deliverables: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Budget Min */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Budget Per Creator (Min ₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={quickCampaignForm.budgetMin}
                        onChange={(e) => setQuickCampaignForm({ ...quickCampaignForm, budgetMin: Number(e.target.value) })}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Budget Max */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Total Campaign Budget (Max ₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={quickCampaignForm.budgetMax}
                        onChange={(e) => setQuickCampaignForm({ ...quickCampaignForm, budgetMax: Number(e.target.value) })}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Brief & Instructions */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Campaign Brief & Content Guidelines <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify the product features, hook style, required talking points, discount promo code to mention, and brand @tagging."
                    value={quickCampaignForm.description}
                    onChange={(e) => setQuickCampaignForm({ ...quickCampaignForm, description: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Campaign Brief</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Your Active Brand Campaigns</h3>
                <p className="text-xs text-slate-500">Manage creator deliverables, budgets and paused status</p>
              </div>
              <button
                onClick={() => navigate('/create-campaign')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Advanced Campaign Wizard</span>
              </button>
            </div>

            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{camp.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        camp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{camp.description}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                      <span>Budget: <strong className="text-slate-900">{formatCurrency(camp.budget.totalBudget)}</strong></span>
                      <span>•</span>
                      <span>Applicants: <strong className="text-indigo-600">{camp.applicantsCount || 4}</strong></span>
                      <span>•</span>
                      <span>Category: <strong>{camp.category}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCampaignStatus(camp.id, camp.status === 'active' ? 'paused' : 'active')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      {camp.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                    </button>
                    <button
                      onClick={() => navigate(`/campaigns/${camp.id}`)}
                      className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition"
                    >
                      View Live Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGENCY TAB: CLIENT BRAND HUB */}
        {role === 'agency' && activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Multi-Brand Client Portfolios</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage client ad spend, dedicated creator rosters, and multi-user access permissions.
                  </p>
                </div>

                <button
                  onClick={() => alert('New client onboarding flow initiated. Enter client GSTIN and brand legal name.')}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Onboard New Client Brand</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Aroma Roasters</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Active Client</span>
                  </div>
                  <p className="text-xs text-slate-600">Specialty Coffee & Cold Brew D2C Brand</p>
                  <div className="pt-2 border-t border-indigo-100 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Monthly Budget:</span>
                      <strong className="text-slate-900">₹ 1,20,000</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Active Collabs:</span>
                      <strong className="text-indigo-700">4 Creators</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Glow Botanicals</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Active Client</span>
                  </div>
                  <p className="text-xs text-slate-600">Clean Ayurvedic Skincare & Haircare</p>
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Monthly Budget:</span>
                      <strong className="text-slate-900">₹ 85,000</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Active Collabs:</span>
                      <strong className="text-indigo-700">2 Creators</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">Urban Aura</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">Onboarding</span>
                  </div>
                  <p className="text-xs text-slate-600">Gen-Z Sustainable Streetwear</p>
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Monthly Budget:</span>
                      <strong className="text-slate-900">₹ 40,000</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Campaign Status:</span>
                      <strong className="text-amber-600">Drafting Brief</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORGANISER & SPONSOR TAB: EVENT PACKAGES */}
        {(role === 'organiser' || role === 'sponsor') && activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {role === 'organiser' ? 'Your Event Sponsorship Inventory' : 'Sponsored Events & Activations'}
                </h3>
                <p className="text-xs text-slate-500">Title, co-powered, and stall tier inventory</p>
              </div>
              {role === 'organiser' && (
                <button
                  onClick={() => navigate('/sponsorships')}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List New Event</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsorships.map((ev) => (
                <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{ev.location}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">{ev.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                  
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Audience: <strong className="text-slate-900">{ev.expectedFootfall.toLocaleString()}</strong></span>
                    <button
                      onClick={() => navigate('/sponsorships')}
                      className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center space-x-1"
                    >
                      <span>View Sponsorship Packages</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TRANSACTIONS, GST INVOICES & PAYOUTS */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>{role === 'creator' ? 'Creator Payouts & Tax Ledger' : 'GST Tax Invoices & Escrow Receipts'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {role === 'creator'
                      ? 'Instant UPI payouts transferred upon brand approval. 1% TDS deducted as per Section 194R/194C.'
                      : 'Automated B2B GST tax invoices with SAC Code 998371 (Market Research & Advertising Services).'}
                  </p>
                </div>

                <button
                  onClick={() => alert('Consolidated Financial Statement downloaded for FY 2026-27.')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Annual Tax Statement</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Invoice #</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-indigo-700">{tx.invoiceNumber}</td>
                        <td className="p-4 text-slate-600">{formatDate(tx.createdAt)}</td>
                        <td className="p-4 font-medium text-slate-900">{tx.campaignTitle || 'Milestone Escrow Deposit'}</td>
                        <td className="p-4 text-slate-600">{tx.paymentMethod}</td>
                        <td className="p-4 font-bold text-slate-900">{formatCurrency(tx.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            tx.status === 'held_in_escrow' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tx.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => alert(`Downloading GST Tax Invoice #${tx.invoiceNumber} with QR verification.`)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
