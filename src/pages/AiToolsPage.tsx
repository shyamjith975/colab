import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle,
  TrendingUp,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreatorProfile } from '../types';
import { formatCurrency, formatCompactNumber } from '../utils';

export const AiToolsPage: React.FC = () => {
  const { creators, settings, createCampaign } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'matchmaker' | 'builder' | 'calculator'>('matchmaker');

  // Matchmaker form
  const [matchCategory, setMatchCategory] = useState(settings.categories[0] || 'Fashion & Style');
  const [matchCity, setMatchCity] = useState('Mumbai');
  const [matchBudget, setMatchBudget] = useState(5000);
  const [matchResults, setMatchResults] = useState<{ creator: CreatorProfile; score: number; reasons: string[] }[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // Natural Language Campaign Builder
  const [promptText, setPromptText] = useState("I own a boutique in Trivandrum. I want to promote my new women's clothing collection with a budget of ₹10,000.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null);

  // Rate calculator
  const [calcFollowers, setCalcFollowers] = useState(85000);
  const [calcEngagement, setCalcEngagement] = useState(5.5);
  const [calcFormat, setCalcFormat] = useState('Instagram Reel (45s)');

  // Run AI Matching
  const handleRunMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      const scored = creators.map((creator) => {
        let score = 50;
        const reasons: string[] = [];

        // Category synergy
        if (creator.category === matchCategory) {
          score += 30;
          reasons.push(`Direct category match in ${creator.category}`);
        } else {
          score += 10;
        }

        // Location synergy
        if ((creator.location || '').toLowerCase().includes(matchCity.toLowerCase())) {
          score += 15;
          reasons.push(`Hyper-local presence in ${creator.location || matchCity}`);
        }

        // Budget fit
        if (creator.minPrice <= matchBudget) {
          score += 10;
          reasons.push(`Price fits within ₹${matchBudget.toLocaleString()} budget`);
        } else {
          score -= 10;
        }

        // Engagement bonus
        const eng = creator.socialAccounts[0]?.engagementRate || 4.0;
        if (eng >= 5.0) {
          score += 5;
          reasons.push(`High engagement rate (${eng}%)`);
        }

        const finalScore = Math.min(99, Math.max(55, score));
        return { creator, score: finalScore, reasons };
      });

      scored.sort((a, b) => b.score - a.score);
      setMatchResults(scored.slice(0, 4));
      setIsMatching(false);
    }, 600);
  };

  // Run AI Campaign Brief Generator
  const handleGenerateBrief = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCampaign({
        title: "Trivandrum Handloom Festive Style Showcase",
        description: "Promoting contemporary artisanal women's wear tailored for urban professionals and festive occasions. Highlight pure organic fabric drape, local craftsmanship, and easy online boutique ordering.",
        category: "Fashion & Style",
        productName: "Spring/Festive Contemporary Ethnic Collection",
        targetLocations: ["Trivandrum", "Kochi", "Kerala"],
        targetAge: "20-38 (Women)",
        platform: "Instagram",
        contentFormat: "2x Aesthetic Try-on Reels + 3x Story Link Sequences",
        recommendedCreatorsCount: 3,
        budgetMin: 2500,
        budgetMax: 3500,
        totalBudget: 10000,
        compensationDetails: "₹3,300 per creator + ₹2,500 complimentary clothing set"
      });
      setIsGenerating(false);
    }, 800);
  };

  const handlePublishGeneratedCampaign = () => {
    if (!generatedCampaign) return;
    createCampaign({
      title: generatedCampaign.title,
      description: generatedCampaign.description,
      category: generatedCampaign.category,
      productName: generatedCampaign.productName,
      objectives: ['Local Store Awareness', 'Website Footfall', 'High-Res UGC Assets'],
      targetAudience: {
        locations: generatedCampaign.targetLocations,
        ageRange: generatedCampaign.targetAge,
        gender: 'Female',
        interests: ['Sustainable Fashion', 'Indian Ethnic Wear'],
        languages: ['Malayalam', 'English']
      },
      requirements: {
        platform: generatedCampaign.platform,
        contentFormat: generatedCampaign.contentFormat,
        quantity: 2,
        storeVisitRequired: false,
        licensingTerms: '6 months digital usage',
        deadline: '2026-12-25'
      },
      budget: {
        type: 'fixed',
        minAmount: generatedCampaign.budgetMin,
        maxAmount: generatedCampaign.budgetMax,
        totalBudget: generatedCampaign.totalBudget,
        compensationDetails: generatedCampaign.compensationDetails
      },
      settings: {
        deadline: '2026-12-15',
        maxCreators: 3,
        slotsAvailable: 3,
        minFollowers: 10000,
        eligibilityNotes: 'Creators located in Kerala with authentic female audience.',
        customQuestions: ['Are you able to produce 4K reel video?']
      },
      status: 'active',
      isFeatured: true
    });

    alert("AI Campaign generated and published to the marketplace! Redirecting to campaign listings...");
    navigate('/campaigns');
  };

  // Calculate estimated creator rate
  const calculateRate = () => {
    const base = (calcFollowers / 1000) * 45;
    const engMultiplier = calcEngagement / 4.0;
    const est = Math.round(base * engMultiplier);
    return Math.max(1200, Math.min(25000, est));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Intelligence Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Creator Matching & Campaign Tools
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Explainable matchmaking, natural language campaign generation, and data-backed rate estimation.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit text-xs font-bold shadow-xs">
          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'matchmaker'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Creator Matchmaker</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'builder'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Natural Language Brief Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Rate Calculator</span>
          </button>
        </div>

        {/* TAB 1: AI CREATOR MATCHMAKER */}
        {activeTab === 'matchmaker' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Explainable Matchmaking Engine</h3>
                <p className="text-xs text-slate-500">
                  Matches your brand goals against audience demographics, location proximity, price suitability, and authentic engagement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Niche</label>
                  <select
                    value={matchCategory}
                    onChange={(e) => setMatchCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {settings.categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target City / State</label>
                  <input
                    type="text"
                    value={matchCity}
                    onChange={(e) => setMatchCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Budget Allocation</label>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-indigo-700">{formatCurrency(matchBudget)}</span>
                    <input
                      type="range"
                      min={1000}
                      max={15000}
                      step={500}
                      value={matchBudget}
                      onChange={(e) => setMatchBudget(Number(e.target.value))}
                      className="flex-1 accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunMatch}
                disabled={isMatching}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isMatching ? 'Analyzing creator audience telemetry...' : 'Find Compatible Creators with AI Match'}</span>
              </button>
            </div>

            {/* Match Results */}
            {matchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Top Matched Creators ({matchResults.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchResults.map(({ creator, score, reasons }) => (
                    <div
                      key={creator.id}
                      className="bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-xs hover:border-indigo-300 transition space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={creator.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-50" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{creator.name}</h4>
                            <span className="text-xs text-slate-500">{creator.category} • {creator.location}</span>
                          </div>
                        </div>

                        {/* Match score badge */}
                        <div className="flex flex-col items-end">
                          <div className="text-xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                            {score}% Match
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5">Explainable AI Score</span>
                        </div>
                      </div>

                      {/* Explainability checklist */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Why this creator matches:</span>
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center space-x-2 text-slate-700">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Starting at</span>
                          <span className="font-bold text-slate-900 text-sm">{formatCurrency(creator.minPrice)}</span>
                        </div>

                        <button
                          onClick={() => navigate(`/creators/${creator.id}`)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition shadow-xs"
                        >
                          View Profile & Invite
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NATURAL LANGUAGE CAMPAIGN BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Natural Language Campaign Builder</h3>
                <p className="text-xs text-slate-500">
                  Describe what your business sells in plain text. AI will configure the deliverables, budget allocation, and target audience automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe your promotional goal in your own words:
                </label>
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                onClick={handleGenerateBrief}
                disabled={isGenerating || !promptText.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Structuring campaign requirements...' : 'Generate Structured Campaign Brief'}</span>
              </button>
            </div>

            {/* Generated Campaign Output */}
            {generatedCampaign && (
              <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 sm:p-8 shadow-premium space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                      AI Generated Campaign Structure
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                      {generatedCampaign.title}
                    </h3>
                  </div>

                  <button
                    onClick={handlePublishGeneratedCampaign}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition"
                  >
                    Publish to Marketplace
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {generatedCampaign.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Deliverables</span>
                    <span className="font-bold text-slate-800">{generatedCampaign.contentFormat}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Audience</span>
                    <span className="font-bold text-slate-800">{generatedCampaign.targetAge} ({generatedCampaign.targetLocations.join(', ')})</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Budget Allocation</span>
                    <span className="font-extrabold text-indigo-700 text-sm">{formatCurrency(generatedCampaign.totalBudget)} Total</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INFLUENCER RATE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Influencer Fair Rate Calculator</h3>
              <p className="text-xs text-slate-500">Calculate realistic compensation benchmarks based on audience metrics.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Follower Count: {calcFollowers.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={5000}
                  max={500000}
                  step={5000}
                  value={calcFollowers}
                  onChange={(e) => setCalcFollowers(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Average Engagement Rate: {calcEngagement}%
                </label>
                <input
                  type="range"
                  min={1.0}
                  max={12.0}
                  step={0.5}
                  value={calcEngagement}
                  onChange={(e) => setCalcEngagement(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content Format</label>
                <select
                  value={calcFormat}
                  onChange={(e) => setCalcFormat(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Instagram Reel (45s)">Instagram Reel (45s)</option>
                  <option value="3x Instagram Story Frame">3x Instagram Story Frame</option>
                  <option value="YouTube Mid-roll (60s)">YouTube Mid-roll (60s)</option>
                  <option value="UGC Video Asset">UGC Video Asset</option>
                </select>
              </div>

              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Recommended Commercial Fee</span>
                <div className="text-3xl font-black text-indigo-900">
                  {formatCurrency(calculateRate())}
                </div>
                <span className="text-[11px] text-indigo-800 block">
                  Fair market standard for {calcFormat} with {calcEngagement}% engagement.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
