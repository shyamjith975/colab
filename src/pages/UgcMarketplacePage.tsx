import React, { useState } from 'react';
import {
  Video,
  Camera,
  Scissors,
  FileEdit,
  Star,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreativeProfessional } from '../types';
import { formatCurrency } from '../utils';

export const UgcMarketplacePage: React.FC = () => {
  const { creativeProfessionals, createOrGetConversation } = useApp();
  const [selectedRole, setSelectedRole] = useState('All');
  const [activeProfessional, setActiveProfessional] = useState<CreativeProfessional | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderBrief, setOrderBrief] = useState('');

  const roles = [
    'All',
    'UGC Creator',
    'Video Editor',
    'Photographer',
    'Copywriter'
  ];

  const filtered = creativeProfessionals.filter((p) => {
    if (selectedRole !== 'All' && p.role !== selectedRole) return false;
    return true;
  });

  const handleOpenOrder = (prof: CreativeProfessional) => {
    setActiveProfessional(prof);
    setOrderBrief('');
    setShowOrderModal(true);
  };

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Order brief sent to ${activeProfessional?.name}! They will confirm timeline and start your asset production.`);
    setShowOrderModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-1.5 bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Independent Creative Talent</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            UGC Creators & Creative Professionals
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hire video editors, UGC ad creators, photographers and copywriters without needing massive follower counts. Pure conversion and high production skill.
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none text-xs">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
                selectedRole === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={prof.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-50" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{prof.name}</h3>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {prof.role}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prof.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {prof.skills.map((s, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Rating & Turnaround */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Rating</span>
                    <span className="font-bold text-amber-800 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{prof.rating} ({prof.reviewsCount})</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Speed</span>
                    <span className="font-bold text-slate-800 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{prof.turnaroundDays}d Delivery</span>
                    </span>
                  </div>
                </div>

                {/* Portfolio Samples */}
                {prof.portfolio.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Sample Work</span>
                    <div className="flex items-center space-x-2">
                      {prof.portfolio.map((item, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden w-16 h-12 border border-slate-200">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer */}
              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Starting at</span>
                  <span className="font-black text-indigo-700 text-base">
                    {formatCurrency(prof.startingPrice)}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenOrder(prof)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  Hire Talent
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER MODAL */}
        {showOrderModal && activeProfessional && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Hire {activeProfessional.name} ({activeProfessional.role})
                  </h3>
                  <span className="text-xs text-indigo-700 font-bold">
                    Starting from {formatCurrency(activeProfessional.startingPrice)}
                  </span>
                </div>
                <button onClick={() => setShowOrderModal(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSendOrder} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Describe Your Asset Requirement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={orderBrief}
                    onChange={(e) => setOrderBrief(e.target.value)}
                    placeholder="Specify video duration, script hooks, footage link, sound design or product still specifications..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px]">
                  ⚡ Fast turnaround: {activeProfessional.turnaroundDays} business days with unlimited revisions for script compliance.
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Send Production Brief
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

