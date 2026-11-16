import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  Star,
  Users,
  Briefcase,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  DollarSign,
  HelpCircle,
  Check,
  Building,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCompactNumber } from '../utils';

export const LandingPage: React.FC = () => {
  const { creators, campaigns, switchRole, isLoggedIn, setShowLoginModal, currentUser } = useApp();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'creator') {
      if (localSearch.trim()) {
        navigate(`/campaigns?search=${encodeURIComponent(localSearch.trim())}`);
      } else {
        navigate('/campaigns');
      }
    } else {
      if (localSearch.trim()) {
        navigate(`/creators?search=${encodeURIComponent(localSearch.trim())}`);
      } else {
        navigate('/creators');
      }
    }
  };

  const featuredCreators = creators.slice(0, 4);
  const featuredCampaigns = campaigns.filter(c => c.isFeatured).slice(0, 3);

  const categories = [
    { name: 'Fashion & Style', icon: '👗', count: '4,200+ Creators' },
    { name: 'Tech & Gadgets', icon: '⚡', count: '2,800+ Creators' },
    { name: 'Food & Dining', icon: '🍲', count: '3,100+ Creators' },
    { name: 'Beauty & Skincare', icon: '✨', count: '3,600+ Creators' },
    { name: 'Fitness & Health', icon: '💪', count: '2,400+ Creators' },
    { name: 'Travel & Stays', icon: '✈️', count: '1,900+ Creators' },
    { name: 'Finance & FinTech', icon: '📈', count: '1,200+ Creators' },
    { name: 'College Events & Fests', icon: '🎪', count: '850+ Opportunities' }
  ];

  const faqs = [
    {
      q: 'How does payment protection and escrow work on co-lab?',
      a: 'When a brand hires a creator or approves a campaign proposal, funds are securely deposited into milestone escrow. The creator produces the content with peace of mind knowing the funds are locked. Once the business approves the delivered asset, payment is settled directly to the creator UPI or bank account.'
    },
    {
      q: 'Can a small local shop or boutique hire creators on a low budget?',
      a: 'Absolutely! co-lab was built specifically to eliminate high agency minimums. Local boutiques, cafes, and independent shops regularly book hyper-local creators and UGC videos starting from just ₹1,000.'
    },
    {
      q: 'What is the platform fee?',
      a: 'co-lab charges a transparent 8% marketplace platform fee on successfully settled collaborations. There are no hidden transaction markups or forced agency retainer contracts.'
    },
    {
      q: 'How does co-lab verify creator audience authenticity?',
      a: 'We evaluate social metrics, authentic engagement rates, historical campaign reviews, and audience demographics. Creators with verified performance receive the Verified badge.'
    },
    {
      q: 'What can college festival and event organisers do on co-lab?',
      a: 'Organisers can publish their sponsorship deck, delineate sponsorship tiers (Title, Presenting, Gold, Product Partner), and directly receive sponsorship proposals from national brands looking for youth footfall.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        <div className="absolute inset-0 bg-radial-pattern opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center space-x-2 bg-indigo-100/80 border border-indigo-200 text-indigo-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Multi-Vendor Creator Economy & Advertising Ecosystem</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Every Creator Deserves an Opportunity.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800">
                Every Business Deserves an Audience.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover verified creators, find high-paying brand collaborations, launch advertising campaigns, book ad inventory, and secure college event sponsors — all in one unified marketplace.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-premium border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <Search className="w-5 h-5 text-slate-600 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder={
                    currentUser?.role === 'creator'
                      ? "Search brand advertising campaigns, sponsorships, RFPs..."
                      : "Search creators (e.g. fashion in Mumbai, tech reviews, budget under ₹3,000)..."
                  }
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shrink-0 flex items-center space-x-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Two Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  switchRole('creator');
                  navigate('/campaigns');
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-200 transition flex items-center justify-center space-x-2"
              >
                <span>Find Collaborations</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  switchRole('business');
                  navigate('/create-campaign');
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition flex items-center justify-center space-x-2"
              >
                <span>Promote Your Business</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Milestone Escrow Protection</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Local Promos from ₹1,000</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Zero Hidden Agency Markup</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE INTERCONNECTED MARKETPLACES */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Three Unified Marketplaces
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              One Engine. Every Commercial Collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Marketplace A: Creator Marketplace */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-300 transition hover:shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                🎨
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Creator Marketplace</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Creators discover paid brand sponsorships, showcase media kits, sell rate cards, list ad slots, and connect with verified brands.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom rate cards for Reels, Stories & Videos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Audience verified demographics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Guaranteed timely payouts via UPI/bank</span>
                </li>
              </ul>
              <Link
                to="/creators"
                className="text-xs font-bold text-indigo-600 flex items-center space-x-1 group-hover:translate-x-1 transition"
              >
                <span>Browse Creator Profiles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Marketplace B: Business Promotion Marketplace */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-300 transition hover:shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                🏢
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Business Promotion</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Boutiques, cafes, DTC brands and enterprises publish campaigns, filter creators by city & audience, and track deliverables in live deal rooms.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>6-Step Campaign Creation Wizard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Deal room with live deliverable reviews</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>GST compliant tax invoicing</span>
                </li>
              </ul>
              <Link
                to="/campaigns"
                className="text-xs font-bold text-indigo-600 flex items-center space-x-1 group-hover:translate-x-1 transition"
              >
                <span>Explore Open Campaigns</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Marketplace C: Sponsorship Marketplace */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-300 transition hover:shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                🎪
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sponsorships & Events</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Find sponsors for college festivals, podcasts, YouTube channels, esports tournaments, and offline conferences with clear tier packages.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Title, Presenting, Gold & Product Partner tiers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct organiser-to-brand proposal dealmaking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Footfall & attendee demographic profiles</span>
                </li>
              </ul>
              <Link
                to="/sponsorships"
                className="text-xs font-bold text-indigo-600 flex items-center space-x-1 group-hover:translate-x-1 transition"
              >
                <span>Discover Sponsorship Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CREATORS (HIDDEN FOR CREATORS - ONLY SHOWN TO BRANDS & VISITORS) */}
      {currentUser?.role !== 'creator' && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                Top Talent
              </h2>
              <p className="text-3xl font-extrabold text-slate-900">
                Featured Verified Creators
              </p>
            </div>
            <Link
              to="/creators"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mt-2 sm:mt-0"
            >
              <span>View all 20+ creators</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {featuredCreators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLoginModal(true);
                  } else {
                    navigate(`/creators/${creator.id}`);
                  }
                }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* 1st image as background banner */}
                  <div className="h-36 sm:h-40 w-full relative bg-slate-100 overflow-hidden">
                    <img
                      src={creator.coverImage}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10 shadow-xs">
                      {creator.category}
                    </div>
                  </div>

                  {/* Avatar & Info with Avatar in FRONT */}
                  <div className="px-5 pb-5 pt-0 flex-1 flex flex-col relative z-20">
                    <div className="-mt-12 sm:-mt-14 mb-3.5 flex items-end justify-between relative z-30">
                      <div className="relative">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl bg-white relative z-30"
                        />
                        {creator.verified && (
                          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-0.5 rounded-full ring-2 ring-white z-40" title="Verified Creator">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 bg-amber-50/90 backdrop-blur-xs text-amber-800 text-xs font-bold px-2.5 py-1 rounded-xl border border-amber-200/80 shadow-xs relative z-30">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{creator.rating.toFixed(1)}</span>
                        <span className="text-slate-500 text-[10px]">({creator.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-indigo-600 transition">
                        {creator.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{creator.handle}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {creator.bio}
                    </p>

                    {/* Social Metrics */}
                    <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl mb-4 border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Audience</span>
                        <span className="font-bold text-slate-800">
                          {formatCompactNumber(creator.socialAccounts[0]?.followersCount || 10000)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Engagement</span>
                        <span className="font-bold text-emerald-600">
                          {creator.socialAccounts[0]?.engagementRate || 5.2}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                      {isLoggedIn ? 'Starting from' : 'Indicative rate'}
                    </span>
                    <span className="font-extrabold text-indigo-700 text-sm">
                      {formatCurrency(creator.minPrice)}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs hover:shadow-indigo-200">
                    {isLoggedIn ? 'View Media Kit →' : 'Log In to View 🔒'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED OPEN CAMPAIGNS */}
      <section className="py-16 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                Open Opportunities
              </h2>
              <p className="text-3xl font-extrabold text-slate-900">
                Active Brand Advertising Campaigns
              </p>
            </div>
            <Link
              to="/campaigns"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mt-2 sm:mt-0"
            >
              <span>View all 10+ campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCampaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => navigate('/campaigns')}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={camp.businessLogo}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {camp.businessName}
                        </span>
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {camp.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {camp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                      📱 {camp.requirements.platform}
                    </span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      🎬 {camp.requirements.contentFormat}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-600 block uppercase font-semibold">Compensation</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(camp.budget.minAmount)} - {formatCurrency(camp.budget.maxAmount)}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg transition">
                    Apply Now
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR CATEGORIES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
            Browse By Niche
          </h2>
          <p className="text-3xl font-extrabold text-slate-900">
            Popular Business Categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/creators?category=${encodeURIComponent(cat.name)}`)}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex items-center space-x-3.5"
            >
              <div className="text-2xl">{cat.icon}</div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-600">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW CO-LAB WORKS */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
              End-To-End Workflow
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              How co-lab Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-200">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Post or Discover</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Businesses publish campaigns with target demographics. Creators search open campaigns or get direct invites.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-200">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Escrow & Agreement</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once a proposal is accepted, deal terms are locked. Business deposits funds into secure platform milestone escrow.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-200">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Deliverable Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Creator uploads draft reels or video previews in the private Deal Room. Brand requests revisions or approves.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-200">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base">Settlement & Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Payment settles automatically to creator UPI/Bank. Both parties leave verified 2-way reviews with trust badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PLATFORM STATISTICS */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">24,800+</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Verified Content Creators</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">₹4.8 Cr+</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Commercial Collab GMV</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">4,200+</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">MSME Brands & Boutiques</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">99.4%</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Escrow Payout Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING PLANS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
            Transparent Pricing
          </h2>
          <p className="text-3xl font-extrabold text-slate-900">
            Plans for Creators & Businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Creator Free */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Creator Free</span>
              <div className="text-3xl font-black text-slate-900 mt-2 mb-4">₹0 <span className="text-xs text-slate-600 font-normal">/ month</span></div>
              <p className="text-xs text-slate-600 mb-6">Everything you need to create your media kit and apply for brand campaigns.</p>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Public Media Kit & Rate Card</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Unlimited Campaign Applications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Deal Room & Protected Escrow Payouts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Standard 8% Platform Commission</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => { switchRole('creator'); navigate('/dashboard'); }}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
            >
              Get Started Free
            </button>
          </div>

          {/* Business Growth (Highlighted) */}
          <div className="bg-white rounded-2xl border-2 border-indigo-600 p-8 shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Popular for Brands
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Business Growth</span>
              <div className="text-3xl font-black text-slate-900 mt-2 mb-4">₹1,999 <span className="text-xs text-slate-600 font-normal">/ month</span></div>
              <p className="text-xs text-slate-600 mb-6">For growing businesses seeking active influencer campaigns and high ROI.</p>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Post Unlimited Campaigns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Direct Creator Messaging & Invites</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>AI Creator Matching & Brief Generator</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Automated GST Tax Invoices</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => { switchRole('business'); navigate('/create-campaign'); }}
              className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-200"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Agency & Enterprise */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Agency Scale</span>
              <div className="text-3xl font-black text-slate-900 mt-2 mb-4">₹6,999 <span className="text-xs text-slate-600 font-normal">/ month</span></div>
              <p className="text-xs text-slate-600 mb-6">For digital agencies and brands managing rosters of multiple client accounts.</p>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Multi-Client Account Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Team Permissions & Delegated Access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Bulk Creator Export & White-label Reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Dedicated Account Manager</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => { switchRole('agency'); navigate('/dashboard'); }}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
              Have Questions?
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-bold text-slate-900 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-600 transition-transform ${
                      activeFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL REGISTRATION CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Unlock Commercial Growth on co-lab?
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto">
            Join thousands of creators, boutiques, national brands and event organisers conducting business smoothly without middleman bloat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => { switchRole('creator'); navigate('/creators'); }}
              className="px-7 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl text-sm transition shadow-lg"
            >
              Join as a Creator
            </button>
            <button
              onClick={() => { switchRole('business'); navigate('/create-campaign'); }}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition border border-indigo-400"
            >
              Post a Brand Campaign
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

