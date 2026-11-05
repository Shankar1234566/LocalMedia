import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  ThumbsUp, 
  Flag, 
  Share2, 
  Clock, 
  MessageSquare, 
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onOpenDetail: (post: Post) => void;
  onToggleConfirm: (postId: string) => void;
  onOpenDispute: (post: Post) => void;
  onOpenAIModal: (post: Post) => void;
  onFilterByCity?: (city: string) => void;
  onFilterByCategory?: (category: any) => void;
  onSharePost?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onOpenDetail,
  onToggleConfirm,
  onOpenDispute,
  onOpenAIModal,
  onFilterByCity,
  onFilterByCategory,
  onSharePost,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'civic':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'crime':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'education':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'environment':
        return 'bg-teal-50 text-teal-700 border-teal-300';
      case 'community':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-300';
    }
  };

  const getTruthTheme = (score: number) => {
    if (score >= 85) {
      return {
        badgeClass: 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400 hover:bg-emerald-100',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
        label: 'Verified Local Report',
      };
    }
    if (score >= 60) {
      return {
        badgeClass: 'bg-amber-50 text-amber-700 border-2 border-amber-400 hover:bg-amber-100',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        label: 'Under Review',
      };
    }
    return {
      badgeClass: 'bg-rose-50 text-rose-700 border-2 border-rose-400 hover:bg-rose-100 animate-pulse',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Flagged Content',
    };
  };

  const truthTheme = getTruthTheme(post.verification.overallScore);

  const getCivicStatusBadge = (status?: string) => {
    if (!status) return null;
    const styles: Record<string, string> = {
      reported: 'bg-slate-100 text-slate-700 border border-slate-300',
      investigating: 'bg-amber-50 text-amber-800 border border-amber-300',
      in_progress: 'bg-blue-50 text-blue-800 border border-blue-300',
      resolved: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[status] || styles.reported}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <article className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Media Container */}
        <div 
          className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer border-b-2 border-blue-100"
          onClick={() => onOpenDetail(post)}
        >
          <img
            src={post.imageUrl}
            alt={post.headline}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80';
              setImageLoaded(true);
            }}
          />

          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse" />
          )}

          {/* Category Badge overlay with blue border */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterByCategory?.(post.category);
              }}
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border-2 shadow-sm backdrop-blur-md ${getCategoryTheme(post.category)}`}
            >
              {post.category}
            </button>
            {getCivicStatusBadge(post.civicStatus)}
          </div>

          {/* Truth Score Badge Overlay (Clickable to open AI Breakdown) */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAIModal(post);
              }}
              className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shadow-md transition transform group-hover:scale-105 ${truthTheme.badgeClass}`}
              title="Click to view full AI Authenticity & Credibility Analysis"
            >
              {truthTheme.icon}
              <span>{post.verification.overallScore}% Truth</span>
            </button>
          </div>

          {/* Location Bar overlay at bottom of photo */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterByCity?.(post.city);
              }}
              className="flex items-center gap-1 hover:underline font-semibold truncate drop-shadow"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{post.city}, {post.country}</span>
            </button>
            <span className="text-[11px] text-white/90 shrink-0 drop-shadow flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.timestamp}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Explanatory Alert Banner if Flagged (<60%) */}
          {post.verification.overallScore < 60 && (
            <div 
              onClick={() => onOpenAIModal(post)}
              className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-[11px] text-rose-800 flex items-start gap-2 cursor-pointer hover:bg-rose-100 transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider block">Potential Misinformation:</span>
                <span className="line-clamp-2">
                  {post.verification.warningReasons[0] || 'Flagged for sensationalized claims or unverified media.'}
                </span>
              </div>
            </div>
          )}

          {/* Headline */}
          <h2 
            onClick={() => onOpenDetail(post)}
            className="text-base sm:text-lg font-bold text-slate-900 leading-snug cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
          >
            {post.headline}
          </h2>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {post.description}
          </p>

          {/* Reporter byline */}
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-blue-200" 
              />
              <span className="truncate font-semibold text-slate-700">
                {post.author.name}
              </span>
              {post.author.isOfficial && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] shrink-0 text-slate-400">
              <Eye className="w-3 h-3 text-blue-500" />
              <span>{post.viewsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crowdsource Action Bar Footer with clean blue border detailing */}
      <div className="px-4 py-3 bg-white border-t-2 border-blue-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Confirm Issue button */}
          <button
            onClick={() => onToggleConfirm(post.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold border-2 transition ${
              post.userAction === 'confirmed'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
            }`}
            title="Confirm this issue as local witness"
          >
            <ThumbsUp className="w-3 h-3 text-blue-600" />
            <span>Confirm ({post.confirmations})</span>
          </button>

          {/* Report Inaccurate button */}
          <button
            onClick={() => onOpenDispute(post)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition border-2 border-transparent hover:border-rose-300"
            title="Report inaccurate or misleading information"
          >
            <Flag className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">Dispute</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Comments count */}
          <button
            onClick={() => onOpenDetail(post)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
            title="View comments and eyewitness reports"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{post.comments.length}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => onSharePost?.(post)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
            title="Share report"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
