import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  Check,
  MessageSquare,
  Calendar,
  DollarSign,
  Mic,
  Play,
  Pause,
  Clock,
  ArrowRight,
  Tag,
  X,
  Plus,
  FileText,
  Sparkles,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime, formatCurrency } from '../utils';
import { StructuredCollaborationEnquiry, NegotiationQuote, Message } from '../types';

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    messages,
    sendMessage,
    sendVoiceNote,
    sendNegotiationQuote,
    respondToQuote,
    markConversationAsRead,
    currentUser,
    isLoggedIn,
    setShowLoginModal,
    collaborations
  } = useApp();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const convParam = searchParams.get('conv');
  const [selectedConvId, setSelectedConvId] = useState<string>(
    convParam || (conversations[0]?.id ?? '')
  );
  const [inputText, setInputText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'enquiries' | 'negotiations' | 'bookings' | 'deals'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Audio Playback Simulation State
  const [playingVoiceMsgId, setPlayingVoiceMsgId] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Send Formal Quotation Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState<string>('8000');
  const [quoteTimelineDays, setQuoteTimelineDays] = useState<number>(5);
  const [quoteUsageRights, setQuoteUsageRights] = useState('90 Days Digital & Paid Ad Rights');
  const [quoteTerms, setQuoteTerms] = useState('Includes 2 rounds of edits before final posting. 50% escrow advance.');
  const [quoteItems, setQuoteItems] = useState<{ item: string; price: number }[]>([
    { item: '1x Dedicated Instagram Reel (60s)', price: 5500 },
    { item: '2x Instagram Story integrations with Swipe-Up link', price: 2500 }
  ]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Counteroffer Modal State
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeQuoteForCounter, setActiveQuoteForCounter] = useState<NegotiationQuote | null>(null);
  const [counterAmount, setCounterAmount] = useState<string>('7000');
  const [counterNote, setCounterNote] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convParam) setSelectedConvId(convParam);
  }, [convParam]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (selectedConvId) {
      markConversationAsRead(selectedConvId);
    }
  }, [messages, selectedConvId]);

  // Voice Recording Timer Simulation
  useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <MessageSquare className="w-12 h-12 text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Please Sign In</h2>
          <p className="text-xs text-slate-500">
            Sign in to access your direct collaboration enquiries, negotiation quotes, and smart deal messages.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // Filter conversations by category and search
  const filteredConversations = conversations.filter((c) => {
    // Category match
    if (categoryFilter === 'enquiries' && c.category !== 'enquiries') return false;
    if (categoryFilter === 'negotiations' && c.category !== 'negotiations') return false;
    if (categoryFilter === 'bookings' && c.category !== 'bookings') return false;
    if (categoryFilter === 'deals' && !c.collaborationId) return false;

    // Search query match
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const names = Object.values(c.participantNames).join(' ').toLowerCase();
      const lastMsg = (c.lastMessage || '').toLowerCase();
      return names.includes(q) || lastMsg.includes(q);
    }
    return true;
  });

  const activeConv = conversations.find((c) => c.id === selectedConvId);
  const convMessages = messages.filter((m) => m.conversationId === selectedConvId);

  const getOtherParticipantId = (conv: typeof activeConv) => {
    if (!conv) return '';
    return conv.participantIds.find((id) => id !== currentUser?.id) || conv.participantIds[0];
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;
    sendMessage(selectedConvId, inputText.trim());
    setInputText('');
  };

  const handleToggleVoiceRecording = () => {
    if (isRecordingVoice) {
      // Finish recording and send
      setIsRecordingVoice(false);
      const duration = Math.max(3, recordingSeconds);
      sendVoiceNote(selectedConvId, duration);
    } else {
      setIsRecordingVoice(true);
    }
  };

  const handleAddDeliverableItem = () => {
    if (!newItemTitle.trim() || !newItemPrice) return;
    const priceNum = Number(newItemPrice);
    const updated = [...quoteItems, { item: newItemTitle.trim(), price: priceNum }];
    setQuoteItems(updated);
    const newTotal = updated.reduce((sum, it) => sum + it.price, 0);
    setQuoteAmount(newTotal.toString());
    setNewItemTitle('');
    setNewItemPrice('');
  };

  const handleRemoveDeliverableItem = (index: number) => {
    const updated = quoteItems.filter((_, i) => i !== index);
    setQuoteItems(updated);
    const newTotal = updated.reduce((sum, it) => sum + it.price, 0);
    setQuoteAmount(newTotal.toString());
  };

  const handleSendFormalQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !activeConv) return;
    const otherId = getOtherParticipantId(activeConv);
    const otherName = activeConv.participantNames[otherId] || 'Partner';

    sendNegotiationQuote({
      conversationId: selectedConvId,
      fromId: currentUser.id,
      fromName: currentUser.name,
      fromRole: currentUser.role,
      toId: otherId,
      toName: otherName,
      currentAmount: Number(quoteAmount) || 8000,
      itemizedDeliverables: quoteItems,
      timelineDays: Number(quoteTimelineDays) || 5,
      usageRights: quoteUsageRights,
      terms: quoteTerms
    });

    setShowQuoteModal(false);
  };

  const handleOpenCounteroffer = (quote: NegotiationQuote) => {
    setActiveQuoteForCounter(quote);
    setCounterAmount(Math.round(quote.currentAmount * 0.85).toString());
    setCounterNote('');
    setShowCounterModal(true);
  };

  const handleSubmitCounteroffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuoteForCounter) return;
    respondToQuote(
      activeQuoteForCounter.id,
      'counter',
      Number(counterAmount),
      counterNote || `Counteroffer of ₹${Number(counterAmount).toLocaleString()} proposed.`
    );
    setShowCounterModal(false);
    setActiveQuoteForCounter(null);
  };

  const handleAcceptQuote = (quote: NegotiationQuote) => {
    if (window.confirm(`Accept formal quotation of ${formatCurrency(quote.currentAmount)}? This will lock contract terms and establish the secure escrow Deal Room.`)) {
      respondToQuote(quote.id, 'accept');
    }
  };

  const handleRejectQuote = (quote: NegotiationQuote) => {
    const reason = window.prompt("Reason for declining quotation:", "Budget/scope mismatch");
    if (reason !== null) {
      respondToQuote(quote.id, 'reject', undefined, reason);
    }
  };

  // Pre-fill formal quote from a received Structured Enquiry
  const handlePreFillQuoteFromEnquiry = (enquiry: StructuredCollaborationEnquiry) => {
    setQuoteAmount(enquiry.budget.toString());
    const items = enquiry.expectedDeliverables.map((del) => ({
      item: del,
      price: Math.round(enquiry.budget / (enquiry.expectedDeliverables.length || 1))
    }));
    setQuoteItems(items);
    setQuoteUsageRights(enquiry.contentUsageRights || '90 Days Digital Ad Rights');
    setShowQuoteModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Aviora CRM Page Title Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Unified Professional Inbox
              </span>
              <span className="text-xs text-slate-400">Aviora CRM Engine</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Commercial Enquiries & Negotiations
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Send Formal Quotation</span>
            </button>
          </div>
        </div>

        {/* Main Inbox Workspace Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-premium overflow-hidden h-[780px] flex flex-col md:flex-row">
          {/* Conversation Sidebar (Aviora CRM Multi-Category View) */}
          <div className="w-full md:w-88 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/60 shrink-0">
            {/* Search Bar */}
            <div className="p-3.5 border-b border-slate-200/80 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search enquiries, proposals, brands..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Aviora CRM Category Filter Tabs */}
              <div className="flex items-center space-x-1 mt-3 overflow-x-auto scrollbar-none text-[11px] font-bold">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                    categoryFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('enquiries')}
                  className={`px-2.5 py-1 rounded-lg transition shrink-0 flex items-center space-x-1 ${
                    categoryFilter === 'enquiries'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Enquiries</span>
                </button>
                <button
                  onClick={() => setCategoryFilter('negotiations')}
                  className={`px-2.5 py-1 rounded-lg transition shrink-0 flex items-center space-x-1 ${
                    categoryFilter === 'negotiations'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Negotiations</span>
                </button>
                <button
                  onClick={() => setCategoryFilter('bookings')}
                  className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                    categoryFilter === 'bookings'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Bookings</span>
                </button>
                <button
                  onClick={() => setCategoryFilter('deals')}
                  className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                    categoryFilter === 'deals'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Deals</span>
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No conversations in this filter</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const otherId = getOtherParticipantId(conv);
                  const name = conv.participantNames[otherId] || 'Commercial Partner';
                  const avatar = conv.participantAvatars[otherId] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  const role = conv.participantRoles[otherId] || 'creator';
                  const isSelected = conv.id === selectedConvId;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-3.5 sm:p-4 flex items-start space-x-3 cursor-pointer transition ${
                        isSelected
                          ? 'bg-indigo-50/90 border-r-4 border-indigo-600 shadow-2xs'
                          : 'hover:bg-slate-100/70 bg-white/40'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={avatar}
                          alt=""
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                        />
                        <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 truncate">
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">{name}</h4>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {role}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                            {formatRelativeTime(conv.lastMessageTime || '')}
                          </span>
                        </div>

                        {/* Category Tag pill */}
                        <div className="flex items-center space-x-1 mt-1">
                          {conv.category === 'enquiries' && (
                            <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                              Enquiry
                            </span>
                          )}
                          {conv.category === 'negotiations' && (
                            <span className="text-[9px] font-extrabold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                              Negotiation
                            </span>
                          )}
                          {conv.category === 'bookings' && (
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                              Booking
                            </span>
                          )}
                          {conv.collaborationId && (
                            <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                              Deal Room
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                          <p className="truncate pr-2 text-[11px]">{conv.lastMessage || 'Open discussion'}</p>
                          <div className="flex items-center space-x-1 shrink-0">
                            {conv.unreadCount > 0 ? (
                              <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                                {conv.unreadCount}
                              </span>
                            ) : (
                              <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Conversation Chat Window */}
          {activeConv ? (
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-xs">
                {(() => {
                  const otherId = getOtherParticipantId(activeConv);
                  const name = activeConv.participantNames[otherId] || 'User';
                  const avatar = activeConv.participantAvatars[otherId] || '';
                  const role = activeConv.participantRoles[otherId] || 'creator';

                  return (
                    <div className="flex items-center space-x-3">
                      <img src={avatar} alt="" className="w-10 h-10 rounded-2xl object-cover shadow-xs ring-1 ring-slate-200" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-extrabold text-slate-900 text-sm">{name}</h3>
                          <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {role}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Verified Commercial Deal Room Active</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Header Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Quotation</span>
                  </button>

                  {activeConv.collaborationId && (
                    <button
                      onClick={() => navigate(`/collaborations/${activeConv.collaborationId}`)}
                      className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      <span>Smart Deal Room</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                {convMessages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-600">Start the conversation</p>
                    <p>Send a structured brief, voice note, or formal quotation below.</p>
                  </div>
                ) : (
                  convMessages.map((msg) => {
                    const isMine = msg.senderId === currentUser?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-full`}
                      >
                        {/* 1. STRUCTURED ENQUIRY CARD RENDERING */}
                        {msg.attachmentType === 'enquiry' && msg.attachmentMetadata ? (
                          <div className="max-w-lg w-full bg-white rounded-3xl border border-indigo-200 shadow-md p-5 space-y-4 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center space-x-2">
                                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                  <FileText className="w-4 h-4" />
                                </span>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider block">
                                    Structured Collaboration Enquiry
                                  </span>
                                  <h4 className="font-extrabold text-slate-900 text-sm">
                                    {msg.attachmentMetadata.projectNeed}
                                  </h4>
                                </div>
                              </div>
                              <span className="text-base font-black text-slate-900 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                                {formatCurrency(msg.attachmentMetadata.budget)}
                              </span>
                            </div>

                            <div className="space-y-2 text-slate-700">
                              <div className="flex items-start justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-400 font-bold text-[11px]">Deliverables:</span>
                                <span className="font-semibold text-right max-w-xs">
                                  {Array.isArray(msg.attachmentMetadata.expectedDeliverables)
                                    ? msg.attachmentMetadata.expectedDeliverables.join(', ')
                                    : msg.attachmentMetadata.expectedDeliverables}
                                </span>
                              </div>

                              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-400 font-bold text-[11px]">Timeline / Dates:</span>
                                <span className="font-semibold">{msg.attachmentMetadata.campaignDates || 'Flexible'}</span>
                              </div>

                              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-400 font-bold text-[11px]">Location / Mode:</span>
                                <span className="font-semibold">{msg.attachmentMetadata.location || 'Remote'}</span>
                              </div>

                              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-400 font-bold text-[11px]">Content Usage Rights:</span>
                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                  {msg.attachmentMetadata.contentUsageRights}
                                </span>
                              </div>

                              <div className="flex items-start justify-between py-1">
                                <span className="text-slate-400 font-bold text-[11px]">Target KPIs:</span>
                                <span className="font-semibold text-right text-emerald-700">
                                  🎯 {msg.attachmentMetadata.expectedResults}
                                </span>
                              </div>
                            </div>

                            {/* Action to convert enquiry into formal quotation */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">
                                From: {msg.attachmentMetadata.senderName || 'Brand Partner'}
                              </span>
                              <button
                                onClick={() => handlePreFillQuoteFromEnquiry(msg.attachmentMetadata)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                              >
                                <span>Send Formal Quote</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : msg.attachmentType === 'quote' && msg.attachmentMetadata ? (
                          /* 2. FORMAL NEGOTIATION QUOTATION CARD WITH AUDIT LADDER */
                          <div className="max-w-lg w-full bg-white rounded-3xl border border-purple-200 shadow-md p-5 space-y-4 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center space-x-2">
                                <span className="p-1.5 bg-purple-50 text-purple-700 rounded-xl">
                                  <DollarSign className="w-4 h-4" />
                                </span>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider block">
                                    Formal Quotation & Negotiation
                                  </span>
                                  <h4 className="font-black text-slate-900 text-base">
                                    {formatCurrency(msg.attachmentMetadata.currentAmount)}
                                  </h4>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <span
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                  msg.attachmentMetadata.status === 'accepted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : msg.attachmentMetadata.status === 'countered'
                                    ? 'bg-amber-100 text-amber-900'
                                    : msg.attachmentMetadata.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {msg.attachmentMetadata.status === 'accepted'
                                  ? '✓ Agreed & Escrow Locked'
                                  : msg.attachmentMetadata.status === 'countered'
                                  ? '🔄 Counteroffer Active'
                                  : msg.attachmentMetadata.status === 'rejected'
                                  ? '❌ Declined'
                                  : '⏳ Pending Response'}
                              </span>
                            </div>

                            {/* Itemized Deliverables Table */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Itemized Scope & Deliverables
                              </span>
                              <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 border border-slate-100">
                                {msg.attachmentMetadata.itemizedDeliverables?.map((del: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-800">{del.item}</span>
                                    <span className="font-extrabold text-slate-900">{formatCurrency(del.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Terms and turnaround */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <span className="font-bold text-slate-400 block text-[9px] uppercase">Turnaround:</span>
                                <span className="font-semibold">{msg.attachmentMetadata.timelineDays} Business Days</span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <span className="font-bold text-slate-400 block text-[9px] uppercase">Usage Rights:</span>
                                <span className="font-semibold truncate block">{msg.attachmentMetadata.usageRights}</span>
                              </div>
                            </div>

                            {/* Negotiation Trail Audit History */}
                            {msg.attachmentMetadata.history && msg.attachmentMetadata.history.length > 0 && (
                              <div className="border-t border-slate-100 pt-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                  Negotiation Audit Trail:
                                </span>
                                <div className="space-y-1.5 pl-2 border-l-2 border-indigo-200">
                                  {msg.attachmentMetadata.history.map((step: any, sIdx: number) => (
                                    <div key={sIdx} className="text-[11px] text-slate-600">
                                      <span className="font-extrabold text-slate-900">{step.senderName}</span>:{' '}
                                      <span className="font-bold text-indigo-700">{formatCurrency(step.amount)}</span>{' '}
                                      <span className="text-slate-400 text-[10px]">({step.note})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Negotiation Action Buttons */}
                            {msg.attachmentMetadata.status !== 'accepted' && msg.attachmentMetadata.status !== 'rejected' && (
                              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                                <button
                                  onClick={() => handleRejectQuote(msg.attachmentMetadata)}
                                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleOpenCounteroffer(msg.attachmentMetadata)}
                                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition shadow-2xs"
                                >
                                  Submit Counteroffer
                                </button>
                                <button
                                  onClick={() => handleAcceptQuote(msg.attachmentMetadata)}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm"
                                >
                                  Accept at {formatCurrency(msg.attachmentMetadata.currentAmount)}
                                </button>
                              </div>
                            )}

                            {/* If Accepted, show link to Deal Room */}
                            {msg.attachmentMetadata.status === 'accepted' && (
                              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                                <span className="font-bold">Deal locked into Smart Contract</span>
                                <button
                                  onClick={() => navigate('/collaborations')}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center space-x-1"
                                >
                                  <span>View Deal Room</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : msg.attachmentType === 'booking' && msg.attachmentMetadata ? (
                          /* 3. INSTANT BOOKING CARD */
                          <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200 shadow-md p-5 space-y-3 text-xs">
                            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                              <span className="p-1.5 bg-amber-50 text-amber-800 rounded-xl">
                                <Calendar className="w-4 h-4" />
                              </span>
                              <div>
                                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                                  Instant Service Booking
                                </span>
                                <h4 className="font-black text-slate-900 text-sm">
                                  {msg.attachmentMetadata.serviceTitle}
                                </h4>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-slate-700">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Date & Time:</span>
                                <span className="font-bold">{msg.attachmentMetadata.date} ({msg.attachmentMetadata.timeSlot})</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Amount in Escrow:</span>
                                <span className="font-extrabold text-slate-900">{formatCurrency(msg.attachmentMetadata.price)}</span>
                              </div>
                            </div>
                            {msg.attachmentMetadata.conditions && (
                              <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl italic">
                                📋 {msg.attachmentMetadata.conditions}
                              </p>
                            )}
                            {msg.attachmentMetadata.collabId && (
                              <button
                                onClick={() => navigate(`/collaborations/${msg.attachmentMetadata.collabId}`)}
                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center space-x-1"
                              >
                                <span>Go to Deal Room</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : msg.attachmentType === 'voice_note' ? (
                          /* 4. VOICE NOTE WAVEFORM BUBBLE */
                          <div
                            className={`p-3.5 rounded-2xl max-w-sm flex items-center space-x-3 shadow-xs ${
                              isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                            }`}
                          >
                            <button
                              onClick={() => {
                                if (playingVoiceMsgId === msg.id) {
                                  setPlayingVoiceMsgId(null);
                                } else {
                                  setPlayingVoiceMsgId(msg.id);
                                }
                              }}
                              className={`p-2 rounded-full transition ${
                                isMine ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                              }`}
                            >
                              {playingVoiceMsgId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>

                            {/* Simulated Voice Waveform Bars */}
                            <div className="flex items-center space-x-1 h-6">
                              {[12, 24, 16, 28, 20, 14, 26, 18, 22, 15, 25, 12, 19, 27, 10].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isMine ? 'bg-white/80' : 'bg-indigo-500'
                                  } ${playingVoiceMsgId === msg.id ? 'animate-pulse' : ''}`}
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>

                            <span className="text-[11px] font-bold shrink-0">
                              0:{msg.voiceNoteDuration || 28}
                            </span>
                          </div>
                        ) : (
                          /* 5. STANDARD TEXT MESSAGE */
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMine
                                ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                        )}

                        {/* Timestamp & Read Receipt */}
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1 px-1">
                          <span>{formatRelativeTime(msg.timestamp)}</span>
                          {isMine && (
                            <span title="Read by recipient">
                              <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box & Voice / Quote Tools */}
              <div className="p-3 border-t border-slate-200 bg-white space-y-2">
                {isRecordingVoice && (
                  <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-rose-800 text-xs animate-pulse">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                      <span className="font-bold">Recording voice note... ({recordingSeconds}s)</span>
                    </div>
                    <button
                      onClick={handleToggleVoiceRecording}
                      className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs"
                    >
                      Stop & Send
                    </button>
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(true)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600 rounded-xl text-xs transition"
                    title="Send Formal Quotation"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleVoiceRecording}
                    className={`p-2.5 rounded-xl text-xs transition ${
                      isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title={isRecordingVoice ? 'Stop recording' : 'Record voice note'}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder="Type a message or discuss contract terms..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Select a conversation</p>
              <p>Choose an enquiry or deal from the left sidebar to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* FORMAL QUOTATION BUILDER MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider block">
                  Proposal & Negotiation Engine
                </span>
                <h3 className="text-lg font-black text-slate-900">Create Formal Quotation</h3>
                <p className="text-xs text-slate-500">
                  Itemize your deliverables. The client can accept or counteroffer your quotation.
                </p>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendFormalQuote} className="space-y-4 text-xs">
              {/* Itemized Deliverables */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Itemized Deliverables & Pricing Breakdown:
                </label>
                <div className="space-y-2 mb-2 max-h-40 overflow-y-auto pr-1">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                      <span className="font-semibold text-slate-800">{item.item}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{formatCurrency(item.price)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverableItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Deliverable title (e.g. 1x 60s Reel)"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverableItem}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Total Quotation Amount */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">Total Formal Quotation:</span>
                  <span className="text-xl font-black text-indigo-900">{formatCurrency(Number(quoteAmount))}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Deliverables Count:</span>
                  <span className="font-extrabold text-slate-800">{quoteItems.length} items</span>
                </div>
              </div>

              {/* Turnaround & Usage Rights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Turnaround Timeline (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quoteTimelineDays}
                    onChange={(e) => setQuoteTimelineDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Content Usage Rights
                  </label>
                  <input
                    type="text"
                    value={quoteUsageRights}
                    onChange={(e) => setQuoteUsageRights(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Agreement Terms & Revision Policy
                </label>
                <textarea
                  rows={2}
                  value={quoteTerms}
                  onChange={(e) => setQuoteTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md shadow-indigo-200 transition"
                >
                  Send Formal Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUNTEROFFER MODAL */}
      {showCounterModal && activeQuoteForCounter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">
                  Negotiation Counteroffer
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Propose Counteroffer to {activeQuoteForCounter.fromName}
                </h3>
              </div>
              <button
                onClick={() => setShowCounterModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCounteroffer} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                <span className="text-slate-500 font-bold">Current Quotation:</span>
                <span className="font-black text-slate-900 line-through text-sm">
                  {formatCurrency(activeQuoteForCounter.currentAmount)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Your Proposed Counter Amount (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Note / Reason for Counteroffer:
                </label>
                <textarea
                  rows={2}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="e.g. Can meet at ₹7,000 if stories are included without additional revisions."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition"
                >
                  Submit Counteroffer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
