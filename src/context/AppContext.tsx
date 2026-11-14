import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  CreatorProfile,
  BusinessProfile,
  Campaign,
  CampaignApplication,
  Collaboration,
  DeliverableSubmission,
  SponsorshipOpportunity,
  CreativeProfessional,
  AdInventoryItem,
  Review,
  Transaction,
  PlatformSettings,
  Message,
  Conversation,
  LocalAdChannel,
  CreatorCollective,
  AffiliateProgram,
  CreatorAffiliateLink,
  BookingSlot,
  PerformanceAttribution,
  ProfessionalSubProfile,
  SponsorRequirementRFP,
  StructuredCollaborationEnquiry,
  NegotiationQuote
} from '../types';
import {
  DEMO_USERS,
  CREATORS,
  BUSINESSES,
  CAMPAIGNS,
  SPONSORSHIPS,
  CREATIVE_PROFESSIONALS,
  AD_INVENTORY,
  COLLABORATIONS,
  REVIEWS,
  TRANSACTIONS,
  INITIAL_SETTINGS,
  LOCAL_AD_CHANNELS,
  CREATOR_COLLECTIVES,
  AFFILIATE_PROGRAMS,
  CREATOR_AFFILIATE_LINKS,
  BOOKING_SLOTS,
  PERFORMANCE_ATTRIBUTIONS,
  SPONSOR_RFPS,
  STRUCTURED_ENQUIRIES,
  NEGOTIATION_QUOTES
} from '../data/mockData';
import { api } from '../services/api';

interface AppContextType {
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  login: (user?: UserProfile) => void;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  signupWithPassword: (payload: { email: string; password: string; name: string; role: UserRole; bio?: string; location?: string }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  users: UserProfile[];
  creators: CreatorProfile[];
  businesses: BusinessProfile[];
  campaigns: Campaign[];
  applications: CampaignApplication[];
  collaborations: Collaboration[];
  sponsorships: SponsorshipOpportunity[];
  creativeProfessionals: CreativeProfessional[];
  adInventory: AdInventoryItem[];
  reviews: Review[];
  transactions: Transaction[];
  settings: PlatformSettings;
  conversations: Conversation[];
  messages: Message[];
  localAdChannels: LocalAdChannel[];
  creatorCollectives: CreatorCollective[];
  affiliatePrograms: AffiliateProgram[];
  creatorAffiliateLinks: CreatorAffiliateLink[];
  bookingSlots: BookingSlot[];
  performanceAttributions: PerformanceAttribution[];
  sponsorRfps: SponsorRequirementRFP[];
  structuredEnquiries: StructuredCollaborationEnquiry[];
  negotiationQuotes: NegotiationQuote[];
  
  // Actions
  createSponsorRfp: (rfp: Omit<SponsorRequirementRFP, 'id' | 'sponsorId' | 'sponsorName' | 'sponsorLogo' | 'proposalsCount' | 'createdAt'>) => SponsorRequirementRFP;
  switchSubProfile: (subProfileId: string) => void;
  createOrUpdateSubProfile: (profile: ProfessionalSubProfile) => void;
  bookConsultationSlot: (slotId: string, clientName: string) => void;
  bookServiceWithConditions: (creatorId: string, slotId: string, serviceTitle: string, date: string, timeSlot: string, price: number, conditions: string, clientNote?: string) => Collaboration;
  joinAffiliateProgram: (programId: string) => CreatorAffiliateLink;
  simulateAffiliateOrder: (linkId: string, orderValue: number) => void;
  bookLocalAdBundle: (channelIds: string[], campaignTitle: string, totalAmount: number) => Collaboration;
  bookCreatorCollective: (collectiveId: string, businessNote: string) => Collaboration;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'businessVerified' | 'applicantsCount' | 'shortlistedCount' | 'createdAt'>) => Campaign;
  applyToCampaign: (application: Omit<CampaignApplication, 'id' | 'appliedAt' | 'status'>) => void;
  updateApplicationStatus: (applicationId: string, status: CampaignApplication['status']) => void;
  createCollaborationFromApplication: (applicationId: string) => Collaboration;
  updateCollaborationDeliverable: (collabId: string, deliverableId: string, submissionUrl: string) => void;
  requestDeliverableRevision: (collabId: string, deliverableId: string, feedback: string) => void;
  approveDeliverable: (collabId: string, deliverableId: string) => void;
  releaseEscrowPayment: (collabId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'verifiedCollaboration'>) => void;
  sendMessage: (conversationId: string, text: string, attachmentUrl?: string, attachmentType?: Message['attachmentType'], attachmentMetadata?: any) => void;
  sendVoiceNote: (conversationId: string, durationSeconds?: number) => void;
  sendStructuredEnquiry: (enquiryData: Omit<StructuredCollaborationEnquiry, 'id' | 'createdAt' | 'status'>) => string;
  sendNegotiationQuote: (quoteData: Omit<NegotiationQuote, 'id' | 'createdAt' | 'status' | 'history'>) => NegotiationQuote;
  respondToQuote: (quoteId: string, action: 'accept' | 'counter' | 'reject', counterAmount?: number, note?: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  createOrGetConversation: (targetUserId: string, collaborationId?: string) => string;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  toggleUserVerification: (userId: string) => void;
  updateCampaignStatus: (campaignId: string, status: Campaign['status']) => void;
  bookAdInventory: (inventoryId: string, date: string) => void;
  createAdInventoryItem: (data: Omit<AdInventoryItem, 'id' | 'slotsRemaining' | 'creatorId' | 'creatorName' | 'creatorAvatar'>) => AdInventoryItem;
  createLocalAdChannel: (data: Omit<LocalAdChannel, 'id' | 'verified'>) => LocalAdChannel;
  createSponsorshipOpportunity: (data: Omit<SponsorshipOpportunity, 'id' | 'proposalCount' | 'verifiedOrganiser' | 'organiserId' | 'organiserName' | 'organiserAvatar'>) => SponsorshipOpportunity;
  submitSponsorshipProposal: (sponsorshipId: string, packageId: string, note: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('colab_is_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedLogin = localStorage.getItem('colab_is_logged_in');
    if (savedLogin === 'false') return null;
    const saved = localStorage.getItem('colab_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('colab_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [creators, setCreators] = useState<CreatorProfile[]>(() => {
    const saved = localStorage.getItem('colab_creators');
    return saved ? JSON.parse(saved) : CREATORS;
  });

  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem('colab_businesses');
    return saved ? JSON.parse(saved) : BUSINESSES;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('colab_campaigns');
    return saved ? JSON.parse(saved) : CAMPAIGNS;
  });

  const [applications, setApplications] = useState<CampaignApplication[]>(() => {
    const saved = localStorage.getItem('colab_applications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'app-sample-1',
        campaignId: 'camp-1',
        campaignTitle: 'Spring Pastel Handloom Collection Launch',
        creatorId: 'user-creator-1',
        creatorName: 'Ananya Sharma',
        creatorHandle: '@ananya_style',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        creatorCategory: 'Fashion & Style',
        creatorFollowers: 185000,
        creatorRating: 4.9,
        proposedRate: 3500,
        deliveryDays: 4,
        pitch: 'I love your artisanal cotton kurtis! I have a high-converting styling series "Desk to Dinner" where I can feature 3 pastel outfits. 78% of my audience are working women looking for daily chic looks.',
        portfolioLinks: ['https://instagram.com/p/sample1'],
        status: 'accepted',
        appliedAt: '2026-11-04T10:00:00Z'
      },
      {
        id: 'app-sample-2',
        campaignId: 'camp-1',
        campaignTitle: 'Spring Pastel Handloom Collection Launch',
        creatorId: 'user-creator-20',
        creatorName: 'Nisha Bano',
        creatorHandle: '@nisha_crafts',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        creatorCategory: 'Fashion & Style',
        creatorFollowers: 68000,
        creatorRating: 5.0,
        proposedRate: 1500,
        deliveryDays: 3,
        pitch: 'I create authentic handmade crafts and styling content. I can showcase your handcrafted handloom pieces with high organic engagement.',
        portfolioLinks: ['https://instagram.com/p/crafts2'],
        status: 'pending',
        appliedAt: '2026-11-05T14:30:00Z'
      }
    ];
  });

  const [collaborations, setCollaborations] = useState<Collaboration[]>(() => {
    const saved = localStorage.getItem('colab_collaborations');
    return saved ? JSON.parse(saved) : COLLABORATIONS;
  });

  const [sponsorships, setSponsorships] = useState<SponsorshipOpportunity[]>(() => {
    const saved = localStorage.getItem('colab_sponsorships');
    return saved ? JSON.parse(saved) : SPONSORSHIPS;
  });

  const [creativeProfessionals] = useState<CreativeProfessional[]>(CREATIVE_PROFESSIONALS);
  const [adInventory, setAdInventory] = useState<AdInventoryItem[]>(() => {
    const saved = localStorage.getItem('colab_ad_inventory');
    return saved ? JSON.parse(saved) : AD_INVENTORY;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('colab_reviews');
    return saved ? JSON.parse(saved) : REVIEWS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('colab_transactions');
    return saved ? JSON.parse(saved) : TRANSACTIONS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('colab_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('colab_conversations');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'conv-101',
        participantIds: ['user-creator-1', 'user-biz-1'],
        participantNames: {
          'user-creator-1': 'Ananya Sharma',
          'user-biz-1': 'Aroma Threads Boutique'
        },
        participantAvatars: {
          'user-creator-1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          'user-biz-1': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80'
        },
        participantRoles: {
          'user-creator-1': 'creator',
          'user-biz-1': 'business'
        },
        lastMessage: 'I have uploaded the 4K draft preview to the deal room! Let me know if you would like any text overlay tweaks.',
        lastMessageTime: '2026-11-12T16:22:00Z',
        unreadCount: 1,
        collaborationId: 'collab-101'
      }
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('colab_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg-1',
        conversationId: 'conv-101',
        senderId: 'user-biz-1',
        senderName: 'Aroma Threads Boutique',
        senderRole: 'business',
        text: 'Hi Ananya! We are thrilled to work with you on our Spring Pastel launch. The kurti package has been dispatched to your Mumbai address.',
        timestamp: '2026-11-06T10:00:00Z',
        isRead: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-101',
        senderId: 'user-creator-1',
        senderName: 'Ananya Sharma',
        senderRole: 'creator',
        text: 'Received the package yesterday! The fabric quality and lilac color are stunning. I have planned a high-energy morning transition shoot.',
        timestamp: '2026-11-08T14:15:00Z',
        isRead: true
      },
      {
        id: 'msg-3',
        conversationId: 'conv-101',
        senderId: 'user-creator-1',
        senderName: 'Ananya Sharma',
        senderRole: 'creator',
        text: 'I have uploaded the 4K draft preview to the deal room! Let me know if you would like any text overlay tweaks.',
        timestamp: '2026-11-12T16:22:00Z',
        isRead: false
      }
    ];
  });

  const [localAdChannels, setLocalAdChannels] = useState<LocalAdChannel[]>(() => {
    const saved = localStorage.getItem('colab_local_channels');
    return saved ? JSON.parse(saved) : LOCAL_AD_CHANNELS;
  });

  const [creatorCollectives, setCreatorCollectives] = useState<CreatorCollective[]>(() => {
    const saved = localStorage.getItem('colab_creator_collectives');
    return saved ? JSON.parse(saved) : CREATOR_COLLECTIVES;
  });

  const [affiliatePrograms, setAffiliatePrograms] = useState<AffiliateProgram[]>(() => {
    const saved = localStorage.getItem('colab_affiliate_programs');
    return saved ? JSON.parse(saved) : AFFILIATE_PROGRAMS;
  });

  const [creatorAffiliateLinks, setCreatorAffiliateLinks] = useState<CreatorAffiliateLink[]>(() => {
    const saved = localStorage.getItem('colab_creator_affiliate_links');
    return saved ? JSON.parse(saved) : CREATOR_AFFILIATE_LINKS;
  });

  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>(() => {
    const saved = localStorage.getItem('colab_booking_slots');
    return saved ? JSON.parse(saved) : BOOKING_SLOTS;
  });

  const [performanceAttributions, setPerformanceAttributions] = useState<PerformanceAttribution[]>(() => {
    const saved = localStorage.getItem('colab_performance_attributions');
    return saved ? JSON.parse(saved) : PERFORMANCE_ATTRIBUTIONS;
  });

  const [sponsorRfps, setSponsorRfps] = useState<SponsorRequirementRFP[]>(() => {
    const saved = localStorage.getItem('colab_sponsor_rfps');
    return saved ? JSON.parse(saved) : SPONSOR_RFPS;
  });

  const [structuredEnquiries, setStructuredEnquiries] = useState<StructuredCollaborationEnquiry[]>(() => {
    const saved = localStorage.getItem('colab_structured_enquiries');
    return saved ? JSON.parse(saved) : STRUCTURED_ENQUIRIES;
  });

  const [negotiationQuotes, setNegotiationQuotes] = useState<NegotiationQuote[]>(() => {
    const saved = localStorage.getItem('colab_negotiation_quotes');
    return saved ? JSON.parse(saved) : NEGOTIATION_QUOTES;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('colab_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('colab_structured_enquiries', JSON.stringify(structuredEnquiries));
  }, [structuredEnquiries]);

  useEffect(() => {
    localStorage.setItem('colab_negotiation_quotes', JSON.stringify(negotiationQuotes));
  }, [negotiationQuotes]);

  useEffect(() => {
    localStorage.setItem('colab_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('colab_messages', JSON.stringify(messages));
  }, [messages]);

  // Real SQLite Database Hydration: fetch fresh data from colab.db
  useEffect(() => {
    let isMounted = true;
    const hydrateFromDatabase = async () => {
      try {
        const bootstrap = await api.bootstrap();
        if (!isMounted || !bootstrap) return;
        if (bootstrap.creators && bootstrap.creators.length > 0) {
          setCreators(bootstrap.creators);
        }
        if (bootstrap.campaigns && bootstrap.campaigns.length > 0) {
          setCampaigns(bootstrap.campaigns);
        }
        if (bootstrap.collaborations && bootstrap.collaborations.length > 0) {
          setCollaborations(bootstrap.collaborations);
        }
        if (bootstrap.sponsorships && bootstrap.sponsorships.length > 0) {
          setSponsorships(bootstrap.sponsorships);
        }
        if (bootstrap.bookingSlots && bootstrap.bookingSlots.length > 0) {
          setBookingSlots(bootstrap.bookingSlots);
        }
        if (bootstrap.structuredEnquiries && bootstrap.structuredEnquiries.length > 0) {
          setStructuredEnquiries(bootstrap.structuredEnquiries);
        }
        if (bootstrap.negotiationQuotes && bootstrap.negotiationQuotes.length > 0) {
          setNegotiationQuotes(bootstrap.negotiationQuotes);
        }
        if (bootstrap.sponsorRfps && bootstrap.sponsorRfps.length > 0) {
          setSponsorRfps(bootstrap.sponsorRfps);
        }
        if (bootstrap.conversations && bootstrap.conversations.length > 0) {
          setConversations(bootstrap.conversations);
        }
        if (bootstrap.messages && bootstrap.messages.length > 0) {
          setMessages(bootstrap.messages);
        }
        if (bootstrap.settings) {
          setSettings(bootstrap.settings);
        }
      } catch (err) {
        console.warn('[co-lab] Using local storage/mock fallback:', err);
      }
    };
    hydrateFromDatabase();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('colab_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('colab_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('colab_collaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  useEffect(() => {
    localStorage.setItem('colab_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('colab_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('colab_settings', JSON.stringify(settings));
  }, [settings]);

  // Actions
  const login = (user?: UserProfile) => {
    const target = user || users[0] || DEMO_USERS[0];
    setCurrentUser(target);
    setIsLoggedIn(true);
    localStorage.setItem('colab_is_logged_in', 'true');
    localStorage.setItem('colab_current_user', JSON.stringify(target));
    setShowLoginModal(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.setItem('colab_is_logged_in', 'false');
    localStorage.removeItem('colab_current_user');
  };

  const loginWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        localStorage.setItem('colab_is_logged_in', 'true');
        localStorage.setItem('colab_current_user', JSON.stringify(res.user));
        setShowLoginModal(false);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Invalid email or password' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login connection failed' };
    }
  };

  const signupWithPassword = async (payload: { email: string; password: string; name: string; role: UserRole; bio?: string; location?: string }): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await api.auth.signup(payload);
      if (res.success && res.user) {
        setUsers(prev => [res.user!, ...prev]);
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        localStorage.setItem('colab_is_logged_in', 'true');
        localStorage.setItem('colab_current_user', JSON.stringify(res.user));
        setShowLoginModal(false);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Failed to create account' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup connection failed' };
    }
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsLoggedIn(true);
      localStorage.setItem('colab_is_logged_in', 'true');
      localStorage.setItem('colab_current_user', JSON.stringify(target));
    }
  };

  const switchRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setIsLoggedIn(true);
      localStorage.setItem('colab_is_logged_in', 'true');
      localStorage.setItem('colab_current_user', JSON.stringify(matched));
    } else {
      const newUser: UserProfile = {
        id: `user-${role}-test`,
        email: `${role}@colab.test`,
        name: `Demo ${role.toUpperCase()}`,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        verified: true,
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('colab_is_logged_in', 'true');
      localStorage.setItem('colab_current_user', JSON.stringify(newUser));
    }
  };

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'businessVerified' | 'applicantsCount' | 'shortlistedCount' | 'createdAt'>): Campaign => {
    const activeUser = currentUser || users[2] || DEMO_USERS[2];
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      businessId: activeUser.id,
      businessName: activeUser.name,
      businessLogo: activeUser.avatar,
      businessVerified: activeUser.verified,
      applicantsCount: 0,
      shortlistedCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    api.campaigns.create(newCampaign).catch(() => {});
    return newCampaign;
  };

  const applyToCampaign = (applicationData: Omit<CampaignApplication, 'id' | 'appliedAt' | 'status'>) => {
    const newApp: CampaignApplication = {
      ...applicationData,
      id: `app-${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);
    api.applications.create(newApp).catch(() => {});
    // increment count
    setCampaigns(prev => prev.map(c => c.id === applicationData.campaignId ? { ...c, applicantsCount: c.applicantsCount + 1 } : c));
  };

  const updateApplicationStatus = (applicationId: string, status: CampaignApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a));
  };

  const createCollaborationFromApplication = (applicationId: string): Collaboration => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error("Application not found");

    const campaign = campaigns.find(c => c.id === app.campaignId);
    const agreedAmount = app.proposedRate;
    const fee = Math.round(agreedAmount * (settings.platformCommissionPercent / 100));
    const payout = agreedAmount - fee;

    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const newCollab: Collaboration = {
      id: `collab-${Date.now()}`,
      campaignId: app.campaignId,
      campaignTitle: app.campaignTitle,
      businessId: campaign ? campaign.businessId : activeUser.id,
      businessName: campaign ? campaign.businessName : activeUser.name,
      businessAvatar: campaign ? campaign.businessLogo : activeUser.avatar,
      creatorId: app.creatorId,
      creatorName: app.creatorName,
      creatorAvatar: app.creatorAvatar,
      creatorHandle: app.creatorHandle,
      agreedAmount,
      platformFee: fee,
      creatorPayout: payout,
      status: 'escrow_funded',
      escrowStatus: 'held',
      contractTerms: `Collaboration Agreement: Creator ${app.creatorName} agrees to deliver required deliverables as described in campaign ${app.campaignTitle}. Platform fees are ${settings.platformCommissionPercent}%. Escrow funds are secured.`,
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
      lastUpdated: new Date().toISOString(),
      businessReviewed: false,
      creatorReviewed: false,
      deliverables: [
        {
          id: `del-${Date.now()}-1`,
          title: 'Primary Promotional Asset (Reel / Video)',
          format: campaign?.requirements.contentFormat || 'Instagram Reel',
          status: 'pending'
        }
      ]
    };

    setCollaborations(prev => [newCollab, ...prev]);
    api.collaborations.create(newCollab).catch(() => {});
    updateApplicationStatus(applicationId, 'accepted');

    // record escrow transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      collaborationId: newCollab.id,
      campaignTitle: newCollab.campaignTitle,
      payerId: newCollab.businessId,
      payerName: newCollab.businessName,
      payeeId: newCollab.creatorId,
      payeeName: newCollab.creatorName,
      amount: agreedAmount,
      platformFee: fee,
      netAmount: payout,
      type: 'escrow_deposit',
      status: 'held_in_escrow',
      paymentMethod: 'UPI',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);

    return newCollab;
  };

  const updateCollaborationDeliverable = (collabId: string, deliverableId: string, submissionUrl: string) => {
    setCollaborations(prev => prev.map(c => {
      if (c.id !== collabId) return c;
      const updatedDeliverables = c.deliverables.map(d => {
        if (d.id !== deliverableId) return d;
        return {
          ...d,
          submissionUrl,
          previewUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
          status: 'submitted' as const,
          submittedAt: new Date().toISOString()
        };
      });
      return {
        ...c,
        status: 'reviewing_deliverables',
        deliverables: updatedDeliverables,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  const requestDeliverableRevision = (collabId: string, deliverableId: string, feedback: string) => {
    setCollaborations(prev => prev.map(c => {
      if (c.id !== collabId) return c;
      const updatedDeliverables = c.deliverables.map(d => {
        if (d.id !== deliverableId) return d;
        return {
          ...d,
          status: 'revision_requested' as const,
          feedback
        };
      });
      return {
        ...c,
        status: 'revision_needed',
        deliverables: updatedDeliverables,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  const approveDeliverable = (collabId: string, deliverableId: string) => {
    setCollaborations(prev => prev.map(c => {
      if (c.id !== collabId) return c;
      const updatedDeliverables = c.deliverables.map(d => {
        if (d.id !== deliverableId) return d;
        return {
          ...d,
          status: 'approved' as const
        };
      });
      const allApproved = updatedDeliverables.every(d => d.status === 'approved');
      return {
        ...c,
        status: allApproved ? 'approved' : c.status,
        deliverables: updatedDeliverables,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  const releaseEscrowPayment = (collabId: string) => {
    const collab = collaborations.find(c => c.id === collabId);
    if (!collab) return;

    setCollaborations(prev => prev.map(c => {
      if (c.id !== collabId) return c;
      return {
        ...c,
        status: 'settled',
        escrowStatus: 'released',
        lastUpdated: new Date().toISOString()
      };
    }));

    // Record payout transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      collaborationId: collab.id,
      campaignTitle: collab.campaignTitle,
      payerId: collab.businessId,
      payerName: collab.businessName,
      payeeId: collab.creatorId,
      payeeName: collab.creatorName,
      amount: collab.agreedAmount,
      platformFee: collab.platformFee,
      netAmount: collab.creatorPayout,
      type: 'creator_payout',
      status: 'completed',
      paymentMethod: 'UPI',
      invoiceNumber: `INV-SETTLE-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'verifiedCollaboration'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verifiedCollaboration: true
    };
    setReviews(prev => [newReview, ...prev]);

    // mark reviewed on collaboration
    setCollaborations(prev => prev.map(c => {
      if (c.id !== reviewData.collaborationId) return c;
      return {
        ...c,
        businessReviewed: reviewData.reviewerRole === 'business' ? true : c.businessReviewed,
        creatorReviewed: reviewData.reviewerRole === 'creator' ? true : c.creatorReviewed
      };
    }));
  };

  const markConversationAsRead = (conversationId: string) => {
    setMessages(prev => prev.map(m => m.conversationId === conversationId ? { ...m, isRead: true } : m));
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    attachmentUrl?: string,
    attachmentType?: Message['attachmentType'],
    attachmentMetadata?: any
  ) => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderRole: activeUser.role,
      text,
      attachmentUrl,
      attachmentType,
      attachmentMetadata,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        lastMessage: text,
        lastMessageTime: new Date().toISOString()
      };
    }));
  };

  const sendVoiceNote = (conversationId: string, durationSeconds: number = 18) => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const newMsg: Message = {
      id: `msg-voice-${Date.now()}`,
      conversationId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderRole: activeUser.role,
      text: `🎤 Voice note (${durationSeconds}s)`,
      attachmentType: 'voice_note',
      voiceNoteDuration: durationSeconds,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        lastMessage: `🎤 Voice note (${durationSeconds}s)`,
        lastMessageTime: new Date().toISOString()
      };
    }));
  };

  const sendStructuredEnquiry = (enquiryData: Omit<StructuredCollaborationEnquiry, 'id' | 'createdAt' | 'status'>): string => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const targetId = enquiryData.targetId || enquiryData.creatorId || '';
    const senderId = enquiryData.senderId || enquiryData.businessId || activeUser.id;
    const targetUser = creators.find(c => c.id === targetId) || users.find(u => u.id === targetId);

    const convId = createOrGetConversation(targetId);
    const newEnquiry: StructuredCollaborationEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      conversationId: convId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      senderId,
      senderName: enquiryData.senderName || enquiryData.businessName || activeUser.name,
      senderAvatar: enquiryData.senderAvatar || enquiryData.businessAvatar || activeUser.avatar,
      senderRole: activeUser.role,
      targetId,
      targetName: enquiryData.targetName || enquiryData.creatorName || targetUser?.name || 'Creator'
    };

    setStructuredEnquiries(prev => [newEnquiry, ...prev]);
    api.enquiries.create(newEnquiry).catch(() => {});

    // Send formatted message card into conversation
    const cardText = `📋 Structured Collaboration Enquiry: ${enquiryData.projectNeed} • Budget: ₹${enquiryData.budget.toLocaleString()}`;
    const enquiryMsg: Message = {
      id: `msg-enq-${Date.now()}`,
      conversationId: convId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderRole: activeUser.role,
      text: cardText,
      attachmentType: 'enquiry',
      attachmentMetadata: newEnquiry,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, enquiryMsg]);
    setConversations(prev => prev.map(conv => {
      if (conv.id !== convId) return conv;
      return {
        ...conv,
        category: 'enquiries',
        lastMessage: cardText,
        lastMessageTime: new Date().toISOString()
      };
    }));

    return convId;
  };

  const sendNegotiationQuote = (quoteData: Omit<NegotiationQuote, 'id' | 'createdAt' | 'status' | 'history'>): NegotiationQuote => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const newQuote: NegotiationQuote = {
      id: `quote-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      history: [
        {
          senderId: activeUser.id,
          senderName: activeUser.name,
          senderRole: activeUser.role,
          amount: quoteData.currentAmount,
          note: quoteData.terms || 'Formal quotation submitted.',
          timestamp: new Date().toISOString()
        }
      ],
      ...quoteData
    };

    setNegotiationQuotes(prev => [newQuote, ...prev]);
    api.quotes.create(newQuote).catch(() => {});

    const quoteText = `💼 Formal Quotation: ₹${quoteData.currentAmount.toLocaleString()} (${quoteData.itemizedDeliverables.map(d => d.item).join(', ')})`;
    const quoteMsg: Message = {
      id: `msg-quote-${Date.now()}`,
      conversationId: quoteData.conversationId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderRole: activeUser.role,
      text: quoteText,
      attachmentType: 'quote',
      attachmentMetadata: newQuote,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, quoteMsg]);
    setConversations(prev => prev.map(conv => {
      if (conv.id !== quoteData.conversationId) return conv;
      return {
        ...conv,
        category: 'negotiations',
        lastMessage: quoteText,
        lastMessageTime: new Date().toISOString()
      };
    }));

    return newQuote;
  };

  const respondToQuote = (
    quoteId: string,
    action: 'accept' | 'counter' | 'reject',
    counterAmount?: number,
    note?: string
  ) => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const quote = negotiationQuotes.find(q => q.id === quoteId);
    if (!quote) return;

    if (action === 'accept') {
      const finalPrice = quote.currentAmount;
      const updatedQuote: NegotiationQuote = {
        ...quote,
        status: 'accepted',
        finalAgreedAmount: finalPrice,
        history: [
          ...quote.history,
          {
            senderId: activeUser.id,
            senderName: activeUser.name,
            senderRole: activeUser.role,
            amount: finalPrice,
            note: note || `Terms Accepted at ₹${finalPrice.toLocaleString()}! Deal agreement ready for escrow.`,
            timestamp: new Date().toISOString()
          }
        ]
      };

      setNegotiationQuotes(prev => prev.map(q => q.id === quoteId ? updatedQuote : q));

      // Create collaboration with escrow ready
      const fee = Math.round(finalPrice * (settings.platformCommissionPercent / 100));
      const targetUserId = quote.fromId === activeUser.id ? quote.toId : quote.fromId;
      const targetUser = users.find(u => u.id === targetUserId) || creators.find(c => c.id === targetUserId) || businesses.find(b => b.id === targetUserId);
      const isCreator = activeUser.role === 'creator';

      const newCollab: Collaboration = {
        id: `collab-agreed-${Date.now()}`,
        campaignId: `camp-agreed-${Date.now()}`,
        campaignTitle: `Agreed Collaboration: ${quote.itemizedDeliverables.map(d => d.item).join(', ')}`,
        businessId: isCreator ? targetUserId : activeUser.id,
        businessName: isCreator ? (targetUser?.name || 'Brand Partner') : activeUser.name,
        businessAvatar: isCreator ? (targetUser?.avatar || '') : activeUser.avatar,
        creatorId: isCreator ? activeUser.id : targetUserId,
        creatorName: isCreator ? activeUser.name : (targetUser?.name || 'Creator'),
        creatorAvatar: isCreator ? activeUser.avatar : (targetUser?.avatar || ''),
        creatorHandle: '@creator_partner',
        agreedAmount: finalPrice,
        platformFee: fee,
        creatorPayout: finalPrice - fee,
        status: 'escrow_funded',
        escrowStatus: 'held',
        contractTerms: `Formally agreed terms: ${quote.terms}. Usage: ${quote.usageRights}. Deliverables: ${quote.itemizedDeliverables.map(d => d.item).join(', ')}.`,
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + (quote.timelineDays || 5) * 86400000).toISOString(),
        lastUpdated: new Date().toISOString(),
        businessReviewed: false,
        creatorReviewed: false,
        deliverables: quote.itemizedDeliverables.map((item, idx) => ({
          id: `del-agreed-${idx}`,
          title: item.item,
          format: 'Agreed Deliverable',
          status: 'pending' as const
        }))
      };

      setCollaborations(prev => [newCollab, ...prev]);
      api.collaborations.create(newCollab).catch(() => {});

      const acceptMsgText = `🤝 Deal Accepted at ₹${finalPrice.toLocaleString()}! Digital agreement locked and escrow secured.`;
      const acceptMsg: Message = {
        id: `msg-accept-${Date.now()}`,
        conversationId: quote.conversationId,
        senderId: activeUser.id,
        senderName: activeUser.name,
        senderRole: activeUser.role,
        text: acceptMsgText,
        attachmentType: 'quote',
        attachmentMetadata: updatedQuote,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, acceptMsg]);

    } else if (action === 'counter' && counterAmount) {
      const updatedQuote: NegotiationQuote = {
        ...quote,
        currentAmount: counterAmount,
        status: 'countered',
        history: [
          ...quote.history,
          {
            senderId: activeUser.id,
            senderName: activeUser.name,
            senderRole: activeUser.role,
            amount: counterAmount,
            note: note || `Counteroffer submitted: ₹${counterAmount.toLocaleString()}`,
            timestamp: new Date().toISOString()
          }
        ]
      };

      setNegotiationQuotes(prev => prev.map(q => q.id === quoteId ? updatedQuote : q));

      const counterText = `🔄 Counteroffer: ₹${counterAmount.toLocaleString()} (${note || 'Price revision proposed'})`;
      const counterMsg: Message = {
        id: `msg-counter-${Date.now()}`,
        conversationId: quote.conversationId,
        senderId: activeUser.id,
        senderName: activeUser.name,
        senderRole: activeUser.role,
        text: counterText,
        attachmentType: 'quote',
        attachmentMetadata: updatedQuote,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, counterMsg]);

    } else if (action === 'reject') {
      const updatedQuote: NegotiationQuote = {
        ...quote,
        status: 'rejected',
        history: [
          ...quote.history,
          {
            senderId: activeUser.id,
            senderName: activeUser.name,
            senderRole: activeUser.role,
            amount: quote.currentAmount,
            note: note || 'Quotation declined.',
            timestamp: new Date().toISOString()
          }
        ]
      };
      setNegotiationQuotes(prev => prev.map(q => q.id === quoteId ? updatedQuote : q));

      const declineText = `❌ Quotation declined: ${note || 'Budget / terms did not match.'}`;
      const declineMsg: Message = {
        id: `msg-reject-${Date.now()}`,
        conversationId: quote.conversationId,
        senderId: activeUser.id,
        senderName: activeUser.name,
        senderRole: activeUser.role,
        text: declineText,
        attachmentType: 'quote',
        attachmentMetadata: updatedQuote,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, declineMsg]);
    }
  };

  const bookServiceWithConditions = (
    creatorId: string,
    slotId: string,
    serviceTitle: string,
    date: string,
    timeSlot: string,
    price: number,
    conditions: string,
    clientNote?: string
  ): Collaboration => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const targetCreator = creators.find(c => c.id === creatorId) || users.find(u => u.id === creatorId);
    const convId = createOrGetConversation(creatorId);

    // 1. Mark slot as booked
    setBookingSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'booked', clientName: activeUser.name } : s));

    // 2. Create Collaboration deal room with held escrow
    const fee = Math.round(price * (settings.platformCommissionPercent / 100));
    const newCollab: Collaboration = {
      id: `collab-book-${Date.now()}`,
      campaignId: `book-camp-${Date.now()}`,
      campaignTitle: `Booked: ${serviceTitle} (${date} • ${timeSlot})`,
      businessId: activeUser.id,
      businessName: activeUser.name,
      businessAvatar: activeUser.avatar,
      creatorId,
      creatorName: targetCreator?.name || 'Creator',
      creatorAvatar: targetCreator?.avatar || '',
      creatorHandle: (targetCreator as any)?.handle || '@creator',
      agreedAmount: price,
      platformFee: fee,
      creatorPayout: price - fee,
      status: 'escrow_funded',
      escrowStatus: 'held',
      contractTerms: `Instant Service Booking: ${serviceTitle}. Date: ${date} ${timeSlot}. Conditions: ${conditions}. Note: ${clientNote || 'None'}`,
      createdAt: new Date().toISOString(),
      deadline: `${date}T18:00:00Z`,
      lastUpdated: new Date().toISOString(),
      businessReviewed: false,
      creatorReviewed: false,
      deliverables: [
        {
          id: `del-book-1`,
          title: `${serviceTitle} Completion`,
          format: 'Direct Professional Service',
          status: 'pending'
        }
      ]
    };

    setCollaborations(prev => [newCollab, ...prev]);
    api.collaborations.create(newCollab).catch(() => {});
    api.bookingSlots.book(slotId, activeUser.name).catch(() => {});

    // 3. Post booking confirmation card to conversation thread
    const bookingMsgText = `📅 Instant Booking Confirmed: ${serviceTitle} on ${date} (${timeSlot}) • ₹${price.toLocaleString()} secured in escrow.`;
    const bookingMsg: Message = {
      id: `msg-book-${Date.now()}`,
      conversationId: convId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderRole: activeUser.role,
      text: bookingMsgText,
      attachmentType: 'booking',
      attachmentMetadata: {
        serviceTitle,
        date,
        timeSlot,
        price,
        conditions,
        collabId: newCollab.id
      },
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, bookingMsg]);
    setConversations(prev => prev.map(conv => {
      if (conv.id !== convId) return conv;
      return {
        ...conv,
        category: 'bookings',
        lastMessage: bookingMsgText,
        lastMessageTime: new Date().toISOString()
      };
    }));

    return newCollab;
  };

  const createOrGetConversation = (targetUserId: string, collaborationId?: string): string => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const existing = conversations.find(c =>
      c.participantIds.includes(activeUser.id) && c.participantIds.includes(targetUserId)
    );
    if (existing) return existing.id;

    const targetUser = users.find(u => u.id === targetUserId) ||
      creators.find(c => c.id === targetUserId) ||
      businesses.find(b => b.id === targetUserId);

    const targetName = targetUser?.name || 'User';
    const targetAvatar = targetUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    const targetRole = targetUser?.role || 'creator';

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participantIds: [activeUser.id, targetUserId],
      participantNames: {
        [activeUser.id]: activeUser.name,
        [targetUserId]: targetName
      },
      participantAvatars: {
        [activeUser.id]: activeUser.avatar,
        [targetUserId]: targetAvatar
      },
      participantRoles: {
        [activeUser.id]: activeUser.role,
        [targetUserId]: targetRole
      },
      unreadCount: 0,
      collaborationId
    };

    setConversations(prev => [newConv, ...prev]);
    return newConv.id;
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleUserVerification = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    setCreators(prev => prev.map(c => c.id === userId ? { ...c, verified: !c.verified } : c));
    setBusinesses(prev => prev.map(b => b.id === userId ? { ...b, verified: !b.verified } : b));
  };

  const updateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status } : c));
  };

  const bookAdInventory = (inventoryId: string, _date: string) => {
    setAdInventory(prev => prev.map(item => {
      if (item.id !== inventoryId) return item;
      return {
        ...item,
        slotsRemaining: Math.max(0, item.slotsRemaining - 1)
      };
    }));
  };

  const submitSponsorshipProposal = (sponsorshipId: string, packageId: string, _note: string) => {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== sponsorshipId) return s;
      const updatedPackages = s.packages.map(p => {
        if (p.id !== packageId) return p;
        return {
          ...p,
          claimedSlots: Math.min(p.availableSlots, p.claimedSlots + 1)
        };
      });
      return {
        ...s,
        proposalCount: s.proposalCount + 1,
        packages: updatedPackages
      };
    }));
  };

  const createAdInventoryItem = (data: Omit<AdInventoryItem, 'id' | 'slotsRemaining' | 'creatorId' | 'creatorName' | 'creatorAvatar'>): AdInventoryItem => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const newItem: AdInventoryItem = {
      id: `ad-inv-${Date.now()}`,
      creatorId: activeUser.id,
      creatorName: activeUser.name,
      creatorAvatar: activeUser.avatar,
      slotsRemaining: data.slotsTotal,
      ...data
    };
    setAdInventory(prev => [newItem, ...prev]);
    api.adInventory.create(newItem).catch(() => {});
    return newItem;
  };

  const createLocalAdChannel = (data: Omit<LocalAdChannel, 'id' | 'verified'>): LocalAdChannel => {
    const newChannel: LocalAdChannel = {
      id: `local-ch-${Date.now()}`,
      verified: true,
      ...data
    };
    setLocalAdChannels(prev => [newChannel, ...prev]);
    api.localAds.create(newChannel).catch(() => {});
    return newChannel;
  };

  const createSponsorshipOpportunity = (data: Omit<SponsorshipOpportunity, 'id' | 'proposalCount' | 'verifiedOrganiser' | 'organiserId' | 'organiserName' | 'organiserAvatar'>): SponsorshipOpportunity => {
    const activeUser = currentUser || users[0] || DEMO_USERS[0];
    const newSpons: SponsorshipOpportunity = {
      id: `spons-${Date.now()}`,
      organiserId: activeUser.id,
      organiserName: activeUser.name,
      organiserAvatar: activeUser.avatar,
      verifiedOrganiser: false,
      proposalCount: 0,
      ...data
    };
    setSponsorships(prev => [newSpons, ...prev]);
    api.sponsorships.create(newSpons).catch(() => {});
    return newSpons;
  };

  const switchSubProfile = (subProfileId: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, activeSubProfileId: subProfileId };
    setCurrentUser(updatedUser);
    localStorage.setItem('colab_current_user', JSON.stringify(updatedUser));
  };

  const createOrUpdateSubProfile = (newSub: ProfessionalSubProfile) => {
    if (!currentUser) return;
    const existing = currentUser.subProfiles || [];
    const index = existing.findIndex(p => p.id === newSub.id);
    let updatedSubs: ProfessionalSubProfile[];
    if (index >= 0) {
      updatedSubs = [...existing];
      updatedSubs[index] = newSub;
    } else {
      updatedSubs = [...existing, newSub];
    }
    const updatedUser = { ...currentUser, subProfiles: updatedSubs, activeSubProfileId: newSub.id };
    setCurrentUser(updatedUser);
    localStorage.setItem('colab_current_user', JSON.stringify(updatedUser));
  };

  const bookConsultationSlot = (slotId: string, clientName: string) => {
    setBookingSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, status: 'booked', clientName };
      }
      return s;
    }));
  };

  const joinAffiliateProgram = (programId: string): CreatorAffiliateLink => {
    const program = affiliatePrograms.find(p => p.id === programId);
    const creatorId = currentUser?.id || 'user-creator-1';
    const creatorName = currentUser?.name?.split(' ')[0] || 'CREATOR';
    const cleanCode = `${creatorName.toUpperCase()}${program?.commissionRate || '15'}`;
    const newLink: CreatorAffiliateLink = {
      id: `link-${Date.now()}`,
      programId,
      creatorId,
      referralCode: cleanCode,
      referralUrl: `https://colab.market/aff/${programId}/${cleanCode}`,
      couponCode: cleanCode,
      clicks: 0,
      conversions: 0,
      earnedAmount: 0,
      status: 'active'
    };
    setCreatorAffiliateLinks(prev => [newLink, ...prev]);
    return newLink;
  };

  const simulateAffiliateOrder = (linkId: string, orderValue: number) => {
    setCreatorAffiliateLinks(prev => prev.map(link => {
      if (link.id === linkId) {
        const prog = affiliatePrograms.find(p => p.id === link.programId);
        const commission = prog?.commissionType === 'flat' 
          ? prog.commissionRate 
          : Math.round(orderValue * ((prog?.commissionRate || 15) / 100));
        return {
          ...link,
          clicks: link.clicks + 1,
          conversions: link.conversions + 1,
          earnedAmount: link.earnedAmount + commission
        };
      }
      return link;
    }));
  };

  const bookLocalAdBundle = (channelIds: string[], campaignTitle: string, totalAmount: number): Collaboration => {
    const fee = Math.round(totalAmount * (settings.platformCommissionPercent / 100));
    const newCollab: Collaboration = {
      id: `collab-local-${Date.now()}`,
      campaignId: `local-camp-${Date.now()}`,
      campaignTitle: campaignTitle || 'Hyperlocal Multi-Channel Campaign',
      businessId: currentUser?.id || 'user-biz-1',
      businessName: currentUser?.name || 'Local Business',
      businessAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      creatorId: 'local-network',
      creatorName: `${channelIds.length} Local Channels Bundle`,
      creatorAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      creatorHandle: '@local_network',
      agreedAmount: totalAmount,
      platformFee: fee,
      creatorPayout: totalAmount - fee,
      status: 'escrow_funded',
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
      lastUpdated: new Date().toISOString(),
      businessReviewed: false,
      creatorReviewed: false,
      escrowStatus: 'held',
      contractTerms: `Hyperlocal campaign covering ${channelIds.length} verified regional channels.`,
      deliverables: [
        {
          id: `del-local-1`,
          title: `Hyperlocal Reels & Community Posts across ${channelIds.length} channels`,
          format: 'Multi-Channel Reel & Story Package',
          status: 'pending'
        }
      ]
    };
    setCollaborations(prev => [newCollab, ...prev]);
    api.collaborations.create(newCollab).catch(() => {});
    return newCollab;
  };

  const bookCreatorCollective = (collectiveId: string, businessNote: string): Collaboration => {
    const collective = creatorCollectives.find(c => c.id === collectiveId);
    const totalAmount = collective?.bundlePrice || 25000;
    const fee = Math.round(totalAmount * (settings.platformCommissionPercent / 100));
    const newCollab: Collaboration = {
      id: `collab-coll-${Date.now()}`,
      campaignId: `coll-camp-${Date.now()}`,
      campaignTitle: collective?.title || 'Creator Collective Campaign',
      businessId: currentUser?.id || 'user-biz-1',
      businessName: currentUser?.name || 'Local Business',
      businessAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      creatorId: collectiveId,
      creatorName: collective?.title || 'Creator Collective',
      creatorAvatar: collective?.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      creatorHandle: '@collective',
      agreedAmount: totalAmount,
      platformFee: fee,
      creatorPayout: totalAmount - fee,
      status: 'escrow_funded',
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      lastUpdated: new Date().toISOString(),
      businessReviewed: false,
      creatorReviewed: false,
      escrowStatus: 'held',
      contractTerms: `Creator collective package: ${collective?.title}. ${businessNote || ''}`,
      deliverables: collective?.deliverables.map((del, i) => ({
        id: `del-coll-${i}`,
        title: del,
        format: 'Collective Package Item',
        status: 'pending' as const
      })) || []
    };
    setCollaborations(prev => [newCollab, ...prev]);
    api.collaborations.create(newCollab).catch(() => {});
    return newCollab;
  };

  const createSponsorRfp = (rfpData: Omit<SponsorRequirementRFP, 'id' | 'sponsorId' | 'sponsorName' | 'sponsorLogo' | 'proposalsCount' | 'createdAt'>): SponsorRequirementRFP => {
    const newRfp: SponsorRequirementRFP = {
      id: `rfp-${Date.now()}`,
      sponsorId: currentUser?.id || 'user-sponsor-1',
      sponsorName: currentUser?.name || 'Sponsoring Brand',
      sponsorLogo: currentUser?.avatar || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
      ...rfpData
    };
    setSponsorRfps(prev => [newRfp, ...prev]);
    api.sponsorRfps.create(newRfp).catch(() => {});
    return newRfp;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        loginWithPassword,
        signupWithPassword,
        logout,
        showLoginModal,
        setShowLoginModal,
        switchUser,
        switchRole,
        users,
        creators,
        businesses,
        campaigns,
        applications,
        collaborations,
        sponsorships,
        creativeProfessionals,
        adInventory,
        reviews,
        transactions,
        settings,
        conversations,
        messages,
        localAdChannels,
        creatorCollectives,
        affiliatePrograms,
        creatorAffiliateLinks,
        bookingSlots,
        performanceAttributions,
        sponsorRfps,
        structuredEnquiries,
        negotiationQuotes,
        createSponsorRfp,
        createAdInventoryItem,
        createLocalAdChannel,
        createSponsorshipOpportunity,
        switchSubProfile,
        createOrUpdateSubProfile,
        bookConsultationSlot,
        bookServiceWithConditions,
        joinAffiliateProgram,
        simulateAffiliateOrder,
        bookLocalAdBundle,
        bookCreatorCollective,
        createCampaign,
        applyToCampaign,
        updateApplicationStatus,
        createCollaborationFromApplication,
        updateCollaborationDeliverable,
        requestDeliverableRevision,
        approveDeliverable,
        releaseEscrowPayment,
        addReview,
        sendMessage,
        sendVoiceNote,
        sendStructuredEnquiry,
        sendNegotiationQuote,
        respondToQuote,
        markConversationAsRead,
        createOrGetConversation,
        updateSettings,
        toggleUserVerification,
        updateCampaignStatus,
        bookAdInventory,
        submitSponsorshipProposal,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

