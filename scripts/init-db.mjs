/**
 * co-lab SQLite Database Initialization & Seeding Script
 * 
 * Creates 'colab.db' using Node.js built-in 'node:sqlite' DatabaseSync.
 * Seeds all mock data from src/data/mockData.ts into relational tables
 * with full-fidelity JSON preservation.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'colab.db');

export async function initDatabase(verbose = true) {
  if (verbose) {
    console.log(`[co-lab Database] Initializing SQLite database at: ${dbPath}`);
  }

  // Remove existing database to ensure fresh clean migration
  if (fs.existsSync(dbPath)) {
    try {
      fs.unlinkSync(dbPath);
    } catch {
      // file might be locked, reopen in place
    }
  }

  const db = new DatabaseSync(dbPath);

  // Enable WAL mode for concurrent fast reads and writes
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  // 1. CREATE ALL SCHEMA TABLES
  db.exec(`
    -- Platform Settings
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      data JSON NOT NULL
    );

    -- Users & Profiles
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      verified INTEGER DEFAULT 0,
      activeSubProfileId TEXT,
      subProfiles JSON,
      raw JSON NOT NULL
    );

    -- Creators Directory
    CREATE TABLE IF NOT EXISTS creators (
      id TEXT PRIMARY KEY,
      handle TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT,
      minPrice REAL DEFAULT 1000,
      rating REAL DEFAULT 5.0,
      completedDeals INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      avatar TEXT,
      coverImage TEXT,
      languages JSON,
      demographics JSON,
      socialAccounts JSON,
      services JSON,
      portfolio JSON,
      raw JSON NOT NULL
    );

    -- Business Profiles
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      location TEXT,
      verified INTEGER DEFAULT 0,
      avatar TEXT,
      coverImage TEXT,
      campaignsCount INTEGER DEFAULT 0,
      totalSpent REAL DEFAULT 0,
      raw JSON NOT NULL
    );

    -- Brand Advertising Campaigns
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      businessId TEXT NOT NULL,
      businessName TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      budgetMin REAL NOT NULL,
      budgetMax REAL NOT NULL,
      totalBudget REAL,
      applicantsCount INTEGER DEFAULT 0,
      shortlistedCount INTEGER DEFAULT 0,
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Campaign Applications
    CREATE TABLE IF NOT EXISTS campaign_applications (
      id TEXT PRIMARY KEY,
      campaignId TEXT NOT NULL,
      campaignTitle TEXT NOT NULL,
      creatorId TEXT NOT NULL,
      creatorName TEXT NOT NULL,
      creatorHandle TEXT,
      creatorCategory TEXT,
      proposedRate REAL NOT NULL,
      deliveryDays INTEGER DEFAULT 5,
      pitch TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      appliedAt TEXT,
      raw JSON NOT NULL
    );

    -- Collaborations & Smart Deal Rooms
    CREATE TABLE IF NOT EXISTS collaborations (
      id TEXT PRIMARY KEY,
      campaignId TEXT NOT NULL,
      campaignTitle TEXT NOT NULL,
      businessId TEXT NOT NULL,
      businessName TEXT NOT NULL,
      creatorId TEXT NOT NULL,
      creatorName TEXT NOT NULL,
      agreedAmount REAL NOT NULL,
      platformFee REAL NOT NULL,
      creatorPayout REAL NOT NULL,
      status TEXT NOT NULL,
      escrowStatus TEXT NOT NULL DEFAULT 'held',
      deadline TEXT,
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Sponsorship Opportunities
    CREATE TABLE IF NOT EXISTS sponsorships (
      id TEXT PRIMARY KEY,
      title TEXT,
      organizerName TEXT,
      category TEXT,
      location TEXT,
      eventDate TEXT,
      expectedFootfall INTEGER DEFAULT 0,
      proposalCount INTEGER DEFAULT 0,
      raw JSON NOT NULL
    );

    -- Sponsor RFPs (Corporate Sponsorship Requirements)
    CREATE TABLE IF NOT EXISTS sponsor_rfps (
      id TEXT PRIMARY KEY,
      sponsorId TEXT NOT NULL,
      sponsorName TEXT NOT NULL,
      brandIndustry TEXT NOT NULL,
      title TEXT NOT NULL,
      budgetMin REAL NOT NULL,
      budgetMax REAL NOT NULL,
      minFootfall INTEGER DEFAULT 1000,
      status TEXT NOT NULL DEFAULT 'open',
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Creative Professionals Directory
    CREATE TABLE IF NOT EXISTS creative_professionals (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      location TEXT,
      startingPrice REAL,
      rating REAL DEFAULT 5.0,
      raw JSON NOT NULL
    );

    -- Direct Ad Inventory Slots
    CREATE TABLE IF NOT EXISTS ad_inventory (
      id TEXT PRIMARY KEY,
      creatorId TEXT,
      creatorName TEXT,
      platform TEXT,
      format TEXT,
      price REAL,
      slotsRemaining INTEGER DEFAULT 1,
      raw JSON NOT NULL
    );

    -- Verified Reviews
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      collaborationId TEXT,
      reviewerId TEXT,
      reviewerName TEXT,
      reviewerRole TEXT,
      targetId TEXT,
      targetName TEXT,
      rating REAL,
      comment TEXT,
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Financial Escrow Transactions
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      collaborationId TEXT,
      amount REAL,
      type TEXT,
      status TEXT,
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Hyperlocal Advertising Channels
    CREATE TABLE IF NOT EXISTS local_ad_channels (
      id TEXT PRIMARY KEY,
      channelName TEXT,
      platform TEXT,
      city TEXT,
      locality TEXT,
      reachCount INTEGER,
      pricePerSlot REAL,
      verifiedAudience INTEGER DEFAULT 1,
      raw JSON NOT NULL
    );

    -- Creator Collectives & Bundles
    CREATE TABLE IF NOT EXISTS creator_collectives (
      id TEXT PRIMARY KEY,
      title TEXT,
      region TEXT,
      niche TEXT,
      creatorCount INTEGER,
      bundlePrice REAL,
      raw JSON NOT NULL
    );

    -- Affiliate Programs
    CREATE TABLE IF NOT EXISTS affiliate_programs (
      id TEXT PRIMARY KEY,
      brandName TEXT,
      productName TEXT,
      commissionType TEXT,
      commissionRate REAL,
      raw JSON NOT NULL
    );

    -- Creator Affiliate Tracking Links
    CREATE TABLE IF NOT EXISTS creator_affiliate_links (
      id TEXT PRIMARY KEY,
      programId TEXT,
      creatorId TEXT,
      referralCode TEXT,
      couponCode TEXT,
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      earnedAmount REAL DEFAULT 0,
      raw JSON NOT NULL
    );

    -- Creator Availability & Booking Slots
    CREATE TABLE IF NOT EXISTS booking_slots (
      id TEXT PRIMARY KEY,
      creatorId TEXT,
      serviceTitle TEXT,
      date TEXT,
      timeSlot TEXT,
      durationMinutes INTEGER DEFAULT 60,
      price REAL,
      status TEXT DEFAULT 'available',
      bookingConditions TEXT,
      serviceLocation TEXT,
      instantBookable INTEGER DEFAULT 1,
      clientName TEXT,
      raw JSON NOT NULL
    );

    -- Structured Collaboration Enquiries (Aviora CRM)
    CREATE TABLE IF NOT EXISTS structured_enquiries (
      id TEXT PRIMARY KEY,
      conversationId TEXT,
      senderId TEXT,
      senderName TEXT,
      targetId TEXT,
      targetName TEXT,
      projectNeed TEXT,
      budget REAL,
      campaignDates TEXT,
      location TEXT,
      contentUsageRights TEXT,
      expectedResults TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Formal Negotiation Quotes & Counteroffer Ladders
    CREATE TABLE IF NOT EXISTS negotiation_quotes (
      id TEXT PRIMARY KEY,
      conversationId TEXT,
      fromId TEXT,
      fromName TEXT,
      toId TEXT,
      toName TEXT,
      currentAmount REAL,
      timelineDays INTEGER DEFAULT 5,
      usageRights TEXT,
      terms TEXT,
      status TEXT DEFAULT 'pending',
      finalAgreedAmount REAL,
      createdAt TEXT,
      raw JSON NOT NULL
    );

    -- Campaign Telemetry & Performance Attributions
    CREATE TABLE IF NOT EXISTS performance_attributions (
      id TEXT PRIMARY KEY,
      campaignId TEXT,
      creatorId TEXT,
      trackingUrl TEXT,
      couponCode TEXT,
      verifiedPlatformData INTEGER DEFAULT 1,
      attributedSales REAL DEFAULT 0,
      adSpend REAL DEFAULT 0,
      raw JSON NOT NULL
    );

    -- Aviora CRM Unified Inbox Conversations
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      category TEXT DEFAULT 'all',
      collaborationId TEXT,
      unreadCount INTEGER DEFAULT 0,
      lastMessage TEXT,
      lastMessageTime TEXT,
      raw JSON NOT NULL
    );

    -- Messages & Chat Attachments
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT,
      senderId TEXT,
      senderName TEXT,
      senderRole TEXT,
      text TEXT,
      attachmentType TEXT,
      voiceNoteDuration INTEGER,
      isRead INTEGER DEFAULT 0,
      timestamp TEXT,
      raw JSON NOT NULL
    );

    -- Create Query Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_creators_category ON creators(category);
    CREATE INDEX IF NOT EXISTS idx_creators_price ON creators(minPrice);
    CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
    CREATE INDEX IF NOT EXISTS idx_collab_creator ON collaborations(creatorId);
    CREATE INDEX IF NOT EXISTS idx_collab_business ON collaborations(businessId);
    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversationId);
    CREATE INDEX IF NOT EXISTS idx_booking_creator ON booking_slots(creatorId);
    CREATE INDEX IF NOT EXISTS idx_enquiries_target ON structured_enquiries(targetId);
    CREATE INDEX IF NOT EXISTS idx_quotes_conv ON negotiation_quotes(conversationId);
  `);

  if (verbose) {
    console.log('[co-lab Database] All 23 SQLite tables and indexes created successfully.');
  }

  // 2. LOAD DATA FROM src/data/mockData.ts VIA VITE RUNTIME
  const { createServer } = await import('vite');
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom'
  });

  const mockData = await vite.ssrLoadModule('./src/data/mockData.ts');
  await vite.close();

  // Helper to insert record with standard columns and full raw JSON
  const insertOne = (table, row, standardMapping = {}) => {
    const raw = JSON.stringify(row);
    const cols = ['id', 'raw', ...Object.keys(standardMapping)];
    const placeholders = cols.map(() => '?').join(', ');
    const values = [row.id, raw, ...Object.values(standardMapping)].map(v => v === undefined ? null : v);
    const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`);
    stmt.run(...values);
  };

  // Seed Settings
  db.prepare('INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)').run(
    'platform_settings',
    JSON.stringify(mockData.INITIAL_SETTINGS)
  );

  // Seed Users
  for (const u of mockData.DEMO_USERS) {
    insertOne('users', u, {
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      bio: u.bio,
      verified: u.verified ? 1 : 0,
      activeSubProfileId: u.activeSubProfileId || null,
      subProfiles: JSON.stringify(u.subProfiles || [])
    });
  }

  // Seed Creators
  for (const c of mockData.CREATORS) {
    insertOne('creators', c, {
      handle: c.handle,
      name: c.name,
      category: c.category,
      location: c.location,
      minPrice: c.minPrice,
      rating: c.rating,
      completedDeals: c.completedDeals,
      verified: c.verified ? 1 : 0,
      avatar: c.avatar,
      coverImage: c.coverImage,
      languages: JSON.stringify(c.languages || []),
      demographics: JSON.stringify(c.demographics || {}),
      socialAccounts: JSON.stringify(c.socialAccounts || []),
      services: JSON.stringify(c.services || []),
      portfolio: JSON.stringify(c.portfolio || [])
    });
  }

  // Seed Businesses
  for (const b of mockData.BUSINESSES) {
    insertOne('businesses', b, {
      name: b.name,
      industry: b.industry,
      location: b.location,
      verified: b.verified ? 1 : 0,
      avatar: b.avatar,
      coverImage: b.coverImage,
      campaignsCount: b.campaignsCount,
      totalSpent: b.totalSpent
    });
  }

  // Seed Campaigns
  for (const camp of mockData.CAMPAIGNS) {
    insertOne('campaigns', camp, {
      title: camp.title,
      businessId: camp.businessId,
      businessName: camp.businessName,
      category: camp.category,
      status: camp.status,
      budgetMin: camp.budget?.minAmount || 0,
      budgetMax: camp.budget?.maxAmount || 0,
      totalBudget: camp.budget?.totalBudget || 0,
      applicantsCount: camp.applicantsCount || 0,
      shortlistedCount: camp.shortlistedCount || 0,
      createdAt: camp.createdAt
    });
  }

  // Seed Sponsorships
  for (const s of mockData.SPONSORSHIPS) {
    insertOne('sponsorships', s, {
      title: s.title,
      organizerName: s.organiserName || s.organizerName || '',
      category: s.category,
      location: s.location,
      eventDate: s.eventDate,
      expectedFootfall: s.expectedFootfall || 0,
      proposalCount: s.proposalCount || 0
    });
  }

  // Seed Sponsor RFPs
  for (const rfp of mockData.SPONSOR_RFPS || []) {
    insertOne('sponsor_rfps', rfp, {
      sponsorId: rfp.sponsorId,
      sponsorName: rfp.sponsorName,
      brandIndustry: rfp.brandIndustry,
      title: rfp.title,
      budgetMin: rfp.budgetMin,
      budgetMax: rfp.budgetMax,
      minFootfall: rfp.minFootfall || 1000,
      status: rfp.status || 'open',
      createdAt: rfp.createdAt
    });
  }

  // Seed Creative Professionals
  for (const p of mockData.CREATIVE_PROFESSIONALS) {
    insertOne('creative_professionals', p, {
      name: p.name,
      role: p.role,
      location: p.location,
      startingPrice: p.startingPrice || p.startingRate || 1000,
      rating: p.rating || 5.0
    });
  }

  // Seed Ad Inventory
  for (const inv of mockData.AD_INVENTORY) {
    insertOne('ad_inventory', inv, {
      creatorId: inv.creatorId || null,
      creatorName: inv.creatorName || null,
      platform: inv.platform || null,
      format: inv.format || null,
      price: inv.price || 0,
      slotsRemaining: inv.slotsRemaining ?? 1
    });
  }

  // Seed Collaborations
  for (const col of mockData.COLLABORATIONS) {
    insertOne('collaborations', col, {
      campaignId: col.campaignId,
      campaignTitle: col.campaignTitle,
      businessId: col.businessId,
      businessName: col.businessName,
      creatorId: col.creatorId,
      creatorName: col.creatorName,
      agreedAmount: col.agreedAmount,
      platformFee: col.platformFee,
      creatorPayout: col.creatorPayout,
      status: col.status,
      escrowStatus: col.escrowStatus || 'held',
      deadline: col.deadline,
      createdAt: col.createdAt
    });
  }

  // Seed Reviews
  for (const r of mockData.REVIEWS) {
    insertOne('reviews', r, {
      collaborationId: r.collaborationId,
      reviewerId: r.reviewerId,
      reviewerName: r.reviewerName,
      reviewerRole: r.reviewerRole,
      targetId: r.targetId,
      targetName: r.targetName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    });
  }

  // Seed Transactions
  for (const t of mockData.TRANSACTIONS) {
    insertOne('transactions', t, {
      collaborationId: t.collaborationId || null,
      amount: t.amount,
      type: t.type,
      status: t.status,
      createdAt: t.createdAt
    });
  }

  // Seed Local Ad Channels
  for (const l of mockData.LOCAL_AD_CHANNELS) {
    insertOne('local_ad_channels', l, {
      channelName: l.channelName,
      platform: l.platform,
      city: l.city,
      locality: l.locality,
      reachCount: l.reachCount,
      pricePerSlot: l.pricePerSlot,
      verifiedAudience: l.verifiedAudience ? 1 : 0
    });
  }

  // Seed Creator Collectives
  for (const col of mockData.CREATOR_COLLECTIVES) {
    insertOne('creator_collectives', col, {
      title: col.title,
      region: col.region,
      niche: col.niche,
      creatorCount: col.creatorCount,
      bundlePrice: col.bundlePrice
    });
  }

  // Seed Affiliate Programs
  for (const ap of mockData.AFFILIATE_PROGRAMS) {
    insertOne('affiliate_programs', ap, {
      brandName: ap.brandName,
      productName: ap.productName,
      commissionType: ap.commissionType,
      commissionRate: ap.commissionRate
    });
  }

  // Seed Creator Affiliate Links
  for (const al of mockData.CREATOR_AFFILIATE_LINKS) {
    insertOne('creator_affiliate_links', al, {
      programId: al.programId,
      creatorId: al.creatorId,
      referralCode: al.referralCode,
      couponCode: al.couponCode,
      clicks: al.clicks,
      conversions: al.conversions,
      earnedAmount: al.earnedAmount
    });
  }

  // Seed Booking Slots
  for (const bs of mockData.BOOKING_SLOTS) {
    insertOne('booking_slots', bs, {
      creatorId: bs.creatorId,
      serviceTitle: bs.serviceTitle,
      date: bs.date,
      timeSlot: bs.timeSlot,
      durationMinutes: bs.durationMinutes || 60,
      price: bs.price,
      status: bs.status || 'available',
      bookingConditions: bs.bookingConditions || null,
      serviceLocation: bs.serviceLocation || null,
      instantBookable: bs.instantBookable ? 1 : 0,
      clientName: bs.clientName || null
    });
  }

  // Seed Structured Collaboration Enquiries
  for (const se of mockData.STRUCTURED_ENQUIRIES || []) {
    insertOne('structured_enquiries', se, {
      conversationId: se.conversationId || 'conv-101',
      senderId: se.senderId,
      senderName: se.senderName,
      targetId: se.targetId,
      targetName: se.targetName,
      projectNeed: se.projectNeed,
      budget: se.budget,
      campaignDates: se.campaignDates || null,
      location: se.location || null,
      contentUsageRights: se.contentUsageRights,
      expectedResults: se.expectedResults,
      status: se.status || 'pending',
      createdAt: se.createdAt
    });
  }

  // Seed Formal Negotiation Quotes
  for (const nq of mockData.NEGOTIATION_QUOTES || []) {
    insertOne('negotiation_quotes', nq, {
      conversationId: nq.conversationId,
      fromId: nq.fromId,
      fromName: nq.fromName,
      toId: nq.toId,
      toName: nq.toName,
      currentAmount: nq.currentAmount,
      timelineDays: nq.timelineDays,
      usageRights: nq.usageRights,
      terms: nq.terms,
      status: nq.status,
      finalAgreedAmount: nq.finalAgreedAmount || null,
      createdAt: nq.createdAt
    });
  }

  // Seed Performance Attributions
  for (const pa of mockData.PERFORMANCE_ATTRIBUTIONS || []) {
    insertOne('performance_attributions', pa, {
      campaignId: pa.campaignId,
      creatorId: pa.creatorId,
      trackingUrl: pa.trackingUrl,
      couponCode: pa.couponCode,
      verifiedPlatformData: pa.verifiedPlatformData ? 1 : 0,
      attributedSales: pa.attributedSales || 0,
      adSpend: pa.adSpend || 0
    });
  }

  // Seed Sample Applications
  const sampleApps = [
    {
      id: 'app-sample-1',
      campaignId: 'camp-1',
      campaignTitle: 'Spring Pastel Handloom Collection Launch',
      creatorId: 'user-creator-1',
      creatorName: 'Ananya Sharma',
      creatorHandle: '@ananya_style',
      creatorCategory: 'Fashion & Style',
      proposedRate: 3500,
      deliveryDays: 4,
      pitch: 'I love your artisanal cotton kurtis! I have a high-converting styling series "Desk to Dinner".',
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
      creatorCategory: 'Fashion & Style',
      proposedRate: 1500,
      deliveryDays: 3,
      pitch: 'I create authentic handmade crafts and styling content.',
      status: 'pending',
      appliedAt: '2026-11-05T14:30:00Z'
    }
  ];
  for (const a of sampleApps) {
    insertOne('campaign_applications', a, {
      campaignId: a.campaignId,
      campaignTitle: a.campaignTitle,
      creatorId: a.creatorId,
      creatorName: a.creatorName,
      creatorHandle: a.creatorHandle,
      creatorCategory: a.creatorCategory,
      proposedRate: a.proposedRate,
      deliveryDays: a.deliveryDays,
      pitch: a.pitch,
      status: a.status,
      appliedAt: a.appliedAt
    });
  }

  // Seed Conversations
  const sampleConversations = [
    {
      id: 'conv-101',
      category: 'negotiations',
      collaborationId: 'collab-101',
      unreadCount: 0,
      lastMessage: 'Deal terms updated: ₹7,000 accepted with 90-day ad rights.',
      lastMessageTime: '2026-11-14T11:30:00Z',
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
      }
    },
    {
      id: 'conv-102',
      category: 'enquiries',
      collaborationId: null,
      unreadCount: 1,
      lastMessage: '📋 Structured Collaboration Enquiry: Dedicated Summer Reel • Budget: ₹8,000',
      lastMessageTime: '2026-11-14T10:15:00Z',
      participantIds: ['user-creator-1', 'user-biz-2'],
      participantNames: {
        'user-creator-1': 'Ananya Sharma',
        'user-biz-2': 'UrbanGlow Skincare'
      },
      participantAvatars: {
        'user-creator-1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        'user-biz-2': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80'
      },
      participantRoles: {
        'user-creator-1': 'creator',
        'user-biz-2': 'business'
      }
    }
  ];
  for (const conv of sampleConversations) {
    insertOne('conversations', conv, {
      category: conv.category,
      collaborationId: conv.collaborationId,
      unreadCount: conv.unreadCount,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime
    });
  }

  // Seed Messages
  const sampleMessages = [
    {
      id: 'msg-1',
      conversationId: 'conv-101',
      senderId: 'user-biz-1',
      senderName: 'Aroma Threads Boutique',
      senderRole: 'business',
      text: 'Hi Ananya! We are thrilled to partner with you for our Spring Pastel handloom launch.',
      attachmentType: null,
      timestamp: '2026-11-12T10:00:00Z',
      isRead: 1
    },
    {
      id: 'msg-2',
      conversationId: 'conv-101',
      senderId: 'user-creator-1',
      senderName: 'Ananya Sharma',
      senderRole: 'creator',
      text: 'Thank you! Excited to style the pastel pieces with high-energy reels.',
      attachmentType: null,
      timestamp: '2026-11-12T10:15:00Z',
      isRead: 1
    },
    {
      id: 'msg-3',
      conversationId: 'conv-101',
      senderId: 'user-creator-1',
      senderName: 'Ananya Sharma',
      senderRole: 'creator',
      text: '🎤 Voice note (24s) explaining creative transitions',
      attachmentType: 'voice_note',
      voiceNoteDuration: 24,
      timestamp: '2026-11-12T11:00:00Z',
      isRead: 1
    },
    {
      id: 'msg-4',
      conversationId: 'conv-101',
      senderId: 'user-creator-1',
      senderName: 'Ananya Sharma',
      senderRole: 'creator',
      text: '💼 Formal Quotation: ₹7,000 (1x 60s Reel, 2x Stories with link, High-res stills)',
      attachmentType: 'quote',
      attachmentMetadata: mockData.NEGOTIATION_QUOTES?.[0] || null,
      timestamp: '2026-11-14T11:30:00Z',
      isRead: 1
    }
  ];
  for (const m of sampleMessages) {
    insertOne('messages', m, {
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      text: m.text,
      attachmentType: m.attachmentType || null,
      voiceNoteDuration: m.voiceNoteDuration || null,
      isRead: m.isRead || 0,
      timestamp: m.timestamp
    });
  }

  // Inspect Counts
  const tables = [
    'users', 'creators', 'businesses', 'campaigns', 'campaign_applications',
    'collaborations', 'sponsorships', 'sponsor_rfps', 'creative_professionals',
    'ad_inventory', 'reviews', 'transactions', 'local_ad_channels', 'creator_collectives',
    'affiliate_programs', 'creator_affiliate_links', 'booking_slots', 'structured_enquiries',
    'negotiation_quotes', 'performance_attributions', 'conversations', 'messages', 'settings'
  ];

  const stats = {};
  for (const t of tables) {
    const countRow = db.prepare(`SELECT COUNT(*) as count FROM ${t}`).get();
    stats[t] = countRow.count;
  }

  if (verbose) {
    console.log('\n[co-lab Database] Successfully seeded colab.db with:');
    console.table(stats);
  }

  db.close();
  return { dbPath, stats };
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase().catch(err => {
    console.error('[co-lab Database Error]', err);
    process.exit(1);
  });
}
