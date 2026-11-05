import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  ThumbsUp, 
  Flag, 
  Clock, 
  MessageSquare,
  Eye
} from 'lucide-react';
import { Post } from '../types';

interface FeedListViewProps {
  posts: Post[];
  onOpenDetail: (post: Post) => void;
  onToggleConfirm: (postId: string) => void;
  onOpenDispute: (post: Post) => void;
  onOpenAIModal: (post: Post) => void;
}

export const FeedListView: React.FC<FeedListViewProps> = ({
  posts,
  onOpenDetail,
  onToggleConfirm,
  onOpenDispute,
  onOpenAIModal,
}) => {
  return (
    <div className="space-y-3.5">
      {posts.map((post) => {
        const isVerified = post.verification.overallScore >= 85;
        const isReview = post.verification.overallScore >= 60 && post.verification.overallScore < 85;

        return (
          <article
            key={post.id}
            className="bg-white border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4"
          >
            {/* Thumbnail with blue border */}
            <div 
              onClick={() => onOpenDetail(post)}
              className="w-full sm:w-44 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer relative group border-2 border-blue-100"
            >
              <img
                src={post.imageUrl}
                alt={post.headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-900/90 text-white backdrop-blur-xs border border-blue-400">
                {post.category}
              </span>
            </div>

            {/* Information */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {post.city}, {post.country}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" /> {post.timestamp}
                  </span>
                </div>

                {/* Truth Score Badge */}
                <button
                  onClick={() => onOpenAIModal(post)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border-2 transition ${
                    isVerified
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                      : isReview
                      ? 'bg-amber-50 text-amber-800 border-amber-400'
                      : 'bg-rose-50 text-rose-800 border-rose-400 animate-pulse'
                  }`}
                  title="Click to view AI authenticity breakdown"
                >
                  {isVerified ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isReview ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>{post.verification.overallScore}% Truth</span>
                </button>
              </div>

              {/* Title */}
              <h3 
                onClick={() => onOpenDetail(post)}
                className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-blue-600 transition"
              >
                {post.headline}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {post.description}
              </p>

              {/* Actions row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => onToggleConfirm(post.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold border-2 transition ${
                      post.userAction === 'confirmed'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3 text-blue-600" />
                    <span>Confirm ({post.confirmations})</span>
                  </button>

                  <button
                    onClick={() => onOpenDispute(post)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 text-xs"
                  >
                    <Flag className="w-3 h-3 text-rose-500" />
                    <span>Dispute</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> {post.comments.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-blue-500" /> {post.viewsCount}
                  </span>
                  <button
                    onClick={() => onOpenDetail(post)}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
