import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  Layers,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Share2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCompactNumber } from '../utils';
import { CreatorCollective } from '../types';

export const CollectivesPage: React.FC = () => {
  const { creatorCollectives, currentUser, isLoggedIn, setShowLoginModal, bookCreatorCollective } = useApp();
  const navigate = useNavigate();

  const [selectedCollective, setSelectedCollective] = useState<CreatorCollective | null>(null);
  const [bookingNote, setBookingNote] = useState('');
  const [bookedCollabId, setBookedCollabId] = useState<string | null>(null);

  const handleBookCollective = (collective: CreatorCollective) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    const collab = bookCreatorCollective(collective.id, bookingNote);
    setSelectedCollective(null);
    setBookedCollabId(collab.id);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span>Multi-Creator Synergy</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Creator Collectives & Group Campaign Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Why negotiate with 10 different creators separately? Book pre-vetted regional syndicates and thematic creator collectives in 1 campaign package. Unified contract, coordinated delivery, and automated escrow distribution.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Popular Package</span>
              <span className="font-extrabold text-violet-300">10 Kerala Food Creators Bundle (1.4M Reach)</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Booking Simplicity</span>
              <span className="font-extrabold text-white">1 Invoice • All Creators Covered</span>
            </div>
          </div>
        </div>

        {/* Success Confirmation */}
        {bookedCollabId && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 shadow-md animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-extrabold text-emerald-900">Creator Collective Campaign Booked!</h2>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Your collective campaign agreement has been generated and escrow has been funded. Deliverable submissions will be reviewed in your Deal Room.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate(`/collaborations/${bookedCollabId}`)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
              >
                Go to Collaboration Deal Room
              </button>
            </div>
          </div>
        )}

        {/* Collectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorCollectives.map((collective) => (
            <div
              key={collective.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Cover Image & Category Badge */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={collective.coverImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {collective.category}
                    </span>
                    <span className="bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {collective.memberCount} Creators
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-violet-400" />
                      <span>{collective.city}, {collective.region}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base leading-tight mt-0.5">
                      {collective.title}
                    </h3>
                  </div>
                </div>

                {/* Content description & metrics */}
                <div className="px-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {collective.description}
                  </p>

                  {/* Reach & Followers Strip */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Combined Reach</span>
                      <span className="font-extrabold text-violet-700 text-sm">
                        {formatCompactNumber(collective.combinedReach)}+
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Combined Audience</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatCompactNumber(collective.combinedFollowers)} Followers
                      </span>
                    </div>
                  </div>

                  {/* Deliverables checklist preview */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Package Includes:</span>
                    {collective.deliverables.slice(0, 2).map((del, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium line-clamp-1">{del}</span>
                      </div>
                    ))}
                  </div>

                  {/* Member avatars */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex -space-x-2 overflow-hidden">
                      {collective.members.slice(0, 5).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={`${m.name} (${m.role})`}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                        />
                      ))}
                      {collective.members.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
                          +{collective.members.length - 5}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedCollective(collective)}
                      className="text-xs text-violet-600 font-bold hover:text-violet-800"
                    >
                      View All Members
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking CTA */}
              <div className="p-5 pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bundle Price</span>
                  <span className="font-black text-slate-900 text-lg">
                    {formatCurrency(collective.bundlePrice)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCollective(collective)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5"
                >
                  <span>Book Package</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Collective Detail & Booking Modal */}
        {selectedCollective && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setSelectedCollective(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-violet-600 text-xs font-bold uppercase tracking-wider">
                  {selectedCollective.category} • {selectedCollective.city}
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedCollective.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedCollective.description}</p>
              </div>

              {/* Deliverables List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Included Collective Deliverables:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedCollective.deliverables.map((del, i) => (
                    <div key={i} className="flex items-start space-x-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Member Roster */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Member Creators in this Syndicate ({selectedCollective.members.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCollective.members.map((m) => (
                    <div key={m.id} className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <img src={m.avatar} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">{m.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono block">{m.handle} • {m.followers}</span>
                        <span className="text-[10px] text-violet-700 font-semibold">{m.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Form Note */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-800 block">Brief Note for the Creators (Brand / Campaign Goal)</label>
                <textarea
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  placeholder="e.g. Promoting our new dining outlet in Kowdiar, Trivandrum. Looking for weekend family dining reels..."
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Unified Package Rate</span>
                  <span className="text-xl font-black text-slate-900">
                    {formatCurrency(selectedCollective.bundlePrice)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedCollective(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBookCollective(selectedCollective)}
                    className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-md transition"
                  >
                    Confirm & Fund Escrow ({formatCurrency(selectedCollective.bundlePrice)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
