import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  LocateFixed,
  Search
} from 'lucide-react';
import { Category, Post, VerificationBreakdown } from '../types';
import { analyzeNewsAuthenticity, SCAN_STEPS } from '../services/authenticityEngine';

interface PublishReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: (newPost: Post) => void;
}

const AP_SAMPLE_PRESETS = [
  {
    id: 'preset-cyclone',
    name: 'Upcoming Thoofan Storm Surge (Vizag/Kakinada)',
    category: 'environment',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-budameru',
    name: 'Budameru Canal / Water Breach (Vijayawada)',
    category: 'civic',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-pothole-ap',
    name: 'NH-16 Highway Hazard (Guntur-Vijayawada)',
    category: 'civic',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-tsunami-hoax',
    name: '⚠️ Fake WhatsApp Tsunami Hoax (Flag Test)',
    category: 'environment',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1000&q=80',
  },
];

export const PublishReportModal: React.FC<PublishReportModalProps> = ({
  isOpen,
  onClose,
  onPublishSuccess,
}) => {
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState<Category>('civic');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Vijayawada');
  const [district, setDistrict] = useState('NTR District');
  const [country, setCountry] = useState('India (Andhra Pradesh)');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('Venkatesh Naidu');
  const [authorRole, setAuthorRole] = useState('Local Resident & Citizen Volunteer');
  
  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState<VerificationBreakdown | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFileChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSelectPreset = (presetUrl: string) => {
    setImageUrl(presetUrl);
    setImagePreview(presetUrl);
    setErrorMsg('');
  };

  const handleAutoLocate = () => {
    setCity('Vijayawada');
    setDistrict('NTR District');
    setCountry('India (Andhra Pradesh)');
  };

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !description.trim() || !city.trim()) {
      setErrorMsg('Please fill out the headline, description, and city location.');
      return;
    }
    setErrorMsg('');
    setIsScanning(true);
    setCurrentStepIndex(0);
    setScanResult(null);

    // 2-second realistic visual scan
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < SCAN_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        const computed = analyzeNewsAuthenticity({
          headline,
          description,
          city,
          category,
          imageUrl: imageUrl || '',
          hasCustomUpload: !!imagePreview,
        });
        setScanResult(computed);
        setIsScanning(false);
      }
    }, 550);
  };

  const handleConfirmPublish = () => {
    if (!scanResult) return;

    const newPost: Post = {
      id: `ap-user-${Date.now()}`,
      headline: headline.trim(),
      description: description.trim(),
      category,
      city: city.trim(),
      district: district.trim() || `${city.trim()} Ward`,
      country: country.trim() || 'India (Andhra Pradesh)',
      coordinates: {
        lat: 16.5062 + (Math.random() - 0.5) * 0.8,
        lng: 80.6480 + (Math.random() - 0.5) * 0.8,
      },
      imageUrl: imagePreview || imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Citizen uploaded report asset from Andhra Pradesh.',
      author: {
        name: authorName.trim() || 'AP Citizen Reporter',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: authorRole.trim() || 'Citizen Reporter',
        badge: 'Verified Citizen',
        isOfficial: false,
      },
      timestamp: 'Just now',
      publishedAt: new Date().toISOString(),
      confirmations: 1,
      disputes: 0,
      userAction: 'confirmed',
      civicStatus: category === 'civic' ? 'reported' : undefined,
      verification: scanResult,
      commentsCount: 0,
      viewsCount: 1,
      sharesCount: 0,
      comments: [],
      tags: [category.toUpperCase(), city.replace(/\s+/g, ''), 'AndhraPradesh'],
    };

    onPublishSuccess(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border-2 border-blue-300 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b-2 border-blue-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Submit Citizen Report (Andhra Pradesh & Regional)
              </h2>
              <p className="text-xs text-slate-500">
                Automated AI Authenticity Engine scans report for clickbait, thoofan rumors, and image validity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal State 1: Verification Scanning Animation */}
          {isScanning && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border-2 border-blue-600 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Search className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900">
                  {SCAN_STEPS[currentStepIndex].label}
                </h3>
                <p className="text-xs text-slate-500">
                  {SCAN_STEPS[currentStepIndex].detail}
                </p>
              </div>

              {/* Progress Steps Indicators with blue borders */}
              <div className="max-w-md mx-auto space-y-2 text-left pt-2">
                {SCAN_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center gap-3 p-2.5 rounded-xl border-2 text-xs transition ${
                        isDone 
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : isCurrent
                          ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className="flex-1 truncate">{step.label}</span>
                      <span className="text-[10px] uppercase font-mono font-bold">
                        {isDone ? 'Completed' : isCurrent ? 'Scanning...' : 'Queued'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal State 2: Verification Scan Result Preview */}
          {!isScanning && scanResult && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  AI Scan Complete
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Truth Authenticity Evaluation
                </h3>
              </div>

              {/* Truth Score Box */}
              <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${
                scanResult.overallScore >= 85
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : scanResult.overallScore >= 60
                  ? 'border-amber-400 bg-amber-50 text-amber-800'
                  : 'border-rose-400 bg-rose-50 text-rose-800'
              }`}>
                <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0 border border-slate-200">
                  {scanResult.overallScore >= 85 ? (
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  ) : scanResult.overallScore >= 60 ? (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  ) : (
                    <ShieldAlert className="w-8 h-8 text-rose-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">
                      {scanResult.overallScore}%
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-300">
                      {scanResult.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed">
                    {scanResult.verificationSummary}
                  </p>
                </div>
              </div>

              {/* Sub-score grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border-2 border-blue-100 bg-white">
                  <span className="text-slate-500">Text Factuality:</span>{' '}
                  <span className="font-bold text-slate-800">{scanResult.textCredibilityScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-blue-100 bg-white">
                  <span className="text-slate-500">Clickbait Penalty:</span>{' '}
                  <span className={`font-bold ${scanResult.clickbaitScore > 30 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {scanResult.clickbaitScore}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-blue-100 bg-white">
                  <span className="text-slate-500">Image Integrity:</span>{' '}
                  <span className="font-bold text-slate-800">{scanResult.imageIntegrityScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-blue-100 bg-white">
                  <span className="text-slate-500">AP / Local Corroboration:</span>{' '}
                  <span className="font-bold text-slate-800">{scanResult.sourceCorroborationScore}%</span>
                </div>
              </div>

              {scanResult.warningReasons.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-900">
                  <span className="font-bold block mb-1">Algorithmic Observation Notes:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {scanResult.warningReasons.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-blue-100">
                <button
                  type="button"
                  onClick={() => setScanResult(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-blue-50 border border-blue-200 transition"
                >
                  Edit Report Details
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPublish}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm border border-blue-500 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Post to Live Feed
                </button>
              </div>
            </div>
          )}

          {/* Modal State 3: Citizen Form Input */}
          {!isScanning && !scanResult && (
            <form onSubmit={handleStartScan} className="space-y-4">
              {/* Category & Location row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Topic Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="civic">Civic & Infrastructure Issues</option>
                    <option value="crime">Crime & Public Safety Alerts</option>
                    <option value="education">Education & Student Community</option>
                    <option value="environment">Environment & Weather Alerts (Thoofan / Rain)</option>
                    <option value="community">Community & Local Events</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1 flex items-center justify-between">
                    <span>City / Town (AP) *</span>
                    <button
                      type="button"
                      onClick={handleAutoLocate}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold normal-case"
                    >
                      <LocateFixed className="w-3 h-3" /> Quick AP Hub
                    </button>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Vijayawada, Visakhapatnam, Guntur, Kakinada, Bapatla"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* District & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    District / Locality
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. NTR District, RK Beach Ward, Prakasam Barrage Area"
                    className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Andhra Pradesh, India"
                    className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Headline *</span>
                  <span className="text-[10px] text-slate-400 font-mono">{headline.length}/120</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. APSDMA Issues Alert: Deep Depression Thoofan Approaching Kakinada Coast"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Detailed Description *</span>
                  <span className="text-[10px] text-slate-400 font-mono">{description.length} chars</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention exact location (e.g., Budameru canal bank, RK Beach Vizag), local municipal body actions (VMC, GVMC, APSDMA), and current flood / warning status..."
                  required
                  className="w-full text-xs p-3 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Drag and Drop Image Uploader */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Photo Evidence / Attachment (Max 5MB)
                </label>
                
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-600 transition bg-blue-50/20"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && e.target.files[0] && handleImageFileChange(e.target.files[0])}
                  />

                  {imagePreview ? (
                    <div className="flex items-center justify-center gap-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-24 h-20 object-cover rounded-xl shadow-xs border-2 border-blue-200" 
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Photo Loaded Ready for Scan
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Click or drag to change image.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 mx-auto text-blue-500" />
                      <p className="text-xs font-bold text-slate-800">
                        Drag and drop a photo here, or <span className="text-blue-600 underline">browse files</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        PNG, JPG, WEBP up to 5MB. AI checks for metadata integrity and reverse duplicates.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick preset selector buttons */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    Quick Sample Presets (Andhra Pradesh Scenarios):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AP_SAMPLE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border-2 transition ${
                          imageUrl === preset.url
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                            : 'bg-white text-slate-700 border-blue-100 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Venkatesh Naidu, Lakshmi Prasad"
                    className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Citizen Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Ward Volunteer, Resident, Eyewitness"
                    className="w-full text-xs p-2.5 rounded-xl border-2 border-blue-200 bg-white text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-blue-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-blue-50 border border-blue-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm border border-blue-500 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Post & Verify Authenticity
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
