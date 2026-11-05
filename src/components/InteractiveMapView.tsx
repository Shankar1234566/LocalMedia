import React, { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  X,
  ZoomIn,
  ZoomOut,
  Compass
} from 'lucide-react';
import { Post } from '../types';

interface InteractiveMapViewProps {
  posts: Post[];
  onOpenDetail: (post: Post) => void;
  onOpenAIModal: (post: Post) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  posts,
  onOpenDetail,
  onOpenAIModal,
}) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Convert GPS lat/long to SVG percentages (Mercator approximate projection)
  const getCoordinatesPercent = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 50 - (mercN / (2 * Math.PI)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const getPinColor = (score: number) => {
    if (score >= 85) return { bg: 'bg-emerald-500', ring: 'ring-emerald-400' };
    if (score >= 60) return { bg: 'bg-amber-500', ring: 'ring-amber-400' };
    return { bg: 'bg-rose-500', ring: 'ring-rose-400' };
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-4 sm:p-6">
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            Global Citizen Incident & Truth Map
          </h2>
          <p className="text-xs text-slate-500">
            Interactive geographic visualization of verified civic issues and flagged reports
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
            <span className="text-slate-700 font-medium">Verified (85%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-300" />
            <span className="text-slate-700 font-medium">Under Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-300" />
            <span className="text-slate-700 font-medium">Flagged Hoax</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-slate-950 border-2 border-blue-300 shadow-inner select-none">
        {/* World Grid Lines and Continents Stylized Canvas */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(59, 130, 246, 0.4)" strokeDasharray="4 4" strokeWidth="1.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(59, 130, 246, 0.4)" strokeDasharray="4 4" strokeWidth="1.5" />
        </svg>

        {/* Ambient Map Glow */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Zoom Controls with blue border */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white border-2 border-blue-200 p-1.5 rounded-xl shadow-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.3))}
            className="p-1.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.3))}
            className="p-1.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition text-[10px] font-mono font-bold"
            title="Reset Zoom"
          >
            1x
          </button>
        </div>

        {/* Interactive Scaled Coordinate Container */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {posts.map((post) => {
            const { x, y } = getCoordinatesPercent(post.coordinates.lat, post.coordinates.lng);
            const pin = getPinColor(post.verification.overallScore);
            const isSelected = selectedPost?.id === post.id;

            return (
              <button
                key={post.id}
                onClick={() => setSelectedPost(post)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform z-10 ${
                  isSelected ? 'scale-150 z-30' : 'hover:scale-135'
                }`}
                title={`${post.headline} (${post.city}) - ${post.verification.overallScore}% Truth`}
              >
                <div className="relative flex items-center justify-center">
                  {(post.isUrgent || isSelected) && (
                    <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75 ${pin.bg}`} />
                  )}
                  <div className={`w-4 h-4 rounded-full ${pin.bg} ring-2 ring-white shadow-md shadow-black/60 flex items-center justify-center`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <span className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap border-2 border-blue-400">
                  {post.city} ({post.verification.overallScore}%)
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Post Popover Card */}
        {selectedPost && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-white border-2 border-blue-300 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-300">
                    {selectedPost.category}
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {selectedPost.city}, {selectedPost.country}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-3">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.headline}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-blue-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {selectedPost.headline}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-black ${
                      selectedPost.verification.overallScore >= 85 ? 'text-emerald-700' :
                      selectedPost.verification.overallScore >= 60 ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {selectedPost.verification.overallScore}% Truth Score
                    </span>
                    <span className="text-[10px] text-slate-500">• {selectedPost.confirmations} confirmed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-100">
                <button
                  onClick={() => onOpenAIModal(selectedPost)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" /> AI Scan
                </button>
                <button
                  onClick={() => onOpenDetail(selectedPost)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1 shadow-sm border border-blue-500"
                >
                  <ExternalLink className="w-3 h-3" /> Full Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
