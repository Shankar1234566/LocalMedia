import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Search, 
  Image as ImageIcon, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface ExplainAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainAIModal: React.FC<ExplainAIModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                How LocalMedia AI Truth Engine Works
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Algorithmic integrity, reverse-image scanning, and crowdsourced verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            LocalMedia combines real-time algorithmic evaluation models with citizen crowdsourcing to verify local reports before rumors can cause public panic or civic confusion.
          </p>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" /> 1. Lexical & Clickbait Scan
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Flags sensationalist keywords ("SHOCKING", "YOU WON'T BELIEVE", "100% CURE"), excessive dramatic punctuation, and manufactured panic phrasing.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                <ImageIcon className="w-4 h-4" /> 2. Image Integrity & EXIF
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Simulates reverse image lookup to detect recycled stock photos or past disaster archives presented out-of-context, checking compression metadata.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Search className="w-4 h-4" /> 3. Local Agency Corroboration
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Boosts credibility when reports reference verifiable municipal bodies, transportation authorities, weather services, or specific street intersections.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" /> 4. Crowdsourced Consensus
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Neighbor confirmations ("Confirm Issue") strengthen verification confidence, while community dispute flags trigger automated editorial review.
              </p>
            </div>
          </div>

          {/* Truth Score Badge Scale */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              The Truth Score Badge System
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    🟢 Verified Local Report (85%–100%)
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                    High factual density, corroborating official dispatch records or telemetry, and original unmanipulated photo evidence.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    🟡 Under Community Review (60%–84%)
                  </h4>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    Plausible local incident awaiting secondary eyewitness confirmations or civic authority acknowledgement.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    🔴 Unverified / Flagged Content (&lt;60%)
                  </h4>
                  <p className="text-xs text-rose-800/80 dark:text-rose-300/80 mt-0.5">
                    Marked with cautionary warning banners. Contains clickbait triggers, duplicate photo matches, or uncorroborated panic claims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
