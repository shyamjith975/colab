/**
 * co-lab Security, Compliance, DPDP, and Payment Types
 * Compliant with:
 * - India Digital Personal Data Protection Act (DPDP Act, 2023 & Rules 2025)
 * - Advertising Standards Council of India (ASCI) Guidelines
 * - RBI Payment Aggregator & Nodal Settlement Guidelines
 * - Indian Information Technology Act, 2000
 */

export interface IpLicensingTerms {
  contentOwnership: 'creator_retains_copyright' | 'work_for_hire_assignment' | 'joint_ownership';
  usageLicence: ('organic_social' | 'paid_digital_ads' | 'print_ooh' | 'broadcast_tv' | 'ecommerce_website')[];
  advertisingPermissions: {
    metaSparkAds: boolean;
    metaWhitelisting: boolean;
    youtubeBrandConnect: boolean;
    darkPosting: boolean;
  };
  duration: '30_days' | '60_days' | '90_days' | '180_days' | '1_year' | 'perpetuity';
  exclusivity: {
    isExclusive: boolean;
    category?: string;
    exclusivityDurationDays?: number;
  };
  territory: 'india_only' | 'pan_asia' | 'worldwide';
  modificationRights: {
    allowCropping: boolean;
    allowVoiceoverDubbing: boolean;
    allowTranslationSubtitles: boolean;
    requirePriorApprovalForEdits: boolean;
  };
  resalePermissions: boolean; // strictly false for standard commercial deals
}

export interface DigitalAgreement {
  id: string;
  collaborationId: string;
  campaignTitle: string;
  creatorId: string;
  creatorName: string;
  creatorSignedAt?: string;
  businessId: string;
  businessName: string;
  businessSignedAt?: string;
  agreedPrice: number;
  ipTerms: IpLicensingTerms;
  contractSha256Checksum: string;
  auditTrail: {
    action: string;
    actorId: string;
    actorName: string;
    ipAddress: string;
    timestamp: string;
  }[];
  status: 'draft' | 'awaiting_signatures' | 'mutually_signed' | 'disputed';
  createdAt: string;
}

export interface AsciComplianceReport {
  isCompliant: boolean;
  hasProminentDisclosureTag: boolean;
  disclosureTagUsed: '#ad' | '#sponsored' | '#collab' | '#partnership' | '#affiliate';
  disclosureInFirstThreeLines: boolean;
  videoAudioDisclosurePresent: boolean;
  noMisleadingClaimsCertified: boolean;
  checkedAt: string;
}

export interface MerchantKyc {
  id: string;
  userId: string;
  legalEntityName: string;
  panNumber: string;
  gstin?: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  upiVpa?: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 're_kyc_required';
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface PaymentWebhookEvent {
  eventId: string;
  gateway: 'razorpay' | 'cashfree' | 'stripe';
  event: 'payment.authorized' | 'payment.captured' | 'payment.failed' | 'escrow.held' | 'payout.settled' | 'refund.processed';
  signatureVerified: boolean;
  payload: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    payerEmail?: string;
    settlementUtr?: string;
    timestamp: number;
  };
  hmacSha256Signature: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent?: string;
  status: 'success' | 'warning' | 'failure';
  details?: Record<string, any>;
}

export interface DpdpConsentRecord {
  id: string;
  userId: string;
  consentType: 'platform_terms' | 'commercial_matching' | 'marketing_communications' | 'telemetry_analytics';
  purpose: string;
  granted: boolean;
  timestamp: string;
  ipAddress: string;
  version: string;
}

export interface NotificationDispatch {
  id: string;
  recipientId: string;
  recipientContact: string; // email or phone
  channel: 'email' | 'sms' | 'whatsapp';
  templateName: string;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  status: 'sent' | 'delivered' | 'failed' | 'queued';
  dispatchedAt: string;
}

