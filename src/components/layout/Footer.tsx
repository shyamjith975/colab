import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { openComplianceModal } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-extrabold text-xl">co</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                co-lab
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier multi-vendor creator economy, influencer marketing, advertising, sponsorship & commercial collaboration marketplace. Connecting businesses of every size with talented creators.
            </p>
            <button
              onClick={() => openComplianceModal('payment')}
              className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-lg w-fit border border-slate-700/50 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Milestone Escrow & ASCI Compliant</span>
            </button>
          </div>

          {/* Product Marketplaces */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Marketplaces
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/creators" className="hover:text-white transition">Creator Marketplace</Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-white transition">Business Campaigns</Link>
              </li>
              <li>
                <Link to="/sponsorships" className="hover:text-white transition">Sponsorships & Events</Link>
              </li>
              <li>
                <Link to="/ugc-pros" className="hover:text-white transition">UGC & Production Pros</Link>
              </li>
              <li>
                <Link to="/ad-spaces" className="hover:text-white transition">Ad Space Inventory</Link>
              </li>
              <li>
                <Link to="/ai-tools" className="hover:text-white transition flex items-center space-x-1">
                  <span>AI Matchmaker</span>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1 rounded">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions by Role */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/creators" className="hover:text-white transition">For Content Creators</Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-white transition">For Small Boutiques & Shops</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">For DTC & National Brands</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">For Digital Agencies</Link>
              </li>
              <li>
                <Link to="/sponsorships" className="hover:text-white transition">For College & Event Organisers</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">Admin & Platform Ops</Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => openComplianceModal('ip')}
                  className="hover:text-white cursor-pointer transition text-left"
                >
                  8-Point IP Terms & eSign (13.6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openComplianceModal('dpdp')}
                  className="hover:text-white cursor-pointer transition text-left"
                >
                  Privacy & DPDP Act 2023 (13.2)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openComplianceModal('payment')}
                  className="hover:text-white cursor-pointer transition text-left"
                >
                  Escrow, PA-PG & KYC (13.4)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openComplianceModal('asci')}
                  className="hover:text-white cursor-pointer transition text-left"
                >
                  ASCI Advertising Disclosures (13.3)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openComplianceModal('security')}
                  className="hover:text-white cursor-pointer transition text-left"
                >
                  Security, RBAC & MFA Audit (12.3)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openComplianceModal('notifications')}
                  className="hover:text-white cursor-pointer transition text-left"
                >
                  Email, SMS & WhatsApp Alerts
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} co-lab Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1">
              <span>Engineered with modern fullstack architecture</span>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

