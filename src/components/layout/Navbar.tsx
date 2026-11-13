import React, { useState } from 'react';
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
  LogIn
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
  const location = useLocation();

  const navLinks = [
    { label: 'Discover Creators', path: '/creators' },
    { label: 'Brand Campaigns', path: '/campaigns' },
    { label: 'Sponsorships', path: '/sponsorships' },
    { label: 'UGC & Pros', path: '/ugc-pros' },
    { label: 'Ad Spaces', path: '/ad-spaces' },
    { label: 'AI Matchmaker', path: '/ai-tools', badge: 'AI' }
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/40 text-indigo-200 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {isLoggedIn ? 'Demo Mode' : 'Guest Mode'}
            </span>
            <span className="hidden sm:inline text-slate-200">
              {isLoggedIn
                ? 'Switch roles instantly to preview Creator, Brand, Deal Room, or Admin operations.'
                : 'Browse as Guest • Log in to view full creator media kits, rate cards, and collaborate.'}
            </span>
          </div>

          {/* Quick Role Switcher Pill or Login CTA */}
          {isLoggedIn && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full text-xs transition font-medium border border-white/20"
              >
                <span>Acting as:</span>
                <span className="font-bold text-amber-300 capitalize">{currentUser.role}</span>
                <span className="text-[11px]">({currentUser.name.split(' ')[0]})</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-100">
                    Switch Active Role
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => switchRole(r.role)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
                        currentUser.role === r.role ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                      </span>
                      {currentUser.role === r.role && (
                        <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded">Active</span>
                      )}
                    </button>
                  ))}

                  <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-t border-slate-100 mt-1">
                    Preset Test Profiles
                  </div>
                  {users.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => switchUser(u.id)}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 text-slate-600"
                    >
                      <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{u.name}</span>
                      <span className="text-[10px] text-slate-600 capitalize">({u.role})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-xs transition"
            >
              <LogIn className="w-3 h-3" />
              <span>Log In to Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 whitespace-nowrap">
          {/* Logo (Single Line) */}
          <div className="flex items-center space-x-8 shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition shrink-0">
                <span className="text-white font-extrabold text-xl tracking-tighter">co</span>
              </div>
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  co-lab
                </span>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Single Line with whitespace-nowrap) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                    isActive(link.path)
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search bar & Right Actions */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-44 lg:w-56">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search creators, niches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-full border border-transparent focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Post Campaign CTA for Business / Agency */}
            {isLoggedIn && currentUser && (currentUser.role === 'business' || currentUser.role === 'agency') && (
              <Link
                to="/create-campaign"
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition hover:shadow-indigo-200 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Campaign</span>
              </Link>
            )}

            {/* Messages */}
            {isLoggedIn && (
              <Link
                to="/messages"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition relative"
                title="Deal Messages"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
              </Link>
            )}

            {/* Admin shortcut if admin */}
            {isLoggedIn && currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2 py-1 rounded-lg text-xs font-bold transition shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin</span>
              </Link>
            )}

            {/* PROFILE ICON ONLY (Dashboard link removed as requested) */}
            {isLoggedIn && currentUser ? (
              <div className="relative pl-1 border-l border-slate-200">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center focus:outline-none group"
                  title="Profile & Account Menu"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition shadow-xs"
                  />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
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
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
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
                className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-lg"
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
            {navLinks.map((link) => (
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
