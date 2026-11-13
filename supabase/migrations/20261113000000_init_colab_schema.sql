-- ====================================================================
-- co-lab: Production Multi-Vendor Creator Economy & Advertising Marketplace
-- Database Schema Migration
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum Types
CREATE TYPE user_role_enum AS ENUM ('creator', 'business', 'agency', 'organiser', 'sponsor', 'admin');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'active', 'in_progress', 'completed', 'paused', 'cancelled');
CREATE TYPE application_status_enum AS ENUM ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE collaboration_status_enum AS ENUM ('agreement_pending', 'escrow_funded', 'in_progress', 'reviewing_deliverables', 'revision_needed', 'approved', 'settled', 'completed', 'disputed');
CREATE TYPE deliverable_status_enum AS ENUM ('pending', 'submitted', 'revision_requested', 'approved');
CREATE TYPE transaction_status_enum AS ENUM ('held_in_escrow', 'completed', 'processing', 'refunded');

-- 1. PROFILES & USER AUTH
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'creator',
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    location_city TEXT,
    location_state TEXT,
    location_country TEXT DEFAULT 'India',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CREATOR PROFILES & SPECS
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    handle TEXT UNIQUE NOT NULL,
    cover_image_url TEXT,
    primary_category TEXT NOT NULL,
    subcategories TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    experience_years INT DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    completed_deals INT DEFAULT 0,
    min_service_price NUMERIC(10, 2) DEFAULT 1000.00,
    is_available BOOLEAN DEFAULT TRUE,
    audience_demographics JSONB DEFAULT '{"topAge": "18-24", "genderRatio": {"male": 52, "female": 48}, "topLocations": ["Mumbai", "Bengaluru", "Delhi"]}'::jsonb,
    badges TEXT[] DEFAULT '{"Rising Star", "Verified Reach"}'
);

-- 3. CREATOR SOCIAL ACCOUNTS
CREATE TABLE creator_social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    profile_url TEXT NOT NULL,
    followers_count INT DEFAULT 0,
    engagement_rate NUMERIC(5, 2) DEFAULT 0.00,
    avg_views INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATOR SERVICES & RATE CARDS
CREATE TABLE creator_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    format TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    delivery_days INT DEFAULT 5,
    revisions_allowed INT DEFAULT 2,
    deliverables TEXT[] DEFAULT '{}',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. CREATOR PORTFOLIO ITEMS
CREATE TABLE creator_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    platform TEXT NOT NULL,
    brand_collaborated TEXT,
    impressions_count INT,
    engagement_rate NUMERIC(5, 2)
);

-- 6. BUSINESS PROFILES
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    website_url TEXT,
    gstin TEXT,
    team_size TEXT,
    active_campaigns_count INT DEFAULT 0,
    total_spend NUMERIC(12, 2) DEFAULT 0.00,
    cover_image_url TEXT,
    verification_documents JSONB DEFAULT '[]'::jsonb
);

-- 7. AGENCY PROFILES & CLIENT ASSOCIATIONS
CREATE TABLE agency_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    agency_name TEXT NOT NULL,
    specialization TEXT,
    client_count INT DEFAULT 0,
    managed_spend NUMERIC(12, 2) DEFAULT 0.00
);

CREATE TABLE agency_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agency_profiles(id) ON DELETE CASCADE,
    client_business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. OPEN CAMPAIGNS
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_url TEXT,
    objectives TEXT[] DEFAULT '{}',
    target_locations TEXT[] DEFAULT '{}',
    target_age_range TEXT DEFAULT '18-35',
    target_gender TEXT DEFAULT 'All',
    target_languages TEXT[] DEFAULT '{"English", "Hindi"}',
    platform TEXT NOT NULL,
    content_format TEXT NOT NULL,
    quantity INT DEFAULT 1,
    store_visit_required BOOLEAN DEFAULT FALSE,
    licensing_terms TEXT DEFAULT 'Standard 6-month digital usage',
    budget_type TEXT DEFAULT 'fixed',
    budget_min NUMERIC(10, 2) DEFAULT 1000.00,
    budget_max NUMERIC(10, 2) DEFAULT 10000.00,
    total_budget NUMERIC(12, 2) NOT NULL,
    barter_product_value NUMERIC(10, 2) DEFAULT 0.00,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    slots_available INT DEFAULT 5,
    min_followers INT DEFAULT 5000,
    custom_questions TEXT[] DEFAULT '{}',
    status campaign_status_enum DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CAMPAIGN APPLICATIONS
CREATE TABLE campaign_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    proposed_rate NUMERIC(10, 2) NOT NULL,
    delivery_days INT DEFAULT 7,
    pitch TEXT NOT NULL,
    portfolio_links TEXT[] DEFAULT '{}',
    answers JSONB DEFAULT '[]'::jsonb,
    status application_status_enum DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_creator_campaign UNIQUE (campaign_id, creator_id)
);

-- 10. COLLABORATIONS & DEAL ROOMS
CREATE TABLE collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    agreed_amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    creator_payout NUMERIC(10, 2) NOT NULL,
    status collaboration_status_enum DEFAULT 'agreement_pending',
    escrow_status TEXT DEFAULT 'unfunded',
    contract_terms TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    business_reviewed BOOLEAN DEFAULT FALSE,
    creator_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. DELIVERABLES
CREATE TABLE collaboration_deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collaboration_id UUID REFERENCES collaborations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    format TEXT NOT NULL,
    status deliverable_status_enum DEFAULT 'pending',
    submission_url TEXT,
    preview_url TEXT,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- 12. SPONSORSHIP OPPORTUNITIES
CREATE TABLE sponsorship_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organiser_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_footfall INT DEFAULT 1000,
    target_audience TEXT NOT NULL,
    image_url TEXT,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    packages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. CREATIVE PROFESSIONALS (UGC / PRODUCTION)
CREATE TABLE creative_professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    starting_price NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    turnaround_days INT DEFAULT 3,
    skills TEXT[] DEFAULT '{}',
    bio TEXT NOT NULL,
    portfolio JSONB DEFAULT '[]'::jsonb
);

-- 14. AD SPACE INVENTORY
CREATE TABLE ad_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    format TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    estimated_reach INT NOT NULL,
    dates_available TEXT[] DEFAULT '{}',
    slots_total INT DEFAULT 1,
    slots_remaining INT DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 15. MESSAGES & CONVERSATIONS
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_ids UUID[] NOT NULL,
    collaboration_id UUID REFERENCES collaborations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    attachment_url TEXT,
    attachment_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. REVIEWS & RATINGS (TWO-WAY VERIFIED)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collaboration_id UUID REFERENCES collaborations(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
    quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating INT CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    compliance_rating INT CHECK (compliance_rating >= 1 AND compliance_rating <= 5),
    comment TEXT NOT NULL,
    verified_collaboration BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. TRANSACTIONS & ESCROW
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collaboration_id UUID REFERENCES collaborations(id) ON DELETE SET NULL,
    payer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    payee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    net_amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL,
    status transaction_status_enum DEFAULT 'held_in_escrow',
    payment_method TEXT DEFAULT 'UPI',
    invoice_number TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. PLATFORM SETTINGS
CREATE TABLE platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 19. SPONSOR REQUIREMENT RFPS
CREATE TABLE sponsor_rfps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    brand_logo TEXT,
    industry TEXT NOT NULL,
    title TEXT NOT NULL,
    target_event_types TEXT[] NOT NULL DEFAULT '{}',
    budget_max NUMERIC(12, 2) NOT NULL,
    min_footfall INT DEFAULT 1000,
    required_perks TEXT[] NOT NULL DEFAULT '{}',
    target_cities TEXT[] NOT NULL DEFAULT '{}',
    brief TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    proposals_received INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. HYPERLOCAL ADVERTISING CHANNELS
CREATE TABLE local_ad_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    type TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    audience_reach INT NOT NULL,
    followers_count INT NOT NULL,
    price_per_slot NUMERIC(10, 2) NOT NULL,
    slot_format TEXT NOT NULL,
    engagement_rate NUMERIC(4, 2) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    category TEXT NOT NULL
);

-- 21. CREATOR COLLECTIVES
CREATE TABLE creator_collectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    region TEXT NOT NULL,
    category TEXT NOT NULL,
    creator_count INT NOT NULL,
    combined_reach INT NOT NULL,
    package_price NUMERIC(12, 2) NOT NULL,
    package_deliverables TEXT[] NOT NULL DEFAULT '{}',
    creators JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 22. AFFILIATE PROGRAMS & PERFORMANCE LINKS
CREATE TABLE affiliate_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_price NUMERIC(10, 2) NOT NULL,
    commission_type TEXT NOT NULL DEFAULT 'percentage',
    commission_rate NUMERIC(5, 2) NOT NULL,
    cookie_days INT DEFAULT 30,
    active_creators INT DEFAULT 0,
    category TEXT NOT NULL
);

CREATE TABLE creator_affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES affiliate_programs(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tracking_url TEXT UNIQUE NOT NULL,
    coupon_code TEXT UNIQUE NOT NULL,
    clicks INT DEFAULT 0,
    orders INT DEFAULT 0,
    revenue_generated NUMERIC(12, 2) DEFAULT 0.00,
    commission_earned NUMERIC(12, 2) DEFAULT 0.00
);

-- 23. CREATOR BOOKING SLOTS
CREATE TABLE booking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    service_type TEXT NOT NULL,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    booked_by UUID REFERENCES profiles(id)
);

-- 24. PERFORMANCE ATTRIBUTIONS & TRACKING
CREATE TABLE performance_attributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tracking_url TEXT NOT NULL,
    coupon_code TEXT NOT NULL,
    qr_code_url TEXT,
    verified_views INT DEFAULT 0,
    creator_reported_views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    enquiries INT DEFAULT 0,
    conversions INT DEFAULT 0,
    attributed_sales_inr NUMERIC(12, 2) DEFAULT 0.00,
    cpl_inr NUMERIC(10, 2) DEFAULT 0.00,
    roi_multiple NUMERIC(5, 2) DEFAULT 0.00
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owners can update
CREATE POLICY "Public profiles are readable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Creator & Business profiles: Public read
CREATE POLICY "Creator profiles are public" ON creator_profiles FOR SELECT USING (true);
CREATE POLICY "Business profiles are public" ON business_profiles FOR SELECT USING (true);

-- Campaigns: Active campaigns readable by all, creators/businesses manage accordingly
CREATE POLICY "Active campaigns are readable by all" ON campaigns FOR SELECT USING (status = 'active' OR auth.uid() = business_id);
CREATE POLICY "Businesses can manage own campaigns" ON campaigns FOR ALL USING (auth.uid() = business_id);

-- Applications: Creator sees their own, Campaign owner sees all for their campaign
CREATE POLICY "Creators see their own applications" ON campaign_applications FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Businesses see applications for their campaigns" ON campaign_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_applications.campaign_id AND campaigns.business_id = auth.uid())
);

-- Collaborations: Only participants (creator and business) or admins can view
CREATE POLICY "Participants can view collaboration" ON collaborations FOR SELECT USING (
    auth.uid() = creator_id OR auth.uid() = business_id
);

-- Messages: Only conversation participants can view and insert
CREATE POLICY "Participants can access messages" ON messages FOR ALL USING (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND auth.uid() = ANY(conversations.participant_ids))
);

-- Indexes for high-performance querying
CREATE INDEX idx_campaigns_category ON campaigns(category);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_creator_category ON creator_profiles(primary_category);
CREATE INDEX idx_creator_rating ON creator_profiles(rating DESC);
CREATE INDEX idx_collab_creator ON collaborations(creator_id);
CREATE INDEX idx_collab_business ON collaborations(business_id);
CREATE INDEX idx_transactions_status ON transactions(status);

