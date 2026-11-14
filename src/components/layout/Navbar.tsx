import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  MessageSquare,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  LogOut,
  LogIn,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DatabaseExplorerModal } from '../database/DatabaseExplorerModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isLoggedIn,
    logout,
    setShowLoginModal,
    switchRole,
    switchUser,
    users,
    searchQuery,
    setSearchQuery,
    openComplianceModal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [showDbExplorer, setShowDbExplorer] = useState(false);
  const location = useLocation();

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setRoleDropdownOpen(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Close menus when changing routes
  useEffect(() => {
    setProfileDropdownOpen(false);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [location.pathname]);

  interface NavItem {
    label: string;
    path: string;
    badge?: string;
    icon?: string;
  }

  // Universal Desktop Navigation Tabs - Core high-priority destinations
  const desktopNavTabs: NavItem[] = [
    { label: 'Creators', path: '/creators' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Sponsorships', path: '/sponsorships' },
    { label: 'AI Tools', path: '/ai-tools', badge: 'AI' }
  ];

  // Specialized Marketplaces available in "More Markets ▾" dropdown
  const moreMarketplaceItems = [
    { label: 'Local City Ads', path: '/local-ads', icon: '📍', desc: 'Cafe displays, transit hubs & city theme pages', badge: 'City' },
    { label: 'Creator Collectives', path: '/collectives', icon: '👥', desc: 'Pre-vetted multi-creator bundles & group bookings', badge: 'Bundle' },
    { label: 'Affiliate Marketplace', path: '/affiliates', icon: '💰', desc: 'DTC affiliate programs & pay-per-sale commissions', badge: 'Recurring' },
    { label: 'UGC & Production Pros', path: '/ugc-pros', icon: '🎬', desc: 'Dedicated videographers, editors, stylists & crew' },
    { label: 'Ad Space Inventory', path: '/ad-spaces', icon: '📰', desc: 'Print ads, newsletter spots, podcast slots & billboards' },
    { label: 'Sponsor Requirements (RFPs)', path: '/sponsor-requirements', icon: '📋', desc: 'Brands & sponsors posting sponsorship requirements', badge: 'RFPs' },
    { label: 'Pricing & Plans', path: '/pricing', icon: '💳', desc: 'Transparent fee structures, commission tiers & enterprise' }
  ];

  const isMoreActive = moreMarketplaceItems.some(item => location.pathname === item.path);

  // Full options specifically for mobile view
  const mobileNavLinks: NavItem[] = [
    { label: 'Discover Creators', path: '/creators', icon: '🎨' },
    { label: 'Brand Campaigns', path: '/campaigns', icon: '📢' },
    { label: 'Local Ads Network', path: '/local-ads', icon: '📍', badge: 'City' },
    { label: 'Creator Collectives', path: '/collectives', icon: '👥', badge: 'Bundle' },
    { label: 'Affiliate Marketplace', path: '/affiliates', icon: '💰', badge: 'Recurring' },
    { label: 'Sponsorships & Events', path: '/sponsorships', icon: '🎪' },
    { label: 'Post Sponsor RFP', path: '/sponsor-requirements', icon: '📋', badge: 'Sponsor' },
    { label: 'UGC & Creative Pros', path: '/ugc-pros', icon: '🎬' },
    { label: 'Ad Space Inventory', path: '/ad-spaces', icon: '📰' },
    { label: 'AI Creator Matchmaker', path: '/ai-tools', icon: '✨', badge: 'AI' },
    { label: 'Pricing & Plans', path: '/pricing', icon: '💳' }
  ];

  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'creator', label: 'Creator View', icon: '🎨' },
    { role: 'business', label: 'Brand / Business', icon: '🏢' },
    { role: 'agency', label: 'Agency Client View', icon: '💼' },
    { role: 'organiser', label: 'Event Organiser', icon: '🎪' },
    { role: 'sponsor', label: 'Sponsor View', icon: '🤝' },
    { role: 'admin', label: 'Admin Control Panel', icon: '⚡' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white text-xs py-2 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="bg-indigo-500/40 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              {isLoggedIn ? 'Demo Mode' : 'Guest Mode'}
            </span>
            <button
              onClick={() => setShowDbExplorer(true)}
              className="flex items-center space-x-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer shrink-0"
              title="Open Live colab.db SQLite Explorer & Query Test Runner"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>colab.db (SQLite)</span>
            </button>
            <span className="hidden md:inline text-slate-200 text-xs truncate">
              {isLoggedIn
                ? 'Switch roles instantly to preview Creator, Brand, Deal Room, or Admin operations.'
                : 'Browse as Guest • Log in to view full creator media kits, rate cards, and collaborate.'}
            </span>
          </div>

          {/* Quick Role Switcher Pill or Login CTA */}
          {isLoggedIn && currentUser ? (
            <div className="relative shrink-0" ref={roleDropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs transition font-medium border border-white/20"
              >
                <span>Acting as:</span>
                <span className="font-bold text-amber-300 capitalize">{currentUser.role}</span>
                <span className="text-[11px]">({currentUser.name.split(' ')[0]})</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setRoleDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                      Switch Active Role
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => switchRole(r.role)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
                          currentUser.role === r.role ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{r.icon}</span>
                          <span>{r.label}</span>
                        </span>
                        {currentUser.role === r.role && (
                          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">Active</span>
                        )}
                      </button>
                    ))}

                    <div className="px-3.5 pt-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-t border-slate-100 mt-1">
                      Preset Test Profiles
                    </div>
                    {users.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className="w-full text-left px-3.5 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 text-slate-600"
                      >
                        <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">({u.role})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1 rounded-full text-xs transition shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In to Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Nav with clean responsive layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-18 w-full gap-2 sm:gap-4">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center space-x-2 xl:space-x-4 shrink-0">
            <Link to="/" className="flex items-center space-x-2 group shrink-0 pr-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition shrink-0">
                <span className="text-white font-extrabold text-lg sm:text-xl tracking-tighter">co</span>
              </div>
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  co-lab
                </span>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md hidden xl:inline-block">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (All tabs directly visible on tab bar) */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 shrink-0">
              {desktopNavTabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition flex items-center space-x-1 whitespace-nowrap shrink-0 ${
                    isActive(tab.path)
                      ? 'text-indigo-600 bg-indigo-50 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {tab.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* More Markets Dropdown */}
              <div className="relative shrink-0" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition flex items-center space-x-1 whitespace-nowrap ${
                    moreMenuOpen || isMoreActive
                      ? 'text-indigo-600 bg-indigo-50 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>More Markets</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${moreMenuOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>

                {moreMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setMoreMenuOpen(false)}
                    />
                    <div
                      className="absolute left-0 mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Specialized Collaboration Markets
                      </div>
                      {moreMarketplaceItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`w-full px-3.5 py-2 text-xs flex items-start space-x-2.5 hover:bg-indigo-50/70 transition ${
                            isActive(item.path) ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                          }`}
                        >
                          <span className="text-base leading-none mt-0.5">{item.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{item.label}</span>
                              {item.badge && (
                                <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold uppercase">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>

          {/* Search bar & Right Actions */}
          <div className="hidden md:flex items-center space-x-2 xl:space-x-3 shrink-0">
            {/* Search Input (Responsive width with guaranteed space) */}
            <div className="relative w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 focus-within:w-48 transition-all duration-200">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-full border border-transparent focus:border-indigo-500 focus:outline-none transition shadow-2xs"
              />
            </div>

            {/* If Logged In: show role-tailored CTA & user actions */}
            {isLoggedIn && currentUser ? (
              <>
                {/* Sponsor: Post RFP Requirement */}
                {currentUser.role === 'sponsor' && (
                  <Link
                    to="/sponsor-requirements"
                    className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition hover:shadow-amber-200 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post<span className="hidden xl:inline"> RFP</span></span>
                  </Link>
                )}

                {/* Business / Agency: Post Campaign */}
                {(currentUser.role === 'business' || currentUser.role === 'agency') && (
                  <Link
                    to="/create-campaign"
                    className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition hover:shadow-indigo-200 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post<span className="hidden xl:inline"> Campaign</span></span>
                  </Link>
                )}

                {/* Creator: Find Campaigns */}
                {currentUser.role === 'creator' && (
                  <Link
                    to="/campaigns"
                    className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition hover:shadow-indigo-200 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Find Deals</span>
                  </Link>
                )}

                {/* Organiser: List Event Sponsorship */}
                {currentUser.role === 'organiser' && (
                  <Link
                    to="/sponsorships"
                    className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition hover:shadow-indigo-200 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>List<span className="hidden xl:inline"> Event</span></span>
                  </Link>
                )}

                {/* Messages */}
                <Link
                  to="/messages"
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition relative shrink-0"
                  title="Deal Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                </Link>

                {/* Admin shortcut if admin */}
                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden xl:flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* PROFILE ICON ONLY (Clicking outside closes it immediately) */}
                <div className="relative pl-1.5 border-l border-slate-200 shrink-0" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center focus:outline-none group p-0.5 rounded-full ring-2 ring-transparent hover:ring-indigo-400 transition"
                    title="Profile & Account Menu"
                  >
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition shadow-xs"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 ring-2 ring-white rounded-full"></span>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <>
                      {/* Transparent backdrop to catch any click on screen */}
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div
                        className="absolute right-0 mt-3 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        {/* User Profile Header */}
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center space-x-3">
                          <img
                            src={currentUser.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</h4>
                            <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                            <span className="inline-block mt-0.5 text-[9px] font-bold uppercase bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                              {currentUser.role}
                            </span>
                          </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="py-1 text-xs">
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition"
                          >
                            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>My Profile & Dashboard</span>
                          </Link>

                          <Link
                            to="/messages"
                            className="flex items-center space-x-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition"
                          >
                            <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Deal Room Messages</span>
                          </Link>

                          {currentUser.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center space-x-2.5 px-4 py-2 hover:bg-amber-50 text-amber-900 font-bold transition"
                            >
                              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Admin Control Panel</span>
                            </Link>
                          )}

                          <button
                            onClick={() => {
                              openComplianceModal('payment');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-4 py-2 hover:bg-indigo-50 text-indigo-800 font-medium transition text-left cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Trust & Legal Compliance</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowDbExplorer(true);
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-4 py-2 hover:bg-emerald-50 text-emerald-800 font-medium transition text-left cursor-pointer"
                          >
                            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Database Explorer (SQLite)</span>
                          </button>
                        </div>

                        {/* Logout Action */}
                        <div className="border-t border-slate-100 pt-1 mt-1">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition"
                          >
                            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* When NOT Logged In: show clean Log In and Sign Up buttons */
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition hover:shadow-indigo-200"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger & profile icon */}
          <div className="flex items-center space-x-2 lg:hidden">
            {isLoggedIn && currentUser ? (
              <Link to="/dashboard" className="p-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
              </Link>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg"
              >
                Log In
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="pt-2 pb-1">
            <input
              type="text"
              placeholder="Search creators, campaigns, sponsorships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-3 py-2 bg-slate-100 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2.5">
                    {link.icon && <span className="text-base">{link.icon}</span>}
                    <span>{link.label}</span>
                  </span>
                  {link.badge && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Profile & Deals
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Deal Room Messages
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-bold text-amber-800 bg-amber-50"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowDbExplorer(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>colab.db SQLite Explorer</span>
            </button>

            {!isLoggedIn && (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>Sign In to Account</span>
              </button>
            )}
          </div>

          {isLoggedIn && currentUser && (
            <div className="pt-2">
              {currentUser.role === 'sponsor' && (
                <Link
                  to="/sponsor-requirements"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm shadow-sm"
                >
                  Post Sponsor RFP & Requirements
                </Link>
              )}
              {(currentUser.role === 'business' || currentUser.role === 'agency') && (
                <Link
                  to="/create-campaign"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm"
                >
                  Post a New Campaign
                </Link>
              )}
              {currentUser.role === 'creator' && (
                <Link
                  to="/campaigns"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm"
                >
                  Browse Brand Deals
                </Link>
              )}
              {currentUser.role === 'organiser' && (
                <Link
                  to="/sponsorships"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm"
                >
                  List Sponsorship Package
                </Link>
              )}
            </div>
          )}
        </div>
      )}
      {/* Live SQLite Database Explorer & Query Runner Modal */}
      <DatabaseExplorerModal
        isOpen={showDbExplorer}
        onClose={() => setShowDbExplorer(false)}
      />
    </header>
  );
};
