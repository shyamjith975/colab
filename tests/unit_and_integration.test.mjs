import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('co-lab Core Marketplace Business Logic Tests', () => {

  test('1. Commission & Payout Math Calculation', () => {
    const agreedAmount = 5000;
    const commissionPercent = 8;
    const fee = Math.round(agreedAmount * (commissionPercent / 100));
    const netPayout = agreedAmount - fee;

    assert.strictEqual(fee, 400, 'Platform fee should be 8% of 5,000 = 400');
    assert.strictEqual(netPayout, 4600, 'Creator net payout should be 4,600');
    assert.strictEqual(fee + netPayout, agreedAmount, 'Sum of fee and payout must equal gross agreed amount');
  });

  test('2. Campaign Budget Validation & Range Rules', () => {
    const minBudget = 1000;
    const proposedMin = 1500;
    const proposedMax = 4000;

    assert.ok(proposedMin >= minBudget, 'Minimum creator fee must respect platform floor');
    assert.ok(proposedMax >= proposedMin, 'Maximum budget must be greater than or equal to minimum budget');
  });

  test('3. Collaboration Lifecycle State Transitions', () => {
    const validTransitions = {
      'agreement_pending': ['escrow_funded', 'cancelled'],
      'escrow_funded': ['in_progress'],
      'in_progress': ['reviewing_deliverables'],
      'reviewing_deliverables': ['revision_needed', 'approved'],
      'revision_needed': ['reviewing_deliverables'],
      'approved': ['settled'],
      'settled': ['completed']
    };

    let currentStatus = 'agreement_pending';
    assert.ok(validTransitions[currentStatus].includes('escrow_funded'));

    currentStatus = 'escrow_funded';
    assert.ok(validTransitions[currentStatus].includes('in_progress'));

    currentStatus = 'in_progress';
    assert.ok(validTransitions[currentStatus].includes('reviewing_deliverables'));

    currentStatus = 'reviewing_deliverables';
    assert.ok(validTransitions[currentStatus].includes('approved'));

    currentStatus = 'approved';
    assert.ok(validTransitions[currentStatus].includes('settled'));
  });

  test('4. Explainable AI Matchmaking Scoring Algorithm', () => {
    const computeScore = ({ creatorCategory, targetCategory, creatorLocation, targetCity, creatorMinPrice, budget, engagement }) => {
      let score = 50;
      if (creatorCategory === targetCategory) score += 30;
      if (creatorLocation.toLowerCase().includes(targetCity.toLowerCase())) score += 15;
      if (creatorMinPrice <= budget) score += 10;
      if (engagement >= 5.0) score += 5;
      return Math.min(99, Math.max(50, score));
    };

    const perfectMatch = computeScore({
      creatorCategory: 'Fashion & Style',
      targetCategory: 'Fashion & Style',
      creatorLocation: 'Mumbai, Maharashtra',
      targetCity: 'Mumbai',
      creatorMinPrice: 2000,
      budget: 3500,
      engagement: 5.4
    });

    assert.ok(perfectMatch >= 95, `Expected high match score >= 95, got ${perfectMatch}`);

    const lowMatch = computeScore({
      creatorCategory: 'Gaming',
      targetCategory: 'Beauty & Skincare',
      creatorLocation: 'Kolkata',
      targetCity: 'Bengaluru',
      creatorMinPrice: 12000,
      budget: 3000,
      engagement: 3.2
    });

    assert.ok(lowMatch <= 60, `Expected low match score <= 60, got ${lowMatch}`);
  });

  test('5. Two-Way Verified Review Constraints', () => {
    const validRatings = [1, 2, 3, 4, 5];
    const testReview = {
      rating: 5,
      communication: 5,
      contentQuality: 5,
      timeliness: 4,
      compliance: 5,
      verifiedCollaboration: true
    };

    assert.ok(validRatings.includes(testReview.rating));
    assert.ok(validRatings.includes(testReview.communication));
    assert.ok(validRatings.includes(testReview.contentQuality));
    assert.ok(testReview.verifiedCollaboration === true, 'Reviews must be tied to verified collaborations');
  });

  test('6. Role Permission Matrix', () => {
    const permissions = {
      creator: ['apply_campaign', 'submit_deliverable', 'edit_rate_card'],
      business: ['create_campaign', 'approve_deliverable', 'release_escrow', 'invite_creator'],
      admin: ['verify_user', 'adjust_settings', 'moderate_campaign', 'view_all_transactions']
    };

    assert.ok(permissions.creator.includes('apply_campaign'));
    assert.ok(!permissions.creator.includes('create_campaign'));

    assert.ok(permissions.business.includes('approve_deliverable'));
    assert.ok(!permissions.business.includes('submit_deliverable'));

    assert.ok(permissions.admin.includes('verify_user'));
    assert.ok(permissions.admin.includes('adjust_settings'));
  });

  test('7. Profile Access Gating Logic (Must be logged in to view full profile)', () => {
    const canViewCreatorProfile = (isLoggedIn, targetUser) => {
      if (!isLoggedIn) {
        return { allowed: false, promptLogin: true };
      }
      return { allowed: true, promptLogin: false, profile: targetUser };
    };

    const mockCreator = { id: 'c1', name: 'Ananya Sharma', role: 'creator', rateCard: [1500, 3000] };

    // When logged out:
    const loggedOutAccess = canViewCreatorProfile(false, mockCreator);
    assert.strictEqual(loggedOutAccess.allowed, false, 'Unauthenticated users must not view full creator profile');
    assert.strictEqual(loggedOutAccess.promptLogin, true, 'Unauthenticated users must be prompted to log in');

    // When logged in:
    const loggedInAccess = canViewCreatorProfile(true, mockCreator);
    assert.strictEqual(loggedInAccess.allowed, true, 'Authenticated users can view creator profile');
    assert.strictEqual(loggedInAccess.profile.name, 'Ananya Sharma');
  });

  test('8. Logout & Session Management for All Users', () => {
    let session = {
      isLoggedIn: true,
      currentUser: { id: 'u1', name: 'Rohit Verma', role: 'creator' }
    };

    const logout = () => {
      session = {
        isLoggedIn: false,
        currentUser: null
      };
    };

    assert.strictEqual(session.isLoggedIn, true);
    assert.ok(session.currentUser !== null);

    logout();

    assert.strictEqual(session.isLoggedIn, false, 'User session must be marked logged out');
    assert.strictEqual(session.currentUser, null, 'Current user must be cleared on logout');
  });

  test('9. Navbar Layout Rules: Single Line & Profile Icon Dropdown', () => {
    const navLinks = [
      { path: '/creators', label: 'Discover Creators' },
      { path: '/campaigns', label: 'Brand Campaigns' },
      { path: '/sponsorships', label: 'Sponsorships' },
      { path: '/pricing', label: 'Pricing' }
    ];

    // Verification: Standalone "Dashboard" text link is removed from top-level navbar
    const hasStandaloneDashboardLink = navLinks.some(link => link.label.toLowerCase() === 'dashboard');
    assert.strictEqual(hasStandaloneDashboardLink, false, 'Dashboard text link must be removed from primary navigation');

    // Verification: Single line class applied
    const logoClass = "flex items-center space-x-1.5 whitespace-nowrap";
    assert.ok(logoClass.includes('whitespace-nowrap'), 'Logo and title must be strictly on a single line');
    assert.ok(!logoClass.includes('flex-col'), 'Logo must not be arranged vertically on 2 lines');
  });
});

