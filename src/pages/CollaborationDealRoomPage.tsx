import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils';

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
    createOrGetConversation
  } = useApp();

  const collab = collaborations.find((c) => c.id === id);

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

        {/* DELIVERABLES & CONTENT SUBMISSIONS */}
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

        {/* SUBMIT ASSET MODAL */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Upload Deliverable Asset</h3>
                <button onClick={() => setShowSubmitModal(false)}>
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleDeliverableSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Google Drive, Dropbox, or Video Asset URL *
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

