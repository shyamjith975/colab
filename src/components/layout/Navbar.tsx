import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Layers,
  Award,
  Calendar,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, switchUser, users, searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
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
            <span className="bg-indigo-500/40 text-indigo-200 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Demo Mode</span>
            <span className="hidden sm:inline text-slate-200">
              Switch roles instantly to preview Creator, Brand, Deal Room, or Admin operations.
            </span>
          </div>

          {/* Quick Role Switcher Pill */}
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
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition">
                <span className="text-white font-extrabold text-xl tracking-tighter">co</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                  co-lab
                </span>
                <span className="text-[9px] font-bold tracking-widest text-indigo-500 uppercase -mt-1">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
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
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative w-48 lg:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search creators, niches, deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-full border border-transparent focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Post Campaign CTA for Business / Agency */}
            {(currentUser.role === 'business' || currentUser.role === 'agency') && (
              <Link
                to="/create-campaign"
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition hover:shadow-indigo-200"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Campaign</span>
              </Link>
            )}

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="text-slate-600 hover:text-slate-900 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              Dashboard
            </Link>

            {/* Messages */}
            <Link
              to="/messages"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition relative"
              title="Deal Messages"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </Link>

            {/* Admin shortcut if admin */}
            {currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Profile Avatar */}
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 pl-2 border-l border-slate-200"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to="/dashboard"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            </Link>
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
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link
              to="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Deal Room Messages
            </Link>
            {currentUser.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-amber-800 bg-amber-50"
              >
                Admin Control Panel
              </Link>
            )}
          </div>

          {(currentUser.role === 'business' || currentUser.role === 'agency') && (
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
