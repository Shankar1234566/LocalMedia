import React, { useState, useEffect, useMemo } from 'react';
import { SAMPLE_POSTS } from './data/samplePosts';
import { Post, Category, FilterState, CommentItem, CivicStatus } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { PostCard } from './components/PostCard';
import { FeedListView } from './components/FeedListView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { PublishReportModal } from './components/PublishReportModal';
import { PostDetailModal } from './components/PostDetailModal';
import { AIVerificationModal } from './components/AIVerificationModal';
import { ReportInaccurateModal } from './components/ReportInaccurateModal';
import { ExplainAIModal } from './components/ExplainAIModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  Sparkles, 
  SearchX, 
  RotateCcw, 
  ShieldCheck, 
  Radio, 
  MapPin, 
  PlusCircle,
  FileCheck
} from 'lucide-react';

const STORAGE_KEY = 'localmedia_posts_v1';
const THEME_KEY = 'localmedia_theme';

export function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Posts state with LocalStorage persistence
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved posts:', e);
    }
    return SAMPLE_POSTS;
  });

  // Filter & Search State
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    truthStatus: 'all',
    civicStatus: 'all',
    sortBy: 'latest',
    viewMode: 'grid',
  });

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);
  const [activeAIPost, setActiveAIPost] = useState<Post | null>(null);
  const [activeDisputePost, setActiveDisputePost] = useState<Post | null>(null);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme with HTML document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Persist posts whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save posts to localStorage:', e);
    }
  }, [posts]);

  // Handle resetting back to initial sample dataset
  const handleResetData = () => {
    if (window.confirm('Reset all posts and votes to the 50 initial sample items?')) {
      setPosts(SAMPLE_POSTS);
      localStorage.removeItem(STORAGE_KEY);
      addToast('info', 'Feed Reset', 'All 50 sample news reports restored to original state.');
    }
  };

  // Handle post confirmation (upvote / crowdsource verification)
  const handleToggleConfirm = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const isCurrentlyConfirmed = post.userAction === 'confirmed';
        const newConfirmations = isCurrentlyConfirmed
          ? Math.max(0, post.confirmations - 1)
          : post.confirmations + 1;
        const newUserAction = isCurrentlyConfirmed ? null : 'confirmed';

        // Adjust truth score slightly based on community eyewitness confirmation
        const scoreDelta = isCurrentlyConfirmed ? -1 : 1;
        const newScore = Math.min(99, Math.max(10, post.verification.overallScore + scoreDelta));
        const newBadge = newScore >= 85 ? 'verified' : newScore >= 60 ? 'review' : 'flagged';

        return {
          ...post,
          confirmations: newConfirmations,
          userAction: newUserAction,
          verification: {
            ...post.verification,
            overallScore: newScore,
            badge: newBadge,
          },
        };
      })
    );

    // If modal is active on this post, update it
    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost((prev) => {
        if (!prev) return null;
        const isCurrentlyConfirmed = prev.userAction === 'confirmed';
        return {
          ...prev,
          confirmations: isCurrentlyConfirmed ? prev.confirmations - 1 : prev.confirmations + 1,
          userAction: isCurrentlyConfirmed ? null : 'confirmed',
        };
      });
    }

    addToast('success', 'Issue Confirmed', 'Your eyewitness confirmation strengthens community verification.');
  };

  // Handle reporting inaccurate information
  const handleSubmitDispute = (reason: string, details: string) => {
    if (!activeDisputePost) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== activeDisputePost.id) return post;
        // Deduct truth score for dispute
        const newDisputes = post.disputes + 1;
        const newScore = Math.max(12, post.verification.overallScore - 7);
        const newBadge = newScore >= 85 ? 'verified' : newScore >= 60 ? 'review' : 'flagged';
        const updatedReasons = [...post.verification.warningReasons];
        if (!updatedReasons.some((r) => r.includes('community dispute'))) {
          updatedReasons.push(`Reported by community: ${reason.replace(/_/g, ' ')}`);
        }

        return {
          ...post,
          disputes: newDisputes,
          userAction: 'disputed',
          verification: {
            ...post.verification,
            overallScore: newScore,
            badge: newBadge,
            warningReasons: updatedReasons,
          },
        };
      })
    );

    addToast('warning', 'Dispute Recorded', 'The AI engine has adjusted the consensus rating for this report.');
  };

  // Handle publishing newly created report
  const handlePublishSuccess = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    addToast(
      'success',
      'Report Published!',
      `AI verified with a ${newPost.verification.overallScore}% Truth Score (${newPost.verification.badgeLabel}).`
    );
  };

  // Handle adding comment
  const handleAddComment = (postId: string, comment: CommentItem) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [comment, ...post.comments],
        };
      })
    );

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
          comments: [comment, ...prev.comments],
        };
      });
    }

    addToast('success', 'Comment Added', 'Your contribution has been posted to the public thread.');
  };

  // Handle civic resolution status update
  const handleUpdateCivicStatus = (postId: string, newStatus: CivicStatus) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, civicStatus: newStatus } : p))
    );
    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost((prev) => (prev ? { ...prev, civicStatus: newStatus } : null));
    }
    addToast('info', 'Civic Status Updated', `Status changed to "${newStatus.replace('_', ' ')}".`);
  };

  // Handle sharing
  const handleSharePost = (post: Post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('success', 'Link Copied', `Sharable link for "${post.headline.slice(0, 30)}..." copied to clipboard.`);
    }
  };

  // Computed platform statistics
  const platformStats = useMemo(() => {
    const total = posts.length;
    let verified = 0;
    let review = 0;
    let flagged = 0;
    let totalScore = 0;
    const citiesSet = new Set<string>();

    posts.forEach((p) => {
      totalScore += p.verification.overallScore;
      if (p.verification.overallScore >= 85) verified++;
      else if (p.verification.overallScore >= 60) review++;
      else flagged++;

      if (p.city) citiesSet.add(p.city);
    });

    const averageScore = total > 0 ? Math.round(totalScore / total) : 0;
    const verifiedRate = total > 0 ? Math.round((verified / total) * 100) : 0;

    return {
      total,
      verified,
      review,
      flagged,
      averageScore,
      verifiedRate,
      activeCities: citiesSet.size,
    };
  }, [posts]);

  // Category counts for category tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<Category | 'all', number> = {
      all: posts.length,
      civic: 0,
      crime: 0,
      education: 0,
      environment: 0,
      community: 0,
    };
    posts.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [posts]);

  // Truth counts
  const truthCounts = useMemo(() => {
    let verified = 0;
    let review = 0;
    let flagged = 0;
    posts.forEach((p) => {
      if (p.verification.overallScore >= 85) verified++;
      else if (p.verification.overallScore >= 60) review++;
      else flagged++;
    });
    return {
      all: posts.length,
      verified,
      review,
      flagged,
    };
  }, [posts]);

  // Filtered and Sorted Posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Category filter
    if (filterState.category !== 'all') {
      result = result.filter((p) => p.category === filterState.category);
    }

    // Truth Status filter
    if (filterState.truthStatus === 'verified') {
      result = result.filter((p) => p.verification.overallScore >= 85);
    } else if (filterState.truthStatus === 'review') {
      result = result.filter((p) => p.verification.overallScore >= 60 && p.verification.overallScore < 85);
    } else if (filterState.truthStatus === 'flagged') {
      result = result.filter((p) => p.verification.overallScore < 60);
    }

    // Civic status filter
    if (filterState.civicStatus !== 'all') {
      result = result.filter((p) => p.civicStatus === filterState.civicStatus);
    }

    // Search query filter (headline, description, city, country, tags)
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.headline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (filterState.sortBy) {
      case 'most_confirmed':
        result.sort((a, b) => b.confirmations - a.confirmations);
        break;
      case 'highest_truth':
        result.sort((a, b) => b.verification.overallScore - a.verification.overallScore);
        break;
      case 'urgent':
        result.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
        break;
      case 'latest':
      default:
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
    }

    return result;
  }, [posts, filterState]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header Bar */}
      <Header
        searchQuery={filterState.searchQuery}
        onSearchChange={(q) => setFilterState((prev) => ({ ...prev, searchQuery: q }))}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((d) => !d)}
        onResetData={handleResetData}
        totalPosts={platformStats.total}
        verifiedRate={platformStats.verifiedRate}
      />

      {/* Hero Analytics & Explanation Banner */}
      <HeroBanner
        totalReports={platformStats.total}
        verifiedCount={platformStats.verified}
        reviewCount={platformStats.review}
        flaggedCount={platformStats.flagged}
        averageTruthScore={platformStats.averageScore}
        activeCitiesCount={platformStats.activeCities}
        onSelectQuickTag={(city) => setFilterState((prev) => ({ ...prev, searchQuery: city }))}
        onOpenExplainAI={() => setIsExplainModalOpen(true)}
      />

      {/* Main Feed Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Category Tabs & Filter Toolbar */}
        <CategoryFilterBar
          filterState={filterState}
          onCategoryChange={(cat) => setFilterState((prev) => ({ ...prev, category: cat }))}
          onTruthStatusChange={(ts) => setFilterState((prev) => ({ ...prev, truthStatus: ts }))}
          onCivicStatusChange={(cs) => setFilterState((prev) => ({ ...prev, civicStatus: cs }))}
          onSortChange={(sort) => setFilterState((prev) => ({ ...prev, sortBy: sort }))}
          onViewModeChange={(mode) => setFilterState((prev) => ({ ...prev, viewMode: mode }))}
          categoryCounts={categoryCounts}
          truthCounts={truthCounts}
        />

        {/* Results Counter and Filter Clear indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <p>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredPosts.length}</strong> of{' '}
            {posts.length} citizen reports
            {filterState.searchQuery && (
              <span>
                {' '}matching "<strong>{filterState.searchQuery}</strong>"
              </span>
            )}
          </p>

          {(filterState.category !== 'all' ||
            filterState.truthStatus !== 'all' ||
            filterState.civicStatus !== 'all' ||
            filterState.searchQuery) && (
            <button
              onClick={() =>
                setFilterState({
                  category: 'all',
                  searchQuery: '',
                  truthStatus: 'all',
                  civicStatus: 'all',
                  sortBy: 'latest',
                  viewMode: filterState.viewMode,
                })
              }
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>

        {/* Empty Search Result State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <SearchX className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching reports found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We couldn't find any reports matching your current category, search query, or credibility filter.
              </p>
            </div>
            <button
              onClick={() =>
                setFilterState({
                  category: 'all',
                  searchQuery: '',
                  truthStatus: 'all',
                  civicStatus: 'all',
                  sortBy: 'latest',
                  viewMode: 'grid',
                })
              }
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* View Mode 1: Interactive Map View */}
        {filterState.viewMode === 'map' && filteredPosts.length > 0 && (
          <InteractiveMapView
            posts={filteredPosts}
            onOpenDetail={(post) => setActiveDetailPost(post)}
            onOpenAIModal={(post) => setActiveAIPost(post)}
          />
        )}

        {/* View Mode 2: Compact List / Feed View */}
        {filterState.viewMode === 'list' && filteredPosts.length > 0 && (
          <FeedListView
            posts={filteredPosts}
            onOpenDetail={(post) => setActiveDetailPost(post)}
            onToggleConfirm={handleToggleConfirm}
            onOpenDispute={(post) => setActiveDisputePost(post)}
            onOpenAIModal={(post) => setActiveAIPost(post)}
          />
        )}

        {/* View Mode 3: Responsive Grid View (Default) */}
        {filterState.viewMode === 'grid' && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onOpenDetail={(p) => setActiveDetailPost(p)}
                onToggleConfirm={handleToggleConfirm}
                onOpenDispute={(p) => setActiveDisputePost(p)}
                onOpenAIModal={(p) => setActiveAIPost(p)}
                onFilterByCity={(city) => setFilterState((prev) => ({ ...prev, searchQuery: city }))}
                onFilterByCategory={(cat) => setFilterState((prev) => ({ ...prev, category: cat }))}
                onSharePost={handleSharePost}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              LM
            </div>
            <span className="font-bold text-slate-900 dark:text-white">LocalMedia</span>
            <span>• Global Citizen Reporting, Civic Issue Tracker & AI Fake-News Verification Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsExplainModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Verification Model
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Reset 50 Samples
            </button>
            <span>•</span>
            <span>Local & Civic Journalism Protocol</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Citizen Publishing Modal */}
      <PublishReportModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublishSuccess={handlePublishSuccess}
      />

      {/* 2. Post Detail Reader Modal */}
      <PostDetailModal
        post={activeDetailPost}
        isOpen={!!activeDetailPost}
        onClose={() => setActiveDetailPost(null)}
        onToggleConfirm={handleToggleConfirm}
        onOpenDisputeModal={(post) => setActiveDisputePost(post)}
        onOpenAIModal={(post) => setActiveAIPost(post)}
        onAddComment={handleAddComment}
        onUpdateCivicStatus={handleUpdateCivicStatus}
      />

      {/* 3. Deep AI Verification Breakdown Modal */}
      {activeAIPost && (
        <AIVerificationModal
          isOpen={!!activeAIPost}
          onClose={() => setActiveAIPost(null)}
          verification={activeAIPost.verification}
          headline={activeAIPost.headline}
        />
      )}

      {/* 4. Crowdsourced Dispute / Report Inaccurate Modal */}
      {activeDisputePost && (
        <ReportInaccurateModal
          isOpen={!!activeDisputePost}
          onClose={() => setActiveDisputePost(null)}
          headline={activeDisputePost.headline}
          onSubmitReport={handleSubmitDispute}
        />
      )}

      {/* 5. How Verification Engine Works Modal */}
      <ExplainAIModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </div>
  );
}

export default App;
