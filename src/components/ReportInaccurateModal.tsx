import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportInaccurateModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  onSubmitReport: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  { id: 'fake_news', label: 'Fabricated / Fake Information', desc: 'Claims are demonstrably false or unproven.' },
  { id: 'misleading', label: 'Misleading Context / Exaggerated', desc: 'Facts taken out of context to manipulate emotion.' },
  { id: 'reused_photo', label: 'Old or Reused Photo', desc: 'Image is from an unrelated past incident.' },
  { id: 'hate_speech', label: 'Harmful Rhetoric / Harassment', desc: 'Contains hate speech or dangerous incitement.' },
  { id: 'resolved', label: 'Already Resolved / Outdated', desc: 'The issue has already been fixed or is no longer relevant.' },
];

export const ReportInaccurateModal: React.FC<ReportInaccurateModalProps> = ({
  isOpen,
  onClose,
  headline,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState('fake_news');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Flag className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Report Inaccurate Information
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Feedback Recorded
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Your community dispute has been logged. The AI Authenticity Engine is recalculating this report's community consensus score.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Flagging Report
              </span>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1 italic">
                "{headline}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Primary Reason
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition text-left ${
                      selectedReason === reason.id
                        ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20 text-slate-900 dark:text-white ring-1 ring-rose-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <p className="text-xs font-semibold">{reason.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{reason.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
                Additional Context (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share evidence, official counter-links, or eyewitness observations..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm"
              >
                Submit Citizen Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
