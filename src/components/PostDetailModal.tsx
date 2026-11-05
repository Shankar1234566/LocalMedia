import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  ThumbsUp, 
  Flag, 
  Share2, 
  Clock, 
  MessageSquare, 
  Sparkles,
  Send,
  Eye,
  Building2
} from 'lucide-react';
import { Post, CommentItem, CivicStatus } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleConfirm: (postId: string) => void;
  onOpenDisputeModal: (post: Post) => void;
  onOpenAIModal: (post: Post) => void;
  onAddComment: (postId: string, comment: CommentItem) => void;
  onUpdateCivicStatus?: (postId: string, newStatus: CivicStatus) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  onToggleConfirm,
  onOpenDisputeModal,
  onOpenAIModal,
  onAddComment,
  onUpdateCivicStatus,
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isWitness, setIsWitness] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      author: authorName.trim() || 'AP Local Citizen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      content: commentText.trim(),
      timestamp: 'Just now',
      isWitness,
      upvotes: 1,
    };

    onAddComment(post.id, newComment);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBadgeIcon = (level: string) => {
    if (level === 'verified') return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    if (level === 'review') return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <ShieldAlert className="w-4 h-4 text-rose-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-blue-300 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b-2 border-blue-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border-2 border-blue-200">
              {post.category.toUpperCase()}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{post.city}, {post.district}, {post.country}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Photo Asset with blue border */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 border-2 border-blue-200">
            <img 
              src={post.imageUrl} 
              alt={post.headline}
              className="w-full h-72 sm:h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            {post.imageCaption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-xs text-white/95 font-medium">
                📷 {post.imageCaption}
              </div>
            )}
          </div>

          {/* Headline & Metadata */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {post.headline}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-2 border-b-2 border-blue-100">
              <div className="flex items-center gap-2.5">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-blue-300"
                />
                <div>
                  <span className="font-bold text-slate-800">{post.author.name}</span>
                  <span className="text-[11px] text-slate-500 block">{post.author.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> {post.timestamp}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" /> {post.viewsCount} views
                </span>
              </div>
            </div>
          </div>

          {/* Truth Score Badge & AI Scan Card */}
          <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            post.verification.overallScore >= 85
              ? 'border-emerald-300 bg-emerald-50'
              : post.verification.overallScore >= 60
              ? 'border-amber-300 bg-amber-50'
              : 'border-rose-300 bg-rose-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0 border border-slate-200">
                {getBadgeIcon(post.verification.badge)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-black ${
                    post.verification.overallScore >= 85 ? 'text-emerald-700' :
                    post.verification.overallScore >= 60 ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {post.verification.overallScore}% Truth Score
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-300">
                    {post.verification.badgeLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  {post.verification.verificationSummary}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenAIModal(post)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50 transition shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              View Full AI Scan Report
            </button>
          </div>

          {/* Warning Banner if < 60% */}
          {post.verification.overallScore < 60 && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Community Notice: Questionable Authenticity / Misinformation
              </div>
              <ul className="list-disc list-inside space-y-1">
                {post.verification.warningReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Description Text */}
          <div className="prose max-w-none text-sm text-slate-700 leading-relaxed font-normal">
            <p className="whitespace-pre-line">{post.description}</p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {post.tags.map((t, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Civic Resolution Status Switcher */}
          {post.category === 'civic' && onUpdateCivicStatus && (
            <div className="p-4 rounded-xl border-2 border-blue-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Municipal Action Status (AP Civic Tracker):
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['reported', 'investigating', 'in_progress', 'resolved'] as CivicStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateCivicStatus(post.id, st)}
                    className={`text-xs px-2.5 py-1 rounded-lg border-2 font-semibold capitalize transition ${
                      post.civicStatus === st
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-blue-100 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Action Bar with Blue Borders */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y-2 border-blue-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleConfirm(post.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition ${
                  post.userAction === 'confirmed'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Confirm Issue ({post.confirmations})</span>
              </button>

              <button
                onClick={() => onOpenDisputeModal(post)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-rose-200 bg-white text-rose-700 hover:bg-rose-50 transition"
              >
                <Flag className="w-3.5 h-3.5 text-rose-500" />
                <span>Report Inaccurate ({post.disputes})</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{copied ? 'Link Copied!' : 'Share Report'}</span>
            </button>
          </div>

          {/* Comments & Eyewitness Reports Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Citizen Eyewitness Reports & Comments ({post.comments.length})
            </h3>

            {/* Comment input form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2.5 bg-blue-50/30 p-4 rounded-2xl border-2 border-blue-200">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name (e.g. Ramesh Reddy - Ward 14)"
                  className="text-xs p-2 rounded-xl border-2 border-blue-200 bg-white text-slate-900 sm:w-1/3 focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share ground updates, water level alerts, or photos..."
                  className="text-xs p-2 rounded-xl border-2 border-blue-200 bg-white text-slate-900 flex-1 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWitness}
                    onChange={(e) => setIsWitness(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>I personally witnessed this issue on-site in Andhra Pradesh</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1 shadow-2xs border border-blue-500"
                >
                  <Send className="w-3 h-3" /> Post Update
                </button>
              </div>
            </form>

            {/* Existing Comments */}
            <div className="space-y-3">
              {post.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No citizen comments yet. Be the first local eyewitness from Andhra Pradesh to confirm!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div 
                    key={comment.id}
                    className="p-3.5 rounded-2xl border-2 border-blue-100 bg-white space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-5 h-5 rounded-full object-cover border border-blue-200"
                        />
                        <span className="font-bold text-slate-800">
                          {comment.author}
                        </span>
                        {comment.isWitness && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Verified Eyewitness
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 pl-7 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
