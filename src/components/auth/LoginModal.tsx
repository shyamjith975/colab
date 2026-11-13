import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, User, ArrowRight, Lock, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, UserProfile } from '../../types';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, login, users } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('creator');

  if (!showLoginModal) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      login(existingUser);
    } else {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        verified: false,
        createdAt: new Date().toISOString()
      };
      login(newUser);
    }
  };

  const demoRoles = [
    { id: 'user-creator-1', name: 'Ananya Sharma', role: 'Creator', desc: 'Fashion & Style Stylist (185k)', icon: '🎨' },
    { id: 'user-creator-2', name: 'Rohit Verma', role: 'Creator', desc: 'Tech & Gadgets Reviewer (310k)', icon: '⚡' },
    { id: 'user-biz-1', name: 'Aroma Threads Boutique', role: 'Brand', desc: 'Ethnic Wear Studio (Trivandrum)', icon: '🏢' },
    { id: 'user-biz-2', name: 'NutriBlend Superfoods', role: 'Brand', desc: 'Clean Plant Nutrition (Gurugram)', icon: '🥗' },
    { id: 'user-agency-1', name: 'Elevate Digital Agency', role: 'Agency', desc: 'Manages 30+ DTC Brands', icon: '💼' },
    { id: 'user-org-1', name: 'Mood Indigo Team', role: 'Organiser', desc: 'Asia Largest Fest (140k+ Footfall)', icon: '🎪' },
    { id: 'user-sponsor-1', name: 'Apex Energy Drinks', role: 'Sponsor', desc: 'Youth & Gaming Sponsor', icon: '🤝' },
    { id: 'user-admin-1', name: 'Super Administrator', role: 'Admin', desc: 'Platform Governance & Finance', icon: '🛡️' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
                co
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Sign In to co-lab
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Log in to view creator profiles, media kits, rate cards, and unlock commercial collaborations.
            </p>
          </div>
          <button
            onClick={() => setShowLoginModal(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Profile Switch / Demo Sign-in */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            1-Click Quick Demo Sign In
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoRoles.map((demo) => {
              const u = users.find(user => user.id === demo.id);
              return (
                <button
                  key={demo.id}
                  onClick={() => {
                    if (u) login(u);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition group"
                >
                  <span className="text-2xl shrink-0">{demo.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition truncate">
                        {demo.name}
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase">
                        {demo.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                      {demo.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-[11px] font-semibold text-slate-400 uppercase">Or Sign In with Email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Custom Email Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
              >
                <option value="creator">Creator / Influencer</option>
                <option value="business">Business / Brand</option>
                <option value="agency">Marketing Agency</option>
                <option value="organiser">Event Organiser</option>
                <option value="sponsor">Corporate Sponsor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center space-x-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

