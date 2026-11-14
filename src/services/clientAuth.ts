/**
 * co-lab Client-Side Cryptographic Authentication & Storage Engine
 *
 * Provides SHA-256 password hashing via Web Crypto API with pure JS fallback.
 * Allows instant, zero-latency authentication on Vercel, static hosting, or offline mode
 * without ever showing "Database network error".
 */

import type { UserProfile, UserRole } from '../types';

// SHA-256 of "Colab@2026"
export const DEFAULT_PASSWORD_HASH = '964f4ebb713726d693f0a48ec2c35a440b4b25c7ef6fac7e67fa782d98dc635b';

const REGISTERED_USERS_KEY = 'colab_registered_users';

// Pre-seeded demo user profiles
const SEEDED_DEMO_USERS: UserProfile[] = [
  {
    id: 'user-creator-1',
    email: 'ananya@colab.test',
    name: 'Ananya Sharma',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Fashion, beauty and lifestyle content creator based in Mumbai. Passionate about sustainable fashion.',
    location: 'Mumbai, Maharashtra',
    verified: true,
    createdAt: '2025-01-10T00:00:00Z',
    activeSubProfileId: 'sub-influencer-1',
    subProfiles: [
      {
        id: 'sub-influencer-1',
        type: 'influencer',
        title: 'Fashion & Sustainable Lifestyle Influencer',
        bio: 'Creating high-aesthetic reels and styling tips for sustainable fashion labels. 120k+ Instagram followers.',
        skills: ['Reel Direction', 'Lookbook Curation', 'Brand Storytelling', 'Voiceover'],
        location: 'Mumbai, Maharashtra',
        languages: ['English', 'Hindi'],
        startingRate: 4500,
        portfolio: [],
        verifiedCredentials: ['Meta Verified Partner', 'ASCI Compliance Certified'],
        isAvailable: true,
        rateCards: [{ format: 'Instagram Reel (60s)', price: 4500, turnaroundDays: 3 }]
      }
    ]
  },
  {
    id: 'user-creator-2',
    email: 'rohit@colab.test',
    name: 'Rohit Verma',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Tech reviewer, unboxer and gadget enthusiast with 250k+ loyal followers.',
    location: 'Bengaluru, Karnataka',
    verified: true,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'user-biz-1',
    email: 'contact@aroma.test',
    name: 'Aroma Botanicals',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    bio: 'Organic skincare & aromatherapy brand looking for authentic UGC and aesthetic creators.',
    location: 'Mumbai, Maharashtra',
    verified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-biz-2',
    email: 'marketing@nutriblend.in',
    name: 'NutriBlend Superfoods',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    bio: 'Clean plant-based protein powders and morning nutrition elixirs.',
    location: 'Gurugram, Haryana',
    verified: true,
    createdAt: '2025-02-10T00:00:00Z'
  },
  {
    id: 'user-agency-1',
    email: 'partners@elevatemedia.in',
    name: 'Elevate Digital Agency',
    role: 'agency',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    bio: 'Leading creator talent management & influencer campaign agency managing 30+ DTC brands.',
    location: 'Delhi NCR',
    verified: true,
    createdAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 'user-org-1',
    email: 'fest@iitb.ac.in',
    name: 'Mood Indigo Team',
    role: 'organiser',
    avatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
    bio: 'Asia largest college cultural festival with over 140,000+ youth footfall every year.',
    location: 'Mumbai, Maharashtra',
    verified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-sponsor-1',
    email: 'sponsorships@redbull.in',
    name: 'Apex Energy Drinks',
    role: 'sponsor',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    bio: 'Powering high performance esports, university fests and adventure creators.',
    location: 'Pune, Maharashtra',
    verified: true,
    createdAt: '2025-02-05T00:00:00Z'
  },
  {
    id: 'user-admin-1',
    email: 'superadmin@colab.internal',
    name: 'co-lab System Administrator',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Master operations, financial settlement and platform moderation.',
    location: 'HQ Bengaluru',
    verified: true,
    createdAt: '2024-12-01T00:00:00Z'
  }
];

// Pure JS SHA-256 implementation as universal fallback if crypto.subtle is unavailable
export function pureJsSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let isComposite: { [key: number]: boolean } = {};
  for (let candidate = 2; candidate < 312; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1Ch =
        rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = hash[7] + s1Ch + ch + k[i] + w[i];
      const s0Maj =
        rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = s0Maj + maj;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export const sha256Hex = pureJsSha256;

/**
 * Universal SHA-256 hashing for browser and Node.js
 */
export async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fall through to pure JS
    }
  }
  return pureJsSha256(text);
}

export interface StoredUserWithHash extends UserProfile {
  password_hash: string;
}

// In-memory cache for custom users (works in browser, Node tests, & SSR)
const inMemoryCustomUsers: StoredUserWithHash[] = [];

/**
 * Get all registered users from localStorage merged with seeded DEMO_USERS
 */
export function getClientUsers(): StoredUserWithHash[] {
  let customUsers: StoredUserWithHash[] = [...inMemoryCustomUsers];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (stored) {
        const fromLocal = JSON.parse(stored);
        customUsers = [...fromLocal, ...customUsers];
      }
    } catch (err) {
      console.warn('[clientAuth] Failed to parse custom users', err);
    }
  }

  // Pre-seed SEEDED_DEMO_USERS with default password hash
  const seededUsers: StoredUserWithHash[] = SEEDED_DEMO_USERS.map(u => ({
    ...u,
    password_hash: DEFAULT_PASSWORD_HASH
  }));

  // Merge (custom users take priority if matching email)
  const userMap = new Map<string, StoredUserWithHash>();
  for (const u of seededUsers) {
    userMap.set(u.email.toLowerCase(), u);
  }
  for (const u of customUsers) {
    userMap.set(u.email.toLowerCase(), u);
  }

  return Array.from(userMap.values());
}

/**
 * Authenticate user credentials locally using SHA-256
 */
export async function clientLogin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const hash = await computeSha256(password);
  const users = getClientUsers();

  const user = users.find(u => u.email.toLowerCase() === normEmail);
  if (!user) {
    return {
      success: false,
      error: `No account found with email "${email}". Please verify the email or click "Create Account" below.`
    };
  }

  if (user.password_hash !== hash) {
    return {
      success: false,
      error: 'Invalid password. (Default test password is Colab@2026)'
    };
  }

  // Sanitize: do not leak password hash
  const { password_hash, ...safeUser } = user;
  const token = `colab_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    success: true,
    user: safeUser as UserProfile,
    token
  };
}

/**
 * Register a new user locally with SHA-256 password hash
 */
export async function clientSignup(payload: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  bio?: string;
  location?: string;
}): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
  const normEmail = payload.email.trim().toLowerCase();
  const users = getClientUsers();

  if (users.some(u => u.email.toLowerCase() === normEmail)) {
    return {
      success: false,
      error: `An account with email "${payload.email}" already exists. Please sign in instead.`
    };
  }

  const hash = await computeSha256(payload.password);
  const userId = `user-${payload.role}-${Date.now()}`;

  const defaultAvatars: Record<UserRole, string> = {
    creator: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    business: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80',
    agency: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    organiser: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
    sponsor: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    admin: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  };

  const newUser: StoredUserWithHash = {
    id: userId,
    email: normEmail,
    name: payload.name.trim(),
    role: payload.role,
    password_hash: hash,
    avatar: defaultAvatars[payload.role] || defaultAvatars.creator,
    bio: payload.bio || `${payload.role.toUpperCase()} member on co-lab marketplace.`,
    location: payload.location || 'Mumbai, Maharashtra',
    verified: true,
    createdAt: new Date().toISOString(),
    activeSubProfileId: `sub-${payload.role}-${Date.now()}`,
    subProfiles: [
      {
        id: `sub-${payload.role}-${Date.now()}`,
        type: payload.role === 'creator' ? 'influencer' : 'business',
        title: `${payload.name} Official Profile`,
        bio: payload.bio || `Verified ${payload.role} on co-lab.`,
        skills: ['Collaborations', 'Brand Campaigns'],
        location: payload.location || 'Mumbai, Maharashtra',
        languages: ['English', 'Hindi'],
        startingRate: 2500,
        portfolio: [],
        verifiedCredentials: ['co-lab Verified Identity'],
        isAvailable: true,
        rateCards: []
      }
    ]
  };

  // Save to memory cache
  inMemoryCustomUsers.push(newUser);

  // Save to localStorage if in browser
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      const customUsers: StoredUserWithHash[] = stored ? JSON.parse(stored) : [];
      customUsers.push(newUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(customUsers));
    } catch (err) {
      console.warn('[clientAuth] Failed to persist new user', err);
    }
  }

  const { password_hash, ...safeUser } = newUser;
  const token = `colab_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    success: true,
    user: safeUser as UserProfile,
    token
  };
}
