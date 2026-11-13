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
  Conversation
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
  INITIAL_SETTINGS
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
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
  
  // Actions
  createCampaign: (campaign: Omit<Campaign, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'businessVerified' | 'applicantsCount' | 'shortlistedCount' | 'createdAt'>) => Campaign;
  applyToCampaign: (application: Omit<CampaignApplication, 'id' | 'appliedAt' | 'status'>) => void;
  updateApplicationStatus: (applicationId: string, status: CampaignApplication['status']) => void;
  createCollaborationFromApplication: (applicationId: string) => Collaboration;
  updateCollaborationDeliverable: (collabId: string, deliverableId: string, submissionUrl: string) => void;
  requestDeliverableRevision: (collabId: string, deliverableId: string, feedback: string) => void;
  approveDeliverable: (collabId: string, deliverableId: string) => void;
  releaseEscrowPayment: (collabId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'verifiedCollaboration'>) => void;
  sendMessage: (conversationId: string, text: string, attachmentUrl?: string) => void;
  createOrGetConversation: (targetUserId: string, collaborationId?: string) => string;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  toggleUserVerification: (userId: string) => void;
  updateCampaignStatus: (campaignId: string, status: Campaign['status']) => void;
  bookAdInventory: (inventoryId: string, date: string) => void;
  submitSponsorshipProposal: (sponsorshipId: string, packageId: string, note: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('colab_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

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

  const [searchQuery, setSearchQuery] = useState('');

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('colab_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

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

  useEffect(() => {
    localStorage.setItem('colab_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('colab_messages', JSON.stringify(messages));
  }, [messages]);

  // Actions
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const switchRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
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
    }
  };

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'businessVerified' | 'applicantsCount' | 'shortlistedCount' | 'createdAt'>): Campaign => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      businessId: currentUser.id,
      businessName: currentUser.name,
      businessLogo: currentUser.avatar,
      businessVerified: currentUser.verified,
      applicantsCount: 0,
      shortlistedCount: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setCampaigns(prev => [newCampaign, ...prev]);
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

    const newCollab: Collaboration = {
      id: `collab-${Date.now()}`,
      campaignId: app.campaignId,
      campaignTitle: app.campaignTitle,
      businessId: campaign ? campaign.businessId : currentUser.id,
      businessName: campaign ? campaign.businessName : currentUser.name,
      businessAvatar: campaign ? campaign.businessLogo : currentUser.avatar,
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

  const sendMessage = (conversationId: string, text: string, attachmentUrl?: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      attachmentUrl,
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

  const createOrGetConversation = (targetUserId: string, collaborationId?: string): string => {
    const existing = conversations.find(c =>
      c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUserId)
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
      participantIds: [currentUser.id, targetUserId],
      participantNames: {
        [currentUser.id]: currentUser.name,
        [targetUserId]: targetName
      },
      participantAvatars: {
        [currentUser.id]: currentUser.avatar,
        [targetUserId]: targetAvatar
      },
      participantRoles: {
        [currentUser.id]: currentUser.role,
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

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
