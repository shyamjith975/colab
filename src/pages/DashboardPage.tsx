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
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils';

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
    transactions,
    createCollaborationFromApplication,
    updateApplicationStatus
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'collaborations' | 'applications' | 'transactions'>('collaborations');

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

  const role = currentUser.role;

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

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

        {/* Dynamic KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {role === 'creator' ? (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Settled Earnings</span>
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
          ) : (
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
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'collaborations'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Deal Rooms ({collaborations.length})
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'applications'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Campaign Proposals ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'transactions'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Payments & Invoices ({transactions.length})
          </button>
        </div>

        {/* TAB 1: COLLABORATIONS & DEAL ROOMS */}
        {activeTab === 'collaborations' && (
          <div className="space-y-4">
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
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                    <span className="font-bold text-indigo-700 capitalize bg-indigo-50 px-2 py-0.5 rounded-md">
                      {collab.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Deal Value</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(collab.agreedAmount)}
                    </span>
                  </div>

                  <button className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                    <span>Open Deal Room</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: APPLICATIONS & PROPOSALS */}
        {activeTab === 'applications' && (
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

        {/* TAB 3: TRANSACTIONS & INVOICES */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Gross Amount</th>
                    <th className="p-4">Status</th>
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
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          tx.status === 'held_in_escrow' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                        }`}>
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
      </div>
    </div>
  );
};

