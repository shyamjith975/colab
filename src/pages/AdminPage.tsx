import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  Layers,
  Sparkles,
  Search,
  Eye,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils';

export const AdminPage: React.FC = () => {
  const {
    users,
    campaigns,
    collaborations,
    transactions,
    settings,
    updateSettings,
    toggleUserVerification,
    updateCampaignStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'campaigns' | 'finances' | 'settings'>('overview');
  const [userSearch, setUserSearch] = useState('');

  // Editable settings form
  const [commissionRate, setCommissionRate] = useState(settings.platformCommissionPercent);
  const [minBudget, setMinBudget] = useState(settings.minCampaignBudget);
  const [taxRate, setTaxRate] = useState(settings.taxGstRate);
  const [featuredFee, setFeaturedFee] = useState(settings.featuredCampaignFee);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platformCommissionPercent: Number(commissionRate),
      minCampaignBudget: Number(minBudget),
      taxGstRate: Number(taxRate),
      featuredCampaignFee: Number(featuredFee)
    });
    alert("Platform settings successfully updated! New rates applied dynamically across all marketplace deals.");
  };

  const totalGMV = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const platformRevenue = transactions.reduce((sum, tx) => sum + tx.platformFee, 0);
  const escrowHeld = transactions.filter(t => t.status === 'held_in_escrow').reduce((sum, tx) => sum + tx.amount, 0);

  const filteredUsers = users.filter((u) => {
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight">co-lab Master Admin Control</h1>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Financial governance, user verification, campaign moderation, and dynamic platform parameters.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">PostgreSQL Engine Connected</span>
          </div>
        </div>

        {/* Global Financial & Operations KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Platform GMV</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{formatCurrency(totalGMV)}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Gross Collaborations</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Platform Fee Revenue</span>
            <span className="text-2xl font-black text-indigo-700 mt-1 block">{formatCurrency(platformRevenue)}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">{settings.platformCommissionPercent}% Commission Cut</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Escrow Held Currently</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{formatCurrency(escrowHeld)}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Secured in Deal Rooms</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Registered Users</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{users.length}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Across all 6 roles</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Overview
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'users' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            User Verification & Access ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'campaigns' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Campaign Moderation ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'finances' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ledger & Escrow
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'settings' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Platform Settings & Rates
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Operational Highlights</h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span>Current Active Marketplaces</span>
                  <span className="font-bold text-slate-900">3 (Creator, Promotion, Sponsorship)</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span>Total Collaboration Deals Initiated</span>
                  <span className="font-bold text-indigo-700">{collaborations.length} Deal Rooms</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span>Dispute Rate</span>
                  <span className="font-bold text-emerald-600">0.0% (Zero Active Disputes)</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span>Average Turnaround to Review</span>
                  <span className="font-bold text-slate-900">3.4 Days</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Quick Admin Actions</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl text-left space-y-1 transition text-indigo-950 font-bold"
                >
                  <Users className="w-5 h-5 text-indigo-600 mb-1" />
                  <span>Review Unverified Users</span>
                  <span className="block text-[10px] text-indigo-700 font-normal">Check KYC documents</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 bg-amber-50 hover:bg-amber-100 rounded-2xl text-left space-y-1 transition text-amber-950 font-bold"
                >
                  <Settings className="w-5 h-5 text-amber-600 mb-1" />
                  <span>Adjust Platform Fees</span>
                  <span className="block text-[10px] text-amber-700 font-normal">Currently {settings.platformCommissionPercent}%</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & VERIFICATION */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-extrabold text-slate-900 text-base">All Registered Profiles</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name, email, role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Verification Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[11px] text-slate-500">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold uppercase text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.verified ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Verified Badge</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-semibold">Unverified</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleUserVerification(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            u.verified
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                          }`}
                        >
                          {u.verified ? 'Revoke Verification' : 'Verify Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGNS MODERATION */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Campaign Moderation Queue</h3>
            <div className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <div key={camp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-sm">{camp.title}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded capitalize">{camp.category}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">By {camp.businessName} • Budget: {formatCurrency(camp.budget.minAmount)} - {formatCurrency(camp.budget.maxAmount)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      camp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {camp.status}
                    </span>

                    <button
                      onClick={() => updateCampaignStatus(camp.id, camp.status === 'active' ? 'paused' : 'active')}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                    >
                      {camp.status === 'active' ? 'Pause Campaign' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FINANCES & ESCROW LEDGER */}
        {activeTab === 'finances' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Platform Escrow Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Invoice</th>
                    <th className="p-3">Gross Deal</th>
                    <th className="p-3">co-lab Fee Cut</th>
                    <th className="p-3">Net Creator Payout</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="p-3 font-mono font-bold text-slate-900">{tx.invoiceNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{formatCurrency(tx.amount)}</td>
                      <td className="p-3 font-extrabold text-indigo-700">{formatCurrency(tx.platformFee)}</td>
                      <td className="p-3 font-bold text-emerald-700">{formatCurrency(tx.netAmount)}</td>
                      <td className="p-3">
                        <span className="font-bold text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded">
                          {tx.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Dynamic Business Parameters</h3>
              <p className="text-xs text-slate-500">
                Update core platform economics. Changes propagate immediately across all deals and invoices.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Platform Commission Percentage (%) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={30}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Current platform deduction applied on completed deal room milestones.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Minimum Campaign Budget (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  step={500}
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  GST Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Featured Listing Placement Fee (₹)
                </label>
                <input
                  type="number"
                  value={featuredFee}
                  onChange={(e) => setFeaturedFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition"
                >
                  Save Platform Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
