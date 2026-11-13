# co-lab — Multi-Vendor Creator Economy & Advertising Marketplace

> **"Every Creator Deserves an Opportunity. Every Business Deserves an Audience."**

**co-lab** is a production-ready, cross-platform commercial collaboration platform connecting:
- Content creators & influencers
- Small and medium businesses (MSMEs, boutiques, local shops, cafes)
- National and global DTC brands
- Digital marketing and talent management agencies
- College festival, tournament, and conference event organisers
- Sponsors and advertisers
- Creative production professionals (video editors, UGC creators, photographers, copywriters)
- Podcast hosts, YouTubers, newsletter publishers, and media inventory owners

---

## 1. Key Highlights & Core Products

`co-lab` unifies commercial operations across three primary interconnected marketplaces sharing one database, authentication system, escrow settlement flow, and administrative governance:

### A. Creator Marketplace
- **Discover Paid Opportunities**: Browse and apply for open advertising campaigns, barter collaborations, and product reviews.
- **Media Kit & Rate Cards**: Transparent packages for Instagram Reels, Stories, YouTube Integrations, and Dedicated Videos with delivery turnaround and revision terms.
- **Audience Telemetry**: Verified demographics (age cohorts, gender distribution, top geographic cities, and authentic engagement rates).

### B. Business Promotion Marketplace
- **6-Step Campaign Wizard**: Seamlessly publish open briefs specifying objectives, target audience demographics, deliverable formats, budget allocation, licensing terms, and custom screening questions.
- **Hyper-Local Collaboration**: Designed so small boutiques can hire local fashion creators for ₹1,000, cafes can invite food vloggers, and startups can book brand ambassadors without high agency minimums.
- **Deal Room & Milestone Escrow**: Funds are locked in escrow upon proposal acceptance; draft previews are submitted for brand review; revisions are requested seamlessly; and payouts settle upon approval.

### C. Sponsorship & Partnership Marketplace
- **College Festivals & Mega Events**: Sponsorship listing decks for events like Asia's largest cultural fests (140,000+ footfall), national FinTech summits, coastal music festivals, and inter-university cricket leagues.
- **Sponsorship Packages**: Transparent tiering (Title Sponsor, Presenting Sponsor, Gold Sponsor, Product Partner, Custom).
- **Digital Media Placements**: Sponsor podcast seasons, YouTube video series, and niche investor newsletters.

### D. Additional Specialized Marketplaces
- **UGC & Creative Professional Marketplace**: Hire video editors, UGC ad creators, product photographers, and direct-response copywriters evaluated purely on portfolio quality and fast turnaround (1–3 days) without follower thresholds.
- **Ad Space & Inventory Marketplace**: Reserve guaranteed ad inventory (e.g., prime Sunday evening Instagram story slots, mid-roll video features, newsletter header banners) with real-time calendar booking.
- **AI-Powered Suite**: Explainable AI Matchmaker (scores creators on niche synergy, audience fit, location proximity, and budget suitability), Natural Language Campaign Brief Builder, and Influencer Fair Rate Calculator.

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6.
- **State & Data Architecture**: Persistent Context API with LocalStorage synchronization, Supabase SDK integration architecture, and TanStack Query state patterns.
- **Backend & Database**: PostgreSQL relational database schema with Row Level Security (RLS) policies, UUID primary keys, and comprehensive indexes (`supabase/migrations/20261113000000_init_colab_schema.sql`).
- **REST API & Specification**: Versioned `/api/v1/` REST endpoints and OpenAPI 3.0 specification (`src/api/openapi.json`).
- **Mobile & Progressive Web App**: PWA Manifest (`public/manifest.json`), service worker ready, and native packaging ready via Capacitor (`capacitor.config.json`).
- **Testing**: Built-in test suite (`tests/unit_and_integration.test.mjs`) covering math calculations, state transitions, permissions, and AI algorithms.

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js v18+ (tested on Node v22.19.0)
- npm or pnpm

### Quick Setup

```bash
# 1. Clone or navigate to the repository
cd colab

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser:
# http://localhost:3000
```

### Production Build & Verification

```bash
# Run TypeScript compilation and Vite production bundle
npm run build

# Run automated unit and integration tests
npm test
```

---

## 4. Database Setup & SQL Migrations

The full PostgreSQL migration file is located at:
`supabase/migrations/20261113000000_init_colab_schema.sql`

It creates the following schema:
1. `profiles`: User accounts, emails, roles, verification status.
2. `creator_profiles`: Bio, category, rating, audience demographics, rate card floor.
3. `creator_social_accounts`: Platform handles, followers, engagement rate, average views.
4. `creator_services`: Individual package offerings with deliverables and turnaround.
5. `creator_portfolio`: Past brand campaign links, impressions, reach.
6. `business_profiles`: Company details, GSTIN, team size, spend history.
7. `campaigns`: Open briefs, budget ranges, target audience, licensing rights.
8. `campaign_applications`: Pitches, proposed rates, custom screening answers.
9. `collaborations`: Active deal rooms, agreed payouts, escrow tracking.
10. `collaboration_deliverables`: Asset upload links, preview thumbnails, revision requests.
11. `sponsorship_opportunities`: Event details, audience footfall, package tiers.
12. `creative_professionals`: UGC creators, video editors, photographers, copywriters.
13. `ad_inventory`: Pre-scheduled ad slots and calendar availability.
14. `conversations` & `messages`: Live messaging and deal room communications.
15. `reviews`: Two-way verified ratings (communication, quality, timeliness, compliance).
16. `transactions`: Milestone escrow deposits, creator payouts, and invoices.
17. `platform_settings`: Dynamic commission %, minimum campaign budgets, and GST rates.

To apply this to your Supabase project:
```bash
# Using Supabase CLI
supabase db push
# Or copy and paste the SQL script into the Supabase SQL Editor.
```

---

## 5. API Endpoints Contract (`/api/v1/`)

The application includes an OpenAPI 3.0 specification in `src/api/openapi.json`. Core endpoints include:

- `POST /api/v1/auth/register` — User registration by role
- `POST /api/v1/auth/login` — Authentication & JWT issuance
- `GET /api/v1/creators` — Search and filter creators
- `GET /api/v1/creators/:id` — Full public creator media kit profile
- `GET /api/v1/campaigns` — Browse active advertising campaigns
- `POST /api/v1/campaigns` — Publish campaign (6-step wizard)
- `POST /api/v1/campaigns/:id/apply` — Creator application & pitch
- `GET /api/v1/collaborations/:id` — Live collaboration deal room
- `POST /api/v1/collaborations/:id/deliverables` — Submit draft preview asset
- `POST /api/v1/collaborations/:id/approve` — Approve deliverable
- `POST /api/v1/collaborations/:id/release-escrow` — Trigger creator payout
- `GET /api/v1/sponsorships` — Event sponsorship opportunities
- `GET /api/v1/admin/dashboard` — Platform overview, GMV & commission ledger

---

## 6. Mobile Application Packaging (Capacitor Android & iOS)

`co-lab` is prepared for native packaging on Android and iOS:

1. Build the web distribution:
   ```bash
   npm run build
   ```
2. Add Capacitor platforms:
   ```bash
   npx cap add android
   npx cap add ios
   ```
3. Sync web assets:
   ```bash
   npx cap sync
   ```
4. Open in native IDEs:
   ```bash
   npx cap open android # Opens Android Studio
   npx cap open ios     # Opens Xcode
   ```

---

## 7. Interactive Role Switcher in Demo Mode

For rapid testing and evaluation, the top announcement bar includes an **Instant Role Switcher**:
- Switch to **Creator View** (e.g. Ananya Sharma) to apply for campaigns, upload deliverables, and manage rate cards.
- Switch to **Brand / Business View** (e.g. Aroma Threads Boutique) to publish campaigns, accept applications, fund escrow, review draft assets, and release payouts.
- Switch to **Agency View** to manage multi-brand client rosters.
- Switch to **Event Organiser View** to list sponsorship packages.
- Switch to **Sponsor View** to submit sponsorship proposals.
- Switch to **Admin Control Panel** to verify users, moderate campaigns, and adjust platform commission percentages.

---

## 8. License

Proprietary — co-lab Inc. All rights reserved.
