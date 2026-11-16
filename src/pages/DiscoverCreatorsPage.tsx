import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpDown,
  X,
  Share2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreatorProfile } from '../types';
import { formatCurrency, formatCompactNumber } from '../utils';

export const DiscoverCreatorsPage: React.FC = () => {
  const { creators, settings, isLoggedIn, setShowLoginModal, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Creators do not browse competitor creators; immediately redirect them to Open Brand Campaigns
  useEffect(() => {
    if (currentUser?.role === 'creator') {
      navigate('/campaigns', { replace: true });
    }
  }, [currentUser?.role, navigate]);

  const handleViewProfile = (creatorId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(`/creators/${creatorId}`);
    }
  };

  // Filters state
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'followers' | 'rating' | 'price_asc' | 'price_desc'>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Comparison drawer state
  const [comparedCreators, setComparedCreators] = useState<CreatorProfile[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const categories = ['All', ...settings.categories];
  const platforms = ['All', 'instagram', 'youtube', 'x', 'linkedin'];

  // If creator, do not render creator directory
  if (currentUser?.role === 'creator') {
    return null;
  }

  // Filter & sort logic
  const filteredCreators = useMemo(() => {
    return creators
      .filter((creator) => {
        // category
        if (selectedCategory !== 'All' && creator.category !== selectedCategory) {
          return false;
        }
        // search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = creator.name.toLowerCase().includes(q);
          const matchHandle = creator.handle.toLowerCase().includes(q);
          const matchBio = (creator.bio || '').toLowerCase().includes(q);
          const matchCity = (creator.location || '').toLowerCase().includes(q);
          if (!matchName && !matchHandle && !matchBio && !matchCity) return false;
        }
        // platform
        if (selectedPlatform !== 'All') {
          const hasPlatform = creator.socialAccounts.some(s => s.platform.toLowerCase() === selectedPlatform.toLowerCase());
          if (!hasPlatform) return false;
        }
        // price
        if (creator.minPrice > maxPrice) return false;
        // rating
        if (creator.rating < minRating) return false;
        // verified
        if (verifiedOnly && !creator.verified) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'followers') {
          const fA = a.socialAccounts[0]?.followersCount || 0;
          const fB = b.socialAccounts[0]?.followersCount || 0;
          return fB - fA;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.minPrice - b.minPrice;
        if (sortBy === 'price_desc') return b.minPrice - a.minPrice;
        return 0; // relevance
      });
  }, [creators, selectedCategory, searchQuery, selectedPlatform, maxPrice, minRating, verifiedOnly, sortBy]);

  const toggleCompare = (creator: CreatorProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (comparedCreators.some(c => c.id === creator.id)) {
      setComparedCreators(prev => prev.filter(c => c.id !== creator.id));
    } else {
      if (comparedCreators.length >= 3) {
        alert("You can compare up to 3 creators at a time.");
        return;
      }
      setComparedCreators(prev => [...prev, creator]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Guest Banner if not logged in */}
        {!isLoggedIn && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                ✨
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Browsing in Guest Mode</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Browse creators freely. Sign in to view verified media kits, unlock custom rates, and launch commercial collaborations.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 hover:shadow-indigo-200"
            >
              Log In / Sign Up
            </button>
          </div>
        )}

        {/* Header with generous margins */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Platform Creator Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover Creators & Influencers
          </h1>
          <p className="text-sm text-slate-600">
            Search from 20+ verified creators across India with transparent pricing from ₹1,000 to ₹11,000.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search creator name, city, handle, or bio keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Platform filter */}
            <div className="w-full md:w-44">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="x">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="followers">Sort: Most Followers</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-600 font-semibold shrink-0 mr-1">Categories:</span>
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

          {/* Quick Sliders & Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="font-semibold text-slate-700">Verified Creators Only</span>
              </label>

              <div className="flex items-center space-x-2">
                <span className="text-slate-500">Max Budget:</span>
                <span className="font-bold text-slate-800">{formatCurrency(maxPrice)}</span>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-indigo-600"
                />
              </div>
            </div>

            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredCreators.length}</span> creators
            </div>
          </div>
        </div>

        {/* Creator Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No creators found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try adjusting your category, price range, or platform filter to see more profiles.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedPlatform('All');
                setMaxPrice(15000);
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => {
              const isCompared = comparedCreators.some(c => c.id === creator.id);
              const primaryAccount = creator.socialAccounts[0];

              return (
                <div
                  key={creator.id}
                  onClick={() => handleViewProfile(creator.id)}
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

                      {/* Compare toggle button */}
                      <button
                        onClick={(e) => toggleCompare(creator, e)}
                        className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md transition ${
                          isCompared
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white/90 text-slate-800 hover:bg-white shadow-xs'
                        }`}
                      >
                        {isCompared ? '✓ Compared' : '+ Compare'}
                      </button>
                    </div>

                    {/* Body with Profile Photo in FRONT */}
                    <div className="px-5 pt-0 pb-5 relative z-20 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Profile Avatar cleanly in FRONT */}
                        <div className="-mt-12 sm:-mt-14 mb-3.5 flex items-end justify-between relative z-30">
                          <div className="relative">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover ring-4 ring-white shadow-xl bg-white relative z-30"
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

                        {/* Name & Handle */}
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition truncate">
                            {creator.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{creator.handle}</p>

                        <div className="flex items-center space-x-1 text-[11px] text-slate-500 mb-2">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{creator.location}</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                          {creator.bio}
                        </p>

                        {/* Verified stats row */}
                        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl mb-3 border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Audience</span>
                            <span className="font-bold text-slate-800">
                              {formatCompactNumber(primaryAccount?.followersCount || 10000)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Engagement</span>
                            <span className="font-bold text-emerald-600">
                              {primaryAccount?.engagementRate || 5.0}%
                            </span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1">
                          {creator.badges.slice(0, 2).map((b) => (
                            <span key={b} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Rate Card preview */}
                  <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                        {isLoggedIn ? 'Rate card from' : 'Starting from'}
                      </span>
                      <span className="font-extrabold text-indigo-700 text-sm">
                        {formatCurrency(creator.minPrice)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleViewProfile(creator.id, e)}
                      className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs hover:shadow-indigo-200"
                    >
                      {isLoggedIn ? 'View Media Kit →' : 'Log In to View 🔒'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMPARISON BAR (floating bottom if 1+ creators selected) */}
        {comparedCreators.length > 0 && (
          <div className="fixed bottom-14 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-4 max-w-xl w-[90%]">
            <div className="flex items-center space-x-2 flex-1 overflow-hidden">
              <span className="text-xs font-bold text-slate-300 shrink-0">Compare ({comparedCreators.length}/3):</span>
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {comparedCreators.map(c => (
                  <div key={c.id} className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded-lg text-xs shrink-0">
                    <img src={c.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                    <span className="truncate max-w-[80px]">{c.name.split(' ')[0]}</span>
                    <button onClick={(e) => toggleCompare(c, e)} className="text-slate-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
              >
                Compare Now
              </button>
              <button
                onClick={() => setComparedCreators([])}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* SIDE-BY-SIDE COMPARISON MODAL */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Creator Comparison Analysis</h3>
                <button onClick={() => setShowCompareModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {comparedCreators.map(c => (
                  <div key={c.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center space-x-3">
                      <img src={c.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        <p className="text-xs text-slate-500">{c.category}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2 border-t border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Starting Rate:</span>
                        <span className="font-bold text-indigo-700">{formatCurrency(c.minPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Audience:</span>
                        <span className="font-bold text-slate-800">{formatCompactNumber(c.socialAccounts[0]?.followersCount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Engagement:</span>
                        <span className="font-bold text-emerald-600">{c.socialAccounts[0]?.engagementRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rating:</span>
                        <span className="font-bold text-amber-600">★ {c.rating} ({c.reviewsCount})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Deals Done:</span>
                        <span className="font-bold text-slate-800">{c.completedDeals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-semibold text-slate-800 truncate">{c.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowCompareModal(false);
                        handleViewProfile(c.id);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      View Profile & Rate Cards
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
