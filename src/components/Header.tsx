import React from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  RotateCcw, 
  MapPin
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPublishModal: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onResetData: () => void;
  totalPosts: number;
  verifiedRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenPublishModal,
  onResetData,
  totalPosts,
  verifiedRate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-blue-200 shadow-sm">
      {/* Top Emergency Ticker Marquee with clean blue trim */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-[11px] font-medium py-1.5 px-4 overflow-hidden border-b border-blue-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-bold tracking-wider uppercase text-[10px] bg-white/20 border border-white/30 px-1.5 py-0.5 rounded">
              LIVE NETWORK
            </span>
          </div>

          <div className="truncate text-white flex items-center gap-4 text-[11px]">
            <span>🚨 <strong>Seattle:</strong> 36-Inch Water Main Rupture on 4th Ave (Repair Crews Dispatched)</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">⚡ <strong>Johannesburg:</strong> Substation fire in Greenhills; backup grid engaged</span>
            <span className="hidden lg:inline">•</span>
            <span className="hidden lg:inline">🌊 <strong>Sydney:</strong> Flash Flood warning along Riverside Parkway</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0 text-[10px] font-mono text-blue-100">
            <span>{totalPosts} REPORTS</span>
            <span>•</span>
            <span className="text-emerald-300 font-bold">{verifiedRate}% VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white border-2 border-blue-400 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    Local<span className="text-blue-600">Media</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border-2 border-blue-200">
                    AI Verified
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 hidden sm:inline">
                  Global Citizen Journalism & Civic Tracker
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar with crisp blue border */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by city, country, or issue (e.g., Seattle, pothole, flood)..."
                className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border-2 border-blue-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Submit Report CTA */}
            <button
              onClick={onOpenPublishModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {/* Reset Sample Data with crisp blue border */}
            <button
              onClick={onResetData}
              title="Reset feed to initial 50 sample posts"
              className="p-2 rounded-xl text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border-2 border-blue-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by city, country, or issue..."
              className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border-2 border-blue-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
