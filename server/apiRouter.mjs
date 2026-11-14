/**
 * co-lab REST API Router (/api/v1)
 *
 * Implements REST endpoints backed directly by the SQLite database 'colab.db'.
 * Works as Vite dev middleware and as a standalone Node.js HTTP server.
 */

import {
  getAll,
  getById,
  insertRecord,
  updateRecord,
  deleteRecord,
  executeRawQuery,
  getDatabaseStats,
  getDatabase
} from './db.mjs';
import { initDatabase } from '../scripts/init-db.mjs';
import crypto from 'node:crypto';

// Helper to parse JSON body from incoming Node.js HTTP request
export async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON HTTP response
export function sendJson(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.end(JSON.stringify(data));
  return true;
}

/**
 * Universal Request Handler for /api/v1/*
 */
export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/$/, ''); // strip trailing slash
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.end();
    return true;
  }

  // Only handle routes starting with /api/v1
  if (!pathname.startsWith('/api/v1')) {
    return false;
  }

  const endpoint = pathname.replace('/api/v1', '') || '/';

  try {
    // 1. HEALTH & DATABASE STATS
    if (endpoint === '/health' || endpoint === '/db/status') {
      return sendJson(res, {
        status: 'ok',
        app: 'co-lab Creator & Advertising Marketplace',
        timestamp: new Date().toISOString(),
        database: getDatabaseStats()
      });
    }

    // 2. BOOTSTRAP: Load all collections in 1 fast query for frontend hydration
    if (endpoint === '/bootstrap') {
      const data = {
        users: getAll('users'),
        creators: getAll('creators'),
        businesses: getAll('businesses'),
        campaigns: getAll('campaigns'),
        applications: getAll('campaign_applications'),
        collaborations: getAll('collaborations'),
        sponsorships: getAll('sponsorships'),
        sponsorRfps: getAll('sponsor_rfps'),
        creativeProfessionals: getAll('creative_professionals'),
        adInventory: getAll('ad_inventory'),
        reviews: getAll('reviews'),
        transactions: getAll('transactions'),
        localAdChannels: getAll('local_ad_channels'),
        creatorCollectives: getAll('creator_collectives'),
        affiliatePrograms: getAll('affiliate_programs'),
        creatorAffiliateLinks: getAll('creator_affiliate_links'),
        bookingSlots: getAll('booking_slots'),
        structuredEnquiries: getAll('structured_enquiries'),
        negotiationQuotes: getAll('negotiation_quotes'),
        performanceAttributions: getAll('performance_attributions'),
        conversations: getAll('conversations'),
        messages: getAll('messages'),
        settings: getById('settings', 'platform_settings') || getAll('settings')[0] || null,
        stats: getDatabaseStats()
      };
      return sendJson(res, data);
    }

    // 3. MANUAL SQL QUERY RUNNER & RESEED
    if (endpoint === '/db/query' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.sql) {
        return sendJson(res, { error: 'Missing SQL query parameter' }, 400);
      }
      const results = executeRawQuery(body.sql, body.params || []);
      return sendJson(res, { success: true, count: results.length, rows: results });
    }

    if (endpoint === '/db/reseed' && method === 'POST') {
      const result = await initDatabase(false);
      return sendJson(res, { success: true, message: 'colab.db re-seeded successfully', result });
    }

    // 3.5 AUTHENTICATION API (SHA-256 PASSWORD HASHING)
    if (endpoint === '/auth/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password } = body;
      if (!email || !password) {
        return sendJson(res, { error: 'Email and password are required' }, 400);
      }
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      const db = getDatabase();
      const userRow = db.prepare('SELECT raw, password_hash FROM users WHERE LOWER(email) = LOWER(?)').get(email);
      if (!userRow) {
        return sendJson(res, { error: 'No account found with this email address.' }, 401);
      }
      if (userRow.password_hash !== hash) {
        return sendJson(res, { error: 'Invalid password. Please check your credentials.' }, 401);
      }
      const user = JSON.parse(userRow.raw);
      delete user.password_hash;
      return sendJson(res, {
        success: true,
        user,
        token: `colab_jwt_${Date.now()}_${user.id}`,
        message: 'Logged in successfully'
      });
    }

    if (endpoint === '/auth/signup' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { email, password, name, role, bio, location } = body;
      if (!email || !password || !name || !role) {
        return sendJson(res, { error: 'Name, email, password, and role are required' }, 400);
      }
      if (password.length < 6) {
        return sendJson(res, { error: 'Password must be at least 6 characters long' }, 400);
      }
      const db = getDatabase();
      const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email);
      if (existing) {
        return sendJson(res, { error: 'An account with this email address already exists' }, 409);
      }

      const hash = crypto.createHash('sha256').update(password).digest('hex');
      const newUserId = `user-${role}-${Date.now()}`;
      const newUser = {
        id: newUserId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: bio || `Passionate ${role} on co-lab`,
        location: location || 'India',
        verified: false,
        createdAt: new Date().toISOString()
      };

      insertRecord('users', { ...newUser, password_hash: hash }, {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        password_hash: hash,
        avatar: newUser.avatar,
        bio: newUser.bio,
        verified: 0
      });

      // If creator role, also create profile in creators table
      if (role === 'creator') {
        const cleanHandle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const newCreator = {
          id: newUserId,
          handle: cleanHandle,
          name: newUser.name,
          category: 'Fashion & Style',
          location: newUser.location,
          minPrice: 1500,
          rating: 5.0,
          completedDeals: 0,
          verified: false,
          avatar: newUser.avatar,
          coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
          bio: newUser.bio,
          languages: ['English', 'Hindi'],
          demographics: {
            topAudienceAge: '18-30',
            genderRatio: { male: 50, female: 50 },
            topLocations: [newUser.location]
          },
          socialAccounts: [
            { platform: 'Instagram', handle: cleanHandle, followers: 5000, engagementRate: 4.8, verified: false }
          ],
          services: [
            { format: 'Instagram Reel (60s)', price: 2500, turnaroundDays: 3 }
          ],
          portfolio: []
        };
        insertRecord('creators', newCreator, {
          handle: newCreator.handle,
          name: newCreator.name,
          category: newCreator.category,
          location: newCreator.location,
          minPrice: newCreator.minPrice,
          rating: newCreator.rating,
          completedDeals: 0,
          verified: 0,
          avatar: newCreator.avatar,
          coverImage: newCreator.coverImage,
          languages: JSON.stringify(newCreator.languages),
          demographics: JSON.stringify(newCreator.demographics),
          socialAccounts: JSON.stringify(newCreator.socialAccounts),
          services: JSON.stringify(newCreator.services),
          portfolio: JSON.stringify(newCreator.portfolio)
        });
      }

      // If business/agency role, also create profile in businesses table
      if (role === 'business' || role === 'agency') {
        const newBiz = {
          id: newUserId,
          name: newUser.name,
          industry: 'Retail & Consumer Goods',
          location: newUser.location,
          verified: false,
          avatar: newUser.avatar,
          coverImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
          campaignsCount: 0,
          totalSpent: 0
        };
        insertRecord('businesses', newBiz, {
          name: newBiz.name,
          industry: newBiz.industry,
          location: newBiz.location,
          verified: 0,
          avatar: newBiz.avatar,
          coverImage: newBiz.coverImage,
          campaignsCount: 0,
          totalSpent: 0
        });
      }

      return sendJson(res, {
        success: true,
        user: newUser,
        token: `colab_jwt_${Date.now()}_${newUser.id}`,
        message: 'Account created successfully'
      }, 201);
    }

    // 4. CREATORS API
    if (endpoint === '/creators' && method === 'GET') {
      return sendJson(res, getAll('creators'));
    }
    if (endpoint.startsWith('/creators/') && method === 'GET') {
      const id = endpoint.split('/')[2];
      const creator = getById('creators', id);
      if (!creator) return sendJson(res, { error: 'Creator not found' }, 404);
      return sendJson(res, creator);
    }

    // 5. CAMPAIGNS API
    if (endpoint === '/campaigns' && method === 'GET') {
      return sendJson(res, getAll('campaigns'));
    }
    if (endpoint === '/campaigns' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newCamp = {
        id: `camp-${Date.now()}`,
        status: 'active',
        applicantsCount: 0,
        shortlistedCount: 0,
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('campaigns', newCamp, {
        title: newCamp.title,
        businessId: newCamp.businessId,
        businessName: newCamp.businessName,
        category: newCamp.category,
        status: newCamp.status,
        budgetMin: newCamp.budget?.minAmount || newCamp.budgetMin || 1000,
        budgetMax: newCamp.budget?.maxAmount || newCamp.budgetMax || 5000,
        totalBudget: newCamp.budget?.totalBudget || newCamp.totalBudget || 5000,
        createdAt: newCamp.createdAt
      });
      return sendJson(res, newCamp, 201);
    }
    if (endpoint.startsWith('/campaigns/') && method === 'PATCH') {
      const id = endpoint.split('/')[2];
      const body = await parseJsonBody(req);
      const updated = updateRecord('campaigns', id, body);
      return sendJson(res, updated);
    }

    // 6. CAMPAIGN APPLICATIONS
    if (endpoint === '/campaign-applications' && method === 'GET') {
      return sendJson(res, getAll('campaign_applications'));
    }
    if (endpoint === '/campaign-applications' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newApp = {
        id: `app-${Date.now()}`,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        ...body
      };
      insertRecord('campaign_applications', newApp, {
        campaignId: newApp.campaignId,
        campaignTitle: newApp.campaignTitle,
        creatorId: newApp.creatorId,
        creatorName: newApp.creatorName,
        proposedRate: newApp.proposedRate,
        status: newApp.status,
        appliedAt: newApp.appliedAt
      });
      return sendJson(res, newApp, 201);
    }

    // 7. COLLABORATIONS & SMART DEAL ROOMS
    if (endpoint === '/collaborations' && method === 'GET') {
      return sendJson(res, getAll('collaborations'));
    }
    if (endpoint === '/collaborations' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newCollab = {
        id: `collab-${Date.now()}`,
        status: 'escrow_funded',
        escrowStatus: 'held',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        ...body
      };
      insertRecord('collaborations', newCollab, {
        campaignId: newCollab.campaignId,
        campaignTitle: newCollab.campaignTitle,
        businessId: newCollab.businessId,
        businessName: newCollab.businessName,
        creatorId: newCollab.creatorId,
        creatorName: newCollab.creatorName,
        agreedAmount: newCollab.agreedAmount,
        platformFee: newCollab.platformFee,
        creatorPayout: newCollab.creatorPayout,
        status: newCollab.status,
        escrowStatus: newCollab.escrowStatus,
        createdAt: newCollab.createdAt
      });
      return sendJson(res, newCollab, 201);
    }
    if (endpoint.startsWith('/collaborations/') && method === 'PATCH') {
      const id = endpoint.split('/')[2];
      const body = await parseJsonBody(req);
      const updated = updateRecord('collaborations', id, body);
      return sendJson(res, updated);
    }

    // 8. STRUCTURED ENQUIRIES
    if (endpoint === '/structured-enquiries' && method === 'GET') {
      return sendJson(res, getAll('structured_enquiries'));
    }
    if (endpoint === '/structured-enquiries' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newEnq = {
        id: `enq-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('structured_enquiries', newEnq, {
        conversationId: newEnq.conversationId,
        senderId: newEnq.senderId,
        senderName: newEnq.senderName,
        targetId: newEnq.targetId,
        targetName: newEnq.targetName,
        projectNeed: newEnq.projectNeed,
        budget: newEnq.budget,
        campaignDates: newEnq.campaignDates,
        location: newEnq.location,
        contentUsageRights: newEnq.contentUsageRights,
        expectedResults: newEnq.expectedResults,
        status: newEnq.status,
        createdAt: newEnq.createdAt
      });
      return sendJson(res, newEnq, 201);
    }

    // 9. FORMAL NEGOTIATION QUOTES
    if (endpoint === '/negotiation-quotes' && method === 'GET') {
      return sendJson(res, getAll('negotiation_quotes'));
    }
    if (endpoint === '/negotiation-quotes' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newQuote = {
        id: `quote-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        history: body.history || [
          {
            senderName: body.fromName,
            amount: body.currentAmount,
            note: body.terms || 'Formal quotation submitted.',
            timestamp: new Date().toISOString()
          }
        ],
        ...body
      };
      insertRecord('negotiation_quotes', newQuote, {
        conversationId: newQuote.conversationId,
        fromId: newQuote.fromId,
        fromName: newQuote.fromName,
        toId: newQuote.toId,
        toName: newQuote.toName,
        currentAmount: newQuote.currentAmount,
        timelineDays: newQuote.timelineDays,
        usageRights: newQuote.usageRights,
        terms: newQuote.terms,
        status: newQuote.status,
        createdAt: newQuote.createdAt
      });
      return sendJson(res, newQuote, 201);
    }

    // 10. BOOKING SLOTS
    if (endpoint === '/booking-slots' && method === 'GET') {
      return sendJson(res, getAll('booking_slots'));
    }
    if (endpoint === '/booking-slots/book' && method === 'POST') {
      const body = await parseJsonBody(req);
      const slot = getById('booking_slots', body.slotId);
      if (!slot) return sendJson(res, { error: 'Slot not found' }, 404);
      const updated = updateRecord('booking_slots', body.slotId, {
        status: 'booked',
        clientName: body.clientName || 'Partner Brand'
      });
      return sendJson(res, updated);
    }

    // 11. CONVERSATIONS & MESSAGES
    if (endpoint === '/conversations' && method === 'GET') {
      return sendJson(res, getAll('conversations'));
    }
    if (endpoint === '/conversations' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newConv = {
        id: `conv-${Date.now()}`,
        unreadCount: 0,
        lastMessageTime: new Date().toISOString(),
        ...body
      };
      insertRecord('conversations', newConv, {
        category: newConv.category || 'all',
        collaborationId: newConv.collaborationId || null,
        unreadCount: 0,
        lastMessage: newConv.lastMessage || '',
        lastMessageTime: newConv.lastMessageTime
      });
      return sendJson(res, newConv, 201);
    }

    if (endpoint === '/messages' && method === 'GET') {
      const convId = url.searchParams.get('conversationId');
      if (convId) {
        return sendJson(res, getAll('messages', { where: { conversationId: convId }, orderBy: 'timestamp' }));
      }
      return sendJson(res, getAll('messages'));
    }
    if (endpoint === '/messages' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newMsg = {
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: 0,
        ...body
      };
      insertRecord('messages', newMsg, {
        conversationId: newMsg.conversationId,
        senderId: newMsg.senderId,
        senderName: newMsg.senderName,
        senderRole: newMsg.senderRole,
        text: newMsg.text,
        attachmentType: newMsg.attachmentType || null,
        voiceNoteDuration: newMsg.voiceNoteDuration || null,
        isRead: 0,
        timestamp: newMsg.timestamp
      });

      // Update parent conversation last message
      updateRecord('conversations', newMsg.conversationId, {
        lastMessage: newMsg.text || 'Attachment',
        lastMessageTime: newMsg.timestamp
      });

      return sendJson(res, newMsg, 201);
    }

    // 12. USERS & PROFILES
    if (endpoint === '/users' && method === 'GET') {
      return sendJson(res, getAll('users'));
    }

    // 13. SPONSORSHIPS & SPONSOR RFPS
    if (endpoint === '/sponsorships' && method === 'GET') {
      return sendJson(res, getAll('sponsorships'));
    }
    if (endpoint === '/sponsorships' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newSpons = {
        id: `spons-${Date.now()}`,
        proposalCount: 0,
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('sponsorships', newSpons, {
        title: newSpons.title,
        organizerName: newSpons.organiserName || newSpons.organizerName || 'Organiser',
        category: newSpons.type || newSpons.category || 'college_fest',
        location: newSpons.location || 'India',
        eventDate: newSpons.date || newSpons.eventDate,
        expectedFootfall: newSpons.expectedAttendees || newSpons.expectedFootfall || 5000,
        proposalCount: 0
      });
      return sendJson(res, newSpons, 201);
    }

    if (endpoint === '/sponsor-rfps' && method === 'GET') {
      return sendJson(res, getAll('sponsor_rfps'));
    }
    if (endpoint === '/sponsor-rfps' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newRfp = {
        id: `rfp-${Date.now()}`,
        status: 'open',
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('sponsor_rfps', newRfp, {
        sponsorId: newRfp.sponsorId,
        sponsorName: newRfp.sponsorName,
        brandIndustry: newRfp.brandIndustry,
        title: newRfp.title,
        budgetMin: newRfp.budgetMin,
        budgetMax: newRfp.budgetMax,
        minFootfall: newRfp.minFootfall || 1000,
        status: newRfp.status,
        createdAt: newRfp.createdAt
      });
      return sendJson(res, newRfp, 201);
    }

    // 13.5 AD INVENTORY API
    if (endpoint === '/ad-inventory' && method === 'GET') {
      return sendJson(res, getAll('ad_inventory'));
    }
    if (endpoint === '/ad-inventory' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newItem = {
        id: `ad-inv-${Date.now()}`,
        slotsRemaining: body.slotsTotal || 1,
        slotsTotal: body.slotsTotal || 1,
        datesAvailable: body.datesAvailable || [new Date().toISOString().slice(0, 10)],
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('ad_inventory', newItem, {
        creatorId: newItem.creatorId,
        creatorName: newItem.creatorName,
        platform: newItem.platform,
        format: newItem.format,
        price: newItem.price,
        slotsRemaining: newItem.slotsRemaining
      });
      return sendJson(res, newItem, 201);
    }

    // 14. LOCAL ADS & COLLECTIVES
    if (endpoint === '/local-ads' && method === 'GET') {
      return sendJson(res, getAll('local_ad_channels'));
    }
    if (endpoint === '/local-ads' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newChannel = {
        id: `local-ch-${Date.now()}`,
        verified: true,
        rating: 5.0,
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('local_ad_channels', newChannel, {
        channelName: newChannel.name || newChannel.channelName,
        platform: newChannel.platform || 'Instagram',
        city: newChannel.city,
        locality: newChannel.locality || newChannel.city,
        reachCount: newChannel.reach || newChannel.reachCount || 50000,
        pricePerSlot: newChannel.price || newChannel.pricePerSlot || 1500,
        verifiedAudience: 1
      });
      return sendJson(res, newChannel, 201);
    }
    if (endpoint === '/collectives' && method === 'GET') {
      return sendJson(res, getAll('creator_collectives'));
    }

    // 15. REVIEWS & TRANSACTIONS
    if (endpoint === '/reviews' && method === 'GET') {
      return sendJson(res, getAll('reviews'));
    }
    if (endpoint === '/reviews' && method === 'POST') {
      const body = await parseJsonBody(req);
      const newReview = {
        id: `rev-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...body
      };
      insertRecord('reviews', newReview, {
        collaborationId: newReview.collaborationId,
        reviewerId: newReview.reviewerId,
        reviewerName: newReview.reviewerName,
        reviewerRole: newReview.reviewerRole,
        targetId: newReview.targetId,
        targetName: newReview.targetName,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: newReview.createdAt
      });
      return sendJson(res, newReview, 201);
    }
    if (endpoint === '/transactions' && method === 'GET') {
      return sendJson(res, getAll('transactions'));
    }

    // 16. SETTINGS
    if (endpoint === '/settings' && method === 'GET') {
      return sendJson(res, getById('settings', 'platform_settings'));
    }
    if (endpoint === '/settings' && method === 'PATCH') {
      const body = await parseJsonBody(req);
      const updated = updateRecord('settings', 'platform_settings', body);
      return sendJson(res, updated);
    }

    // Unmatched endpoint
    return sendJson(res, { error: `Endpoint ${endpoint} not found` }, 404);

  } catch (err) {
    console.error(`[API Error] ${method} ${endpoint}:`, err);
    return sendJson(res, { error: err.message || 'Internal Database Server Error' }, 500);
  }
}

