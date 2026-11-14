import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  CheckCircle2,
  Users,
  Eye,
  Plus,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Filter,
  DollarSign,
  TrendingUp,
  Store,
  Layers,
  Calendar,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCompactNumber } from '../utils';
import { LocalAdChannel } from '../types';

export const LocalAdsPage: React.FC = () => {
  const { localAdChannels, currentUser, isLoggedIn, setShowLoginModal, bookLocalAdBundle, createLocalAdChannel } = useApp();
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState<string>('Thiruvananthapuram');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showChannelModal, setShowChannelModal] = useState(false);

  // New Channel Form State
  const [channelName, setChannelName] = useState('');
  const [channelHandle, setChannelHandle] = useState('@tvm_guide');
  const [channelCity, setChannelCity] = useState('Thiruvananthapuram');
  const [channelNiche, setChannelNiche] = useState('Food & Beverage');
  const [channelReach, setChannelReach] = useState(45000);
  const [channelPrice, setChannelPrice] = useState(1500);
  const [channelPlatform, setChannelPlatform] = useState<'Instagram' | 'YouTube' | 'Facebook' | 'Local Media'>('Instagram');

  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([
    'local-tvm-1',
    'local-tvm-2',
    'local-tvm-3',
    'local-tvm-4',
    'local-tvm-5'
  ]);
  const [campaignTitle, setCampaignTitle] = useState("Authentic Malabar Feast Launch Promotion");
  const [bookingSuccessCollabId, setBookingSuccessCollabId] = useState<string | null>(null);

  const cities = ['Thiruvananthapuram', 'Kochi', 'Bengaluru', 'Mumbai'];
  const categories = ['All', 'Food & Beverage', 'Fashion & Style', 'Events & Lifestyle'];

  const filteredChannels = localAdChannels.filter((ch) => {
    const matchesCity = ch.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCat = selectedCategory === 'All' || ch.category === selectedCategory;
    return matchesCity && matchesCat;
  });

  const selectedChannels = localAdChannels.filter(c => selectedChannelIds.includes(c.id));
  const totalCost = selectedChannels.reduce((sum, c) => sum + c.price, 0);
  const totalReach = selectedChannels.reduce((sum, c) => sum + c.reach, 0);

  const toggleChannelSelection = (id: string) => {
    if (selectedChannelIds.includes(id)) {
      setSelectedChannelIds(selectedChannelIds.filter(i => i !== id));
    } else {
      setSelectedChannelIds([...selectedChannelIds, id]);
    }
  };

  const handleLaunchCampaign = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (selectedChannelIds.length === 0) {
      alert("Please select at least one local advertising channel.");
      return;
    }

    const collab = bookLocalAdBundle(selectedChannelIds, campaignTitle, totalCost);
    setBookingSuccessCollabId(collab.id);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-6 pb-20 sm:pt-8 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hyperlocal Advertising Network</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Promote Your Local Business Across Top Neighborhood Creators
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Why pay lakhs for national ads when your customers live within 10 km? Select 5 local creators, food review pages, or regional community channels in your city to launch an affordable, combined campaign in 1-click.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">City Selected</span>
              <span className="font-extrabold text-white">{selectedCity}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Example Campaign</span>
              <span className="font-extrabold text-emerald-300">₹10,000 for 5 Local Creators</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-slate-300 block text-[10px] font-bold uppercase">Escrow Protection</span>
              <span className="font-extrabold text-white">Guaranteed Delivery Verification</span>
            </div>

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                  return;
                }
                setShowChannelModal(true);
              }}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-md flex items-center space-x-1.5 cursor-pointer ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Local Page / Channel</span>
            </button>
          </div>
        </div>

        {/* Success Modal */}
        {bookingSuccessCollabId && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-emerald-900">Hyperlocal Campaign Booked & Escrow Secured!</h2>
              <p className="text-xs text-emerald-700 max-w-lg mx-auto">
                Your campaign "{campaignTitle}" with {selectedChannels.length} local channels has been created. Total budget of {formatCurrency(totalCost)} is held safely in escrow.
              </p>
            </div>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => navigate(`/collaborations/${bookingSuccessCollabId}`)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Open Collaboration Deal Room
              </button>
              <button
                onClick={() => setBookingSuccessCollabId(null)}
                className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* City & Category Filter Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Select City:</span>
            <div className="flex flex-wrap gap-1.5">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCity === city
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Niche:</span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid: Channel Catalog + Multi-Channel Booking Cart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Channels List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredChannels.length} channels in {selectedCity}</span>
              <span className="font-semibold text-emerald-600">Fixed-price packages with delivery escrow</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredChannels.map((channel) => {
                const isSelected = selectedChannelIds.includes(channel.id);
                return (
                  <div
                    key={channel.id}
                    onClick={() => toggleChannelSelection(channel.id)}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs cursor-pointer transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={channel.avatar}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h3 className="font-extrabold text-slate-900 text-sm">{channel.name}</h3>
                              {channel.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono">{channel.handle} • {channel.platform}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                          isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {channel.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          📍 {channel.area || channel.city}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          👥 {formatCompactNumber(channel.reach)} Reach
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                          ⚡ {channel.turnaroundDays}d turnaround
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Fixed Ad Slot</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatCurrency(channel.price)}
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700 font-black' : 'text-slate-500'}`}>
                        {isSelected ? '✓ Added to Bundle' : '+ Click to Add'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Multi-Channel Combined Booking Cart */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Combined Campaign Cart</h3>
                  <p className="text-xs text-slate-500">1-click booking across selected channels</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full text-xs">
                  {selectedChannels.length} Channels
                </span>
              </div>

              {/* Campaign Name Input */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-800 block">Campaign Title / Store Offer</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 20% Weekend Dining Festival"
                />
              </div>

              {/* Selected Channels List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedChannels.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    No channels selected. Click any channel on the left to add to your campaign bundle.
                  </p>
                ) : (
                  selectedChannels.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2 truncate">
                        <img src={c.avatar} alt="" className="w-6 h-6 rounded-md object-cover shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0 ml-2">{formatCurrency(c.price)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Aggregated Totals */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Channels:</span>
                  <strong className="text-slate-900">{selectedChannels.length}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Combined Local Reach:</span>
                  <strong className="text-emerald-700">{formatCompactNumber(totalReach)} Viewers</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Avg Cost Per Impression:</span>
                  <strong className="text-slate-900">₹{(totalReach > 0 ? (totalCost / totalReach) : 0).toFixed(3)}</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Total Campaign Budget:</span>
                  <span className="font-black text-emerald-700 text-lg">{formatCurrency(totalCost)}</span>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={handleLaunchCampaign}
                disabled={selectedChannels.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 ${
                  selectedChannels.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Hyperlocal Campaign ({formatCurrency(totalCost)})</span>
              </button>

              <div className="text-[10px] text-slate-500 text-center space-y-1">
                <p>🛡️ 100% Escrow Protection: Funds released only after delivery verification.</p>
                <p>📄 Automated GST Tax Invoice generated for your business.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Register Local Channel */}
        {showChannelModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    LOC
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">Register Local Creator / Channel</h3>
                </div>
                <button onClick={() => setShowChannelModal(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="text-lg">✕</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!channelName.trim()) return;
                  createLocalAdChannel({
                    name: channelName.trim(),
                    handle: channelHandle.trim(),
                    type: 'theme_page',
                    city: channelCity,
                    platform: channelPlatform,
                    turnaroundDays: 2,
                    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
                    category: channelNiche,
                    description: `Hyperlocal ${channelNiche} creator channel in ${channelCity}.`,
                    reach: Number(channelReach),
                    price: Number(channelPrice)
                  });
                  alert(`Local channel "${channelName}" published to colab.db! Local stores can now book ad bundles with your channel.`);
                  setShowChannelModal(false);
                  setChannelName('');
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Channel / Page Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trivandrum Food Trails"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Handle / ID</label>
                    <input
                      type="text"
                      required
                      placeholder="@tvm_foodies"
                      value={channelHandle}
                      onChange={(e) => setChannelHandle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Platform</label>
                    <select
                      value={channelPlatform}
                      onChange={(e) => setChannelPlatform(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Regional Media">Regional Media</option>
                      <option value="Telegram">Telegram Channel</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City Location</label>
                    <select
                      value={channelCity}
                      onChange={(e) => setChannelCity(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                      <option value="Kochi">Kochi</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Niche Category</label>
                    <select
                      value={channelNiche}
                      onChange={(e) => setChannelNiche(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Fashion & Style">Fashion & Style</option>
                      <option value="Events & Lifestyle">Events & Lifestyle</option>
                      <option value="Tech & Gadgets">Tech & Gadgets</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Local Audience Reach</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={channelReach}
                      onChange={(e) => setChannelReach(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bundle Slot Fee (₹)</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={channelPrice}
                      onChange={(e) => setChannelPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChannelModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                  >
                    Publish Local Channel to colab.db
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

