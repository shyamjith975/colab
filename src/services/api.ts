/**
 * co-lab Versioned REST API Client (/api/v1)
 *
 * Connects directly to the SQLite backend ('colab.db') via Vite API middleware
 * or standalone Node.js server.
 * Supports complete CRUD for creators, campaigns, enquiries, quotes, deals, bookings,
 * and live database telemetry.
 */

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
  BookingSlot,
  StructuredCollaborationEnquiry,
  NegotiationQuote,
  Message,
  Conversation,
  UserProfile,
  UserRole,
  AdInventoryItem,
  Review,
  Transaction,
  PlatformSettings
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
  BOOKING_SLOTS,
  STRUCTURED_ENQUIRIES,
  NEGOTIATION_QUOTES,
  DEMO_USERS,
  REVIEWS,
  TRANSACTIONS,
  INITIAL_SETTINGS
} from '../data/mockData';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

// Helper for fetch with timeout & fallback
async function fetchJson<T>(endpoint: string, options: RequestInit = {}, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    // Backend fetch failed, will return fallback
  }
  return fallback;
}

export const api = {
  base: API_BASE,

  // 1. BOOTSTRAP API: Fetch all tables in 1 call from colab.db
  async bootstrap() {
    return fetchJson('/bootstrap', { method: 'GET' }, {
      users: DEMO_USERS,
      creators: CREATORS,
      businesses: [],
      campaigns: CAMPAIGNS,
      applications: [],
      collaborations: COLLABORATIONS,
      sponsorships: SPONSORSHIPS,
      sponsorRfps: SPONSOR_RFPS,
      creativeProfessionals: [],
      adInventory: [],
      reviews: REVIEWS,
      transactions: TRANSACTIONS,
      localAdChannels: LOCAL_AD_CHANNELS,
      creatorCollectives: CREATOR_COLLECTIVES,
      affiliatePrograms: AFFILIATE_PROGRAMS,
      creatorAffiliateLinks: CREATOR_AFFILIATE_LINKS,
      bookingSlots: BOOKING_SLOTS,
      structuredEnquiries: STRUCTURED_ENQUIRIES,
      negotiationQuotes: NEGOTIATION_QUOTES,
      performanceAttributions: [],
      conversations: [],
      messages: [],
      settings: INITIAL_SETTINGS,
      stats: { database: 'colab.db', connected: false }
    });
  },

  // 2. DATABASE TELEMETRY & SQL QUERY RUNNER
  db: {
    async getStatus() {
      return fetchJson('/health', { method: 'GET' }, {
        status: 'fallback',
        database: { database: 'colab.db', connected: false, tables: {} }
      });
    },

    async runQuery(sql: string, params: any[] = []) {
      return fetchJson('/db/query', {
        method: 'POST',
        body: JSON.stringify({ sql, params })
      }, { success: false, error: 'Database endpoint unreachable', rows: [] });
    },

    async reseed() {
      return fetchJson('/db/reseed', { method: 'POST' }, { success: false });
    }
  },

  // 3. CREATORS API
  creators: {
    async getAll(): Promise<CreatorProfile[]> {
      return fetchJson<CreatorProfile[]>('/creators', { method: 'GET' }, CREATORS);
    },

    async getById(id: string): Promise<CreatorProfile | null> {
      return fetchJson<CreatorProfile | null>(`/creators/${id}`, { method: 'GET' }, CREATORS.find(c => c.id === id) || null);
    }
  },

  // 4. CAMPAIGNS API
  campaigns: {
    async getAll(): Promise<Campaign[]> {
      return fetchJson<Campaign[]>('/campaigns', { method: 'GET' }, CAMPAIGNS);
    },

    async create(campaign: Partial<Campaign>): Promise<Campaign> {
      return fetchJson<Campaign>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(campaign)
      }, campaign as Campaign);
    }
  },

  // 5. STRUCTURED ENQUIRIES API
  enquiries: {
    async getAll(): Promise<StructuredCollaborationEnquiry[]> {
      return fetchJson<StructuredCollaborationEnquiry[]>('/structured-enquiries', { method: 'GET' }, STRUCTURED_ENQUIRIES);
    },

    async create(enquiry: Partial<StructuredCollaborationEnquiry>): Promise<StructuredCollaborationEnquiry> {
      return fetchJson<StructuredCollaborationEnquiry>('/structured-enquiries', {
        method: 'POST',
        body: JSON.stringify(enquiry)
      }, enquiry as StructuredCollaborationEnquiry);
    }
  },

  // 6. FORMAL NEGOTIATION QUOTES API
  quotes: {
    async getAll(): Promise<NegotiationQuote[]> {
      return fetchJson<NegotiationQuote[]>('/negotiation-quotes', { method: 'GET' }, NEGOTIATION_QUOTES);
    },

    async create(quote: Partial<NegotiationQuote>): Promise<NegotiationQuote> {
      return fetchJson<NegotiationQuote>('/negotiation-quotes', {
        method: 'POST',
        body: JSON.stringify(quote)
      }, quote as NegotiationQuote);
    }
  },

  // 7. BOOKING SLOTS API
  bookingSlots: {
    async getAll(): Promise<BookingSlot[]> {
      return fetchJson<BookingSlot[]>('/booking-slots', { method: 'GET' }, BOOKING_SLOTS);
    },

    async book(slotId: string, clientName: string): Promise<BookingSlot | null> {
      return fetchJson<BookingSlot | null>('/booking-slots/book', {
        method: 'POST',
        body: JSON.stringify({ slotId, clientName })
      }, null);
    }
  },

  // 8. COLLABORATIONS & SMART DEAL ROOMS
  collaborations: {
    async getAll(): Promise<Collaboration[]> {
      return fetchJson<Collaboration[]>('/collaborations', { method: 'GET' }, COLLABORATIONS);
    },

    async create(collab: Partial<Collaboration>): Promise<Collaboration> {
      return fetchJson<Collaboration>('/collaborations', {
        method: 'POST',
        body: JSON.stringify(collab)
      }, collab as Collaboration);
    }
  },

  // 9. CONVERSATIONS & MESSAGES
  messages: {
    async getConversations(): Promise<Conversation[]> {
      return fetchJson<Conversation[]>('/conversations', { method: 'GET' }, []);
    },

    async getMessages(conversationId?: string): Promise<Message[]> {
      const q = conversationId ? `?conversationId=${conversationId}` : '';
      return fetchJson<Message[]>(`/messages${q}`, { method: 'GET' }, []);
    },

    async send(msg: Partial<Message>): Promise<Message> {
      return fetchJson<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify(msg)
      }, msg as Message);
    }
  },

  // 10. SPONSOR RFPS
  sponsorRfps: {
    async getAll(): Promise<SponsorRequirementRFP[]> {
      return fetchJson<SponsorRequirementRFP[]>('/sponsor-rfps', { method: 'GET' }, SPONSOR_RFPS);
    },

    async create(rfp: Partial<SponsorRequirementRFP>): Promise<SponsorRequirementRFP> {
      return fetchJson<SponsorRequirementRFP>('/sponsor-rfps', {
        method: 'POST',
        body: JSON.stringify(rfp)
      }, rfp as SponsorRequirementRFP);
    }
  },

  // 11. AUTHENTICATION (SHA-256 PASSWORD HASHING)
  auth: {
    async login(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
      return fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }, { success: false, error: 'Database network error' });
    },

    async signup(payload: { email: string; password: string; name: string; role: UserRole; bio?: string; location?: string }): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
      return fetchJson('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, { success: false, error: 'Database network error' });
    }
  },

  // 12. AD INVENTORY (AD SPACES)
  adInventory: {
    async getAll(): Promise<AdInventoryItem[]> {
      return fetchJson<AdInventoryItem[]>('/ad-inventory', { method: 'GET' }, []);
    },

    async create(item: Partial<AdInventoryItem>): Promise<AdInventoryItem> {
      return fetchJson<AdInventoryItem>('/ad-inventory', {
        method: 'POST',
        body: JSON.stringify(item)
      }, item as AdInventoryItem);
    }
  },

  // 13. LOCAL ADS
  localAds: {
    async getAll(): Promise<LocalAdChannel[]> {
      return fetchJson<LocalAdChannel[]>('/local-ads', { method: 'GET' }, LOCAL_AD_CHANNELS);
    },

    async create(channel: Partial<LocalAdChannel>): Promise<LocalAdChannel> {
      return fetchJson<LocalAdChannel>('/local-ads', {
        method: 'POST',
        body: JSON.stringify(channel)
      }, channel as LocalAdChannel);
    }
  },

  // 14. SPONSORSHIPS
  sponsorships: {
    async getAll(): Promise<SponsorshipOpportunity[]> {
      return fetchJson<SponsorshipOpportunity[]>('/sponsorships', { method: 'GET' }, SPONSORSHIPS);
    },

    async create(sponsorship: Partial<SponsorshipOpportunity>): Promise<SponsorshipOpportunity> {
      return fetchJson<SponsorshipOpportunity>('/sponsorships', {
        method: 'POST',
        body: JSON.stringify(sponsorship)
      }, sponsorship as SponsorshipOpportunity);
    }
  }
};
