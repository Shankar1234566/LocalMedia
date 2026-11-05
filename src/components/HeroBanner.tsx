import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Globe2, 
  Activity, 
  Sparkles,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface HeroBannerProps {
  totalReports: number;
  verifiedCount: number;
  reviewCount: number;
  flaggedCount: number;
  averageTruthScore: number;
  activeCitiesCount: number;
  onSelectQuickTag?: (tag: string) => void;
  onOpenExplainAI: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalReports,
  verifiedCount,
  averageTruthScore,
  activeCitiesCount,
  onSelectQuickTag,
  onOpenExplainAI,
}) => {
  return (
    <section className="bg-white border-b-2 border-blue-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Title & Mission Statement */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border-2 border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Citizen Journalism & Civic Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Report Local News. Track Civic Issues. <br />
              <span className="text-blue-600">Verify Truth With AI.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              LocalMedia empowers citizens worldwide to report water leaks, road hazards, campus updates, and safety alerts. Every submission is analyzed by our automated AI News Authenticity Engine to stop misinformation in real time.
            </p>
          </div>

          {/* Quick Truth Engine Explainer Card with Blue Borders */}
          <div className="w-full md:w-auto bg-white border-2 border-blue-200 p-4 rounded-2xl shadow-sm space-y-3 shrink-0 sm:min-w-[320px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" /> Truth Verification Index
              </span>
              <button
                onClick={onOpenExplainAI}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
              >
                How It Works
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Verified */}
              <div className="p-2 rounded-xl bg-emerald-50 border-2 border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                <span className="text-xs font-black text-emerald-700 block mt-1">
                  85–100%
                </span>
                <span className="text-[10px] text-slate-600 font-medium">Verified</span>
              </div>

              {/* Review */}
              <div className="p-2 rounded-xl bg-amber-50 border-2 border-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 mx-auto" />
                <span className="text-xs font-black text-amber-700 block mt-1">
                  60–84%
                </span>
                <span className="text-[10px] text-slate-600 font-medium">In Review</span>
              </div>

              {/* Flagged */}
              <div className="p-2 rounded-xl bg-rose-50 border-2 border-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-600 mx-auto" />
                <span className="text-xs font-black text-rose-700 block mt-1">
                  &lt;60%
                </span>
                <span className="text-[10px] text-slate-600 font-medium">Flagged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Network Metrics Bar with crisp blue border detailing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Total Reports */}
          <div className="bg-white p-3.5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors flex items-center gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 leading-none">
                {totalReports}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Total Published Reports
              </p>
            </div>
          </div>

          {/* Average Truth Score */}
          <div className="bg-white p-3.5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors flex items-center gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 leading-none">
                {averageTruthScore}%
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Avg Truth Accuracy
              </p>
            </div>
          </div>

          {/* Active Cities */}
          <div className="bg-white p-3.5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors flex items-center gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 leading-none">
                {activeCitiesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Global Cities Active
              </p>
            </div>
          </div>

          {/* Verified Community Reports */}
          <div className="bg-white p-3.5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors flex items-center gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 leading-none">
                {verifiedCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verified Citizen Reports
              </p>
            </div>
          </div>
        </div>

        {/* Popular City Quick-Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-600">
          <span className="font-bold text-slate-800 shrink-0">
            Quick City Hubs:
          </span>
          {['Seattle', 'London', 'Sydney', 'New Delhi', 'Tokyo', 'Toronto', 'Chicago', 'Berlin', 'São Paulo', 'Cape Town'].map((city) => (
            <button
              key={city}
              onClick={() => onSelectQuickTag?.(city)}
              className="px-2.5 py-1 rounded-lg border-2 border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-400 text-blue-700 transition shrink-0 font-medium shadow-2xs"
            >
              📍 {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
