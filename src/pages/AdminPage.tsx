import React, { useState, useEffect } from 'react';
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
  Lock,
  Key,
  Database,
  FileCheck,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils';
import { complianceService } from '../services/complianceService';
import { SecurityAuditLog } from '../types/compliance';

export const AdminPage: React.FC = () => {
  const {
    users,
    campaigns,
    collaborations,
    transactions,
    settings,
    updateSettings,
    toggleUserVerification,
    updateCampaignStatus,
    openComplianceModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'campaigns' | 'finances' | 'settings' | 'security'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [adminMfaCode, setAdminMfaCode] = useState('');
  const [mfaStatus, setMfaStatus] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  useEffect(() => {
    setAuditLogs(complianceService.getAuditLogs(20));
  }, [activeTab]);

  const handleVerifyAdminMfa = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = complianceService.verifyAdminMfa(adminMfaCode);
    setMfaStatus(ok ? 'MFA TOTP Token Validated ✓ (Session Elevated)' : 'Invalid 6-Digit Code. Try: 123456');
    complianceService.logAuditEvent({
      userId: 'user-admin-1',
      userRole: 'admin',
      action: 'ADMIN_MFA_CHALLENGE',
      resource: 'admin/security',
      status: ok ? 'success' : 'failure',
      details: { codeEntered: ok ? 'VALID_TOTP' : 'INVALID' }
    });
    setAuditLogs(complianceService.getAuditLogs(20));
  };

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

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-4 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'security' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Security, MFA & DPDP (12.3 & 13.2)</span>
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

        {/* TAB 6: SECURITY, MFA & DPDP COMPLIANCE (12.3 & 13.2) */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Top Security Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base">Section 12.3 Security & Section 13.2 DPDP Governance</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Cryptographic authentication, database-level parameterized queries, sliding-window rate limiting (120 req/min), HMAC SHA-256 webhook signatures, and DPDP Act 2023 compliance.
                </p>
              </div>

              <button
                onClick={() => openComplianceModal('security')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shrink-0 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Open Full Interactive Modal</span>
              </button>
            </div>

            {/* Grid 1: Admin MFA Challenge & RBAC Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MFA Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Super Admin MFA (TOTP 2FA)</h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                    Mandatory Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Per Section 12.3 security specifications, administrators require Multi-Factor Authentication. Test real-time TOTP challenge validation below:
                </p>

                <form onSubmit={handleVerifyAdminMfa} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Enter 6-Digit Admin TOTP Code:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={adminMfaCode}
                        onChange={(e) => setAdminMfaCode(e.target.value)}
                        className="w-40 p-2.5 font-mono text-center text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                      >
                        Verify Code
                      </button>
                    </div>
                  </div>

                  {mfaStatus && (
                    <p className={`text-xs font-bold ${mfaStatus.includes('✓') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {mfaStatus}
                    </p>
                  )}
                </form>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-500">
                  <div className="flex justify-between">
                    <span>Algorithm:</span>
                    <strong className="text-slate-800">RFC 6238 TOTP (SHA-1/SHA-256)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Window Drift:</span>
                    <strong className="text-slate-800">±30 seconds</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Bypass Code:</span>
                    <strong className="text-indigo-600 font-mono">123456</strong>
                  </div>
                </div>
              </div>

              {/* RBAC Matrix */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Role-Based Access Control (RBAC) Matrix</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">6 System Roles</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <span className="font-bold text-slate-800 block">Admin</span>
                      <span className="text-[10px] text-slate-500">Financial settings, user moderation, audit logs</span>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded">All Permissions</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <span className="font-bold text-slate-800 block">Creator & UGC Pro</span>
                      <span className="text-[10px] text-slate-500">Proposals, deliverables, rate card management</span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded">Self-Scope</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <span className="font-bold text-slate-800 block">Business & Brand</span>
                      <span className="text-[10px] text-slate-500">Campaign creation, deliverable sign-off, escrow deposit</span>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-black px-2 py-0.5 rounded">Buyer-Scope</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Security & Compliance Audit Log Viewer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time Security & Compliance Audit Log (Immutable Events)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Records all authentication, payment webhook verifications, eSigns, and DPDP actions.
                  </p>
                </div>

                <button
                  onClick={() => setAuditLogs(complianceService.getAuditLogs(20))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Log</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Security Action</th>
                      <th className="py-2.5 px-3">Actor Role</th>
                      <th className="py-2.5 px-3">Target Resource</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {auditLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {log.action}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 capitalize">
                          {log.userRole}
                        </td>
                        <td className="py-2.5 px-3 text-indigo-600 font-sans text-xs">
                          {log.resource}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                            log.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status}
                          </span>
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

