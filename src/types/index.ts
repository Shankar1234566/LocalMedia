export type Category = 
  | 'civic'
  | 'crime'
  | 'education'
  | 'environment'
  | 'community';

export type TruthBadgeLevel = 'verified' | 'review' | 'flagged';

export type CivicStatus = 'reported' | 'investigating' | 'in_progress' | 'resolved';

export interface VerificationBreakdown {
  overallScore: number; // 0 - 100
  badge: TruthBadgeLevel;
  badgeLabel: string;
  textCredibilityScore: number; // 0 - 100
  clickbaitScore: number; // 0 - 100 (higher = worse)
  toxicityScore: number; // 0 - 100
  imageIntegrityScore: number; // 0 - 100
  imageReverseMatchStatus: 'original_local' | 'unverified_source' | 'known_stock_or_reused' | 'potential_manipulation';
  sourceCorroborationScore: number; // 0 - 100
  flaggedKeywords: string[];
  warningReasons: string[];
  verificationSummary: string;
  exifMetadataFound: boolean;
  analyzedAt: string;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isWitness: boolean;
  upvotes: number;
}

export interface Post {
  id: string;
  headline: string;
  description: string;
  category: Category;
  city: string;
  district: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  imageCaption?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    badge?: string;
    isOfficial?: boolean;
  };
  timestamp: string;
  publishedAt: string;
  confirmations: number;
  disputes: number;
  userAction: 'confirmed' | 'disputed' | null;
  verification: VerificationBreakdown;
  civicStatus?: CivicStatus;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  comments: CommentItem[];
  tags: string[];
  isUrgent?: boolean;
}

export interface NewReportFormData {
  headline: string;
  description: string;
  category: Category;
  city: string;
  district: string;
  country: string;
  imageUrl: string;
  imageFile?: File | null;
  authorName: string;
  authorRole: string;
}

export interface FilterState {
  category: Category | 'all';
  searchQuery: string;
  truthStatus: 'all' | 'verified' | 'review' | 'flagged';
  civicStatus: 'all' | CivicStatus;
  sortBy: 'latest' | 'most_confirmed' | 'highest_truth' | 'urgent';
  viewMode: 'grid' | 'list' | 'map';
}
