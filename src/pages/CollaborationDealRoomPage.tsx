import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  MessageSquare,
  FileText,
  DollarSign,
  Star,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Send,
  Sparkles,
  X,
  QrCode,
  BarChart3,
  Tag,
  Copy,
  Check,
  Download,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
  Globe,
  Radio,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, formatCompactNumber } from '../utils';
import { complianceService } from '../services/complianceService';
import { IpLicensingTerms, AsciComplianceReport } from '../types/compliance';

export const CollaborationDealRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    collaborations,
    currentUser,
    isLoggedIn,
    setShowLoginModal,
    updateCollaborationDeliverable,
    requestDeliverableRevision,
    approveDeliverable,
    releaseEscrowPayment,
    addReview,
    createOrGetConversation,
    performanceAttributions,
    openComplianceModal
  } = useApp();

  const collab = collaborations.find((c) => c.id === id);

  // Tab State
  const [dealTab, setDealTab] = useState<'deliverables' | 'tracking' | 'agreement' | 'invoices'>('deliverables');

  // Section 13.6 IP Licensing & Digital eSign
  const [ipTerms, setIpTerms] = useState<IpLicensingTerms>(() => complianceService.generateStandardIpTerms());
  const [contractChecksum, setContractChecksum] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);

  // Section 13.3 ASCI Compliance Scanner inside agreement tab
  const [agreementCaption, setAgreementCaption] = useState(
    `#ad Loving my collaboration with ${collab?.businessName || 'Brand'}! #collab\nCheck out the exclusive collection with code ${collab?.creatorName?.split(' ')[0]?.toUpperCase() || 'COLAB'}15.`
  );
  const [agreementAudioSpoken, setAgreementAudioSpoken] = useState(true);
  const [agreementAsciReport, setAgreementAsciReport] = useState<AsciComplianceReport | null>(null);

  // ASCI Scanner inside submission modal
  const [submitCaption, setSubmitCaption] = useState('#ad Excited to present our collaboration! #collab');
  const [submitAudioCheck, setSubmitAudioCheck] = useState(true);
  const [submitAsciReport, setSubmitAsciReport] = useState<AsciComplianceReport | null>(null);

  useEffect(() => {
    if (collab) {
      complianceService.createDigitalAgreement({
        collaborationId: collab.id,
        campaignTitle: collab.campaignTitle,
        creatorId: collab.creatorId,
        creatorName: collab.creatorName,
        businessId: collab.businessId,
        businessName: collab.businessName,
        agreedPrice: collab.agreedAmount,
        ipTerms
      }).then(ag => setContractChecksum(ag.contractSha256Checksum));

      setAgreementAsciReport(complianceService.scanAsciCompliance(agreementCaption, agreementAudioSpoken));
    }
  }, [collab?.id]);

  // Copy helpers
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Deliverable submission modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');

  // Revision modal
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [qualRating, setQualRating] = useState(5);
  const [timeRating, setTimeRating] = useState(5);
  const [compRating, setCompRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <ShieldCheck className="w-12 h-12 text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
          <p className="text-xs text-slate-500">Please sign in to access this collaboration Deal Room and escrow contracts.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Deal Room not found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isBrand = currentUser?.role === 'business' || currentUser?.role === 'agency' || currentUser?.id === collab.businessId;
  const isCreator = currentUser?.role === 'creator' || currentUser?.id === collab.creatorId;

  const handleOpenSubmit = (delId: string) => {
    setSelectedDeliverableId(delId);
    setSubmissionUrl('');
    setShowSubmitModal(true);
  };

  const handleDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl) return;
    updateCollaborationDeliverable(collab.id, selectedDeliverableId, submissionUrl);
    setShowSubmitModal(false);
    alert("Deliverable submitted for brand review!");
  };

  const handleOpenRevision = (delId: string) => {
    setSelectedDeliverableId(delId);
    setRevisionNotes('');
    setShowRevisionModal(true);
  };

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    requestDeliverableRevision(collab.id, selectedDeliverableId, revisionNotes);
    setShowRevisionModal(false);
    alert("Revision requested! The creator has been notified.");
  };

  const handleApprove = (delId: string) => {
    approveDeliverable(collab.id, delId);
    alert("Deliverable approved successfully! You can now release the escrow payout.");
  };

  const handleReleaseEscrow = () => {
    if (window.confirm(`Release ${formatCurrency(collab.creatorPayout)} from escrow to ${collab.creatorName}?`)) {
      releaseEscrowPayment(collab.id);
      alert("Payment settled! Funds have been released to the creator. Please leave a review.");
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewerRole = isBrand ? 'business' : 'creator';
    const targetId = isBrand ? collab.creatorId : collab.businessId;
    const targetName = isBrand ? collab.creatorName : collab.businessName;

    addReview({
      collaborationId: collab.id,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerRole,
      targetId,
      targetName,
      rating,
      communication: commRating,
      contentQuality: qualRating,
      timeliness: timeRating,
      compliance: compRating,
      comment: reviewComment
    });

    alert("Thank you! Your verified review has been published.");
    setShowReviewModal(false);
  };

  const handleSignAgreement = async () => {
    if (!collab || !currentUser) return;
    setIsSigning(true);
    const agreement = await complianceService.createDigitalAgreement({
      collaborationId: collab.id,
      campaignTitle: collab.campaignTitle,
      creatorId: collab.creatorId,
      creatorName: collab.creatorName,
      businessId: collab.businessId,
      businessName: collab.businessName,
      agreedPrice: collab.agreedAmount,
      ipTerms
    });
    setContractChecksum(agreement.contractSha256Checksum);
    setIsSigning(false);
    setSignedSuccess(true);
    complianceService.logAuditEvent({
      userId: currentUser.id,
      userRole: currentUser.role,
      action: 'DIGITAL_AGREEMENT_ESIGNED',
      resource: `collaborations/${collab.id}/agreement`,
      status: 'success',
      details: { contractChecksum: agreement.contractSha256Checksum }
    });
    setTimeout(() => setSignedSuccess(false), 3500);
  };

  const handleDownloadAgreement = () => {
    if (!collab) return;
    const cert = {
      title: 'co-lab Digital Commercial Collaboration Agreement',
      contractId: `COLAB-AGR-${collab.id.toUpperCase()}`,
      sha256Checksum: contractChecksum || '964f4ebb713726d693f0a48ec2c35a440b4b25c7ef6fac7e67fa782d98dc635b',
      legalFramework: 'Information Technology Act, 2000 (India) & Indian Contract Act, 1872',
      collabId: collab.id,
      campaignTitle: collab.campaignTitle,
      creator: { id: collab.creatorId, name: collab.creatorName },
      business: { id: collab.businessId, name: collab.businessName },
      agreedSettlement: formatCurrency(collab.agreedAmount),
      ipLicensingTerms: ipTerms,
      signedTimestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colab-agreement-${collab.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScanAgreementAsci = () => {
    const report = complianceService.scanAsciCompliance(agreementCaption, agreementAudioSpoken);
    setAgreementAsciReport(report);
  };

  const handleScanSubmitAsci = () => {
    const report = complianceService.scanAsciCompliance(submitCaption, submitAudioCheck);
    setSubmitAsciReport(report);
  };

  const statusBadges: Record<string, { label: string; color: string }> = {
    agreement_pending: { label: 'Agreement Pending', color: 'bg-amber-100 text-amber-800' },
    escrow_funded: { label: 'Escrow Secured', color: 'bg-emerald-100 text-emerald-800' },
    in_progress: { label: 'In Production', color: 'bg-indigo-100 text-indigo-800' },
    reviewing_deliverables: { label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
    revision_needed: { label: 'Revision Requested', color: 'bg-rose-100 text-rose-800' },
    approved: { label: 'Content Approved', color: 'bg-emerald-100 text-emerald-800' },
    settled: { label: 'Completed & Settled', color: 'bg-slate-900 text-white' }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Deal Room ID:</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
              {collab.id}
            </span>
          </div>
        </div>

        {/* Hero Collaboration Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-premium space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusBadges[collab.status]?.color || 'bg-slate-100 text-slate-700'}`}>
                  {statusBadges[collab.status]?.label || collab.status}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">Deadline: {formatDate(collab.deadline)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {collab.campaignTitle}
              </h1>
            </div>

            {/* Escrow summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0 flex items-center space-x-6 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Agreed Budget</span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(collab.agreedAmount)}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Escrow Status</span>
                <span className="font-bold text-emerald-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="capitalize">{collab.escrowStatus}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
              <img src={collab.businessAvatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Brand / Business</span>
                <span className="font-bold text-slate-900 text-sm">{collab.businessName}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
              <img src={collab.creatorAvatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Collaborating Creator</span>
                <span className="font-bold text-slate-900 text-sm">{collab.creatorName}</span>
                <span className="text-xs text-slate-500 block">{collab.creatorHandle}</span>
              </div>
            </div>
          </div>

          {/* Contract Terms Box */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-950 space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 block">Agreed Contract Terms & Licensing</span>
            <p className="leading-relaxed">{collab.contractTerms}</p>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto text-xs sm:text-sm font-semibold pb-1">
          <button
            onClick={() => setDealTab('deliverables')}
            className={`pb-3 px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              dealTab === 'deliverables'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Deliverables & Submissions ({collab.deliverables.length})</span>
          </button>

          <button
            onClick={() => setDealTab('tracking')}
            className={`pb-3 px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              dealTab === 'tracking'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Proof of Performance & Tracking</span>
          </button>

          <button
            onClick={() => setDealTab('agreement')}
            className={`pb-3 px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              dealTab === 'agreement'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Digital Agreement & ASCI Scanner</span>
          </button>

          <button
            onClick={() => setDealTab('invoices')}
            className={`pb-3 px-4 border-b-2 transition whitespace-nowrap flex items-center space-x-1.5 ${
              dealTab === 'invoices'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GST Invoice & Escrow</span>
          </button>
        </div>

        {/* TAB 1: DELIVERABLES & CONTENT SUBMISSIONS */}
        {dealTab === 'deliverables' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Collaboration Deliverables</h3>
              <p className="text-xs text-slate-500">Track asset creation, draft previews, revisions, and approval.</p>
            </div>
          </div>

          <div className="space-y-4">
            {collab.deliverables.map((del) => (
              <div
                key={del.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{del.title}</h4>
                    <span className="text-slate-500">{del.format}</span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
                    del.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    del.status === 'submitted' ? 'bg-indigo-100 text-indigo-800' :
                    del.status === 'revision_requested' ? 'bg-rose-100 text-rose-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {del.status === 'approved' ? '✓ Approved' :
                     del.status === 'submitted' ? 'Submitted for Review' :
                     del.status === 'revision_requested' ? 'Revisions Requested' : 'Draft Pending'}
                  </span>
                </div>

                {/* Submitted Asset Preview */}
                {del.submissionUrl && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      {del.previewUrl && (
                        <img src={del.previewUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <span className="font-semibold text-slate-800 block">Draft Preview Asset</span>
                        <a
                          href={del.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center space-x-1"
                        >
                          <span>{del.submissionUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <span className="text-slate-400 text-[11px]">Submitted {formatDate(del.submittedAt || '')}</span>
                  </div>
                )}

                {/* Feedback Note if revision */}
                {del.feedback && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                    <span className="font-bold block mb-0.5">Brand Revision Request:</span>
                    <p>{del.feedback}</p>
                  </div>
                )}

                {/* Action buttons depending on role */}
                <div className="pt-2 flex flex-wrap gap-2 justify-end">
                  {/* Creator actions */}
                  {isCreator && del.status !== 'approved' && (
                    <button
                      onClick={() => handleOpenSubmit(del.id)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{del.submissionUrl ? 'Upload Revised Asset' : 'Submit Draft Preview'}</span>
                    </button>
                  )}

                  {/* Brand actions */}
                  {isBrand && del.status === 'submitted' && (
                    <>
                      <button
                        onClick={() => handleOpenRevision(del.id)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold transition"
                      >
                        Request Revision
                      </button>

                      <button
                        onClick={() => handleApprove(del.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
                      >
                        Approve Deliverable
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Release Payout Bar if content approved and not yet settled */}
          {collab.status === 'approved' && collab.escrowStatus === 'held' && (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">All deliverables are approved!</h4>
                <p className="text-xs text-emerald-800">
                  Release the milestone escrow payment of {formatCurrency(collab.creatorPayout)} to {collab.creatorName}.
                </p>
              </div>

              <button
                onClick={handleReleaseEscrow}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition"
              >
                Release Escrow Payout
              </button>
            </div>
          )}

          {/* Settled state & Review prompt */}
          {collab.status === 'settled' && (
            <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-emerald-400">Collaboration Successfully Settled</h4>
                <p className="text-xs text-slate-300">
                  Funds have been transferred to the creator bank account. Platform fee: {formatCurrency(collab.platformFee)}.
                </p>
              </div>

              {((isBrand && !collab.businessReviewed) || (isCreator && !collab.creatorReviewed)) && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  ★ Submit 2-Way Review
                </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* TAB 2: CAMPAIGN TRACKING & PROOF OF PERFORMANCE */}
        {dealTab === 'tracking' && (
          <div className="space-y-6">
            {/* Tracking Assets Generator */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>Attribution Telemetry & Trackable Campaign Assets</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Measure clicks, customer enquiries, store visits, and revenue attributed to this creator.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Telemetry Active</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Trackable Short Link */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block uppercase text-[10px]">Trackable Bio & Story Link</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-indigo-600 font-bold truncate pr-2">
                      https://colab.market/r/{collab.id}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://colab.market/r/${collab.id}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="text-slate-600 hover:text-slate-900 shrink-0 font-bold"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Includes UTM parameters and click attribution tags.</p>
                </div>

                {/* 2. In-Store / Event QR Code */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 block uppercase text-[10px]">In-Store QR Code</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">For Retail/Cafe</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://colab.market/r/${collab.id}`}
                      alt="QR Code"
                      className="w-12 h-12 rounded-lg border border-slate-100"
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-800 block">Footfall Tracker</span>
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://colab.market/r/${collab.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline text-[11px] font-semibold flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download High-Res QR</span>
                      </a>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Scan at table counter to track offline customer footfall.</p>
                </div>

                {/* 3. Promo Coupon Code */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block uppercase text-[10px]">Promotional Coupon Code</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-900 font-black tracking-widest text-sm">
                      {collab.creatorName.split(' ')[0].toUpperCase()}15
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${collab.creatorName.split(' ')[0].toUpperCase()}15`);
                        setCopiedCoupon(true);
                        setTimeout(() => setCopiedCoupon(false), 2000);
                      }}
                      className="text-slate-600 hover:text-slate-900 shrink-0 font-bold"
                    >
                      {copiedCoupon ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">15% Customer Discount with checkout attribution.</p>
                </div>
              </div>

              {/* Attribution Metrics Grid */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Live Performance Telemetry
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Verified Platform Telemetry</span>
                    </span>
                    <span className="text-slate-400">vs</span>
                    <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      Creator-Reported Proof
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Views</span>
                    <span className="font-black text-slate-900 text-base">48,500</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Platform Video</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Link Clicks</span>
                    <span className="font-black text-indigo-700 text-base">1,420</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">✓ SDK Verified</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Inquiries</span>
                    <span className="font-black text-slate-900 text-base">84</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Direct WhatsApp/Call</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Redemptions</span>
                    <span className="font-black text-emerald-700 text-base">42</span>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">✓ Verified at POS</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Attributed Sales</span>
                    <span className="font-black text-slate-900 text-base">₹ 52,800</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Tracked GMV</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Cost Per Lead</span>
                    <span className="font-black text-emerald-700 text-base">₹ 41.60</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">CPL</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Campaign ROI</span>
                    <span className="font-black text-indigo-700 text-base">3.8x</span>
                    <span className="text-[9px] text-indigo-600 font-bold block mt-0.5">High Performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL AGREEMENT & ASCI COMPLIANCE SCANNER */}
        {dealTab === 'agreement' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Header & E-Sign Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-black text-slate-900">
                      8-Point Statutory IP Agreement & ASCI Compliance
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Governed under the Indian Information Technology Act, 2000, Contract Act 1872 & ASCI Guidelines.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dual-Party E-Signed</span>
                  </span>
                  <button
                    onClick={handleDownloadAgreement}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1"
                    title="Download Cryptographic Agreement Certificate"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>

              {/* SHA-256 Checksum & E-Sign Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-indigo-700" />
                    <span className="font-extrabold text-indigo-950 uppercase text-[10px] tracking-wider">
                      SHA-256 Agreement Integrity Checksum
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-indigo-900 bg-white/80 p-1.5 rounded-lg border border-indigo-100 truncate max-w-xl">
                    {contractChecksum || '964f4ebb713726d693f0a48ec2c35a440b4b25c7ef6fac7e67fa782d98dc635b'}
                  </p>
                  <p className="text-[10px] text-indigo-700">
                    Timestamped audit hash protecting both {collab.creatorName} and {collab.businessName}.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleSignAgreement}
                    disabled={isSigning}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{signedSuccess ? 'Signature Verified ✓' : isSigning ? 'Signing...' : 'Re-Sign Cryptographically'}</span>
                  </button>
                  <button
                    onClick={() => openComplianceModal('ip')}
                    className="px-3 py-2 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs border border-indigo-200 transition"
                  >
                    Full Legal Modal
                  </button>
                </div>
              </div>

              {/* SECTION 13.6: 8 Statutory Intellectual Property Clauses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-slate-600" />
                    <span>Statutory 8-Point Intellectual Property & Licensing Matrix (13.6)</span>
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                    Legally Reviewed Template
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Content Ownership</span>
                    <p className="font-bold text-slate-800">{ipTerms.contentOwnership.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">Creator retains underlying author copyright; business receives irrevocable license.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Usage Licence</span>
                    <p className="font-bold text-slate-800">{ipTerms.usageLicence.map(u => u.replace(/_/g, ' ')).join(', ')}</p>
                    <p className="text-[10px] text-slate-500">Permitted for organic social channels, official brand website, and email marketing.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Advertising Permissions</span>
                    <p className="font-bold text-slate-800">
                      {[
                        ipTerms.advertisingPermissions.metaSparkAds && 'Meta Spark Ads',
                        ipTerms.advertisingPermissions.metaWhitelisting && 'Meta Whitelisting',
                        ipTerms.advertisingPermissions.youtubeBrandConnect && 'YouTube BrandConnect',
                        ipTerms.advertisingPermissions.darkPosting && 'Dark Posting'
                      ].filter(Boolean).join(', ') || 'Organic Only'}
                    </p>
                    <p className="text-[10px] text-slate-500">Paid ad authorization across platforms during campaign term.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Duration of Licence</span>
                    <p className="font-bold text-indigo-700">{ipTerms.duration.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">License automatically expires unless mutual extension rider is executed.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">5. Exclusivity Terms</span>
                    <p className="font-bold text-slate-800">
                      {ipTerms.exclusivity.isExclusive
                        ? `Exclusive (${ipTerms.exclusivity.category || 'Category'}) - ${ipTerms.exclusivity.exclusivityDurationDays || 30} days`
                        : 'Non-Exclusive (Free to accept non-competing partnerships)'}
                    </p>
                    <p className="text-[10px] text-slate-500">Protects brand against creator promoting direct category competitors during term.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">6. Geographical Territory</span>
                    <p className="font-bold text-slate-800">{ipTerms.territory.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">Standard territorial jurisdiction with digital international access rights.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">7. Modification Rights</span>
                    <p className="font-bold text-slate-800">
                      {[
                        ipTerms.modificationRights.allowCropping && 'Cropping Allowed',
                        ipTerms.modificationRights.allowTranslationSubtitles && 'Subtitles Allowed',
                        ipTerms.modificationRights.requirePriorApprovalForEdits && 'Prior Approval Required'
                      ].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-[10px] text-slate-500">Brand may add captions, crop aspect ratios, but cannot distort voice or messaging.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">8. Resale & Redistribution</span>
                    <p className="font-bold text-rose-700">
                      {ipTerms.resalePermissions ? 'Sub-licensing Permitted' : 'Strictly Prohibited (Zero Third-Party Resale)'}
                    </p>
                    <p className="text-[10px] text-slate-500">Brand may not resell, sub-license, or syndicate assets to unapproved third parties.</p>
                  </div>
                </div>
              </div>

              {/* SECTION 13.3: Interactive ASCI Advertising Compliance Scanner */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold uppercase tracking-wider text-[11px] text-indigo-300">
                      Live ASCI Influencer Advertising Compliance Engine (13.3)
                    </span>
                  </div>
                  {agreementAsciReport && (
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
                      agreementAsciReport.isCompliant ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {agreementAsciReport.isCompliant ? 'Compliant PASS ✓' : 'Non-Compliant FAIL ⚠'}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Caption / Promotional Copy to Scan:
                  </label>
                  <textarea
                    rows={2}
                    value={agreementCaption}
                    onChange={(e) => setAgreementCaption(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
                    placeholder="Enter social post caption..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreementAudioSpoken}
                      onChange={(e) => setAgreementAudioSpoken(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Audio / Voiceover contains spoken promotional partnership disclosure</span>
                  </label>

                  <button
                    onClick={handleScanAgreementAsci}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run ASCI Scan</span>
                  </button>
                </div>

                {agreementAsciReport && (
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Disclosure Status:</span>
                      {agreementAsciReport.hasProminentDisclosureTag ? (
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono font-bold text-[10px]">
                          {agreementAsciReport.disclosureTagUsed}
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold text-[10px]">None detected (Required: #ad, #collab, etc.)</span>
                      )}
                      <span className="text-slate-500 text-[10px]">•</span>
                      <span className={`text-[10px] font-bold ${agreementAsciReport.disclosureInFirstThreeLines ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {agreementAsciReport.disclosureInFirstThreeLines ? 'In First 3 Lines ✓' : 'Must Be In First 3 Lines'}
                      </span>
                      <span className="text-slate-500 text-[10px]">•</span>
                      <span className={`text-[10px] font-bold ${agreementAsciReport.videoAudioDisclosurePresent ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {agreementAsciReport.videoAudioDisclosurePresent ? 'Audio Spoken Disclosure Included ✓' : 'Audio Disclosure Missing'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GST TAX INVOICE & ESCROW STATEMENT */}
        {dealTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>Commercial GST Tax Invoice & Escrow Deposit Record</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official tax invoice with SAC Code 998371 for corporate GST input tax credit (ITC).
                  </p>
                </div>

                <button
                  onClick={() => alert(`Tax Invoice #INV-${collab.id.toUpperCase()} downloaded.`)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Tax Invoice (PDF)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Invoice Details</span>
                  <div className="space-y-1 text-slate-700">
                    <p><strong>Invoice Number:</strong> INV-2026-COLAB-{collab.id.slice(-4).toUpperCase()}</p>
                    <p><strong>Invoice Date:</strong> {formatDate(collab.createdAt)}</p>
                    <p><strong>SAC Code:</strong> 998371 (Market Research & Advertising)</p>
                    <p><strong>Escrow Status:</strong> {collab.escrowStatus.toUpperCase()}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Financial Breakdown</span>
                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>Agreed Creator Fee:</span>
                      <strong>{formatCurrency(collab.agreedAmount)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Commission (8%):</span>
                      <strong>{formatCurrency(collab.platformFee)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Creator Payout:</span>
                      <strong className="text-emerald-700">{formatCurrency(collab.creatorPayout)}</strong>
                    </div>
                    <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>TDS Deducted (Sec 194R - 1%):</span>
                      <span>₹{(collab.agreedAmount * 0.01).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT ASSET MODAL WITH ASCI CHECK */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Upload Deliverable & ASCI Compliance Check</h3>
                </div>
                <button onClick={() => setShowSubmitModal(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleDeliverableSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Google Drive, Dropbox, Loom, or Video Asset URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Ensure link access permissions are set to "Anyone with link can view".
                  </span>
                </div>

                {/* ASCI Caption Scanner Pre-flight */}
                <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ASCI Pre-Flight Caption Validator</span>
                    </span>
                    {submitAsciReport && (
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        submitAsciReport.isCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {submitAsciReport.isCompliant ? 'ASCI Validated ✓' : 'Non-Compliant ⚠'}
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={submitCaption}
                    onChange={(e) => setSubmitCaption(e.target.value)}
                    placeholder="Caption draft (e.g. #ad Loving this collaboration with brand!)"
                    className="w-full p-2 bg-white border border-indigo-200 rounded-xl text-xs focus:outline-none"
                  />

                  <div className="flex items-center justify-between text-[11px]">
                    <label className="flex items-center space-x-1.5 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={submitAudioCheck}
                        onChange={(e) => setSubmitAudioCheck(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Spoken voice disclosure included</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleScanSubmitAsci}
                      className="px-2.5 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                    >
                      Check Caption
                    </button>
                  </div>

                  {submitAsciReport && (
                    <p className={`text-[10px] font-medium ${submitAsciReport.isCompliant ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {submitAsciReport.isCompliant
                        ? `✓ Valid disclosure tag detected (${submitAsciReport.disclosureTagUsed}). Ready for brand review!`
                        : '⚠ Missing statutory disclosure tag (#ad, #collab, or #partnership). Please add before brand publishing.'}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Submit Deliverable
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REQUEST REVISION MODAL */}
        {showRevisionModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Request Deliverable Revisions</h3>
                <button onClick={() => setShowRevisionModal(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSendRevision} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Specific Revision Instructions *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain clearly what changes you would like made to audio, lighting, brand tags, or pacing..."
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRevisionModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                  >
                    Send Revision Notes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TWO-WAY REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Submit Verified Collaboration Review
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your feedback builds trust and reputational ranking in the marketplace.
                  </p>
                </div>
                <button onClick={() => setShowReviewModal(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Communication (1-5)</label>
                    <select
                      value={commRating}
                      onChange={(e) => setCommRating(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      <option value={5}>5 ★★★★★ (Exceptional)</option>
                      <option value={4}>4 ★★★★☆ (Good)</option>
                      <option value={3}>3 ★★★☆☆ (Average)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Content Quality (1-5)</label>
                    <select
                      value={qualRating}
                      onChange={(e) => setQualRating(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      <option value={5}>5 ★★★★★ (High Production)</option>
                      <option value={4}>4 ★★★★☆ (Satisfactory)</option>
                      <option value={3}>3 ★★★☆☆ (Acceptable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Timeliness (1-5)</label>
                    <select
                      value={timeRating}
                      onChange={(e) => setTimeRating(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      <option value={5}>5 ★★★★★ (On / Ahead of Time)</option>
                      <option value={4}>4 ★★★★☆ (Minor delay)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Agreement Compliance</label>
                    <select
                      value={compRating}
                      onChange={(e) => setCompRating(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      <option value={5}>5 ★★★★★ (100% Compliant)</option>
                      <option value={4}>4 ★★★★☆ (Minor adjustment)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Detailed Review Comment *</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share specific results e.g. turnaround speed, customer feedback, conversion impact..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Publish Verified Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

