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
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

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
    setSearchQuery
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

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
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
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
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  interface NavItem {
    label: string;
    path: string;
    badge?: string;
  }

  // Core primary links (always visible on desktop nav)
  const primaryNavLinks: NavItem[] = [
    { label: 'Discover Creators', path: '/creators' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Sponsorships', path: '/sponsorships' }
  ];

  // Secondary marketplace links (compact dropdown)
  const moreNavLinks: { label: string; path: string; icon: string; desc: string; badge?: string }[] = [
    { label: 'UGC & Creative Pros', path: '/ugc-pros', icon: '🎬', desc: 'Hire videographers, editors & photographers' },
    { label: 'Ad Space Inventory', path: '/ad-spaces', icon: '📢', desc: 'Direct newsletter, podcast & digital slots' },
    { label: 'AI Creator Matchmaker', path: '/ai-tools', icon: '✨', desc: 'Instant algorithmic creator matchmaking', badge: 'AI' },
    { label: 'Pricing & Plans', path: '/pricing', icon: '💳', desc: 'Transparent creator & brand tiers' }
  ];

  const mobileNavLinks: NavItem[] = [
    { label: 'Discover Creators', path: '/creators' },
    { label: 'Brand Campaigns', path: '/campaigns' },
    { label: 'Sponsorships & Events', path: '/sponsorships' },
    { label: 'UGC & Production Pros', path: '/ugc-pros' },
    { label: 'Ad Space Inventory', path: '/ad-spaces' },
    { label: 'AI Matchmaker', path: '/ai-tools', badge: 'AI' },
    { label: 'Pricing & Plans', path: '/pricing' }
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
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="bg-indigo-500/40 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {isLoggedIn ? 'Demo Mode' : 'Guest Mode'}
            </span>
            <span className="hidden sm:inline text-slate-200 text-xs">
              {isLoggedIn
                ? 'Switch roles instantly to preview Creator, Brand, Deal Room, or Admin operations.'
                : 'Browse as Guest • Log in to view full creator media kits, rate cards, and collaborate.'}
            </span>
          </div>

          {/* Quick Role Switcher Pill or Login CTA */}
          {isLoggedIn && currentUser ? (
            <div className="relative" ref={roleDropdownRef}>
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
        <div className="flex items-center justify-between h-16 sm:h-18 w-full">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center space-x-4 xl:space-x-6 shrink-0">
            <Link to="/" className="flex items-center space-x-2 group shrink-0 pr-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition shrink-0">
                <span className="text-white font-extrabold text-xl tracking-tighter">co</span>
              </div>
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  co-lab
                </span>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md hidden sm:inline-block">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Compact & Non-overflowing) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                    isActive(link.path)
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              ))}

              {!isLoggedIn && (
                <Link
                  to="/pricing"
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                    isActive('/pricing')
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>Pricing</span>
                </Link>
              )}

              {/* More Dropdown for Authenticated features */}
              {isLoggedIn && (
                <div className="relative" ref={moreDropdownRef}>
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition flex items-center space-x-1 whitespace-nowrap shrink-0 ${
                      moreDropdownOpen || moreNavLinks.some(l => isActive(l.path))
                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                  </button>

                  {moreDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setMoreDropdownOpen(false)}
                      />
                      <div
                        className="absolute left-0 mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1"
                        onClick={() => setMoreDropdownOpen(false)}
                      >
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Commercial Marketplaces
                        </div>
                        {moreNavLinks.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-start space-x-3 p-2.5 rounded-xl transition ${
                              isActive(item.path)
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span className="text-base p-1.5 bg-slate-100 rounded-lg shrink-0">{item.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-xs truncate">{item.label}</span>
                                {item.badge && (
                                  <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Search bar & Right Actions */}
          <div className="hidden md:flex items-center space-x-2.5 lg:space-x-3 shrink-0">
            {/* Search Input (Responsive width) */}
            <div className="relative w-32 lg:w-40 xl:w-48 focus-within:w-48 xl:focus-within:w-56 transition-all duration-200">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-full border border-transparent focus:border-indigo-500 focus:outline-none transition shadow-2xs"
              />
            </div>

            {/* If Logged In: show user actions */}
            {isLoggedIn && currentUser ? (
              <>
                {/* Post Campaign CTA for Business / Agency */}
                {(currentUser.role === 'business' || currentUser.role === 'agency') && (
                  <Link
                    to="/create-campaign"
                    className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition hover:shadow-indigo-200 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Campaign</span>
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
                  <span>{link.label}</span>
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

          {isLoggedIn && currentUser && (currentUser.role === 'business' || currentUser.role === 'agency') && (
            <Link
              to="/create-campaign"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm"
            >
              Post a New Campaign
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
