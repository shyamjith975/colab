import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  DollarSign,
  Calendar,
  Users,
  ShieldCheck,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils';

export const CreateCampaignPage: React.FC = () => {
  const { createCampaign, settings, currentUser, isLoggedIn, setShowLoginModal } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: settings.categories[0] || 'Fashion & Style',
    productName: '',
    productUrl: '',
    objectives: ['Brand Awareness', 'Drive Direct Sales'],
    targetLocations: 'Mumbai, Bengaluru, Delhi',
    targetAgeRange: '18-35',
    targetGender: 'All',
    targetLanguages: 'English, Hindi',
    targetInterests: 'Fashion, Lifestyle, Online Shopping',
    platform: 'Instagram',
    contentFormat: '1 Reel (30-60s) + 2 Stories',
    quantity: 1,
    videoDuration: '45-60s',
    storeVisitRequired: false,
    licensingTerms: '6 months organic and paid Meta ads usage',
    budgetType: 'fixed' as const,
    budgetMin: 2000,
    budgetMax: 5000,
    totalBudget: 15000,
    compensationDetails: 'Cash fee + free product sample kit',
    deadline: '2026-12-30',
    slotsAvailable: 3,
    minFollowers: 15000,
    eligibilityNotes: 'Creators with minimum 4% authentic engagement rate.',
    customQuestions: ['What is your primary city location?']
  });

  const [newQuestion, setNewQuestion] = useState('');

  const steps = [
    { num: 1, title: 'Campaign Details' },
    { num: 2, title: 'Target Audience' },
    { num: 3, title: 'Requirements' },
    { num: 4, title: 'Budget' },
    { num: 5, title: 'Application Rules' },
    { num: 6, title: 'Review & Publish' }
  ];

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setFormData(prev => ({
        ...prev,
        customQuestions: [...prev.customQuestions, newQuestion.trim()]
      }));
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) {
      setShowLoginModal(true);
      return;
    }
    createCampaign({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      productName: formData.productName,
      productUrl: formData.productUrl,
      objectives: formData.objectives,
      targetAudience: {
        locations: formData.targetLocations.split(',').map(s => s.trim()),
        ageRange: formData.targetAgeRange,
        gender: formData.targetGender,
        interests: formData.targetInterests.split(',').map(s => s.trim()),
        languages: formData.targetLanguages.split(',').map(s => s.trim())
      },
      requirements: {
        platform: formData.platform,
        contentFormat: formData.contentFormat,
        quantity: formData.quantity,
        videoDuration: formData.videoDuration,
        storeVisitRequired: formData.storeVisitRequired,
        licensingTerms: formData.licensingTerms,
        deadline: formData.deadline
      },
      budget: {
        type: formData.budgetType,
        minAmount: formData.budgetMin,
        maxAmount: formData.budgetMax,
        totalBudget: formData.totalBudget,
        compensationDetails: formData.compensationDetails
      },
      settings: {
        deadline: formData.deadline,
        maxCreators: formData.slotsAvailable,
        slotsAvailable: formData.slotsAvailable,
        minFollowers: formData.minFollowers,
        eligibilityNotes: formData.eligibilityNotes,
        customQuestions: formData.customQuestions
      },
      status: 'active',
      isFeatured: false
    });

    alert("Campaign published successfully! Creators can now discover and apply.");
    navigate('/campaigns');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wizard Progress Bar */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Publish Advertising Campaign
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create an open brief for creators to discover, submit pitches, and deliver high-ROI content.
          </p>

          <div className="grid grid-cols-6 gap-2 mt-6">
            {steps.map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s.num <= step ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                ></div>
                <span className="text-[10px] font-bold text-slate-600 hidden sm:block truncate">
                  {s.num}. {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-premium">
          {/* STEP 1: CAMPAIGN DETAILS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 1: Campaign Overview</h3>
                <p className="text-xs text-slate-600">Provide the core context of your promotional initiative.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festive Kurti Collection Launch & Try-On Series"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      {settings.categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product or Service Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Organic Cotton Block Print Kurtis"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Website / Store Link</label>
                  <input
                    type="url"
                    placeholder="https://yourbrand.com/products/festive"
                    value={formData.productUrl}
                    onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campaign Description & Story *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe what makes your product unique, what creator style you love, and the vibe you want to convey..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TARGET AUDIENCE */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 2: Target Audience & Demographics</h3>
                <p className="text-xs text-slate-600">Define the ideal consumer profile you are looking to reach.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Geographic Locations (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.targetLocations}
                    onChange={(e) => setFormData({ ...formData, targetLocations: e.target.value })}
                    placeholder="e.g. Mumbai, Bengaluru, Delhi NCR, Pune"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Age Range</label>
                    <select
                      value={formData.targetAgeRange}
                      onChange={(e) => setFormData({ ...formData, targetAgeRange: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      <option value="16-24">16 - 24 (Gen Z)</option>
                      <option value="18-35">18 - 35 (Millennials & Youth)</option>
                      <option value="25-45">25 - 45 (Working Professionals)</option>
                      <option value="All Ages">All Ages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Gender</label>
                    <select
                      value={formData.targetGender}
                      onChange={(e) => setFormData({ ...formData, targetGender: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Genders</option>
                      <option value="Female">Primarily Female (70%+)</option>
                      <option value="Male">Primarily Male (70%+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Languages</label>
                  <input
                    type="text"
                    value={formData.targetLanguages}
                    onChange={(e) => setFormData({ ...formData, targetLanguages: e.target.value })}
                    placeholder="e.g. Hindi, English, Malayalam, Tamil"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Audience Interests & Affinities</label>
                  <input
                    type="text"
                    value={formData.targetInterests}
                    onChange={(e) => setFormData({ ...formData, targetInterests: e.target.value })}
                    placeholder="e.g. Sustainable Fashion, College Life, Beauty Hacks"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVERABLES */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 3: Content Deliverables & Format</h3>
                <p className="text-xs text-slate-600">Specify exactly what the creator will create and deliver.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Social Platform *</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="X">X (Twitter)</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Podcast">Podcast Audio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Content Format *</label>
                    <input
                      type="text"
                      value={formData.contentFormat}
                      onChange={(e) => setFormData({ ...formData, contentFormat: e.target.value })}
                      placeholder="e.g. 1 Reel (30-60s) + 2 Stories"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Store / On-Site Visit Required?</span>
                    <span className="text-slate-500">Check this if the creator must physically visit your shop or cafe.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.storeVisitRequired}
                    onChange={(e) => setFormData({ ...formData, storeVisitRequired: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Content Licensing & Usage Rights</label>
                  <input
                    type="text"
                    value={formData.licensingTerms}
                    onChange={(e) => setFormData({ ...formData, licensingTerms: e.target.value })}
                    placeholder="e.g. 6 months Meta & Google digital ads usage"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 4: Budget & Compensation</h3>
                <p className="text-xs text-slate-600">Transparent compensation attracts the best verified creators.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Creator Fee (₹)</label>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Maximum Creator Fee (₹)</label>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Campaign Budget (₹)</label>
                  <input
                    type="number"
                    min={2000}
                    step={1000}
                    value={formData.totalBudget}
                    onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Escrow funds are deposited only when you accept a specific creator proposal.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Additional Compensation Perks</label>
                  <input
                    type="text"
                    value={formData.compensationDetails}
                    onChange={(e) => setFormData({ ...formData, compensationDetails: e.target.value })}
                    placeholder="e.g. Free gift hamper worth ₹3,000 + 15% affiliate sales commission"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: APPLICATION RULES & QUESTIONS */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 5: Creator Eligibility & Questions</h3>
                <p className="text-xs text-slate-600">Screen for relevant creators with targeted questions.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Creator Slots</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.slotsAvailable}
                      onChange={(e) => setFormData({ ...formData, slotsAvailable: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Screening Questions</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add question e.g. Do you have experience styling ethnic wear?"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {formData.customQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="text-slate-800">{q}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & PUBLISH */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 6: Live Marketplace Preview</h3>
                <p className="text-xs text-slate-600">This is how creators will view and apply to your campaign.</p>
              </div>

              {/* Card Preview */}
              <div className="bg-slate-50 rounded-2xl border-2 border-indigo-200 p-6 space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{currentUser?.name || 'Your Brand'}</span>
                      <span className="text-[10px] text-slate-500">{formData.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {formData.slotsAvailable} Slots
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{formData.title || 'Untitled Campaign'}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{formData.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">
                    📱 {formData.platform}
                  </span>
                  <span className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                    🎬 {formData.contentFormat}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Compensation</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(formData.budgetMin)} - {formatCurrency(formData.budgetMax)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600">
                    Deadline: {formData.deadline}
                  </span>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs text-indigo-900 flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  By publishing, your campaign will be visible to thousands of creators immediately. Funds remain with you until you approve a proposal.
                </span>
              </div>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div></div>}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 1 && !formData.title}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-1.5 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>Publish to Marketplace Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

