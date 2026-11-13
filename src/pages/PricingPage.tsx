import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Percent,
  Building,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';

export const PricingPage: React.FC = () => {
  const { isLoggedIn, setShowLoginModal } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [dealAmount, setDealAmount] = useState<number>(10000);

  // Commission math
  const standardCommission = Math.round(dealAmount * 0.08);
  const proCommission = Math.round(dealAmount * 0.04);
  const savings = standardCommission - proCommission;

  const creatorPlans = [
    {
      name: 'Creator Starter',
      badge: 'Free Forever',
      price: 0,
      period: '/month',
      desc: 'Everything you need to list your profile, create your media kit, and apply to open brand campaigns.',
      features: [
        'Public Verified Creator Profile & Media Kit',
        'Apply to unlimited open brand campaigns',
        'Standard 8% platform escrow success fee',
        'Direct Deal Room chat & deliverable approvals',
        'UPI & Direct Bank instant settlements',
        'Verified 2-way collaboration reviews'
      ],
      popular: false,
      cta: isLoggedIn ? 'Active Plan' : 'Join as Creator Free'
    },
    {
      name: 'Creator Pro',
      badge: 'Most Popular',
      price: billingCycle === 'annual' ? 799 : 999,
      period: '/month',
      desc: 'Designed for full-time content creators, influencers, and creative agencies wanting maximum earnings.',
      features: [
        'All Starter features included',
        'Halved platform fee: Only 4% commission',
        'Priority placement in Brand Discover Search',
        'Featured Creator Gold Badge on profile',
        'Detailed audience demographic analytics kit',
        'Priority Deal Room escrow payout within 24h',
        'Dedicated collaboration manager support'
      ],
      popular: true,
      cta: 'Upgrade to Creator Pro'
    }
  ];

  const businessPlans = [
    {
      name: 'Brand Growth',
      badge: 'For MSMEs & D2C',
      price: billingCycle === 'annual' ? 1999 : 2499,
      period: '/month',
      desc: 'Ideal for local businesses, restaurants, boutiques, and D2C brands hiring influencers routinely.',
      features: [
        'Post unlimited advertising & UGC campaigns',
        'Direct search & invite across 20,000+ creators',
        'Milestone Escrow payment protection',
        'Custom application screening questions',
        'Content licensing terms management',
        'In-depth campaign reach & ROI analytics'
      ],
      popular: false,
      cta: isLoggedIn ? 'Subscribe to Growth' : 'Start Free Trial'
    },
    {
      name: 'Agency Enterprise',
      badge: 'Multi-Client Suite',
      price: billingCycle === 'annual' ? 7999 : 9999,
      period: '/month',
      desc: 'For digital agencies, event organizers, and enterprises managing multi-creator campaigns.',
      features: [
        'All Brand Growth features included',
        'Multi-client management workspace',
        'Zero commission on event sponsorship deals',
        'Client-level access restrictions & team seats',
        'Bulk contract creation & automated GST invoices',
        'Dedicated 24/7 account manager & custom SLAs',
        'Custom API & Supabase webhook integrations'
      ],
      popular: true,
      cta: 'Contact Sales / Enterprise'
    }
  ];

  const faqs = [
    {
      q: 'How does milestone escrow protection work?',
      a: 'When a brand accepts a creator proposal, the agreed budget is held securely in platform escrow. Funds are only released to the creator once the brand reviews and approves the submitted content draft deliverables.'
    },
    {
      q: 'What fees are charged to creators?',
      a: 'Creator accounts are free to set up. On the Starter plan, a transparent 8% success fee is deducted upon escrow settlement. On Creator Pro, the fee is discounted to just 4%.'
    },
    {
      q: 'Can small businesses hire creators on a small budget?',
      a: 'Absolutely! co-lab is specifically built to enable collaborations from ₹1,000 for local boutiques, cafes, and emerging brands, up to enterprise sponsorships worth lakhs.'
    },
    {
      q: 'Are sponsorship agreements legally binding?',
      a: 'Yes. Every Deal Room generates a formal commercial agreement with deliverable deadlines, revision caps, usage licensing terms, and ASCI compliance disclosure obligations.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Fair, Transparent & Scalable</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Plans for Creators, Brands & Agencies
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you are an aspiring creator booking your first ₹1,000 brand reel or an agency managing multi-lakh campaigns, co-lab has the right tier for you.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(b => b === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-indigo-600 rounded-full p-1 transition flex items-center"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-indigo-600' : 'text-slate-500'}`}>
              Annual Billing <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-extrabold ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        {/* SECTION 1: CREATOR PLANS */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
              <span className="text-indigo-600">🎨</span>
              <span>For Content Creators & Influencers</span>
            </h2>
            <p className="text-xs text-slate-500">Monetize your audience with verified brand contracts and guaranteed escrow payouts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {creatorPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition duration-200 ${
                  plan.popular
                    ? 'bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-100 relative'
                    : 'bg-white border border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{plan.name}</span>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">{formatCurrency(plan.price)}</span>
                      <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">What's included:</span>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-xs ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE COMMISSION CALCULATOR */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-indigo-500/30 text-indigo-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                <Percent className="w-3.5 h-3.5" />
                <span>Interactive Earnings Calculator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">See how much you save with Creator Pro</h3>
              <p className="text-xs text-indigo-200">Adjust the collaboration deal amount to see your net payout difference.</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-indigo-300 block uppercase font-bold">Deal Size</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{formatCurrency(dealAmount)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={dealAmount}
              onChange={(e) => setDealAmount(Number(e.target.value))}
              className="w-full accent-indigo-400 h-2 bg-indigo-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-indigo-300 font-mono">
              <span>₹2,000</span>
              <span>₹25,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[11px] text-indigo-300 uppercase font-semibold block">Standard Plan (8%)</span>
              <span className="text-lg font-bold text-white block mt-1">{formatCurrency(dealAmount - standardCommission)}</span>
              <span className="text-[11px] text-slate-400">Fee: {formatCurrency(standardCommission)}</span>
            </div>

            <div className="p-4 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl">
              <span className="text-[11px] text-indigo-200 uppercase font-bold block">Creator Pro (4%)</span>
              <span className="text-lg font-black text-emerald-400 block mt-1">{formatCurrency(dealAmount - proCommission)}</span>
              <span className="text-[11px] text-indigo-300">Fee: {formatCurrency(proCommission)}</span>
            </div>

            <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-emerald-300 uppercase font-bold block">Extra Money in Your Pocket</span>
                <span className="text-2xl font-black text-emerald-400 block mt-1">+{formatCurrency(savings)}</span>
              </div>
              <span className="text-[10px] text-emerald-200 mt-1">Pro subscription pays for itself with a single collaboration!</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: BUSINESS & AGENCY PLANS */}
        <div className="space-y-6 pt-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
              <span className="text-indigo-600">🏢</span>
              <span>For Brands, Small Businesses & Agencies</span>
            </h2>
            <p className="text-xs text-slate-500">Discover creators, post promotional assignments, and streamline milestone escrow contracts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {businessPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition duration-200 ${
                  plan.popular
                    ? 'bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-100 relative'
                    : 'bg-white border border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{plan.name}</span>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">{formatCurrency(plan.price)}</span>
                      <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">Enterprise Perks:</span>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-xs ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQS */}
        <div className="pt-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Clear answers to platform billing and fee structures.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

