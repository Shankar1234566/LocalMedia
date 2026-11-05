import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  Activity, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { VerificationBreakdown } from '../types';

interface AIVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: VerificationBreakdown;
  headline: string;
}

export const AIVerificationModal: React.FC<AIVerificationModalProps> = ({
  isOpen,
  onClose,
  verification,
  headline,
}) => {
  if (!isOpen) return null;

  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-2 border-emerald-300',
        icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
        badgeText: 'Verified Local Report',
      };
    }
    if (score >= 60) {
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-2 border-amber-300',
        icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
        badgeText: 'Under Community Review',
      };
    }
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-2 border-rose-300',
      icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
      badgeText: 'Unverified / Flagged Content',
    };
  };

  const theme = getScoreTheme(verification.overallScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-blue-300 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b-2 border-blue-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                AI Truth Authenticity Engine
              </h2>
              <p className="text-xs text-slate-500">
                Algorithmic credibility, reverse-image, and toxicity verification scan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Post Title Snippet */}
          <div className="bg-blue-50/50 p-3.5 rounded-xl border-2 border-blue-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Scanned Report
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5 line-clamp-2">
              "{headline}"
            </p>
          </div>

          {/* Primary Truth Score Banner */}
          <div className={`p-5 rounded-2xl ${theme.border} ${theme.bg} flex flex-col sm:flex-row items-center gap-5 shadow-xs`}>
            <div className="flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-slate-200">
              {theme.icon}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className={`text-3xl font-black tracking-tight ${theme.text}`}>
                  {verification.overallScore}%
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white shadow-xs border border-slate-300">
                  {theme.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {verification.verificationSummary}
              </p>
            </div>
          </div>

          {/* Warning Banner if < 60% */}
          {verification.overallScore < 60 && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    High Risk / Potential Disinformation Alert
                  </h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {verification.warningReasons.map((reason, idx) => (
                      <li key={idx} className="leading-snug">{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Verification Metrics Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Algorithmic Component Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Text Credibility */}
              <div className="p-3.5 rounded-xl border-2 border-blue-100 bg-white">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <FileText className="w-4 h-4 text-blue-600" /> Text Factuality
                  </span>
                  <span className="font-bold text-slate-900">
                    {verification.textCredibilityScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${verification.textCredibilityScore}%` }} 
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Semantic coherence, context density & syntactic rigor.
                </p>
              </div>

              {/* Clickbait / Sensationalism */}
              <div className="p-3.5 rounded-xl border-2 border-blue-100 bg-white">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Activity className="w-4 h-4 text-purple-600" /> Clickbait Index
                  </span>
                  <span className={`font-bold ${verification.clickbaitScore > 35 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {verification.clickbaitScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${verification.clickbaitScore > 40 ? 'bg-rose-500' : 'bg-purple-600'}`} 
                    style={{ width: `${verification.clickbaitScore}%` }} 
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {verification.clickbaitScore > 30 ? 'Sensationalized phrasing detected.' : 'Clean journalistic phrasing.'}
                </p>
              </div>

              {/* Image Integrity & Reverse Search */}
              <div className="p-3.5 rounded-xl border-2 border-blue-100 bg-white">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <ImageIcon className="w-4 h-4 text-emerald-600" /> Image Integrity Check
                  </span>
                  <span className="font-bold text-slate-900">
                    {verification.imageIntegrityScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${verification.imageIntegrityScore}%` }} 
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Reverse search match: <strong className="text-slate-800">{verification.imageReverseMatchStatus.replace(/_/g, ' ')}</strong>
                </p>
              </div>

              {/* Local Source Corroboration */}
              <div className="p-3.5 rounded-xl border-2 border-blue-100 bg-white">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Search className="w-4 h-4 text-amber-600" /> Local Agency Cross-Check
                  </span>
                  <span className="font-bold text-slate-900">
                    {verification.sourceCorroborationScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${verification.sourceCorroborationScore}%` }} 
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Municipal bulletins, dispatch feeds & geo tags.
                </p>
              </div>
            </div>
          </div>

          {/* Flagged Keywords if any */}
          {verification.flaggedKeywords.length > 0 && (
            <div className="p-3.5 rounded-xl border-2 border-amber-300 bg-amber-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-2">
                Flagged Lexical Triggers ({verification.flaggedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {verification.flaggedKeywords.map((kw, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-white text-amber-900 border border-amber-300"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verification Details Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t-2 border-blue-100">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Scanned: {new Date(verification.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              EXIF Geotag Verification: {verification.exifMetadataFound ? 'Confirmed' : 'Unregistered'}
            </span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 py-3.5 bg-blue-50/40 border-t-2 border-blue-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm border border-blue-500"
          >
            Done Reading Report
          </button>
        </div>
      </div>
    </div>
  );
};
