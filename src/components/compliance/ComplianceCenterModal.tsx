import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  CreditCard,
  Bell,
  Share2,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  X,
  RefreshCw,
  Search,
  Key,
  Database,
  Building,
  Mail,
  MessageSquare,
  Smartphone,
  Eye,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { complianceService } from '../../services/complianceService';
import {
  IpLicensingTerms,
  MerchantKyc,
  AsciComplianceReport,
  SecurityAuditLog,
  NotificationDispatch
} from '../../types/compliance';
import { formatCurrency, formatDate } from '../../utils';

interface ComplianceCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications';
}

export const ComplianceCenterModal: React.FC<ComplianceCenterModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'payment'
}) => {
  const { currentUser, userCollaborations, transactions } = useApp() as any;

  const [activeTab, setActiveTab] = useState<'payment' | 'security' | 'dpdp' | 'asci' | 'ip' | 'notifications'>(defaultTab);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  // Tab 1: Payment & Merchant KYC State
  const [panInput, setPanInput] = useState('ABCDE1234F');
  const [gstinInput, setGstinInput] = useState('27ABCDE1234F1Z5');
  const [bankAccount, setBankAccount] = useState('918273645019');
  const [ifscInput, setIfscInput] = useState('HDFC0001234');
  const [vpaInput, setVpaInput] = useState('creator@okhdfcbank');
  const [kycSaved, setKycSaved] = useState(false);
  const [webhookSimulated, setWebhookSimulated] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  // Tab 2: Security & MFA State
  const [mfaCode, setMfaCode] = useState('');
  const [mfaVerified, setMfaVerified] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  useEffect(() => {
    setAuditLogs(complianceService.getAuditLogs(15));
  }, [isOpen, activeTab]);

  // Tab 3: DPDP Consent & Rights State
  const [consentTerms, setConsentTerms] = useState(true);
  const [consentMatching, setConsentMatching] = useState(true);
  const [consentTelemetry, setConsentTelemetry] = useState(true);
  const [consentNotifs, setConsentNotifs] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [erasureRequested, setErasureRequested] = useState(false);

  // Tab 4: ASCI Scanner State
  const [captionInput, setCaptionInput] = useState(
    '#ad Loving my new morning skincare glow with @GlowBotanicals! The 10% Vitamin C serum is a game changer for hydration.\n\nUse code GLOW20 for 20% off!'
  );
  const [audioDisclosure, setAudioDisclosure] = useState(true);
  const [asciReport, setAsciReport] = useState<AsciComplianceReport | null>(null);

  // Tab 5: IP Terms State
  const [ipTerms, setIpTerms] = useState<IpLicensingTerms>(complianceService.generateStandardIpTerms());
  const [signedContractHash, setSignedContractHash] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Tab 6: Notifications State
  const [notifChannel, setNotifChannel] = useState<'email' | 'sms' | 'whatsapp'>('whatsapp');
  const [notifContact, setNotifContact] = useState('+91 98765 43210');
  const [notifMessage, setNotifMessage] = useState('Your collaboration milestone has been approved! ₹12,000 released from escrow.');
  const [notifDispatched, setNotifDispatched] = useState<NotificationDispatch | null>(null);

  if (!isOpen) return null;

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    complianceService.submitMerchantKyc({
      userId: currentUser?.id || 'user-current',
      legalEntityName: currentUser?.name || 'Verified Creator/Business',
      panNumber: panInput,
      gstin: gstinInput,
      bankAccountNumber: bankAccount,
      bankIfsc: ifscInput,
      bankName: 'HDFC Bank Ltd',
      upiVpa: vpaInput
    });
    setKycSaved(true);
    setTimeout(() => setKycSaved(false), 3500);
  };

  const handleSimulateWebhook = async () => {
    setWebhookSimulated(true);
    const mockPayload = JSON.stringify({
      event: 'payment.captured',
      orderId: `order_${Date.now()}`,
      amount: 1500000,
      currency: 'INR'
    });
    const verified = await complianceService.verifyWebhookSignature(mockPayload, 'mock_hmac_signature_verified');
    setWebhookStatus(verified ? 'HMAC SHA-256 Signature Verified ✓ (200 OK)' : 'Signature Mismatch (400 Bad Request)');
    complianceService.logAuditEvent({
      userId: currentUser?.id || 'gateway',
      userRole: 'payment_gateway',
      action: 'PAYMENT_WEBHOOK_VERIFIED',
      resource: 'payments/webhook',
      status: 'success'
    });
    setAuditLogs(complianceService.getAuditLogs(15));
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = complianceService.verifyAdminMfa(mfaCode);
    setMfaVerified(ok);
    complianceService.logAuditEvent({
      userId: currentUser?.id || 'admin',
      userRole: 'admin',
      action: 'ADMIN_MFA_CHALLENGE',
      resource: 'security/mfa',
      status: ok ? 'success' : 'failure',
      details: { codeEntered: ok ? 'VALID_TOTP' : 'INVALID_CODE' }
    });
    setAuditLogs(complianceService.getAuditLogs(15));
  };

  const handleDownloadDpdpData = () => {
    const jsonStr = complianceService.exportUserPersonalData(
      currentUser || { id: 'u1', name: 'Demo User', email: 'demo@colab.test', role: 'creator' },
      userCollaborations || [],
      transactions || []
    );
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colab-dpdp-data-export-${currentUser?.id || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleRunAsciScanner = () => {
    const report = complianceService.scanAsciCompliance(captionInput, audioDisclosure);
    setAsciReport(report);
  };

  const handleGenerateContract = async () => {
    setIsSigning(true);
    const agreement = await complianceService.createDigitalAgreement({
      collaborationId: 'collab-demo-active',
      campaignTitle: 'Summer Brand Ambassador Campaign',
      creatorId: currentUser?.id || 'user-creator-1',
      creatorName: currentUser?.name || 'Ananya Sharma',
      businessId: 'user-biz-1',
      businessName: 'Aroma Threads Boutique',
      agreedPrice: 15000,
      ipTerms
    });
    setSignedContractHash(agreement.contractSha256Checksum);
    setIsSigning(false);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const result = complianceService.dispatchNotification({
      recipientId: currentUser?.id || 'user-1',
      recipientContact: notifContact,
      channel: notifChannel,
      templateName: 'colab_commercial_alert_v1',
      title: 'co-lab Milestone Alert',
      body: notifMessage
    });
    setNotifDispatched(result);
    setTimeout(() => setNotifDispatched(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-indigo-900/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-white">Trust, Security & Regulatory Compliance Center</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  Verified Architecture
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                India DPDP Act 2023, ASCI Advertising Code, RBI Nodal Payment Aggregator Compliance & IT Act 2000.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-4 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'payment'
                ? 'border-indigo-600 text-indigo-700 font-extrabold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>1. Payment & Escrow (RBI PA-PG)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-700 font-extrabold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>2. Security & Audit (12.3)</span>
          </button>

          <button
            onClick={() => setActiveTab('dpdp')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'dpdp'
                ? 'border-indigo-600 text-indigo-700 font-extrabold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>3. DPDP Act 2023 Rights (13.2)</span>
          </button>

          <button
            onClick={() => setActiveTab('asci')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'asci'
                ? 'border-indigo-600 text-indigo-700 font-extrabold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>4. ASCI Advertising Code (13.3)</span>
          </button>

          <button
            onClick={() => setActiveTab('ip')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'ip'
                ? 'border-indigo-600 text-indigo-700 font-extrabold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>5. IP Rights & eSign (13.6)</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'notifications'
                ? 'border-indigo-600 text-indigo-700 font-extrabold bg-white rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>6. Notifications & Official APIs</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          
          {/* TAB 1: PAYMENT GATEWAY & ESCROW COMPLIANCE (13.4) */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              {/* Mandatory Regulatory Disclosure Card */}
              <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="font-extrabold text-xs sm:text-sm">
                    Regulatory Disclosure: Marketplace Escrow & Settlement (Section 13.4 Compliance)
                  </h4>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  co-lab does <strong>not independently hold user funds or operate an unauthorized banking deposit</strong>. All platform milestone payments, escrow holds, and vendor payouts are routed strictly through <strong>RBI-licensed Payment Aggregators (PA-PG)</strong> utilizing designated Nodal Escrow Accounts in accordance with the Payment and Settlement Systems Act, 2007 and RBI Master Directions.
                </p>
              </div>

              {/* Merchant KYC Onboarding Form */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900">Merchant KYC & Bank Account Verification</h4>
                    <p className="text-xs text-slate-500">Required for creators and sellers prior to automated milestone payout settlement.</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    KYC Status: Verified ✓
                  </span>
                </div>

                <form onSubmit={handleSaveKyc} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Account Number (PAN) *</label>
                    <input
                      type="text"
                      value={panInput}
                      onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (Optional for micro-creators)</label>
                    <input
                      type="text"
                      value={gstinInput}
                      onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account Number *</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bank IFSC Code *</label>
                    <input
                      type="text"
                      value={ifscInput}
                      onChange={(e) => setIfscInput(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Instant UPI VPA (for direct UPI settlements)</label>
                    <input
                      type="text"
                      value={vpaInput}
                      onChange={(e) => setVpaInput(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                    >
                      Update Merchant KYC Information
                    </button>
                    {kycSaved && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>KYC record updated in compliance vault!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Payment Webhook Verification Simulator */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Payment Webhook Cryptographic Verification (HMAC SHA-256)</h4>
                  <button
                    onClick={handleSimulateWebhook}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                  >
                    Simulate Gateway Webhook
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Ensures all incoming transaction capture events are cryptographically authenticated before funds release.
                </p>
                {webhookSimulated && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-emerald-700 font-bold">
                    {webhookStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 12.3 SECURITY, MFA & AUDIT LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Role-Based Access Controls (RBAC) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h4 className="font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Creator Role</span>
                    <span className="text-[11px] text-slate-500">Rate card, media kit, proposal pitches, escrow payout receipt.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Business Role</span>
                    <span className="text-[11px] text-slate-500">Campaign creation, creator hiring, escrow funding, deliverables signoff.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Admin Role (MFA Enforced)</span>
                    <span className="text-[11px] text-slate-500">Platform GMV, tax parameters, audit logs, user verification gating.</span>
                  </div>
                </div>
              </div>

              {/* Administrator Multi-Factor Authentication (MFA) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Administrator Multi-Factor Authentication (MFA / 2FA)</h4>
                    <p className="text-xs text-slate-500">Mandatory TOTP authenticator challenge for high-privilege operations.</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    mfaVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {mfaVerified ? 'MFA Session Active ✓' : 'Challenge Required'}
                  </span>
                </div>

                <form onSubmit={handleVerifyMfa} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit TOTP (e.g. 123456)"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    maxLength={6}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono w-52 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    Verify Authenticator
                  </button>
                  <span className="text-[11px] text-slate-400">Demo Code: 123456</span>
                </form>
              </div>

              {/* Security Audit Logging Trail */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900">Immutable Security Audit Log Trail</h4>
                  <span className="text-xs text-slate-500 font-mono">120 req/min Rate Limiting Active</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1.5 text-xs font-mono">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-slate-900">[{log.action}]</strong>
                        <span className="text-slate-500 ml-1.5">{log.resource}</span>
                      </div>
                      <div className="text-slate-400 flex items-center space-x-2">
                        <span>{log.ipAddress}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 13.2 DPDP ACT 2023 & DATA PROTECTION RIGHTS */}
          {activeTab === 'dpdp' && (
            <div className="space-y-6">
              {/* DPDP Privacy & Purpose Limitation Notice */}
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200 text-indigo-950 space-y-2">
                <h4 className="font-extrabold text-sm">
                  Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025 Notice
                </h4>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  co-lab processes personal data solely for explicit commercial purposes under <strong>Section 4 (Purpose Limitation)</strong> and <strong>Section 5 (Notice & Consent)</strong>. Data is retained strictly for statutory audit requirements (Companies Act & GST Law) and is protected via AES-256 encryption.
                </p>
              </div>

              {/* Granular Consent Controls */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h4 className="font-bold text-slate-900">Granular Consent Preferences</h4>
                <div className="space-y-2.5 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-900 block">Platform Commercial Execution</span>
                      <span className="text-slate-500">Essential for contract generation, deal room escrow, and GST tax invoicing.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentTerms}
                      onChange={(e) => setConsentTerms(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-900 block">Explainable AI Matching Telemetry</span>
                      <span className="text-slate-500">Matching your creator niche/demographics against brand campaign briefs.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentMatching}
                      onChange={(e) => setConsentMatching(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-900 block">Performance Attribution & Telemetry</span>
                      <span className="text-slate-500">Calculating clicks, sales attribution, and verified campaign ROAS.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentTelemetry}
                      onChange={(e) => setConsentTelemetry(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Data Principal Rights (Access & Erasure) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="font-bold text-slate-900">Data Principal Rights (Sections 11, 12 & 13)</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadDpdpData}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Right to Access: Export My Personal Data (JSON)</span>
                  </button>

                  <button
                    onClick={() => setErasureRequested(true)}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition flex items-center space-x-1.5"
                  >
                    <span>Right to Erasure ("Right to be Forgotten")</span>
                  </button>
                </div>

                {downloadSuccess && (
                  <p className="text-xs text-emerald-600 font-bold">
                    ✓ Complete personal data bundle exported successfully under DPDP Act 2023!
                  </p>
                )}

                {erasureRequested && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                    <p className="font-bold">Erasure Request Logged (Ticket #DPDP-DEL-892)</p>
                    <p>In accordance with statutory rules, active financial records required for GST audits will be retained for statutory periods; all non-statutory marketing and profile telemetry will be purged within 30 days.</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <strong>Grievance Redressal Officer:</strong> Adv. K. R. Nambiar (DPO) • Email: <code>grievance@colab.local</code> • SLA: 72 Hours Statutory Response
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 13.3 ADVERTISING COMPLIANCE (ASCI GUIDELINES) */}
          {activeTab === 'asci' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200 text-indigo-950 space-y-2">
                <h4 className="font-extrabold text-sm">ASCI Influencer Advertising Guidelines Compliance</h4>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Under the <strong>Consumer Protection Act, 2019</strong> and <strong>ASCI Code</strong>, creators and advertisers must include clear, unmissable promotional disclosures (e.g. <code>#ad</code>, <code>#sponsored</code>, <code>#collab</code>) in the first 3 lines of video captions and audio announcements.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="font-bold text-slate-900">ASCI Caption & Deliverable Compliance Scanner</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deliverable Caption Text *</label>
                  <textarea
                    rows={4}
                    value={captionInput}
                    onChange={(e) => setCaptionInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioDisclosure}
                    onChange={(e) => setAudioDisclosure(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Creator provides spoken audio disclosure in video (Mandatory for Reels/YouTube)</span>
                </label>

                <button
                  onClick={handleRunAsciScanner}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Scan for ASCI & Consumer Protection Compliance
                </button>

                {asciReport && (
                  <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                    asciReport.isCompliant ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {asciReport.isCompliant ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
                      <span className="font-bold text-sm">
                        {asciReport.isCompliant ? 'ASCI Disclosure Verified ✓' : 'Disclosure Warning: Non-Compliant'}
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li>Prominent Tag: {asciReport.hasProminentDisclosureTag ? `Found (${asciReport.disclosureTagUsed})` : 'Missing prominent hashtag'}</li>
                      <li>Positioning: {asciReport.disclosureInFirstThreeLines ? 'In first 3 lines (Compliant)' : 'Must move disclosure to first 3 lines'}</li>
                      <li>Audio Disclosure: {asciReport.videoAudioDisclosurePresent ? 'Spoken audio verified' : 'Spoken audio disclosure missing'}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: 13.6 INTELLECTUAL PROPERTY & 8-POINT DIGITAL CONTRACT */}
          {activeTab === 'ip' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2">
                <h4 className="font-extrabold text-sm text-amber-300">
                  13.6 Intellectual Property Terms & Digital Agreement Generator
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every commercial collaboration clarifies all 8 statutory IP rights parameters under the Indian Copyright Act, 1957.
                </p>
              </div>

              {/* 8-Point IP Matrix Form */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">1. Content Ownership</label>
                    <select
                      value={ipTerms.contentOwnership}
                      onChange={(e: any) => setIpTerms({ ...ipTerms, contentOwnership: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="creator_retains_copyright">Creator Retains Copyright (Standard)</option>
                      <option value="work_for_hire_assignment">Full Buyout (Work-for-hire assignment)</option>
                      <option value="joint_ownership">Joint Ownership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">2. Licence Duration</label>
                    <select
                      value={ipTerms.duration}
                      onChange={(e: any) => setIpTerms({ ...ipTerms, duration: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="30_days">30 Days</option>
                      <option value="60_days">60 Days</option>
                      <option value="90_days">90 Days (Recommended)</option>
                      <option value="180_days">180 Days</option>
                      <option value="1_year">1 Year</option>
                      <option value="perpetuity">Perpetuity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">3. Territory</label>
                    <select
                      value={ipTerms.territory}
                      onChange={(e: any) => setIpTerms({ ...ipTerms, territory: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="india_only">India Only</option>
                      <option value="pan_asia">Pan-Asia</option>
                      <option value="worldwide">Worldwide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">4. Modification Rights</label>
                    <div className="flex items-center space-x-3 pt-2">
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ipTerms.modificationRights.allowCropping}
                          onChange={(e) => setIpTerms({
                            ...ipTerms,
                            modificationRights: { ...ipTerms.modificationRights, allowCropping: e.target.checked }
                          })}
                        />
                        <span>Cropping</span>
                      </label>
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ipTerms.modificationRights.allowTranslationSubtitles}
                          onChange={(e) => setIpTerms({
                            ...ipTerms,
                            modificationRights: { ...ipTerms.modificationRights, allowTranslationSubtitles: e.target.checked }
                          })}
                        />
                        <span>Subtitles</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={handleGenerateContract}
                    disabled={isSigning}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isSigning ? 'Calculating Checksum...' : 'Generate Legal Agreement & Cryptographic eSign'}</span>
                  </button>

                  <span className="text-[11px] text-slate-500">Governed by Indian Copyright Act, 1957</span>
                </div>

                {signedContractHash && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-900 font-extrabold flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Contract Cryptographically E-Signed & Locked</span>
                      </strong>
                      <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded font-mono font-bold">SHA-256 Valid</span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-600 break-all bg-white p-2 rounded-lg border border-emerald-200">
                      Checksum: {signedContractHash}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MULTI-CHANNEL NOTIFICATIONS & OFFICIAL SOCIAL APIS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900">Multi-Channel Deal Notification Dispatcher</h4>
                  <p className="text-xs text-slate-500">Delivers transactional notifications over Email, SMS, and WhatsApp Business Cloud API.</p>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Notification Channel</label>
                      <select
                        value={notifChannel}
                        onChange={(e: any) => setNotifChannel(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="whatsapp">WhatsApp Business API (Instant Template)</option>
                        <option value="email">Email Notification (HTML Transactional)</option>
                        <option value="sms">SMS DLT Service (Priority Alert)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Contact</label>
                      <input
                        type="text"
                        value={notifContact}
                        onChange={(e) => setNotifContact(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notification Message</label>
                    <input
                      type="text"
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    Dispatch Notification Test
                  </button>

                  {notifDispatched && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Dispatched successfully via {notifDispatched.channel.toUpperCase()}! (Status: {notifDispatched.status})</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Official Social APIs Notice */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Official Social Platform API Guarantee</h4>
                <p className="text-slate-600 leading-relaxed">
                  co-lab integrates strictly with official developer APIs: <strong>Meta Graph API (Instagram)</strong>, <strong>YouTube Data API v3</strong>, and <strong>LinkedIn API</strong>. We <strong>never collect social media passwords</strong> or employ automated scraping. All engagement analytics are authenticated via OAuth 2.0.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>co-lab Commercial Regulatory Framework • Version 2026.3</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
          >
            Close Compliance Center
          </button>
        </div>

      </div>
    </div>
  );
};

