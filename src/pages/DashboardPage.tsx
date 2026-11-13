import React, { useState } from 'react';
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
  Tag
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
    switchSubProfile
  } = useApp();
  const navigate = useNavigate();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<string>('deals');

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

  const handleSaveRateCard = (e: React.FormEvent) => {
    e.preventDefault();
    setRateSaved(true);
    setTimeout(() => setRateSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Role Switcher Toolbar for Quick Testing & Multitasking */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <p className="text-xs font-semibold text-indigo-200">Switch Workspace View & Persona</p>
              <p className="text-sm font-extrabold text-white">
                Currently operating as: <span className="capitalize text-amber-300 font-black">{role}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(['creator', 'business', 'agency', 'organiser', 'sponsor'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  switchRole(r);
                  setActiveTab('deals');
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
                <span className="text-2xl font-black text-slate-900 mt-1 block">₹ 14,220</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">3 Completed Collabs</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Escrow In-Progress</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">₹ 3,220</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Secured on platform</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Deal Rooms</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{userCollaborations.length}</span>
                <span className="text-[11px] text-indigo-600 block mt-0.5">Deliverables pending</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Reputation Rating</span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">4.9 ★</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">38 Verified Brand Reviews</span>
              </div>
            </>
          )}

          {role === 'business' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Campaigns</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{campaigns.length}</span>
                <span className="text-[11px] text-emerald-600 block mt-0.5">Open for applications</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Creator Applications</span>
                <span className="text-2xl font-black text-indigo-700 mt-1 block">{applications.length}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Proposals received</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Deal Rooms</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{collaborations.length}</span>
                <span className="text-[11px] text-indigo-600 block mt-0.5">Escrow funded</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Managed Spend</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">₹ 85,000</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">GST Tax Invoices ready</span>
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

        {/* Role-Specific Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-200 overflow-x-auto text-xs sm:text-sm font-semibold pb-1 scrollbar-none">
          {/* Common / Deal Room Tab */}
          <button
            onClick={() => setActiveTab('deals')}
            className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'deals'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {role === 'creator' ? `Active Deal Rooms (${userCollaborations.length})` : `Deal Rooms & Approvals (${collaborations.length})`}
          </button>

          {/* Role Tab 2 */}
          <button
            onClick={() => setActiveTab('proposals')}
            className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'proposals'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {role === 'creator' ? `My Pitches & Invites (${userApplications.length})` : `Creator Applications (${applications.length})`}
          </button>

          {/* Role Tab 3: Creator Rate Card OR Business Campaigns OR Agency Clients */}
          {role === 'creator' && (
            <>
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
            </>
          )}

          {(role === 'business' || role === 'agency') && (
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'campaigns'
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>My Campaigns ({campaigns.length})</span>
            </button>
          )}

          {role === 'agency' && (
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
          )}

          {(role === 'organiser' || role === 'sponsor') && (
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'events'
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Event Sponsorship Packages ({sponsorships.length})</span>
            </button>
          )}

          {/* Common / Financial Tab */}
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-3 sm:px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {role === 'creator' ? 'Payouts & UPI' : 'GST Invoices & Escrow'} ({transactions.length})
          </button>
        </div>

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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Your Active Brand Campaigns</h3>
                <p className="text-xs text-slate-500">Manage creator deliverables, budgets and paused status</p>
              </div>
              <button
                onClick={() => navigate('/create-campaign')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Campaign</span>
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
