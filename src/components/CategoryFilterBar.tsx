import React from 'react';
import { 
  Building2, 
  ShieldAlert, 
  GraduationCap, 
  CloudRain, 
  Users, 
  LayoutGrid, 
  List, 
  Map, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Category, FilterState, CivicStatus } from '../types';

interface CategoryFilterBarProps {
  filterState: FilterState;
  onCategoryChange: (cat: Category | 'all') => void;
  onTruthStatusChange: (status: FilterState['truthStatus']) => void;
  onCivicStatusChange: (status: FilterState['civicStatus']) => void;
  onSortChange: (sort: FilterState['sortBy']) => void;
  onViewModeChange: (mode: FilterState['viewMode']) => void;
  categoryCounts: Record<Category | 'all', number>;
  truthCounts: {
    all: number;
    verified: number;
    review: number;
    flagged: number;
  };
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  filterState,
  onCategoryChange,
  onTruthStatusChange,
  onCivicStatusChange,
  onSortChange,
  onViewModeChange,
  categoryCounts,
  truthCounts,
}) => {
  const categories: { id: Category | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Reports', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'civic', label: 'Civic & Infrastructure', icon: <Building2 className="w-4 h-4" /> },
    { id: 'crime', label: 'Crime & Safety', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'education', label: 'Education & Student', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'environment', label: 'Environment & Weather', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'community', label: 'Community Events', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filterState.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border-2 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-blue-100 hover:border-blue-400 hover:bg-blue-50/40 shadow-2xs'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                  isActive
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {categoryCounts[cat.id] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar: Truth Filters, Sorting, and View Switcher */}
      <div className="bg-white border-2 border-blue-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        {/* Left: Truth Score Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" /> Credibility:
          </span>

          <button
            onClick={() => onTruthStatusChange('all')}
            className={`text-xs px-2.5 py-1 rounded-lg border-2 font-semibold transition ${
              filterState.truthStatus === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-700 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            All ({truthCounts.all})
          </button>

          <button
            onClick={() => onTruthStatusChange('verified')}
            className={`text-xs px-2.5 py-1 rounded-lg border-2 font-semibold flex items-center gap-1 transition ${
              filterState.truthStatus === 'verified'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified ({truthCounts.verified})</span>
          </button>

          <button
            onClick={() => onTruthStatusChange('review')}
            className={`text-xs px-2.5 py-1 rounded-lg border-2 font-semibold flex items-center gap-1 transition ${
              filterState.truthStatus === 'review'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Under Review ({truthCounts.review})</span>
          </button>

          <button
            onClick={() => onTruthStatusChange('flagged')}
            className={`text-xs px-2.5 py-1 rounded-lg border-2 font-semibold flex items-center gap-1 transition ${
              filterState.truthStatus === 'flagged'
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Flagged ({truthCounts.flagged})</span>
          </button>
        </div>

        {/* Right: Sorting & View Mode */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Civic Status Filter (if civic or all) */}
          {(filterState.category === 'all' || filterState.category === 'civic') && (
            <select
              value={filterState.civicStatus}
              onChange={(e) => onCivicStatusChange(e.target.value as CivicStatus | 'all')}
              className="text-xs py-1.5 px-2.5 rounded-lg border-2 border-blue-200 bg-white text-slate-800 focus:border-blue-600 focus:outline-none"
            >
              <option value="all">Civic Status: All</option>
              <option value="reported">Reported</option>
              <option value="investigating">Investigating</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}

          {/* Sort Dropdown */}
          <select
            value={filterState.sortBy}
            onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
            className="text-xs py-1.5 px-2.5 rounded-lg border-2 border-blue-200 bg-white text-slate-800 focus:border-blue-600 focus:outline-none"
          >
            <option value="latest">Sort: Newest First</option>
            <option value="most_confirmed">Sort: Most Confirmed</option>
            <option value="highest_truth">Sort: Highest Truth Score</option>
            <option value="urgent">Sort: Critical Alerts</option>
          </select>

          {/* View Mode Toggle with blue borders */}
          <div className="flex items-center bg-white p-1 rounded-xl border-2 border-blue-200">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Card Grid View"
              className={`p-1.5 rounded-lg text-xs transition ${
                filterState.viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="Compact Feed View"
              className={`p-1.5 rounded-lg text-xs transition ${
                filterState.viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              title="Interactive Global Map View"
              className={`p-1.5 rounded-lg text-xs transition ${
                filterState.viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
