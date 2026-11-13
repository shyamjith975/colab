import {
  CreatorProfile,
  BusinessProfile,
  Campaign,
  Collaboration,
  SponsorshipOpportunity,
  CreativeProfessional,
  AdInventoryItem,
  Review,
  Transaction,
  PlatformSettings,
  UserProfile
} from '../types';

export const INITIAL_SETTINGS: PlatformSettings = {
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

// DEMO USER ACCOUNTS FOR EASY ROLE SWITCHING
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-creator-1',
    email: 'ananya@colab.test',
    name: 'Ananya Sharma',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Fashion, beauty and lifestyle content creator based in Mumbai. Passionate about sustainable fashion.',
    location: 'Mumbai, Maharashtra',
    verified: true,
    createdAt: '2025-01-10T00:00:00Z'
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
    email: 'growth@trivandrumcrafts.com',
    name: 'Aroma Threads Boutique',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    bio: 'Handcrafted contemporary ethnic wear made with organic cotton and artisanal dyes.',
    location: 'Trivandrum, Kerala',
    verified: true,
    createdAt: '2025-02-01T00:00:00Z'
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

// 20+ CREATORS
export const CREATORS: CreatorProfile[] = [
  {
    id: 'user-creator-1',
    email: 'ananya@colab.test',
    name: 'Ananya Sharma',
    handle: '@ananya_style',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Sustainable fashion stylist, thrift queen & beauty tips. Bringing affordable chic looks to everyday collegiate & corporate wardrobes.',
    category: 'Fashion & Style',
    subcategories: ['Ethnic Wear', 'Sustainable Fashion', 'Daily Styling'],
    location: 'Mumbai, Maharashtra',
    languages: ['Hindi', 'English'],
    experienceYears: 4,
    rating: 4.9,
    reviewsCount: 38,
    completedDeals: 52,
    minPrice: 1500,
    verified: true,
    createdAt: '2025-01-10T00:00:00Z',
    isAvailable: true,
    badges: ['Top Rated', 'Verified Metrics', 'Quick Responder'],
    demographics: {
      topAudienceAge: '18-28',
      genderRatio: { male: 22, female: 78 },
      topLocations: ['Mumbai', 'Delhi', 'Pune', 'Bengaluru']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'ananya_style',
        url: 'https://instagram.com',
        followersCount: 185000,
        engagementRate: 5.4,
        avgViews: 45000,
        verified: true
      },
      {
        platform: 'youtube',
        handle: 'AnanyaStyleVlogs',
        url: 'https://youtube.com',
        followersCount: 64000,
        engagementRate: 6.8,
        avgViews: 28000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-1',
        title: 'Single Instagram Reel (Collab Post)',
        platform: 'Instagram',
        format: 'Reel (30-60s)',
        price: 3500,
        deliveryDays: 4,
        revisions: 2,
        deliverables: ['1 High-res 4K Reel', 'Brand tag & audio hook', 'Pinned comment for 7 days'],
        description: 'Original aesthetic reel featuring your outfit or beauty product styled organically.'
      },
      {
        id: 'srv-2',
        title: '3x Story Sequence with Link Sticker',
        platform: 'Instagram',
        format: 'Story Set',
        price: 1500,
        deliveryDays: 2,
        revisions: 1,
        deliverables: ['3 Stories with custom swipe/tap link', 'Product unboxing or quick try-on'],
        description: 'High converting story sequence during peak evening engagement hours.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Festive Kurti Lookbook for FabIndia',
        thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'FabIndia',
        reach: '210K Impressions',
        engagement: '6.2%'
      }
    ]
  },
  {
    id: 'user-creator-2',
    name: 'Rohit Verma',
    handle: '@rohit_tech',
    email: 'rohit@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    bio: 'No-nonsense consumer tech reviews, smartphone comparisons, battery stress tests, and PC builder.',
    category: 'Tech & Gadgets',
    subcategories: ['Smartphones', 'Audio Gear', 'Smart Home'],
    location: 'Bengaluru, Karnataka',
    languages: ['English', 'Hindi', 'Kannada'],
    experienceYears: 5,
    rating: 4.8,
    reviewsCount: 45,
    completedDeals: 68,
    minPrice: 4000,
    verified: true,
    createdAt: '2025-01-15T00:00:00Z',
    isAvailable: true,
    badges: ['Top Tech Voice', 'High ROI'],
    demographics: {
      topAudienceAge: '20-35',
      genderRatio: { male: 84, female: 16 },
      topLocations: ['Bengaluru', 'Hyderabad', 'Chennai', 'Pune']
    },
    socialAccounts: [
      {
        platform: 'youtube',
        handle: 'RohitVermaTech',
        url: 'https://youtube.com',
        followersCount: 310000,
        engagementRate: 4.2,
        avgViews: 82000,
        verified: true
      },
      {
        platform: 'x',
        handle: 'rohit_tech',
        url: 'https://x.com',
        followersCount: 45000,
        engagementRate: 3.1,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-tech-1',
        title: '60s Dedicated Video Integration',
        platform: 'YouTube',
        format: 'Mid-roll Integration',
        price: 9500,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['60-second seamless integration', 'Pinned link in description & comments'],
        description: 'In-depth showcase of your software app, gadget or tech accessory.'
      },
      {
        id: 'srv-tech-2',
        title: 'X (Twitter) Thread Review & Giveaway',
        platform: 'X',
        format: 'Thread',
        price: 4000,
        deliveryDays: 2,
        revisions: 1,
        deliverables: ['4-tweet deep dive with hi-res product photos', 'Giveaway hosting'],
        description: 'Reach thousands of early adopters and tech decision makers.'
      }
    ],
    portfolio: [
      {
        id: 'port-tech-1',
        title: 'Nothing Ear (a) Real World Sound Test',
        thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://youtube.com',
        platform: 'YouTube',
        brandWorkedWith: 'Nothing',
        reach: '145K Views',
        engagement: '5.1%'
      }
    ]
  },
  {
    id: 'user-creator-3',
    name: 'Chef Priya Nair',
    handle: '@priyacooksdelhi',
    email: 'priya@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    bio: 'Regional street food discovery, home cooking hacks, Kerala spice heritage & cloud kitchen reviews.',
    category: 'Food & Beverage',
    subcategories: ['Restaurant Reviews', 'Quick Recipes', 'Packaged Food Tests'],
    location: 'New Delhi, Delhi',
    languages: ['Hindi', 'English', 'Malayalam'],
    experienceYears: 3,
    rating: 5.0,
    reviewsCount: 29,
    completedDeals: 41,
    minPrice: 2000,
    verified: true,
    createdAt: '2025-01-20T00:00:00Z',
    isAvailable: true,
    badges: ['Foodie Choice', 'High Engagement'],
    demographics: {
      topAudienceAge: '22-45',
      genderRatio: { male: 45, female: 55 },
      topLocations: ['Delhi NCR', 'Kochi', 'Mumbai', 'Chandigarh']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'priyacooksdelhi',
        url: 'https://instagram.com',
        followersCount: 95000,
        engagementRate: 7.2,
        avgViews: 65000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-food-1',
        title: 'Cafe / Restaurant In-Person Reel Review',
        platform: 'Instagram',
        format: 'On-site Video Reel',
        price: 4500,
        deliveryDays: 3,
        revisions: 2,
        deliverables: ['In-person tasting & footage capture', 'High energy food montage reel', 'Google Maps review cross-post'],
        description: 'Bring local foodies right to your restaurant door.'
      },
      {
        id: 'srv-food-2',
        title: 'Ingredient / Packaged Food Recipe Video',
        platform: 'Instagram',
        format: 'Recipe Reel',
        price: 3000,
        deliveryDays: 4,
        revisions: 1,
        deliverables: ['1 Creative recipe video featuring your product', 'Full recipe in caption'],
        description: 'Show how everyday cooks can use your sauces, spices or oils.'
      }
    ],
    portfolio: [
      {
        id: 'port-food-1',
        title: 'Artisanal Ghee Saffron Biryani Showcase',
        thumbnail: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'CountryDelight',
        reach: '180K Views',
        engagement: '8.4%'
      }
    ]
  },
  {
    id: 'user-creator-4',
    name: 'Kabir Fitness',
    handle: '@kabir_lifts',
    email: 'kabir@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    bio: 'Certified strength and conditioning coach. Natural bodybuilding, gym form corrections & science-backed supplementation.',
    category: 'Fitness & Health',
    subcategories: ['Workout Routines', 'Nutrition & Supplements', 'Home Calisthenics'],
    location: 'Hyderabad, Telangana',
    languages: ['English', 'Telugu', 'Hindi'],
    experienceYears: 6,
    rating: 4.9,
    reviewsCount: 52,
    completedDeals: 74,
    minPrice: 3000,
    verified: true,
    createdAt: '2025-01-08T00:00:00Z',
    isAvailable: true,
    badges: ['Certified Coach', 'Fitness Authority'],
    demographics: {
      topAudienceAge: '18-32',
      genderRatio: { male: 76, female: 24 },
      topLocations: ['Hyderabad', 'Bengaluru', 'Visakhapatnam', 'Chennai']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'kabir_lifts',
        url: 'https://instagram.com',
        followersCount: 142000,
        engagementRate: 6.1,
        avgViews: 52000,
        verified: true
      },
      {
        platform: 'youtube',
        handle: 'KabirLiftsFitness',
        url: 'https://youtube.com',
        followersCount: 88000,
        engagementRate: 5.0,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-fit-1',
        title: 'Supplement Review & Gym Workout Reel',
        platform: 'Instagram',
        format: 'Workout Reel',
        price: 5000,
        deliveryDays: 4,
        revisions: 2,
        deliverables: ['Full workout reel showcasing supplement intake', 'Discount coupon code promotion'],
        description: 'Demonstrate natural workout benefits and protein absorption to serious fitness enthusiasts.'
      }
    ],
    portfolio: [
      {
        id: 'port-fit-1',
        title: 'Whey Isolate Shake Lab Results Breakdown',
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'MuscleBlaze',
        reach: '310K Views',
        engagement: '7.9%'
      }
    ]
  },
  {
    id: 'user-creator-5',
    name: 'Dr. Tanya Sen',
    handle: '@tanya_skindoc',
    email: 'tanya@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    bio: 'Dermatology resident, skin barrier advocate. Busting fake skincare myths and evaluating active cosmetic formulations.',
    category: 'Beauty & Skincare',
    subcategories: ['Clinical Reviews', 'Acne Care', 'Sunscreen Science'],
    location: 'Kolkata, West Bengal',
    languages: ['English', 'Bengali', 'Hindi'],
    experienceYears: 3,
    rating: 5.0,
    reviewsCount: 31,
    completedDeals: 36,
    minPrice: 5000,
    verified: true,
    createdAt: '2025-01-18T00:00:00Z',
    isAvailable: true,
    badges: ['Doctor Verified', 'Evidence Based'],
    demographics: {
      topAudienceAge: '20-38',
      genderRatio: { male: 15, female: 85 },
      topLocations: ['Kolkata', 'Mumbai', 'Delhi', 'Bengaluru']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'tanya_skindoc',
        url: 'https://instagram.com',
        followersCount: 110000,
        engagementRate: 8.5,
        avgViews: 85000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-skin-1',
        title: 'Ingredient Chemistry Breakdown Reel',
        platform: 'Instagram',
        format: 'Educational Reel',
        price: 7500,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['Doctor-reviewed formulation deep dive', 'Before/after texture check', 'Compliance with ASCI guidelines'],
        description: 'Build scientific trust and medical credibility for your skincare serum or sun care line.'
      }
    ],
    portfolio: [
      {
        id: 'port-skin-1',
        title: 'Niacinamide vs Vitamin C True Facts',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'The Derma Co',
        reach: '420K Views',
        engagement: '9.2%'
      }
    ]
  },
  {
    id: 'user-creator-6',
    name: 'Arjun Das (WanderWithArjun)',
    handle: '@wander_arjun',
    email: 'arjun@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    bio: 'Backpacking India off the beaten path. Himalayan treks, boutique homestays & scenic motorcycle touring.',
    category: 'Travel & Hospitality',
    subcategories: ['Resort Showcases', 'Adventure Travel', 'Backpacking'],
    location: 'Dehradun, Uttarakhand',
    languages: ['Hindi', 'English'],
    experienceYears: 4,
    rating: 4.8,
    reviewsCount: 22,
    completedDeals: 29,
    minPrice: 3500,
    verified: true,
    createdAt: '2025-01-12T00:00:00Z',
    isAvailable: true,
    badges: ['Cinematic Visuals', 'Drone Certified'],
    demographics: {
      topAudienceAge: '22-35',
      genderRatio: { male: 58, female: 42 },
      topLocations: ['Delhi NCR', 'Chandigarh', 'Jaipur', 'Mumbai']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'wander_arjun',
        url: 'https://instagram.com',
        followersCount: 165000,
        engagementRate: 6.4,
        avgViews: 75000,
        verified: true
      },
      {
        platform: 'youtube',
        handle: 'WanderArjunVlogs',
        url: 'https://youtube.com',
        followersCount: 92000,
        engagementRate: 5.7,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-trv-1',
        title: 'Resort / Homestay Stay Experience Package',
        platform: 'Instagram',
        format: '2x Reels + 5x Stories',
        price: 8000,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['4K drone scenery shots', 'Room tour & dining showcase', 'Booking promo link in bio'],
        description: 'Complete experiential showcase of your luxury villa or mountain retreat.'
      }
    ],
    portfolio: [
      {
        id: 'port-trv-1',
        title: 'Secret Apple Orchard Stay in Manali',
        thumbnail: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'Zostel',
        reach: '290K Impressions',
        engagement: '7.1%'
      }
    ]
  },
  {
    id: 'user-creator-7',
    name: 'Neha Kapoor (FinSmart)',
    handle: '@finsmart_neha',
    email: 'neha@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    bio: 'Chartered Accountant simplifying mutual funds, tax saving, credit cards & personal financial freedom for Gen Z.',
    category: 'Finance & Crypto',
    subcategories: ['Tax Planning', 'Mutual Funds', 'Credit Cards & Credit Score'],
    location: 'Mumbai, Maharashtra',
    languages: ['English', 'Hindi'],
    experienceYears: 5,
    rating: 4.9,
    reviewsCount: 40,
    completedDeals: 58,
    minPrice: 6000,
    verified: true,
    createdAt: '2025-01-05T00:00:00Z',
    isAvailable: true,
    badges: ['CA Verified', 'SEBI Compliant Guidelines'],
    demographics: {
      topAudienceAge: '22-38',
      genderRatio: { male: 60, female: 40 },
      topLocations: ['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'finsmart_neha',
        url: 'https://instagram.com',
        followersCount: 220000,
        engagementRate: 4.9,
        avgViews: 90000,
        verified: true
      },
      {
        platform: 'linkedin',
        handle: 'neha-kapoor-ca',
        url: 'https://linkedin.com',
        followersCount: 65000,
        engagementRate: 3.8,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-fin-1',
        title: 'App Walkthrough & Value Breakdown Reel',
        platform: 'Instagram',
        format: 'Reel + LinkedIn Post',
        price: 9000,
        deliveryDays: 4,
        revisions: 2,
        deliverables: ['Explainer on saving/investing with your fintech platform', 'Disclaimer compliance banner'],
        description: 'Explain complicated fintech propositions in relatable everyday language.'
      }
    ],
    portfolio: [
      {
        id: 'port-fin-1',
        title: 'How I saved ₹45,000 on Old vs New Tax Regime',
        thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'ClearTax',
        reach: '540K Views',
        engagement: '6.8%'
      }
    ]
  },
  {
    id: 'user-creator-8',
    name: 'Sameer Playz',
    handle: '@sameer_gaming',
    email: 'sameer@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    bio: 'BGMI & Valorant streamer, esports caster, high energy gaming banter and gaming peripheral reviews.',
    category: 'Gaming & Esports',
    subcategories: ['Mobile Gaming', 'PC Rig Setups', 'Livestreaming'],
    location: 'Pune, Maharashtra',
    languages: ['Hindi', 'English'],
    experienceYears: 4,
    rating: 4.7,
    reviewsCount: 33,
    completedDeals: 49,
    minPrice: 3000,
    verified: true,
    createdAt: '2025-01-22T00:00:00Z',
    isAvailable: true,
    badges: ['High Live Viewership', 'Gen Z Connect'],
    demographics: {
      topAudienceAge: '16-25',
      genderRatio: { male: 89, female: 11 },
      topLocations: ['Pune', 'Delhi', 'Lucknow', 'Ahmedabad']
    },
    socialAccounts: [
      {
        platform: 'youtube',
        handle: 'SameerPlayzLive',
        url: 'https://youtube.com',
        followersCount: 280000,
        engagementRate: 8.2,
        avgViews: 95000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-gam-1',
        title: 'Live Stream Overlay + 2-Hour Product Plug',
        platform: 'YouTube',
        format: 'Livestream Sponsorship',
        price: 6500,
        deliveryDays: 2,
        revisions: 1,
        deliverables: ['Custom animated lower-third banner', 'Live product test on stream', 'Chat bot link automated posting'],
        description: 'Put your brand in front of thousands of active gamers chatting live.'
      }
    ],
    portfolio: [
      {
        id: 'port-gam-1',
        title: 'Clutching with New 240Hz Gaming Monitor',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://youtube.com',
        platform: 'YouTube',
        brandWorkedWith: 'BenQ ZOWIE',
        reach: '110K Peak Live',
        engagement: '9.5%'
      }
    ]
  },
  {
    id: 'user-creator-9',
    name: 'Devika & Aarav (TwoToTango)',
    handle: '@twototango_vlogs',
    email: 'devika@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    bio: 'Couple lifestyle, relationship humor, home decor transformations and everyday couple struggles.',
    category: 'Comedy & Entertainment',
    subcategories: ['Couple Skits', 'Home Makeovers', 'Festive Celebrations'],
    location: 'Chandigarh, Punjab',
    languages: ['Punjabi', 'Hindi', 'English'],
    experienceYears: 3,
    rating: 4.9,
    reviewsCount: 47,
    completedDeals: 63,
    minPrice: 4000,
    verified: true,
    createdAt: '2025-01-14T00:00:00Z',
    isAvailable: true,
    badges: ['Viral Reels', 'Family Safe'],
    demographics: {
      topAudienceAge: '20-40',
      genderRatio: { male: 42, female: 58 },
      topLocations: ['Chandigarh', 'Delhi', 'Amritsar', 'Ludhiana']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'twototango_vlogs',
        url: 'https://instagram.com',
        followersCount: 340000,
        engagementRate: 8.9,
        avgViews: 190000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-com-1',
        title: 'Humorous Storyline Couple Reel',
        platform: 'Instagram',
        format: 'Comedy Skit Reel',
        price: 8500,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['Original comedic script featuring your product', 'Collaboration tag post'],
        description: 'Make millions laugh while your product solves the couple problem seamlessly.'
      }
    ],
    portfolio: [
      {
        id: 'port-com-1',
        title: 'When He Forgets the Anniversary Gift',
        thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'FNP (Ferns N Petals)',
        reach: '1.2M Views',
        engagement: '11.2%'
      }
    ]
  },
  {
    id: 'user-creator-10',
    name: 'Dr. Vivek Menon',
    handle: '@code_with_vivek',
    email: 'vivek@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    bio: 'Software architect, AI engineering educator, and tech careers mentor. Helping devs master system design & GenAI.',
    category: 'Education & Careers',
    subcategories: ['Coding Tutorials', 'Developer Tools', 'Career Roadmaps'],
    location: 'Kochi, Kerala',
    languages: ['English', 'Malayalam'],
    experienceYears: 6,
    rating: 5.0,
    reviewsCount: 35,
    completedDeals: 44,
    minPrice: 4500,
    verified: true,
    createdAt: '2025-01-16T00:00:00Z',
    isAvailable: true,
    badges: ['Top Tech Educator', 'Dev Audience'],
    demographics: {
      topAudienceAge: '19-32',
      genderRatio: { male: 78, female: 22 },
      topLocations: ['Bengaluru', 'Kochi', 'Chennai', 'Hyderabad']
    },
    socialAccounts: [
      {
        platform: 'youtube',
        handle: 'CodeWithVivek',
        url: 'https://youtube.com',
        followersCount: 175000,
        engagementRate: 6.2,
        avgViews: 48000,
        verified: true
      },
      {
        platform: 'linkedin',
        handle: 'vivek-menon-tech',
        url: 'https://linkedin.com',
        followersCount: 82000,
        engagementRate: 4.8,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-edu-1',
        title: 'Developer Tool Live Demo & Code Sandbox',
        platform: 'YouTube',
        format: 'Dedicated Tutorial',
        price: 8500,
        deliveryDays: 6,
        revisions: 2,
        deliverables: ['Step-by-step code tutorial featuring your API/SaaS', 'GitHub repository link in description'],
        description: 'Empower developers and engineers to adopt your cloud or developer tool.'
      }
    ],
    portfolio: [
      {
        id: 'port-edu-1',
        title: 'Building a Fullstack Supabase App in 30 mins',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://youtube.com',
        platform: 'YouTube',
        brandWorkedWith: 'Supabase',
        reach: '98K Views',
        engagement: '7.8%'
      }
    ]
  },
  {
    id: 'user-creator-11',
    name: 'Kavita Joshi',
    handle: '@kavita_decor',
    email: 'kavita@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    bio: 'Interior designer, DIY ceramic artist, minimal Indian home decor aesthetics and plant mom styling.',
    category: 'Fashion & Style',
    subcategories: ['Home Decor', 'Handicrafts', 'Artisan Goods'],
    location: 'Jaipur, Rajasthan',
    languages: ['Hindi', 'English'],
    experienceYears: 4,
    rating: 4.9,
    reviewsCount: 26,
    completedDeals: 33,
    minPrice: 2000,
    verified: true,
    createdAt: '2025-01-19T00:00:00Z',
    isAvailable: true,
    badges: ['Aesthetic Visuals'],
    demographics: {
      topAudienceAge: '24-45',
      genderRatio: { male: 18, female: 82 },
      topLocations: ['Jaipur', 'Delhi', 'Ahmedabad', 'Mumbai']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'kavita_decor',
        url: 'https://instagram.com',
        followersCount: 88000,
        engagementRate: 5.8,
        avgViews: 40000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-dec-1',
        title: 'Cozy Room Corner Styling Reel',
        platform: 'Instagram',
        format: 'Aesthetic Styling Reel',
        price: 3200,
        deliveryDays: 4,
        revisions: 2,
        deliverables: ['Interior scene setup featuring your home decor/art piece', 'High-res photography included'],
        description: 'Position your home accent or artisanal textile in an inspiring interior.'
      }
    ],
    portfolio: [
      {
        id: 'port-dec-1',
        title: 'Terracotta Lamp & Balcony Makeover',
        thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'The June Shop',
        reach: '140K Views',
        engagement: '6.4%'
      }
    ]
  },
  {
    id: 'user-creator-12',
    name: 'Siddharth Rao (AutoWheels)',
    handle: '@autowheels_sid',
    email: 'sid@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    bio: 'EV scooter reviews, track days, highway mileage tests and motorcycle accessories evaluation.',
    category: 'Automotive & Bikes',
    subcategories: ['Electric Vehicles', 'Superbikes', 'Automobile Accessories'],
    location: 'Chennai, Tamil Nadu',
    languages: ['Tamil', 'English', 'Hindi'],
    experienceYears: 5,
    rating: 4.8,
    reviewsCount: 39,
    completedDeals: 51,
    minPrice: 5000,
    verified: true,
    createdAt: '2025-01-21T00:00:00Z',
    isAvailable: true,
    badges: ['Auto Specialist', 'High Retention'],
    demographics: {
      topAudienceAge: '20-40',
      genderRatio: { male: 91, female: 9 },
      topLocations: ['Chennai', 'Coimbatore', 'Bengaluru', 'Kochi']
    },
    socialAccounts: [
      {
        platform: 'youtube',
        handle: 'AutoWheelsSid',
        url: 'https://youtube.com',
        followersCount: 240000,
        engagementRate: 5.3,
        avgViews: 72000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-auto-1',
        title: 'Highway Road Test & Dashcam / Helmet Review',
        platform: 'YouTube',
        format: 'Road Test Feature',
        price: 8500,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['Real conditions road test', 'Thermal and durability tests', 'Buy link in top description'],
        description: 'Demonstrate motorcycle and car accessories in real driving conditions.'
      }
    ],
    portfolio: [
      {
        id: 'port-auto-1',
        title: 'Ather 450 Apex 500km Stress Ride',
        thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://youtube.com',
        platform: 'YouTube',
        brandWorkedWith: 'Ather Energy',
        reach: '280K Views',
        engagement: '6.7%'
      }
    ]
  },
  {
    id: 'user-creator-13',
    name: 'Meera Rajput',
    handle: '@meera_glow',
    email: 'meera@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Bridal makeup artist, clean beauty product swatches, monsoon skincare hacks.',
    category: 'Beauty & Skincare',
    subcategories: ['Makeup Tutorials', 'Bridal Glam', 'Lipstick Swatches'],
    location: 'Ahmedabad, Gujarat',
    languages: ['Gujarati', 'Hindi', 'English'],
    experienceYears: 4,
    rating: 4.9,
    reviewsCount: 28,
    completedDeals: 37,
    minPrice: 2500,
    verified: true,
    createdAt: '2025-01-23T00:00:00Z',
    isAvailable: true,
    badges: ['Bridal MUA', 'Vibrant Swatches'],
    demographics: {
      topAudienceAge: '18-30',
      genderRatio: { male: 12, female: 88 },
      topLocations: ['Ahmedabad', 'Surat', 'Mumbai', 'Vadodara']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'meera_glow',
        url: 'https://instagram.com',
        followersCount: 135000,
        engagementRate: 6.7,
        avgViews: 58000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-mua-1',
        title: 'Full Face Glam Look Tutorial Reel',
        platform: 'Instagram',
        format: 'Tutorial Reel',
        price: 4500,
        deliveryDays: 3,
        revisions: 1,
        deliverables: ['Step-by-step foundation and eyeshadow application', 'Close-up texture shots'],
        description: 'Showcase your color cosmetics in action under professional studio lighting.'
      }
    ],
    portfolio: [
      {
        id: 'port-mua-1',
        title: 'Smudge-proof Kajal 12-Hour Wear Test',
        thumbnail: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'Sugar Cosmetics',
        reach: '230K Views',
        engagement: '7.5%'
      }
    ]
  },
  {
    id: 'user-creator-14',
    name: 'Taranpreet Singh (PindFoodies)',
    handle: '@pind_foodies',
    email: 'taran@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    bio: 'Dhaba crawls across Punjab, pure ghee kulchas, lassi trails, authentic rural tastes.',
    category: 'Food & Beverage',
    subcategories: ['Highway Dhabas', 'Street Food', 'Traditional Punjabi Cuisine'],
    location: 'Amritsar, Punjab',
    languages: ['Punjabi', 'Hindi'],
    experienceYears: 3,
    rating: 4.8,
    reviewsCount: 30,
    completedDeals: 42,
    minPrice: 1800,
    verified: true,
    createdAt: '2025-01-25T00:00:00Z',
    isAvailable: true,
    badges: ['Street Food King', 'High Virality'],
    demographics: {
      topAudienceAge: '18-40',
      genderRatio: { male: 68, female: 32 },
      topLocations: ['Punjab', 'Delhi NCR', 'Chandigarh', 'Canada']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'pind_foodies',
        url: 'https://instagram.com',
        followersCount: 190000,
        engagementRate: 8.8,
        avgViews: 110000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-pind-1',
        title: 'Dhaba Visit & Chef Interaction Reel',
        platform: 'Instagram',
        format: 'Street Food Reel',
        price: 3500,
        deliveryDays: 3,
        revisions: 1,
        deliverables: ['High-energy Punjabi voiceover', 'Tandoor cooking footage', 'Location pin'],
        description: 'Bring thousands of road-trippers and weekend foodies to your outlet.'
      }
    ],
    portfolio: [
      {
        id: 'port-pind-1',
        title: '70-Year-Old Chole Kulche in Amritsar',
        thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'Amritsari Tadka',
        reach: '650K Views',
        engagement: '9.8%'
      }
    ]
  },
  {
    id: 'user-creator-15',
    name: 'Maya Varma',
    handle: '@maya_reads',
    email: 'maya@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    bio: 'Bookstagrammer, literary fiction explorer, stationery addict & cozy coffee corner reviewer.',
    category: 'Education & Careers',
    subcategories: ['Book Reviews', 'Stationery', 'Coffee & Cafes'],
    location: 'Kochi, Kerala',
    languages: ['English', 'Malayalam'],
    experienceYears: 3,
    rating: 5.0,
    reviewsCount: 19,
    completedDeals: 27,
    minPrice: 1200,
    verified: true,
    createdAt: '2025-01-26T00:00:00Z',
    isAvailable: true,
    badges: ['Engaged Readers', 'Cozy Aesthetic'],
    demographics: {
      topAudienceAge: '18-30',
      genderRatio: { male: 25, female: 75 },
      topLocations: ['Kochi', 'Bengaluru', 'Chennai', 'Mumbai']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'maya_reads',
        url: 'https://instagram.com',
        followersCount: 52000,
        engagementRate: 9.1,
        avgViews: 28000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-book-1',
        title: 'Book Review & Aesthetic Flatlay Photo + Reel',
        platform: 'Instagram',
        format: 'Photo Carousel + 30s Reel',
        price: 2200,
        deliveryDays: 4,
        revisions: 1,
        deliverables: ['Thoughtful spoiler-free review', 'Aesthetic coffee & book staging'],
        description: 'Connect with avid readers and young professionals seeking literature.'
      }
    ],
    portfolio: [
      {
        id: 'port-book-1',
        title: 'Top 5 Psychological Thrillers of 2025',
        thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'HarperCollins India',
        reach: '95K Views',
        engagement: '10.4%'
      }
    ]
  },
  {
    id: 'user-creator-16',
    name: 'Kunal Singhania',
    handle: '@kunal_luxury',
    email: 'kunal@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Men luxury lifestyle, mechanical watches, tailored suits & premium fragrance collector.',
    category: 'Fashion & Style',
    subcategories: ['Men Style', 'Luxury Watches', 'Niche Perfumes'],
    location: 'New Delhi, Delhi',
    languages: ['English', 'Hindi'],
    experienceYears: 5,
    rating: 4.9,
    reviewsCount: 36,
    completedDeals: 48,
    minPrice: 7000,
    verified: true,
    createdAt: '2025-01-09T00:00:00Z',
    isAvailable: true,
    badges: ['High Net Worth Audience', 'Editorial Quality'],
    demographics: {
      topAudienceAge: '25-45',
      genderRatio: { male: 82, female: 18 },
      topLocations: ['Delhi NCR', 'Mumbai', 'Dubai', 'London']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'kunal_luxury',
        url: 'https://instagram.com',
        followersCount: 160000,
        engagementRate: 4.6,
        avgViews: 62000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-lux-1',
        title: 'Cinematic Watch or Fragrance Showcase Reel',
        platform: 'Instagram',
        format: 'Macro Cinematic Reel',
        price: 11000,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['Macro lens 4K lighting shots', 'Sophisticated voiceover storytelling', 'Brand exclusivity for 30 days'],
        description: 'Elevate your premium product to connoisseur status.'
      }
    ],
    portfolio: [
      {
        id: 'port-lux-1',
        title: 'Chronograph Movement Breakdown',
        thumbnail: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'Seiko India',
        reach: '210K Impressions',
        engagement: '5.9%'
      }
    ]
  },
  {
    id: 'user-creator-17',
    name: 'Pooja Hegde (YogaWithPooja)',
    handle: '@pooja_hathayoga',
    email: 'pooja@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    bio: 'Certified Hatha & Ashtanga yoga teacher, sound bath healer, mindful wellness & organic herbal teas.',
    category: 'Fitness & Health',
    subcategories: ['Yoga & Breathwork', 'Holistic Wellness', 'Mindfulness'],
    location: 'Goa / Bengaluru',
    languages: ['English', 'Kannada', 'Hindi'],
    experienceYears: 6,
    rating: 5.0,
    reviewsCount: 25,
    completedDeals: 31,
    minPrice: 3000,
    verified: true,
    createdAt: '2025-01-11T00:00:00Z',
    isAvailable: true,
    badges: ['Yoga Alliance Certified', 'Holistic Health'],
    demographics: {
      topAudienceAge: '24-42',
      genderRatio: { male: 28, female: 72 },
      topLocations: ['Bengaluru', 'Goa', 'Mumbai', 'Mysuru']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'pooja_hathayoga',
        url: 'https://instagram.com',
        followersCount: 88000,
        engagementRate: 6.9,
        avgViews: 44000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-yoga-1',
        title: 'Morning Flow Reel + Yoga Mat & Activewear Spotlight',
        platform: 'Instagram',
        format: 'Morning Routine Reel',
        price: 4200,
        deliveryDays: 3,
        revisions: 1,
        deliverables: ['Peaceful morning yoga routine', 'Activewear fit & mobility testing'],
        description: 'Inspire conscious living and genuine interest in healthy mindful habits.'
      }
    ],
    portfolio: [
      {
        id: 'port-yoga-1',
        title: '15-Minute Desk Mobility Routine',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'Cult.fit',
        reach: '175K Views',
        engagement: '7.8%'
      }
    ]
  },
  {
    id: 'user-creator-18',
    name: 'Akash & Shreya (TheNomadDuo)',
    handle: '@thenomad_duo',
    email: 'nomad@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    bio: 'Full-time remote workers campervan traveling across India. Remote work tech setup, visa hacks & nomad lifestyle.',
    category: 'Travel & Hospitality',
    subcategories: ['Digital Nomad', 'Van Life', 'Budget Travel'],
    location: 'Shimla, Himachal Pradesh',
    languages: ['Hindi', 'English'],
    experienceYears: 4,
    rating: 4.8,
    reviewsCount: 34,
    completedDeals: 46,
    minPrice: 3800,
    verified: true,
    createdAt: '2025-01-13T00:00:00Z',
    isAvailable: true,
    badges: ['Travel Influencer', 'High Production'],
    demographics: {
      topAudienceAge: '22-35',
      genderRatio: { male: 50, female: 50 },
      topLocations: ['Delhi', 'Mumbai', 'Bengaluru', 'Chandigarh']
    },
    socialAccounts: [
      {
        platform: 'youtube',
        handle: 'TheNomadDuoIndia',
        url: 'https://youtube.com',
        followersCount: 160000,
        engagementRate: 6.4,
        avgViews: 58000,
        verified: true
      },
      {
        platform: 'instagram',
        handle: 'thenomad_duo',
        url: 'https://instagram.com',
        followersCount: 125000,
        engagementRate: 5.9,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-nom-1',
        title: 'Travel Gear / Portable Power Station Review',
        platform: 'YouTube',
        format: 'Integrated Video Segment (90s)',
        price: 7500,
        deliveryDays: 5,
        revisions: 2,
        deliverables: ['Real camp conditions usage', 'Link in bio and video pin'],
        description: 'Demonstrate rugged outdoor, travel, and mobile electronics.'
      }
    ],
    portfolio: [
      {
        id: 'port-nom-1',
        title: 'Working 9-to-5 from Spiti Valley',
        thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://youtube.com',
        platform: 'YouTube',
        brandWorkedWith: 'Wildcraft',
        reach: '220K Views',
        engagement: '6.9%'
      }
    ]
  },
  {
    id: 'user-creator-19',
    name: 'Gaurav Kulkarni',
    handle: '@gaurav_finance',
    email: 'gaurav@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Stock market fundamentals, IPO analysis, index investing & personal budgeting for salaried Indian employees.',
    category: 'Finance & Crypto',
    subcategories: ['Stock Market', 'Mutual Funds', 'Insurance Basics'],
    location: 'Pune, Maharashtra',
    languages: ['Marathi', 'Hindi', 'English'],
    experienceYears: 5,
    rating: 4.9,
    reviewsCount: 42,
    completedDeals: 55,
    minPrice: 4000,
    verified: true,
    createdAt: '2025-01-07T00:00:00Z',
    isAvailable: true,
    badges: ['NISM Certified', 'Trusted Guidance'],
    demographics: {
      topAudienceAge: '22-40',
      genderRatio: { male: 80, female: 20 },
      topLocations: ['Pune', 'Mumbai', 'Nagpur', 'Nashik']
    },
    socialAccounts: [
      {
        platform: 'youtube',
        handle: 'GauravKulkarniFinance',
        url: 'https://youtube.com',
        followersCount: 195000,
        engagementRate: 5.1,
        avgViews: 65000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-gk-1',
        title: 'Trading / Demat App Feature Demo Video',
        platform: 'YouTube',
        format: 'Video Segment (60s)',
        price: 8000,
        deliveryDays: 4,
        revisions: 2,
        deliverables: ['Real time screen capture of order placement', 'Referral signup link banner'],
        description: 'Drive high-LTV account registrations with transparent fee walkthrough.'
      }
    ],
    portfolio: [
      {
        id: 'port-gk-1',
        title: 'Nifty 50 vs Sensex: Where to Start?',
        thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://youtube.com',
        platform: 'YouTube',
        brandWorkedWith: 'Zerodha',
        reach: '185K Views',
        engagement: '6.3%'
      }
    ]
  },
  {
    id: 'user-creator-20',
    name: 'Nisha Bano',
    handle: '@nisha_crafts',
    email: 'nisha@colab.test',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    bio: 'Resin art, DIY stationery gifts, handmade jewelry & small business owner tips for aspiring creators.',
    category: 'Fashion & Style',
    subcategories: ['Handmade Jewelry', 'Resin Crafts', 'Small Business Tips'],
    location: 'Lucknow, Uttar Pradesh',
    languages: ['Hindi', 'Urdu', 'English'],
    experienceYears: 3,
    rating: 5.0,
    reviewsCount: 24,
    completedDeals: 30,
    minPrice: 1000,
    verified: true,
    createdAt: '2025-01-27T00:00:00Z',
    isAvailable: true,
    badges: ['Affordable Local Promo', 'Creative Crafts'],
    demographics: {
      topAudienceAge: '16-28',
      genderRatio: { male: 15, female: 85 },
      topLocations: ['Lucknow', 'Kanpur', 'Delhi', 'Varanasi']
    },
    socialAccounts: [
      {
        platform: 'instagram',
        handle: 'nisha_crafts',
        url: 'https://instagram.com',
        followersCount: 68000,
        engagementRate: 8.7,
        avgViews: 42000,
        verified: true
      }
    ],
    services: [
      {
        id: 'srv-nc-1',
        title: 'Affordable Product Try-On Reel (Boutique Special)',
        platform: 'Instagram',
        format: 'Single Reel',
        price: 1000,
        deliveryDays: 2,
        revisions: 1,
        deliverables: ['1 High energy try-on or unboxing reel', 'Store link & discount code in caption'],
        description: 'Ideal for local boutiques and small handicraft stores starting out on a ₹1,000 budget!'
      }
    ],
    portfolio: [
      {
        id: 'port-nc-1',
        title: 'Personalized Resin Bookmark Tutorial',
        thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        mediaUrl: 'https://instagram.com',
        platform: 'Instagram',
        brandWorkedWith: 'Boutique Crafts',
        reach: '115K Views',
        engagement: '9.4%'
      }
    ]
  }
];

// 10 BUSINESSES
export const BUSINESSES: BusinessProfile[] = [
  {
    id: 'user-biz-1',
    email: 'growth@trivandrumcrafts.com',
    name: 'Aroma Threads Boutique',
    companyName: 'Aroma Threads Boutique',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    industry: 'Fashion & Apparel',
    website: 'https://aromathreads.example.com',
    gstNumber: '32AABCA1234F1Z8',
    location: 'Trivandrum, Kerala',
    teamSize: '10-25',
    activeCampaignsCount: 2,
    totalSpent: 45000,
    bio: 'Independent artisanal clothing studio celebrating handloom cottons and natural block prints.',
    verified: true,
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'user-biz-2',
    email: 'marketing@nutriblend.in',
    name: 'NutriBlend Superfoods',
    companyName: 'NutriBlend Superfoods Pvt Ltd',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    industry: 'Health & Wellness',
    website: 'https://nutriblend.example.com',
    gstNumber: '06AACCN8765K1Z4',
    location: 'Gurugram, Haryana',
    teamSize: '50-100',
    activeCampaignsCount: 3,
    totalSpent: 185000,
    bio: '100% plant-based certified clean protein powder, daily greens and immunity formulas.',
    verified: true,
    createdAt: '2025-02-10T00:00:00Z'
  },
  {
    id: 'user-biz-3',
    email: 'partners@urbanglow.in',
    name: 'UrbanGlow Skincare',
    companyName: 'UrbanGlow Beauty Labs',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    industry: 'Beauty & Cosmetics',
    website: 'https://urbanglow.example.com',
    gstNumber: '27AABCU4321D1Z2',
    location: 'Mumbai, Maharashtra',
    teamSize: '25-50',
    activeCampaignsCount: 2,
    totalSpent: 92000,
    bio: 'Clinically tested Korean-formulated sunscreen, barrier repair ceramides, and vitamin serums.',
    verified: true,
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 'user-biz-4',
    email: 'hello@pulsewear.co',
    name: 'Pulse Athletic Wear',
    companyName: 'Pulse Activewear India',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    industry: 'Sports & Activewear',
    website: 'https://pulsewear.example.com',
    gstNumber: '29AAACP9988G1ZQ',
    location: 'Bengaluru, Karnataka',
    teamSize: '20-50',
    activeCampaignsCount: 1,
    totalSpent: 64000,
    bio: 'Sweat-wicking gym shorts, squat-proof compression tights and performance running tees.',
    verified: true,
    createdAt: '2025-02-04T00:00:00Z'
  },
  {
    id: 'user-biz-5',
    email: 'contact@zapcharge.in',
    name: 'ZapCharge EV Ecosystem',
    companyName: 'ZapCharge Technologies',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    industry: 'CleanTech & Automotive',
    website: 'https://zapcharge.example.com',
    gstNumber: '27AABCZ5566M1Z1',
    location: 'Pune, Maharashtra',
    teamSize: '100-250',
    activeCampaignsCount: 2,
    totalSpent: 210000,
    bio: 'Fast charging network and smart home chargers for two-wheelers and four-wheelers across India.',
    verified: true,
    createdAt: '2025-01-18T00:00:00Z'
  },
  {
    id: 'user-biz-6',
    email: 'brand@chaiaddict.com',
    name: 'Chai Tales Cafe Chain',
    companyName: 'Chai Tales Hospitality LLP',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    industry: 'Food & Beverage',
    website: 'https://chaitales.example.com',
    gstNumber: '07AABCC3344R1Z3',
    location: 'New Delhi, Delhi',
    teamSize: '50-100',
    activeCampaignsCount: 1,
    totalSpent: 35000,
    bio: 'Contemporary kulhad chai cafes paired with modern regional snacks in 18 locations.',
    verified: true,
    createdAt: '2025-02-12T00:00:00Z'
  },
  {
    id: 'user-biz-7',
    email: 'marketing@flowbooks.io',
    name: 'FlowBooks Accounting SaaS',
    companyName: 'FlowBooks Softwares India',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    industry: 'B2B Software & FinTech',
    website: 'https://flowbooks.example.com',
    gstNumber: '33AABCF8899P1ZK',
    location: 'Chennai, Tamil Nadu',
    teamSize: '30-60',
    activeCampaignsCount: 2,
    totalSpent: 120000,
    bio: 'Simple GST invoicing, automated e-way bill generation & inventory for Indian MSMEs.',
    verified: true,
    createdAt: '2025-01-25T00:00:00Z'
  },
  {
    id: 'user-biz-8',
    email: 'pr@peakgear.in',
    name: 'PeakCraft Adventure Gear',
    companyName: 'PeakCraft Outdoors LLP',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    industry: 'Travel & Outdoors',
    website: 'https://peakcraft.example.com',
    gstNumber: '05AABCP4455Q1Z7',
    location: 'Dehradun, Uttarakhand',
    teamSize: '15-30',
    activeCampaignsCount: 1,
    totalSpent: 28000,
    bio: 'Waterproof rucksacks, ultra-light trekking poles & high-altitude sleeping bags.',
    verified: true,
    createdAt: '2025-02-08T00:00:00Z'
  },
  {
    id: 'user-biz-9',
    email: 'info@auraecocandles.com',
    name: 'Aura Artisan Living',
    companyName: 'Aura Eco Scents India',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    industry: 'Home Decor & Gifting',
    website: 'https://auraecocandles.example.com',
    gstNumber: '24AABCA7788L1ZH',
    location: 'Ahmedabad, Gujarat',
    teamSize: '5-15',
    activeCampaignsCount: 1,
    totalSpent: 15000,
    bio: 'Soy wax botanical candles, diffuser reeds and handcrafted ceramic home accessories.',
    verified: true,
    createdAt: '2025-02-14T00:00:00Z'
  },
  {
    id: 'user-biz-10',
    email: 'growth@gameverse.gg',
    name: 'GameVerse Arcade',
    companyName: 'GameVerse Entertainment Pvt Ltd',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    industry: 'Gaming & Entertainment',
    website: 'https://gameverse.example.com',
    gstNumber: '29AABCG1122D1ZN',
    location: 'Bengaluru, Karnataka',
    teamSize: '40-80',
    activeCampaignsCount: 2,
    totalSpent: 160000,
    bio: 'Premier VR gaming arenas, LAN tournaments and gaming merchandise stores in 5 cities.',
    verified: true,
    createdAt: '2025-01-30T00:00:00Z'
  }
];

// 10 OPEN ADVERTISING CAMPAIGNS
export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    businessId: 'user-biz-1',
    businessName: 'Aroma Threads Boutique',
    businessLogo: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Spring Pastel Handloom Collection Launch',
    description: 'Looking for 3 fashion & lifestyle creators in South/West India to style our organic cotton festive kurtis and sarees. Show real fabric drape, day-to-evening styling tips and store visit if local to Trivandrum/Kochi.',
    category: 'Fashion & Style',
    productName: 'Handwoven Pastel Kurti & Saree Range',
    productUrl: 'https://aromathreads.example.com/spring',
    objectives: ['Drive Direct Website Sales', 'Brand Awareness', 'Highlight Artisanal Craftsmanship'],
    targetAudience: {
      locations: ['Trivandrum', 'Kochi', 'Bengaluru', 'Chennai', 'Mumbai'],
      ageRange: '20-35',
      gender: 'Female',
      interests: ['Sustainable Fashion', 'Indian Ethnic Wear', 'Office Chic'],
      languages: ['English', 'Malayalam', 'Hindi', 'Tamil']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 Reel (30-60s) + 2 Stories',
      quantity: 1,
      videoDuration: '45-60s',
      storeVisitRequired: false,
      licensingTerms: '6 months paid ads rights on Meta',
      deadline: '2026-12-15'
    },
    budget: {
      type: 'fixed',
      minAmount: 1500,
      maxAmount: 3500,
      totalBudget: 10500,
      compensationDetails: '₹3,500 cash fee + complimentary Kurti set valued at ₹2,800'
    },
    settings: {
      deadline: '2026-12-01',
      maxCreators: 3,
      slotsAvailable: 1,
      minFollowers: 15000,
      eligibilityNotes: 'Must have at least 4% engagement rate. Authentic styling reviews only.',
      customQuestions: ['What is your typical reel engagement rate?', 'Which city are you currently located in?']
    },
    status: 'active',
    applicantsCount: 14,
    shortlistedCount: 3,
    createdAt: '2026-11-01T10:00:00Z',
    isFeatured: true
  },
  {
    id: 'camp-2',
    businessId: 'user-biz-2',
    businessName: 'NutriBlend Superfoods',
    businessLogo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Morning Energy Shake Routine — 100% Plant Protein',
    description: 'Looking for fitness, yoga, and wellness creators to integrate our new Vegan Pea & Brown Rice Protein into their morning smoothie or post-workout breakfast. Highlight zero bloating and natural taste.',
    category: 'Fitness & Health',
    productName: 'NutriBlend Clean Vegan Protein (Chocolate Silk)',
    productUrl: 'https://nutriblend.example.com/protein',
    objectives: ['Coupon Code Redemptions', 'Product Education on Clean Ingredients', 'Content Repurposing for Ads'],
    targetAudience: {
      locations: ['Tier 1 & 2 Metro Cities across India'],
      ageRange: '20-40',
      gender: 'All',
      interests: ['Gym & Fitness', 'Plant Based Diet', 'Weight Management'],
      languages: ['English', 'Hindi']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 High-energy Reel showing shake preparation',
      quantity: 1,
      videoDuration: '30-45s',
      storeVisitRequired: false,
      licensingTerms: 'Perpetual digital organic repost rights',
      deadline: '2026-12-20'
    },
    budget: {
      type: 'range',
      minAmount: 3000,
      maxAmount: 6000,
      totalBudget: 30000,
      compensationDetails: '₹4,000 to ₹6,000 per creator + 2 months free supply'
    },
    settings: {
      deadline: '2026-12-05',
      maxCreators: 5,
      slotsAvailable: 3,
      minFollowers: 25000,
      eligibilityNotes: 'Active fitness creators only with verified workout content.',
      customQuestions: ['Do you currently consume plant protein?', 'Provide a link to your most viewed fitness reel.']
    },
    status: 'active',
    applicantsCount: 22,
    shortlistedCount: 4,
    createdAt: '2026-11-03T12:00:00Z',
    isFeatured: true
  },
  {
    id: 'camp-3',
    businessId: 'user-biz-3',
    businessName: 'UrbanGlow Skincare',
    businessLogo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Invisible Zinc Matte Gel Sunscreen SPF 50+ Real Wear Test',
    description: 'Calling beauty creators, medical skincare advocates and everyday vloggers. Demonstrate zero white cast, non-sticky matte finish on Indian skin tones, and how it holds under makeup.',
    category: 'Beauty & Skincare',
    productName: 'UrbanGlow UltraMatte Mineral SPF 50 PA++++',
    productUrl: 'https://urbanglow.example.com/sunscreen',
    objectives: ['Overcome White-cast Hesitation', 'Direct Amazon/Website Traffic', 'UGC Asset Collection'],
    targetAudience: {
      locations: ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune'],
      ageRange: '18-35',
      gender: 'Female & Male',
      interests: ['Skincare', 'Sun Protection', 'Dermatology'],
      languages: ['English', 'Hindi']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 Reel with half-face application demo',
      quantity: 1,
      videoDuration: '45s',
      storeVisitRequired: false,
      licensingTerms: 'Meta & Google ad whitelisting for 90 days',
      deadline: '2026-12-10'
    },
    budget: {
      type: 'fixed',
      minAmount: 3500,
      maxAmount: 5000,
      totalBudget: 25000,
      compensationDetails: '₹5,000 fixed fee + Sunscreen PR kit'
    },
    settings: {
      deadline: '2026-11-30',
      maxCreators: 5,
      slotsAvailable: 2,
      minFollowers: 20000,
      eligibilityNotes: 'Must show clean unedited skin application without beauty filters.',
      customQuestions: ['What is your skin type (Oily / Dry / Combination)?']
    },
    status: 'active',
    applicantsCount: 19,
    shortlistedCount: 3,
    createdAt: '2026-11-04T08:30:00Z',
    isFeatured: false
  },
  {
    id: 'camp-4',
    businessId: 'user-biz-6',
    businessName: 'Chai Tales Cafe Chain',
    businessLogo: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'New Outlet Opening: Connaught Place — Foodie Crawl',
    description: 'We are opening our 19th flagship store in CP, Delhi! Inviting 4 Delhi-NCR food vloggers for an exclusive pre-launch tasting event. Free food for you and your companion + payment.',
    category: 'Food & Beverage',
    productName: 'Tandoori Kulhad Chai & Bun Maska Platter',
    objectives: ['Launch Day Footfall', 'Viral Geo-tagged Instagram Audio Reels'],
    targetAudience: {
      locations: ['Delhi NCR', 'Gurugram', 'Noida', 'Faridabad'],
      ageRange: '18-35',
      gender: 'All',
      interests: ['Street Food', 'Cafe Hopping', 'Delhi Winter'],
      languages: ['Hindi', 'English']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: 'On-site Reel + 3 Live Stories on Launch Day',
      quantity: 1,
      videoDuration: '30-60s',
      storeVisitRequired: true,
      licensingTerms: 'In-store display rights',
      deadline: '2026-12-08'
    },
    budget: {
      type: 'fixed',
      minAmount: 3000,
      maxAmount: 4500,
      totalBudget: 18000,
      compensationDetails: '₹4,500 cash + unlimited food voucher'
    },
    settings: {
      deadline: '2026-12-03',
      maxCreators: 4,
      slotsAvailable: 2,
      minFollowers: 30000,
      eligibilityNotes: 'Must be physically available in Delhi NCR on opening Saturday.',
      customQuestions: ['Are you available on Saturday, Dec 6th between 4pm-7pm?']
    },
    status: 'active',
    applicantsCount: 31,
    shortlistedCount: 2,
    createdAt: '2026-11-05T14:00:00Z',
    isFeatured: true
  },
  {
    id: 'camp-5',
    businessId: 'user-biz-7',
    businessName: 'FlowBooks Accounting SaaS',
    businessLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Small Business E-Invoicing Simplified: YouTube Integration',
    description: 'Calling Chartered Accountants, finance educators, and MSME consultants with YouTube channels or LinkedIn newsletters. Educate business owners on how to create compliant GST e-invoices in under 60 seconds.',
    category: 'Finance & Crypto',
    productName: 'FlowBooks Cloud Invoicing Platform',
    productUrl: 'https://flowbooks.example.com',
    objectives: ['SaaS Free Trial Signups', 'B2B Leads', 'Search-indexed Educational YouTube Presence'],
    targetAudience: {
      locations: ['Pan India'],
      ageRange: '25-50',
      gender: 'All',
      interests: ['Small Business', 'GST Filing', 'Entrepreneurship', 'Freelancing'],
      languages: ['English', 'Hindi', 'Tamil']
    },
    requirements: {
      platform: 'YouTube',
      contentFormat: '60s Dedicated Mid-roll Integration or 10-min Tutorial',
      quantity: 1,
      videoDuration: '60s integration or full dedicated',
      storeVisitRequired: false,
      licensingTerms: 'Standard digital usage rights',
      deadline: '2026-12-25'
    },
    budget: {
      type: 'range',
      minAmount: 8000,
      maxAmount: 15000,
      totalBudget: 40000,
      compensationDetails: '₹8,000 to ₹15,000 depending on channel subscriber size + 20% recurring affiliate bounty'
    },
    settings: {
      deadline: '2026-12-10',
      maxCreators: 3,
      slotsAvailable: 2,
      minFollowers: 40000,
      eligibilityNotes: 'Must have genuine business/finance creator background.',
      customQuestions: ['What is the average view count on your finance tutorials?']
    },
    status: 'active',
    applicantsCount: 11,
    shortlistedCount: 2,
    createdAt: '2026-11-06T11:00:00Z',
    isFeatured: false
  },
  {
    id: 'camp-6',
    businessId: 'user-biz-4',
    businessName: 'Pulse Athletic Wear',
    businessLogo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Winter Marathon Training & Active Compression Gear',
    description: 'We need 3 runners and endurance athletes to road test our reflective winter thermal running tops and anti-chafing compression tights during their morning long runs.',
    category: 'Sports & Activewear',
    productName: 'Pulse Pro Run Thermal Tops & Tights',
    objectives: ['Brand Affinity in Running Communities', 'Direct Purchases via Creator Codes'],
    targetAudience: {
      locations: ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad'],
      ageRange: '20-40',
      gender: 'All',
      interests: ['Running', 'Marathons', 'Triathlons', 'CrossFit'],
      languages: ['English', 'Hindi']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 Running Reel + 1 Static Post',
      quantity: 2,
      videoDuration: '30s',
      storeVisitRequired: false,
      licensingTerms: '6 months web & social advertising',
      deadline: '2026-12-18'
    },
    budget: {
      type: 'fixed',
      minAmount: 4000,
      maxAmount: 6000,
      totalBudget: 15000,
      compensationDetails: '₹5,000 cash fee + Complete Running Kit (Value ₹7,500)'
    },
    settings: {
      deadline: '2026-12-05',
      maxCreators: 3,
      slotsAvailable: 1,
      minFollowers: 15000,
      eligibilityNotes: 'Actual runners who participate in 10k/21k events.',
      customQuestions: ['What was your last race timing or weekly running distance?']
    },
    status: 'active',
    applicantsCount: 16,
    shortlistedCount: 2,
    createdAt: '2026-11-07T09:00:00Z',
    isFeatured: false
  },
  {
    id: 'camp-7',
    businessId: 'user-biz-5',
    businessName: 'ZapCharge EV Ecosystem',
    businessLogo: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Intercity EV Scooter Roadtrip Challenge: Pune to Goa',
    description: 'Sponsoring 2 automobile YouTubers to take their electric two-wheelers on the Pune-Goa highway and demonstrate fast charging stops using the ZapCharge mobile app.',
    category: 'Automotive & Bikes',
    productName: 'ZapCharge Fast Charging Highway Network',
    objectives: ['Eliminate EV Range Anxiety', 'App Downloads', 'Brand Leadership in EV Tech'],
    targetAudience: {
      locations: ['Maharashtra', 'Goa', 'Karnataka'],
      ageRange: '20-45',
      gender: 'Male & Female',
      interests: ['Electric Vehicles', 'Automobile Roadtrips', 'Gadgets'],
      languages: ['Marathi', 'Hindi', 'English']
    },
    requirements: {
      platform: 'YouTube',
      contentFormat: 'Dedicated Vlog Episode or 2x Instagram Reels',
      quantity: 2,
      videoDuration: 'Full episode + shorts',
      storeVisitRequired: true,
      licensingTerms: 'Perpetual PR and YouTube repost rights',
      deadline: '2026-12-30'
    },
    budget: {
      type: 'fixed',
      minAmount: 12000,
      maxAmount: 25000,
      totalBudget: 50000,
      compensationDetails: '₹20,000 cash + all charging & hotel expenses covered'
    },
    settings: {
      deadline: '2026-12-10',
      maxCreators: 2,
      slotsAvailable: 1,
      minFollowers: 50000,
      eligibilityNotes: 'Must own or have access to an electric two-wheeler.',
      customQuestions: ['Which EV do you currently ride?']
    },
    status: 'active',
    applicantsCount: 18,
    shortlistedCount: 2,
    createdAt: '2026-11-08T15:30:00Z',
    isFeatured: true
  },
  {
    id: 'camp-8',
    businessId: 'user-biz-8',
    businessName: 'PeakCraft Adventure Gear',
    businessLogo: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Winter Trekking Gear Review: 60L Waterproof Rucksack',
    description: 'We are sending our flagship 60L expedition rucksack to Himalayan trekkers and mountain backpackers going on Kedarkantha, Brahmatal or Kuari Pass this December.',
    category: 'Travel & Hospitality',
    productName: 'PeakCraft Glacier 60L Pro Rucksack',
    objectives: ['Field Performance Validation', 'High Quality Visuals of Bags in Snow'],
    targetAudience: {
      locations: ['India North / Trekking Enthusiasts'],
      ageRange: '20-35',
      gender: 'All',
      interests: ['Trekking', 'Camping', 'Photography'],
      languages: ['English', 'Hindi']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 Reel + 3 High-res Product Photos on Summit',
      quantity: 1,
      videoDuration: '30s',
      storeVisitRequired: false,
      licensingTerms: 'Brand catalog photo usage',
      deadline: '2026-12-28'
    },
    budget: {
      type: 'fixed',
      minAmount: 3000,
      maxAmount: 5000,
      totalBudget: 12000,
      compensationDetails: '₹4,000 cash fee + Keep the ₹6,500 Rucksack'
    },
    settings: {
      deadline: '2026-12-05',
      maxCreators: 3,
      slotsAvailable: 2,
      minFollowers: 15000,
      eligibilityNotes: 'Must have confirmed upcoming winter trek plans.',
      customQuestions: ['Which winter trek are you doing this December/January?']
    },
    status: 'active',
    applicantsCount: 24,
    shortlistedCount: 3,
    createdAt: '2026-11-09T10:00:00Z',
    isFeatured: false
  },
  {
    id: 'camp-9',
    businessId: 'user-biz-9',
    businessName: 'Aura Artisan Living',
    businessLogo: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Festive Table Setting & Scented Candle Ambience',
    description: 'Boutique candle studio seeking micro-creators and home decor stylists. Show how our handcrafted vanilla amber candles transform your dinner table or reading nook into a cozy paradise.',
    category: 'Fashion & Style',
    productName: 'Aura Handpoured Soy Candles & Reed Diffusers',
    objectives: ['Holiday Gifting Orders', 'Pinterest and Instagram Aesthetic Buzz'],
    targetAudience: {
      locations: ['Metro Cities'],
      ageRange: '22-45',
      gender: 'Female / Male',
      interests: ['Home Decor', 'Candles', 'Interior Design'],
      languages: ['English', 'Hindi']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 Aesthetic Reel or Photo Carousel',
      quantity: 1,
      videoDuration: '30s',
      storeVisitRequired: false,
      licensingTerms: 'E-commerce website banner usage',
      deadline: '2026-12-12'
    },
    budget: {
      type: 'fixed',
      minAmount: 1200,
      maxAmount: 2500,
      totalBudget: 6000,
      compensationDetails: '₹2,000 cash + Luxury Scent Gift Hamper (₹3,000)'
    },
    settings: {
      deadline: '2026-12-01',
      maxCreators: 3,
      slotsAvailable: 2,
      minFollowers: 8000,
      eligibilityNotes: 'High quality photography and eye for cozy interior styling.',
      customQuestions: ['Share a link to your best home aesthetic post.']
    },
    status: 'active',
    applicantsCount: 15,
    shortlistedCount: 2,
    createdAt: '2026-11-10T11:00:00Z',
    isFeatured: false
  },
  {
    id: 'camp-10',
    businessId: 'user-biz-10',
    businessName: 'GameVerse Arcade',
    businessLogo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    businessVerified: true,
    title: 'Bengaluru VR Arena Battle Royale Tournament Promo',
    description: 'We are hosting a 32-team VR laser combat tournament in Indiranagar, Bengaluru. We need 3 local gaming & comedy creators to challenge each other in VR and promote team registrations.',
    category: 'Gaming & Esports',
    productName: 'GameVerse Virtual Reality Arena Pass',
    objectives: ['Tournament Team Signups', 'Weekend Ticket Sales'],
    targetAudience: {
      locations: ['Bengaluru', 'Mysuru'],
      ageRange: '16-30',
      gender: 'All',
      interests: ['Gaming', 'VR', 'Arcades', 'Weekend Fun'],
      languages: ['English', 'Kannada', 'Hindi']
    },
    requirements: {
      platform: 'Instagram',
      contentFormat: '1 On-site Funny VR Gameplay Reel + Story with booking link',
      quantity: 1,
      videoDuration: '45s',
      storeVisitRequired: true,
      licensingTerms: 'Standard digital rights',
      deadline: '2026-12-14'
    },
    budget: {
      type: 'fixed',
      minAmount: 4000,
      maxAmount: 6000,
      totalBudget: 15000,
      compensationDetails: '₹5,000 cash + Free 1-month VIP gaming pass'
    },
    settings: {
      deadline: '2026-12-04',
      maxCreators: 3,
      slotsAvailable: 1,
      minFollowers: 25000,
      eligibilityNotes: 'Must be able to visit our Indiranagar arena.',
      customQuestions: ['Have you ever tried VR gaming before?']
    },
    status: 'active',
    applicantsCount: 28,
    shortlistedCount: 3,
    createdAt: '2026-11-11T16:00:00Z',
    isFeatured: true
  }
];

// SPONSORSHIP OPPORTUNITIES
export const SPONSORSHIPS: SponsorshipOpportunity[] = [
  {
    id: 'spon-1',
    organiserId: 'user-org-1',
    organiserName: 'Mood Indigo Team (IIT Bombay)',
    organiserAvatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
    title: 'Mood Indigo 2026 — Asia Largest Cultural Fest',
    type: 'college_fest',
    category: 'College & Youth Festival',
    description: 'Over 140,000+ top college students and young professionals across India converge at IIT Bombay for 4 days of concerts, international competitions, art installations, and pro-nites.',
    location: 'IIT Bombay, Powai, Mumbai',
    eventDate: '2026-12-26',
    expectedFootfall: 145000,
    targetAudience: 'College Students (18-24), Tech graduates, Creative Youth, Pan-India',
    verifiedOrganiser: true,
    proposalCount: 18,
    deadline: '2026-12-10',
    createdAt: '2026-10-15T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-1',
        tier: 'Title Sponsor',
        price: 2500000,
        availableSlots: 1,
        claimedSlots: 0,
        perks: ['Title naming on main pro-nite stage', 'Prominent branding across 500+ college campuses', 'On-ground VIP experiential zone (2000 sq ft)', 'Social media reach to 800k+ followers']
      },
      {
        id: 'pkg-2',
        tier: 'Presenting Sponsor',
        price: 1200000,
        availableSlots: 2,
        claimedSlots: 1,
        perks: ['Presenting partner status on EDM & Rock night', 'Booth space in central arena', 'Logo on wristbands and merchandise']
      },
      {
        id: 'pkg-3',
        tier: 'Product Partner',
        price: 350000,
        availableSlots: 6,
        claimedSlots: 3,
        perks: ['Direct product sampling to 50,000+ students', 'Dedicated sampling kiosk near food court', 'Digital shoutouts on official channels']
      }
    ]
  },
  {
    id: 'spon-2',
    organiserId: 'user-org-2',
    organiserName: 'FinCon India Summit',
    organiserAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    title: 'FinCon India 2027: National FinTech & Creator Summit',
    type: 'conference',
    category: 'Business & Technology',
    description: 'Bringing together 2,500+ finance creators, fintech founders, SEBI registered advisors, and wealth tech innovators at the Grand Hyatt, Mumbai.',
    location: 'Grand Hyatt, Mumbai',
    eventDate: '2027-02-14',
    expectedFootfall: 2800,
    targetAudience: 'Fintech Executives, High-earning creators, Angel Investors, Wealth Managers',
    verifiedOrganiser: true,
    proposalCount: 12,
    deadline: '2027-01-15',
    createdAt: '2026-10-20T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-fc-1',
        tier: 'Title Sponsor',
        price: 850000,
        availableSlots: 1,
        claimedSlots: 0,
        perks: ['Keynote speaking slot in main ballroom', 'Exclusive branding on delegate passes and lanyards', 'Private meeting room access for dealmaking']
      },
      {
        id: 'pkg-fc-2',
        tier: 'Gold Sponsor',
        price: 400000,
        availableSlots: 4,
        claimedSlots: 2,
        perks: ['Panelist participation in FinTech session', 'Exhibition booth space in Networking Lounge', '10 All-access VIP conference passes']
      }
    ]
  },
  {
    id: 'spon-3',
    organiserId: 'user-org-3',
    organiserName: 'The Bangalore Tech Podcast',
    organiserAvatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
    title: 'The Bangalore Tech Podcast (Season 4 Sponsorship)',
    type: 'podcast',
    category: 'Podcasts & Media',
    description: 'Weekly in-depth conversations with unicorn founders, CTOs and venture capitalists in India startup capital. 45,000+ monthly audio & video listens.',
    location: 'Bengaluru / Digital Audio Streaming',
    eventDate: '2027-01-01',
    expectedFootfall: 180000,
    targetAudience: 'Software Engineers, Startup Founders, Product Managers, Investors',
    verifiedOrganiser: true,
    proposalCount: 7,
    deadline: '2026-12-20',
    createdAt: '2026-10-25T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-pod-1',
        tier: 'Title Sponsor',
        price: 250000,
        availableSlots: 1,
        claimedSlots: 0,
        perks: ['Exclusive 12-episode title presenter', 'Host-read pre-roll & mid-roll in every episode', 'Logo watermark on YouTube multi-cam video', 'Dedicated link in newsletter reaching 22k subscribers']
      },
      {
        id: 'pkg-pod-2',
        tier: 'Custom',
        price: 75000,
        availableSlots: 3,
        claimedSlots: 1,
        perks: ['Single month 4-episode mid-roll sponsor', 'Host testimonial and affiliate banner']
      }
    ]
  },
  {
    id: 'spon-4',
    organiserId: 'user-org-4',
    organiserName: 'Kochi Indie Music Collective',
    organiserAvatar: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    title: 'Malabar Coastal Waves Music Fest 2026',
    type: 'cultural',
    category: 'Music & Arts',
    description: 'A 2-day independent open air music festival by the backwaters of Fort Kochi featuring 14 indie bands, artisanal food trucks, and craft beverage stalls.',
    location: 'Fort Kochi Parade Ground, Kochi',
    eventDate: '2026-12-29',
    expectedFootfall: 12000,
    targetAudience: 'Music Lovers, Travelers, Gen Z & Millennials in Kerala and Bangalore',
    verifiedOrganiser: true,
    proposalCount: 9,
    deadline: '2026-12-12',
    createdAt: '2026-11-01T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-m-1',
        tier: 'Title Sponsor',
        price: 500000,
        availableSlots: 1,
        claimedSlots: 0,
        perks: ['Main stage naming rights', 'Logo on all printed posters & digital campaigns', 'VIP lounge for sponsor guests with food & beverages']
      },
      {
        id: 'pkg-m-2',
        tier: 'Product Partner',
        price: 150000,
        availableSlots: 4,
        claimedSlots: 2,
        perks: ['Exclusive beverage / snack pouring rights at festival', 'Dedicated 20x20 pop-up booth']
      }
    ]
  },
  {
    id: 'spon-5',
    organiserId: 'user-org-5',
    organiserName: 'All-India Inter-University Cricket League',
    organiserAvatar: 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?auto=format&fit=crop&w=400&q=80',
    title: 'National Varsity T20 Championship 2027',
    type: 'sports_tournament',
    category: 'Sports & Fitness',
    description: '48 top university cricket teams competing across 10 days with live streaming on YouTube and digital sports channels.',
    location: 'DY Patil Stadium Campus, Navi Mumbai',
    eventDate: '2027-01-20',
    expectedFootfall: 35000,
    targetAudience: 'Cricket fans, College athletes, Sports enthusiasts aged 16-35',
    verifiedOrganiser: true,
    proposalCount: 15,
    deadline: '2026-12-25',
    createdAt: '2026-11-02T00:00:00Z',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    packages: [
      {
        id: 'pkg-cric-1',
        tier: 'Title Sponsor',
        price: 1500000,
        availableSlots: 1,
        claimedSlots: 0,
        perks: ['Tournament named after sponsor brand', 'Front jersey sponsor for finalists', 'Man of the Match sponsor presentation']
      },
      {
        id: 'pkg-cric-2',
        tier: 'Product Partner',
        price: 250000,
        availableSlots: 3,
        claimedSlots: 1,
        perks: ['Official hydration or snack partner', 'Boundary perimeter digital boards']
      }
    ]
  }
];

// CREATIVE PROFESSIONALS (UGC / PRODUCTION)
export const CREATIVE_PROFESSIONALS: CreativeProfessional[] = [
  {
    id: 'cr-prof-1',
    name: 'Suhani Verma',
    role: 'UGC Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    location: 'Mumbai, Maharashtra',
    startingPrice: 1500,
    rating: 4.9,
    reviewsCount: 38,
    turnaroundDays: 2,
    skills: ['Authentic Testimonials', 'Problem-Solution Hooks', 'ASMR Unboxing', 'Spanish & English'],
    bio: 'Professional UGC video creator specializing in high converting Meta & TikTok ads for beauty, wellness & DTC brands. No large following needed—just pure organic conversion power.',
    portfolio: [
      { title: 'Vitamin C Serum Real Reaction', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80', type: 'video' },
      { title: 'Pain Relief Neck Pillow Hook', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80', type: 'video' }
    ]
  },
  {
    id: 'cr-prof-2',
    name: 'Rohan Deshmukh',
    role: 'Video Editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    location: 'Pune, Maharashtra',
    startingPrice: 1200,
    rating: 5.0,
    reviewsCount: 54,
    turnaroundDays: 1,
    skills: ['Alex Hormozi Captions', 'Sound Design & SFX', 'B-Roll Sourcing', 'Color Grading'],
    bio: 'Snappy short-form video editor for YouTube Shorts, Reels and TikTok. Scaled creator channels from zero to 500k+ views with retention-optimized pacing.',
    portfolio: [
      { title: 'Fintech Reel Fast Pacing Edit', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80', type: 'video' }
    ]
  },
  {
    id: 'cr-prof-3',
    name: 'Vikramaditya Roy',
    role: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    location: 'Bengaluru, Karnataka',
    startingPrice: 3500,
    rating: 4.9,
    reviewsCount: 42,
    turnaroundDays: 3,
    skills: ['E-Commerce Product Stills', 'Studio Lighting', 'Food Photography', 'Fashion Editorial'],
    bio: 'Commercial product and fashion photographer with a private 1,200 sq ft natural light studio in Indiranagar, Bengaluru. Deliver web-ready, high-resolution catalog imagery.',
    portfolio: [
      { title: 'Artisanal Coffee Packaging Stills', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80', type: 'image' }
    ]
  },
  {
    id: 'cr-prof-4',
    name: 'Natasha Dsouza',
    role: 'Copywriter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    location: 'Goa',
    startingPrice: 1000,
    rating: 4.8,
    reviewsCount: 29,
    turnaroundDays: 2,
    skills: ['Reel Hook Scripts', 'High-Converting Ad Copy', 'Landing Page Headlines', 'Email Newsletters'],
    bio: 'Direct response copywriter who writes video scripts that stop the scroll within 2 seconds. Worked with 20+ DTC brands in India & North America.',
    portfolio: [
      { title: '10 High CTR Meta Ad Angles', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80', type: 'document' }
    ]
  }
];

// AD INVENTORY LISTINGS
export const AD_INVENTORY: AdInventoryItem[] = [
  {
    id: 'inv-1',
    creatorId: 'user-creator-1',
    creatorName: 'Ananya Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    platform: 'Instagram',
    format: 'Prime Sunday Evening Story Slot (3x Frames + Link)',
    price: 1800,
    estimatedReach: 45000,
    datesAvailable: ['Dec 7, 2026', 'Dec 14, 2026', 'Dec 21, 2026'],
    slotsTotal: 3,
    slotsRemaining: 1,
    description: 'Our highest engagement story window on Sunday evening (7pm - 10pm IST) with swipe-up / sticker link for direct sales.'
  },
  {
    id: 'inv-2',
    creatorId: 'user-creator-2',
    creatorName: 'Rohit Verma',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    platform: 'YouTube',
    format: '60s Dedicated Mid-Roll Video Integration',
    price: 9000,
    estimatedReach: 85000,
    datesAvailable: ['Dec 10, 2026', 'Dec 22, 2026'],
    slotsTotal: 2,
    slotsRemaining: 1,
    description: 'Mid-roll sponsor integration during high-traffic upcoming Year-End Best Gadgets long-form video.'
  },
  {
    id: 'inv-3',
    creatorId: 'user-creator-7',
    creatorName: 'Neha Kapoor (FinSmart)',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    platform: 'Newsletter',
    format: 'Top Banner + 150-Word Feature in FinSmart Weekly',
    price: 4500,
    estimatedReach: 32000,
    datesAvailable: ['Dec 8, 2026', 'Dec 15, 2026', 'Dec 22, 2026'],
    slotsTotal: 3,
    slotsRemaining: 2,
    description: 'Header feature in email newsletter sent to 32,000+ verified retail investors and tech professionals (42% average open rate).'
  }
];

// SAMPLE ACTIVE COLLABORATION & DEAL ROOM
export const COLLABORATIONS: Collaboration[] = [
  {
    id: 'collab-101',
    campaignId: 'camp-1',
    campaignTitle: 'Spring Pastel Handloom Collection Launch',
    businessId: 'user-biz-1',
    businessName: 'Aroma Threads Boutique',
    businessAvatar: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    creatorId: 'user-creator-1',
    creatorName: 'Ananya Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    creatorHandle: '@ananya_style',
    agreedAmount: 3500,
    platformFee: 280,
    creatorPayout: 3220,
    status: 'reviewing_deliverables',
    escrowStatus: 'held',
    contractTerms: 'Creator agrees to deliver 1x 4K Instagram Reel featuring the Pastel Lilac Kurti set and 2x Instagram stories with the brand coupon link. Brand has 7 days for review. Standard 6-month digital advertising usage rights included.',
    createdAt: '2026-11-05T12:00:00Z',
    deadline: '2026-12-05T18:00:00Z',
    lastUpdated: '2026-11-12T16:30:00Z',
    businessReviewed: false,
    creatorReviewed: false,
    deliverables: [
      {
        id: 'del-1',
        title: 'Pastel Lilac Kurti Styling 4K Reel',
        format: 'Instagram Reel (45s)',
        status: 'submitted',
        submissionUrl: 'https://drive.google.com/file/d/demo-reel-colab/view',
        previewUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
        submittedAt: '2026-11-12T16:20:00Z',
        feedback: 'Looks amazing! We love the natural lighting. Could we please ensure the coupon code AROMA20 is shown in the first 5 seconds text overlay?'
      },
      {
        id: 'del-2',
        title: '2x Story Swipe/Link Sequence',
        format: 'Instagram Story Set',
        status: 'pending'
      }
    ]
  },
  {
    id: 'collab-102',
    campaignId: 'camp-2',
    campaignTitle: 'Morning Energy Shake Routine — 100% Plant Protein',
    businessId: 'user-biz-2',
    businessName: 'NutriBlend Superfoods',
    businessAvatar: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    creatorId: 'user-creator-4',
    creatorName: 'Kabir Fitness',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    creatorHandle: '@kabir_lifts',
    agreedAmount: 5000,
    platformFee: 400,
    creatorPayout: 4600,
    status: 'in_progress',
    escrowStatus: 'held',
    contractTerms: 'Creator will test chocolate plant protein powder and record a morning pre-workout shake preparation highlighting taste, solubility and ingredient quality.',
    createdAt: '2026-11-08T09:00:00Z',
    deadline: '2026-12-10T18:00:00Z',
    lastUpdated: '2026-11-09T11:00:00Z',
    businessReviewed: false,
    creatorReviewed: false,
    deliverables: [
      {
        id: 'del-fit-1',
        title: 'Morning Smoothie Recipe Reel',
        format: 'Instagram Reel (45s)',
        status: 'pending'
      }
    ]
  },
  {
    id: 'collab-103',
    campaignId: 'camp-3',
    campaignTitle: 'Invisible Zinc Matte Gel Sunscreen SPF 50+',
    businessId: 'user-biz-3',
    businessName: 'UrbanGlow Skincare',
    businessAvatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    creatorId: 'user-creator-5',
    creatorName: 'Dr. Tanya Sen',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    creatorHandle: '@tanya_skindoc',
    agreedAmount: 5000,
    platformFee: 400,
    creatorPayout: 4600,
    status: 'settled',
    escrowStatus: 'released',
    contractTerms: 'Doctor formulation breakdown reel showcasing mineral filter safety and cosmetic elegance.',
    createdAt: '2026-10-10T10:00:00Z',
    deadline: '2026-10-25T18:00:00Z',
    lastUpdated: '2026-10-28T14:00:00Z',
    businessReviewed: true,
    creatorReviewed: true,
    deliverables: [
      {
        id: 'del-sun-1',
        title: 'UV Camera & White Cast Test Reel',
        format: 'Instagram Reel',
        status: 'approved',
        submittedAt: '2026-10-22T10:00:00Z',
        submissionUrl: 'https://instagram.com/reel/demo123'
      }
    ]
  }
];

// REVIEWS & TESTIMONIALS
export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    collaborationId: 'collab-103',
    reviewerId: 'user-biz-3',
    reviewerName: 'UrbanGlow Skincare',
    reviewerRole: 'business',
    targetId: 'user-creator-5',
    targetName: 'Dr. Tanya Sen',
    rating: 5,
    communication: 5,
    contentQuality: 5,
    timeliness: 5,
    compliance: 5,
    comment: 'Dr. Tanya delivered an exceptionally informative, scientifically accurate reel that drove over 1,200 orders for our new sunscreen in the first 48 hours. Communication was stellar and turnaround was ahead of schedule!',
    createdAt: '2026-10-28T15:00:00Z',
    verifiedCollaboration: true
  },
  {
    id: 'rev-2',
    collaborationId: 'collab-103',
    reviewerId: 'user-creator-5',
    reviewerName: 'Dr. Tanya Sen',
    reviewerRole: 'creator',
    targetId: 'user-biz-3',
    targetName: 'UrbanGlow Skincare',
    rating: 5,
    communication: 5,
    contentQuality: 5,
    timeliness: 5,
    compliance: 5,
    comment: 'UrbanGlow provided a clear, flexible brief with complete lab certificates upfront. Escrow payment was released the same hour content was approved. Highly recommend collaborating with them!',
    createdAt: '2026-10-28T16:30:00Z',
    verifiedCollaboration: true
  },
  {
    id: 'rev-3',
    collaborationId: 'collab-prior-1',
    reviewerId: 'user-biz-1',
    reviewerName: 'Aroma Threads Boutique',
    reviewerRole: 'business',
    targetId: 'user-creator-20',
    targetName: 'Nisha Bano',
    rating: 5,
    communication: 5,
    contentQuality: 5,
    timeliness: 5,
    compliance: 5,
    comment: 'We did a ₹1,000 reel with Nisha and were blown away! She generated 40+ customer DMs for our boutique on a very modest budget. Proves that hyper-local creators are incredible value for small shops.',
    createdAt: '2026-10-18T11:00:00Z',
    verifiedCollaboration: true
  }
];

// TRANSACTIONS & ESCROW HISTORY
export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-8901',
    collaborationId: 'collab-101',
    campaignTitle: 'Spring Pastel Handloom Collection Launch',
    payerId: 'user-biz-1',
    payerName: 'Aroma Threads Boutique',
    payeeId: 'user-creator-1',
    payeeName: 'Ananya Sharma',
    amount: 3500,
    platformFee: 280,
    netAmount: 3220,
    type: 'escrow_deposit',
    status: 'held_in_escrow',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2026-11-0089',
    createdAt: '2026-11-05T12:05:00Z'
  },
  {
    id: 'tx-8902',
    collaborationId: 'collab-102',
    campaignTitle: 'Morning Energy Shake Routine — 100% Plant Protein',
    payerId: 'user-biz-2',
    payerName: 'NutriBlend Superfoods',
    payeeId: 'user-creator-4',
    payeeName: 'Kabir Fitness',
    amount: 5000,
    platformFee: 400,
    netAmount: 4600,
    type: 'escrow_deposit',
    status: 'held_in_escrow',
    paymentMethod: 'Credit Card',
    invoiceNumber: 'INV-2026-11-0090',
    createdAt: '2026-11-08T09:15:00Z'
  },
  {
    id: 'tx-8850',
    collaborationId: 'collab-103',
    campaignTitle: 'Invisible Zinc Matte Gel Sunscreen SPF 50+',
    payerId: 'user-biz-3',
    payerName: 'UrbanGlow Skincare',
    payeeId: 'user-creator-5',
    payeeName: 'Dr. Tanya Sen',
    amount: 5000,
    platformFee: 400,
    netAmount: 4600,
    type: 'creator_payout',
    status: 'completed',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2026-10-0044',
    createdAt: '2026-10-28T14:15:00Z'
  }
];
