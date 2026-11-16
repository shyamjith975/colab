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
  NegotiationQuote,
  DEFAULT_PLATFORM_SETTINGS
} from '../types';
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
  showComplianceModal: boolean;
  setShowComplianceModal: (show: boolean) => void;
  complianceModalTab: 'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications';
  setComplianceModalTab: (tab: 'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications') => void;
  openComplianceModal: (tab?: 'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications') => void;
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
  updateApplicationStatus: (
    applicationId: string,
    status: CampaignApplication['status'],
    meta?: { rejectionReason?: string; counterRate?: number; counterNote?: string }
  ) => void;
  updateBookingSlotStatus: (
    slotId: string,
    status: BookingSlot['status'],
    meta?: { rejectionReason?: string; counterRate?: number; counterNote?: string }
  ) => void;
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
    return saved ? JSON.parse(saved) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);
  const [complianceModalTab, setComplianceModalTab] = useState<'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications'>('payment');

  const openComplianceModal = (tab: 'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications' = 'payment') => {
    setComplianceModalTab(tab);
    setShowComplianceModal(true);
  };

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('colab_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [creators, setCreators] = useState<CreatorProfile[]>(() => {
    const saved = localStorage.getItem('colab_creators');
    return saved ? JSON.parse(saved) : [];
  });

  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem('colab_businesses');
    return saved ? JSON.parse(saved) : [];
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('colab_campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  const [applications, setApplications] = useState<CampaignApplication[]>(() => {
    const saved = localStorage.getItem('colab_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [collaborations, setCollaborations] = useState<Collaboration[]>(() => {
    const saved = localStorage.getItem('colab_collaborations');
    return saved ? JSON.parse(saved) : [];
  });

  const [sponsorships, setSponsorships] = useState<SponsorshipOpportunity[]>(() => {
    const saved = localStorage.getItem('colab_sponsorships');
    return saved ? JSON.parse(saved) : [];
  });

  const [creativeProfessionals, setCreativeProfessionals] = useState<CreativeProfessional[]>(() => {
    const saved = localStorage.getItem('colab_creative_professionals');
    return saved ? JSON.parse(saved) : [];
  });

  const [adInventory, setAdInventory] = useState<AdInventoryItem[]>(() => {
    const saved = localStorage.getItem('colab_ad_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('colab_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('colab_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('colab_settings');
    return saved ? JSON.parse(saved) : DEFAULT_PLATFORM_SETTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('colab_conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('colab_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [localAdChannels, setLocalAdChannels] = useState<LocalAdChannel[]>(() => {
    const saved = localStorage.getItem('colab_local_channels');
    return saved ? JSON.parse(saved) : [];
  });

  const [creatorCollectives, setCreatorCollectives] = useState<CreatorCollective[]>(() => {
    const saved = localStorage.getItem('colab_creator_collectives');
    return saved ? JSON.parse(saved) : [];
  });

  const [affiliatePrograms, setAffiliatePrograms] = useState<AffiliateProgram[]>(() => {
    const saved = localStorage.getItem('colab_affiliate_programs');
    return saved ? JSON.parse(saved) : [];
  });

  const [creatorAffiliateLinks, setCreatorAffiliateLinks] = useState<CreatorAffiliateLink[]>(() => {
    const saved = localStorage.getItem('colab_creator_affiliate_links');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>(() => {
    const saved = localStorage.getItem('colab_booking_slots');
    return saved ? JSON.parse(saved) : [];
  });

  const [performanceAttributions, setPerformanceAttributions] = useState<PerformanceAttribution[]>(() => {
    const saved = localStorage.getItem('colab_performance_attributions');
    return saved ? JSON.parse(saved) : [];
  });

  const [sponsorRfps, setSponsorRfps] = useState<SponsorRequirementRFP[]>(() => {
    const saved = localStorage.getItem('colab_sponsor_rfps');
    return saved ? JSON.parse(saved) : [];
  });

  const [structuredEnquiries, setStructuredEnquiries] = useState<StructuredCollaborationEnquiry[]>(() => {
    const saved = localStorage.getItem('colab_structured_enquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [negotiationQuotes, setNegotiationQuotes] = useState<NegotiationQuote[]>(() => {
    const saved = localStorage.getItem('colab_negotiation_quotes');
    return saved ? JSON.parse(saved) : [];
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
        if (bootstrap.users && bootstrap.users.length > 0) {
          setUsers(bootstrap.users);
          localStorage.setItem('colab_users', JSON.stringify(bootstrap.users));
        }
        if (bootstrap.creators && bootstrap.creators.length > 0) {
          setCreators(bootstrap.creators);
          localStorage.setItem('colab_creators', JSON.stringify(bootstrap.creators));
        }
        if (bootstrap.businesses && bootstrap.businesses.length > 0) {
          setBusinesses(bootstrap.businesses);
          localStorage.setItem('colab_businesses', JSON.stringify(bootstrap.businesses));
        }
        if (bootstrap.campaigns && bootstrap.campaigns.length > 0) {
          setCampaigns(bootstrap.campaigns);
          localStorage.setItem('colab_campaigns', JSON.stringify(bootstrap.campaigns));
        }
        if (bootstrap.applications && bootstrap.applications.length > 0) {
          setApplications(bootstrap.applications);
          localStorage.setItem('colab_applications', JSON.stringify(bootstrap.applications));
        }
        if (bootstrap.collaborations && bootstrap.collaborations.length > 0) {
          setCollaborations(bootstrap.collaborations);
          localStorage.setItem('colab_collaborations', JSON.stringify(bootstrap.collaborations));
        }
        if (bootstrap.sponsorships && bootstrap.sponsorships.length > 0) {
          setSponsorships(bootstrap.sponsorships);
          localStorage.setItem('colab_sponsorships', JSON.stringify(bootstrap.sponsorships));
        }
        if (bootstrap.sponsorRfps && bootstrap.sponsorRfps.length > 0) {
          setSponsorRfps(bootstrap.sponsorRfps);
          localStorage.setItem('colab_sponsor_rfps', JSON.stringify(bootstrap.sponsorRfps));
        }
        if (bootstrap.creativeProfessionals && bootstrap.creativeProfessionals.length > 0) {
          setCreativeProfessionals(bootstrap.creativeProfessionals);
          localStorage.setItem('colab_creative_professionals', JSON.stringify(bootstrap.creativeProfessionals));
        }
        if (bootstrap.adInventory && bootstrap.adInventory.length > 0) {
          setAdInventory(bootstrap.adInventory);
          localStorage.setItem('colab_ad_inventory', JSON.stringify(bootstrap.adInventory));
        }
        if (bootstrap.localAdChannels && bootstrap.localAdChannels.length > 0) {
          setLocalAdChannels(bootstrap.localAdChannels);
          localStorage.setItem('colab_local_channels', JSON.stringify(bootstrap.localAdChannels));
        }
        if (bootstrap.creatorCollectives && bootstrap.creatorCollectives.length > 0) {
          setCreatorCollectives(bootstrap.creatorCollectives);
          localStorage.setItem('colab_creator_collectives', JSON.stringify(bootstrap.creatorCollectives));
        }
        if (bootstrap.affiliatePrograms && bootstrap.affiliatePrograms.length > 0) {
          setAffiliatePrograms(bootstrap.affiliatePrograms);
          localStorage.setItem('colab_affiliate_programs', JSON.stringify(bootstrap.affiliatePrograms));
        }
        if (bootstrap.creatorAffiliateLinks && bootstrap.creatorAffiliateLinks.length > 0) {
          setCreatorAffiliateLinks(bootstrap.creatorAffiliateLinks);
          localStorage.setItem('colab_creator_affiliate_links', JSON.stringify(bootstrap.creatorAffiliateLinks));
        }
        if (bootstrap.bookingSlots && bootstrap.bookingSlots.length > 0) {
          setBookingSlots(bootstrap.bookingSlots);
          localStorage.setItem('colab_booking_slots', JSON.stringify(bootstrap.bookingSlots));
        }
        if (bootstrap.structuredEnquiries && bootstrap.structuredEnquiries.length > 0) {
          setStructuredEnquiries(bootstrap.structuredEnquiries);
          localStorage.setItem('colab_structured_enquiries', JSON.stringify(bootstrap.structuredEnquiries));
        }
        if (bootstrap.negotiationQuotes && bootstrap.negotiationQuotes.length > 0) {
          setNegotiationQuotes(bootstrap.negotiationQuotes);
          localStorage.setItem('colab_negotiation_quotes', JSON.stringify(bootstrap.negotiationQuotes));
        }
        if (bootstrap.conversations && bootstrap.conversations.length > 0) {
          setConversations(bootstrap.conversations);
          localStorage.setItem('colab_conversations', JSON.stringify(bootstrap.conversations));
        }
        if (bootstrap.messages && bootstrap.messages.length > 0) {
          setMessages(bootstrap.messages);
          localStorage.setItem('colab_messages', JSON.stringify(bootstrap.messages));
        }
        if (bootstrap.reviews && bootstrap.reviews.length > 0) {
          setReviews(bootstrap.reviews);
          localStorage.setItem('colab_reviews', JSON.stringify(bootstrap.reviews));
        }
        if (bootstrap.transactions && bootstrap.transactions.length > 0) {
          setTransactions(bootstrap.transactions);
          localStorage.setItem('colab_transactions', JSON.stringify(bootstrap.transactions));
        }
        if (bootstrap.settings) {
          setSettings(bootstrap.settings);
          localStorage.setItem('colab_settings', JSON.stringify(bootstrap.settings));
        }
      } catch (err) {
        console.warn('[co-lab] Database hydration notice:', err);
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
    const target = user || users[0];
    if (target) {
      setCurrentUser(target);
      setIsLoggedIn(true);
      localStorage.setItem('colab_is_logged_in', 'true');
      localStorage.setItem('colab_current_user', JSON.stringify(target));
      setShowLoginModal(false);
    }
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
    const activeUser = currentUser || users[2] || users[0];
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

  const updateApplicationStatus = (
    applicationId: string,
    status: CampaignApplication['status'],
    meta?: { rejectionReason?: string; counterRate?: number; counterNote?: string }
  ) => {
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status, ...meta } : a));
    api.applications.updateStatus(applicationId, status, meta?.rejectionReason, meta?.counterRate, meta?.counterNote).catch(() => {});
  };

  const updateBookingSlotStatus = (
    slotId: string,
    status: BookingSlot['status'],
    meta?: { rejectionReason?: string; counterRate?: number; counterNote?: string }
  ) => {
    setBookingSlots(prev => prev.map(s => s.id === slotId ? { ...s, status, ...meta } : s));
    api.bookingSlots.updateStatus(slotId, status, meta?.rejectionReason, meta?.counterRate, meta?.counterNote).catch(() => {});
  };

  const createCollaborationFromApplication = (applicationId: string): Collaboration => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error("Application not found");

    const campaign = campaigns.find(c => c.id === app.campaignId);
    const agreedAmount = app.proposedRate;
    const fee = Math.round(agreedAmount * (settings.platformCommissionPercent / 100));
    const payout = agreedAmount - fee;

    const activeUser = currentUser || users[0];
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
    const activeUser = currentUser || users[0];
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
    const activeUser = currentUser || users[0];
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
    const activeUser = currentUser || users[0];
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
    const activeUser = currentUser || users[0];
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
    const activeUser = currentUser || users[0] || {
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@colab.local',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Guest visitor'
    };
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
    const activeUser = currentUser || users[0] || {
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@colab.local',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Guest visitor'
    };
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
    const activeUser = currentUser || users[0] || {
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@colab.local',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Guest visitor'
    };
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
    const activeUser = currentUser || users[0] || {
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@colab.local',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Guest visitor'
    };
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
    const activeUser = currentUser || users[0] || {
      id: 'guest-user',
      name: 'Guest User',
      email: 'guest@colab.local',
      role: 'business',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Guest visitor'
    };
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
        updateBookingSlotStatus,
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
        setSearchQuery,
        showComplianceModal,
        setShowComplianceModal,
        complianceModalTab,
        setComplianceModalTab,
        openComplianceModal
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

