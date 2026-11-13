/**
 * co-lab Versioned REST API Client (/api/v1)
 *
 * Provides a clean, typed abstraction over Supabase PostgreSQL tables and Edge Functions.
 * Gracefully synchronizes with browser local storage and memory cache if running offline
 * or in demo staging environments.
 */

import { supabase } from '../lib/supabase';
import {
  CreatorProfile,
  Campaign,
  Collaboration,
  SponsorshipOpportunity,
  SponsorRequirementRFP,
  LocalAdChannel,
  CreatorCollective,
  AffiliateProgram,
  CreatorAffiliateLink,
  BookingSlot
} from '../types';
import {
  CREATORS,
  CAMPAIGNS,
  COLLABORATIONS,
  SPONSORSHIPS,
  SPONSOR_RFPS,
  LOCAL_AD_CHANNELS,
  CREATOR_COLLECTIVES,
  AFFILIATE_PROGRAMS,
  CREATOR_AFFILIATE_LINKS,
  BOOKING_SLOTS
} from '../data/mockData';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

// Helper for local storage persistence fallback
const getStorageOrFallback = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`colab_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(`colab_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn(`[co-lab Cache] Could not write ${key}:`, err);
  }
};

export const api = {
  base: API_BASE,

  // 1. CREATORS API (/api/v1/creators)
  creators: {
    async getAll(): Promise<CreatorProfile[]> {
      try {
        const { data, error } = await supabase.from('creators').select('*');
        if (!error && data && data.length > 0) return data as CreatorProfile[];
      } catch {
        // Fallback
      }
      return getStorageOrFallback<CreatorProfile[]>('creators', CREATORS);
    },

    async getById(id: string): Promise<CreatorProfile | null> {
      try {
        const { data, error } = await supabase.from('creators').select('*').eq('id', id).single();
        if (!error && data) return data as CreatorProfile;
      } catch {
        // Fallback
      }
      const list = getStorageOrFallback<CreatorProfile[]>('creators', CREATORS);
      return list.find(c => c.id === id) || null;
    }
  },

  // 2. BRAND CAMPAIGNS API (/api/v1/campaigns)
  campaigns: {
    async getAll(): Promise<Campaign[]> {
      try {
        const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Campaign[];
      } catch {
        // Fallback
      }
      return getStorageOrFallback<Campaign[]>('campaigns', CAMPAIGNS);
    },

    async create(campaign: Partial<Campaign>): Promise<Campaign> {
      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        businessId: campaign.businessId || 'u-biz-01',
        businessName: campaign.businessName || 'Brand Partner',
        businessLogo: campaign.businessLogo || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
        businessVerified: true,
        title: campaign.title || 'Untitled Campaign',
        description: campaign.description || '',
        category: campaign.category || 'Lifestyle',
        productName: campaign.productName || 'Featured Product',
        productUrl: campaign.productUrl || 'https://example.com',
        objectives: campaign.objectives || ['Brand Awareness'],
        targetAudience: campaign.targetAudience || {
          locations: ['Pan-India'],
          ageRange: '18-34',
          gender: 'All',
          interests: ['Lifestyle'],
          languages: ['English', 'Hindi']
        },
        requirements: campaign.requirements || {
          platform: 'Instagram',
          contentFormat: 'Short-Form Video',
          quantity: 1,
          videoDuration: '60s',
          storeVisitRequired: false,
          licensingTerms: '90 Days Digital Rights',
          deadline: '2026-12-31'
        },
        budget: campaign.budget || {
          type: 'fixed',
          minAmount: 3000,
          maxAmount: 15000,
          totalBudget: 15000,
          compensationDetails: 'Fixed payout via platform escrow'
        },
        settings: campaign.settings || {
          deadline: '2026-12-31',
          maxCreators: 5,
          slotsAvailable: 5,
          minFollowers: 3000,
          eligibilityNotes: 'Must create high-converting video reels',
          customQuestions: []
        },
        status: 'active',
        applicantsCount: 0,
        shortlistedCount: 0,
        createdAt: new Date().toISOString()
      };

      try {
        await supabase.from('campaigns').insert([newCampaign]);
      } catch {
        // Fallback to local storage
      }
      const list = getStorageOrFallback<Campaign[]>('campaigns', CAMPAIGNS);
      const updated = [newCampaign, ...list];
      setStorage('campaigns', updated);
      return newCampaign;
    }
  },

  // 3. SPONSORSHIPS API (/api/v1/sponsorships)
  sponsorships: {
    async getAll(): Promise<SponsorshipOpportunity[]> {
      try {
        const { data, error } = await supabase.from('sponsorships').select('*');
        if (!error && data && data.length > 0) return data as SponsorshipOpportunity[];
      } catch {
        // Fallback
      }
      return getStorageOrFallback<SponsorshipOpportunity[]>('sponsorships', SPONSORSHIPS);
    },

    async create(item: Partial<SponsorshipOpportunity>): Promise<SponsorshipOpportunity> {
      const newSponsorship: SponsorshipOpportunity = {
        id: `spons-${Date.now()}`,
        organiserId: item.organiserId || 'u-org-01',
        title: item.title || 'Event Sponsorship',
        type: item.type || 'college_fest',
        category: item.category || 'College Festival',
        organiserName: item.organiserName || 'Event Committee',
        organiserAvatar: item.organiserAvatar || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
        verifiedOrganiser: true,
        description: item.description || '',
        location: item.location || 'India',
        eventDate: item.eventDate || new Date().toISOString(),
        expectedFootfall: item.expectedFootfall || 5000,
        targetAudience: item.targetAudience || 'College Students & Gen-Z (18-24)',
        packages: item.packages || [
          {
            id: `pkg-${Date.now()}`,
            tier: 'Gold Sponsor',
            price: 50000,
            availableSlots: 2,
            claimedSlots: 0,
            perks: ['Main stage banner', 'Stall space (10x10)', 'Logo on brochures']
          }
        ],
        proposalCount: 0,
        deadline: item.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        image: item.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
      };

      try {
        await supabase.from('sponsorships').insert([newSponsorship]);
      } catch {
        // Fallback
      }
      const list = getStorageOrFallback<SponsorshipOpportunity[]>('sponsorships', SPONSORSHIPS);
      const updated = [newSponsorship, ...list];
      setStorage('sponsorships', updated);
      return newSponsorship;
    }
  },

  // 4. SPONSOR RFPS & REQUIREMENTS API (/api/v1/sponsor-rfps)
  sponsorRfps: {
    async getAll(): Promise<SponsorRequirementRFP[]> {
      try {
        const { data, error } = await supabase.from('sponsor_rfps').select('*');
        if (!error && data && data.length > 0) return data as SponsorRequirementRFP[];
      } catch {
        // Fallback
      }
      return getStorageOrFallback<SponsorRequirementRFP[]>('sponsor_rfps', SPONSOR_RFPS);
    },

    async create(rfp: Partial<SponsorRequirementRFP>): Promise<SponsorRequirementRFP> {
      const newRfp: SponsorRequirementRFP = {
        id: `rfp-${Date.now()}`,
        sponsorId: rfp.sponsorId || 'u-sponsor-01',
        sponsorName: rfp.sponsorName || 'Corporate Sponsor',
        sponsorLogo: rfp.sponsorLogo || 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=200&q=80',
        brandIndustry: rfp.brandIndustry || 'Energy / FMCG',
        title: rfp.title || 'Brand Sponsorship Requirement',
        targetEventTypes: rfp.targetEventTypes || ['college_fest', 'sports_tournament'],
        budgetMin: rfp.budgetMin || 50000,
        budgetMax: rfp.budgetMax || 150000,
        minFootfall: rfp.minFootfall || 5000,
        requiredPerks: rfp.requiredPerks || ['Title Sponsorship', 'Sampling Booth'],
        targetLocations: rfp.targetLocations || ['Pan-India'],
        brief: rfp.brief || '',
        deadline: rfp.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
        proposalsCount: 0,
        status: 'open',
        createdAt: new Date().toISOString()
      };

      try {
        await supabase.from('sponsor_rfps').insert([newRfp]);
      } catch {
        // Fallback
      }
      const list = getStorageOrFallback<SponsorRequirementRFP[]>('sponsor_rfps', SPONSOR_RFPS);
      const updated = [newRfp, ...list];
      setStorage('sponsor_rfps', updated);
      return newRfp;
    }
  },

  // 5. HYPERLOCAL ADS API (/api/v1/local-ads)
  localAds: {
    async getAll(city?: string): Promise<LocalAdChannel[]> {
      const list = getStorageOrFallback<LocalAdChannel[]>('local_ad_channels', LOCAL_AD_CHANNELS);
      if (city && city !== 'All') {
        return list.filter(c => c.city.toLowerCase() === city.toLowerCase());
      }
      return list;
    }
  },

  // 6. CREATOR COLLECTIVES API (/api/v1/collectives)
  collectives: {
    async getAll(): Promise<CreatorCollective[]> {
      return getStorageOrFallback<CreatorCollective[]>('creator_collectives', CREATOR_COLLECTIVES);
    }
  },

  // 7. AFFILIATE & PERFORMANCE API (/api/v1/affiliates)
  affiliates: {
    async getAllPrograms(): Promise<AffiliateProgram[]> {
      return getStorageOrFallback<AffiliateProgram[]>('affiliate_programs', AFFILIATE_PROGRAMS);
    },

    async getCreatorLinks(creatorId: string): Promise<CreatorAffiliateLink[]> {
      const links = getStorageOrFallback<CreatorAffiliateLink[]>('creator_affiliate_links', CREATOR_AFFILIATE_LINKS);
      return links.filter(l => l.creatorId === creatorId);
    }
  },

  // 8. COLLABORATION DEAL ROOMS API (/api/v1/collaborations)
  collaborations: {
    async getAll(): Promise<Collaboration[]> {
      try {
        const { data, error } = await supabase.from('collaborations').select('*');
        if (!error && data && data.length > 0) return data as Collaboration[];
      } catch {
        // Fallback
      }
      return getStorageOrFallback<Collaboration[]>('collaborations', COLLABORATIONS);
    },

    async getById(id: string): Promise<Collaboration | null> {
      const list = await api.collaborations.getAll();
      return list.find(c => c.id === id) || null;
    }
  },

  // 9. BOOKING SLOTS API (/api/v1/bookings)
  bookings: {
    async getAll(): Promise<BookingSlot[]> {
      return getStorageOrFallback<BookingSlot[]>('booking_slots', BOOKING_SLOTS);
    }
  }
};
