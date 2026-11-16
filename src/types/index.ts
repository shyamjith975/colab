export type UserRole = 'creator' | 'business' | 'agency' | 'organiser' | 'sponsor' | 'admin';

export interface ProfessionalSubProfile {
  id: string;
  type: 'influencer' | 'ugc_creator' | 'stylist' | 'photographer' | 'designer' | 'boutique_owner' | 'agency' | 'business' | 'sponsor';
  title: string;
  bio: string;
  skills: string[];
  location: string;
  languages: string[];
  startingRate: number;
  portfolio: { title: string; image: string; type: string }[];
  verifiedCredentials: string[];
  isAvailable: boolean;
  rateCards?: { format: string; price: number; turnaroundDays: number }[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  location?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  agencyId?: string;
  subProfiles?: ProfessionalSubProfile[];
  activeSubProfileId?: string;
}

export interface SocialAccount {
  platform: 'instagram' | 'youtube' | 'linkedin' | 'x' | 'tiktok' | 'podcast' | 'blog';
  handle: string;
  url: string;
  followersCount: number;
  engagementRate: number; // e.g., 4.8%
  avgViews?: number;
  verified: boolean;
}

export interface CreatorService {
  id: string;
  title: string;
  platform: string;
  format: string; // 'Reel', 'Story', 'Dedicated Video', 'UGC', 'Product Review', 'Event Appearance'
  price: number;
  deliveryDays: number;
  revisions: number;
  deliverables: string[];
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  thumbnail: string;
  mediaUrl: string;
  platform: string;
  brandWorkedWith?: string;
  reach?: string;
  engagement?: string;
}

export interface CreatorProfile extends UserProfile {
  handle: string;
  coverImage: string;
  category: string;
  subcategories: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  completedDeals: number;
  minPrice: number;
  socialAccounts: SocialAccount[];
  services: CreatorService[];
  portfolio: PortfolioItem[];
  demographics: {
    topAudienceAge: string;
    genderRatio: { male: number; female: number };
    topLocations: string[];
  };
  badges: string[];
  isAvailable: boolean;
}

export interface BusinessProfile extends UserProfile {
  companyName: string;
  industry: string;
  website: string;
  gstNumber?: string;
  teamSize?: string;
  activeCampaignsCount: number;
  totalSpent: number;
  coverImage: string;
}

export interface Campaign {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  businessVerified: boolean;
  title: string;
  description: string;
  category: string;
  productName: string;
  productUrl?: string;
  objectives: string[];
  targetAudience: {
    locations: string[];
    ageRange: string;
    gender: string;
    interests: string[];
    languages: string[];
  };
  requirements: {
    platform: string;
    contentFormat: string;
    quantity: number;
    videoDuration?: string;
    storeVisitRequired: boolean;
    licensingTerms: string;
    deadline: string;
  };
  budget: {
    type: 'fixed' | 'range' | 'barter';
    minAmount: number;
    maxAmount: number;
    totalBudget: number;
    barterProductValue?: number;
    compensationDetails: string;
  };
  settings: {
    deadline: string;
    maxCreators: number;
    slotsAvailable: number;
    minFollowers?: number;
    eligibilityNotes: string;
    customQuestions: string[];
  };
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'paused';
  applicantsCount: number;
  shortlistedCount: number;
  createdAt: string;
  isFeatured?: boolean;
}

export interface CampaignApplication {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorCategory: string;
  creatorFollowers: number;
  creatorRating: number;
  proposedRate: number;
  deliveryDays: number;
  pitch: string;
  portfolioLinks: string[];
  answers?: { question: string; answer: string }[];
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn' | 'counter_offered';
  rejectionReason?: string;
  counterRate?: number;
  counterNote?: string;
  businessId?: string;
  businessName?: string;
  appliedAt: string;
}

export interface DeliverableSubmission {
  id: string;
  title: string;
  format: string;
  status: 'pending' | 'submitted' | 'revision_requested' | 'approved';
  submissionUrl?: string;
  submittedAt?: string;
  previewUrl?: string;
  feedback?: string;
}

export interface Collaboration {
  id: string;
  campaignId: string;
  campaignTitle: string;
  businessId: string;
  businessName: string;
  businessAvatar: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  agreedAmount: number;
  platformFee: number;
  creatorPayout: number;
  status: 'agreement_pending' | 'escrow_funded' | 'in_progress' | 'reviewing_deliverables' | 'revision_needed' | 'approved' | 'settled' | 'completed' | 'disputed';
  deliverables: DeliverableSubmission[];
  contractTerms: string;
  createdAt: string;
  deadline: string;
  lastUpdated: string;
  businessReviewed: boolean;
  creatorReviewed: boolean;
  escrowStatus: 'unfunded' | 'held' | 'released' | 'refunded';
}

export interface SponsorshipPackage {
  id: string;
  tier: 'Title Sponsor' | 'Presenting Sponsor' | 'Gold Sponsor' | 'Silver Sponsor' | 'Product Partner' | 'Media Partner' | 'Custom';
  price: number;
  availableSlots: number;
  claimedSlots: number;
  perks: string[];
}

export interface SponsorshipOpportunity {
  id: string;
  organiserId: string;
  organiserName: string;
  organiserAvatar: string;
  title: string;
  type: 'college_fest' | 'sports_tournament' | 'conference' | 'podcast' | 'youtube' | 'newsletter' | 'community' | 'cultural';
  category: string;
  description: string;
  location: string;
  eventDate: string;
  expectedFootfall: number;
  targetAudience: string;
  packages: SponsorshipPackage[];
  verifiedOrganiser: boolean;
  proposalCount: number;
  deadline: string;
  createdAt: string;
  image: string;
}

export interface CreativeProfessional {
  id: string;
  name: string;
  avatar: string;
  role: 'UGC Creator' | 'Video Editor' | 'Photographer' | 'Videographer' | 'Graphic Designer' | 'Social Media Manager' | 'Copywriter' | 'Voiceover Artist';
  location: string;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  turnaroundDays: number;
  skills: string[];
  bio: string;
  portfolio: { title: string; image: string; type: string }[];
}

export interface AdInventoryItem {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  platform: 'Instagram' | 'YouTube' | 'Podcast' | 'Newsletter' | 'Website' | 'LinkedIn';
  format: string; // e.g. "Dedicated Reel", "60s Mid-roll", "Top Banner"
  price: number;
  estimatedReach: number;
  datesAvailable: string[];
  slotsTotal: number;
  slotsRemaining: number;
  description: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'pdf' | 'voice_note' | 'enquiry' | 'quote' | 'booking';
  attachmentMetadata?: any;
  isRead: boolean;
  voiceNoteDuration?: number; // seconds
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: { [id: string]: string };
  participantAvatars: { [id: string]: string };
  participantRoles: { [id: string]: UserRole };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  collaborationId?: string;
  category?: 'all' | 'enquiries' | 'negotiations' | 'bookings' | 'active_deals';
  isPinned?: boolean;
}

export interface StructuredCollaborationEnquiry {
  id: string;
  conversationId?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  senderRole?: UserRole;
  senderCompany?: string;
  targetId?: string;
  targetName?: string;
  creatorId?: string;
  creatorName?: string;
  creatorHandle?: string;
  creatorAvatar?: string;
  businessId?: string;
  businessName?: string;
  businessAvatar?: string;
  projectNeed: string; // What they need
  budget: number; // in ₹
  budgetType?: 'fixed' | 'negotiable' | 'barter_plus_cash';
  expectedDeliverables: string[]; // e.g. ["1x 60s Reel", "2x Stories with link"]
  startDate?: string;
  deadline?: string;
  campaignDates?: string;
  locationType?: 'remote' | 'on_ground' | 'hybrid';
  locationDetails?: string;
  location?: string;
  contentUsageRights: 'organic_only' | '30d_paid_ads' | '90d_whitelisting' | 'perpetuity_buyout' | string;
  expectedResults: string; // Target KPIs: Views, Sales, App Installs, Footfall
  status: 'pending' | 'accepted' | 'countered' | 'declined';
  createdAt: string;
}

export interface NegotiationQuote {
  id: string;
  conversationId: string;
  enquiryId?: string;
  fromId: string;
  fromName: string;
  fromRole: UserRole;
  toId: string;
  toName: string;
  currentAmount: number; // in ₹
  itemizedDeliverables: { item: string; price: number }[];
  timelineDays: number;
  usageRights: string;
  terms: string;
  status: 'pending' | 'accepted' | 'countered' | 'rejected';
  history: {
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    amount: number;
    note?: string;
    timestamp: string;
  }[];
  finalAgreedAmount?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  collaborationId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: UserRole;
  targetId: string;
  targetName: string;
  rating: number; // 1-5
  communication: number;
  contentQuality: number;
  timeliness: number;
  compliance: number;
  comment: string;
  createdAt: string;
  verifiedCollaboration: boolean;
}

export interface Transaction {
  id: string;
  collaborationId?: string;
  campaignTitle?: string;
  payerId: string;
  payerName: string;
  payeeId: string;
  payeeName: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  type: 'escrow_deposit' | 'creator_payout' | 'subscription' | 'refund';
  status: 'held_in_escrow' | 'completed' | 'processing' | 'refunded';
  paymentMethod: 'UPI' | 'Credit Card' | 'NetBanking' | 'Wallet';
  invoiceNumber: string;
  createdAt: string;
}

export interface PlatformSettings {
  platformCommissionPercent: number; // e.g. 8%
  featuredCampaignFee: number;
  minCampaignBudget: number;
  currencySymbol: string;
  currencyCode: string;
  taxGstRate: number; // e.g. 18%
  autoEscrowReleaseDays: number;
  categories: string[];
  maintenanceMode: boolean;
}

export interface BookingSlot {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  serviceTitle: string;
  serviceType: 'consultation' | 'store_shoot' | 'sponsored_video' | 'express_ugc';
  date: string;
  timeSlot: string;
  durationMinutes: number;
  price: number;
  clientName?: string;
  clientId?: string;
  clientAvatar?: string;
  status: 'available' | 'booked' | 'confirmed' | 'rejected' | 'completed' | 'counter_offered';
  bookingConditions?: string;
  serviceLocation?: string;
  instantBookable?: boolean;
  rejectionReason?: string;
  counterRate?: number;
  counterNote?: string;
}

export interface LocalAdChannel {
  id: string;
  name: string;
  type: 'influencer' | 'theme_page' | 'youtube_channel' | 'community_page' | 'regional_media';
  city: string;
  area?: string;
  handle: string;
  platform: 'Instagram' | 'YouTube' | 'Facebook' | 'Local Media';
  reach: number;
  price: number;
  turnaroundDays: number;
  verified: boolean;
  avatar: string;
  category: string;
  description: string;
}

export interface CreatorCollective {
  id: string;
  title: string;
  region: string;
  city: string;
  category: string;
  memberCount: number;
  combinedFollowers: number;
  combinedReach: number;
  bundlePrice: number;
  description: string;
  coverImage: string;
  deliverables: string[];
  members: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    followers: string;
    role: string;
  }[];
}

export interface AffiliateProgram {
  id: string;
  brandName: string;
  brandLogo: string;
  productName: string;
  category: string;
  price: number;
  commissionType: 'percentage' | 'flat';
  commissionRate: number; // e.g. 15 for 15%, or 300 for ₹300
  avgEarningsPerClick: number; // EPC, e.g. ₹18.50
  cookieDurationDays: number; // e.g. 30
  productImage: string;
  description: string;
  affiliateCount: number;
  totalPaidOut: number;
  productUrl: string;
}

export interface CreatorAffiliateLink {
  id: string;
  programId: string;
  creatorId: string;
  referralCode: string;
  referralUrl: string;
  couponCode: string;
  clicks: number;
  conversions: number;
  earnedAmount: number;
  status: 'active' | 'pending';
}

export interface PerformanceAttribution {
  id: string;
  collaborationId: string;
  campaignTitle: string;
  trackableLink: string;
  qrCodeUrl: string;
  couponCode: string;
  views: number;
  clicks: number;
  enquiries: number;
  couponRedemptions: number;
  attributedSales: number;
  cpl: number;
  roi: number;
  verifiedPlatformData: boolean;
  creatorReportedScreenshots: string[];
}

export interface SponsorRequirementRFP {
  id: string;
  sponsorId: string;
  sponsorName: string;
  sponsorLogo: string;
  brandIndustry: string;
  title: string;
  targetEventTypes: string[];
  budgetMin: number;
  budgetMax: number;
  minFootfall: number;
  requiredPerks: string[];
  targetLocations: string[];
  brief: string;
  status: 'open' | 'negotiating' | 'allocated' | 'closed';
  proposalsCount: number;
  createdAt: string;
  deadline: string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformCommissionPercent: 8,
  featuredCampaignFee: 1999,
  minCampaignBudget: 1000,
  currencySymbol: '₹',
  currencyCode: 'INR',
  taxGstRate: 18,
  autoEscrowReleaseDays: 7,
  categories: [
    'Fashion & Style',
    'Tech & Gadgets',
    'Food & Beverage',
    'Beauty & Skincare',
    'Fitness & Health',
    'Travel & Hospitality',
    'Finance & Crypto',
    'Gaming & Esports',
    'Education & Careers',
    'Comedy & Entertainment',
    'Parenting & Family',
    'Automotive & Bikes',
    'Photography & Film',
    'Events & Lifestyle'
  ],
  maintenanceMode: false
};

// Export all Security, Compliance, DPDP, and Payment types
export * from './compliance';

