import React from 'react';
import { Wind, MessageSquare, Bell, BellRing } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAiChat: () => void;
  alertThresholdActive: boolean;
  onToggleAlertThreshold: () => void;
  currentPsi: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  onOpenAiChat,
  alertThresholdActive,
  onToggleAlertThreshold,
  currentPsi,
}) => {
  const navItems = [
    { id: 'air-quality', label: 'Live Air Quality' },
    { id: 'what-is-haze', label: 'Haze Explained' },
    { id: 'itineraries', label: 'Indoor Itineraries' },
    { id: 'symptoms', label: 'Symptom Care' },
    { id: 'supplies-clinics', label: 'Supplies & Clinics' },
  ];

  const isUnhealthy = currentPsi > 100;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Wind className="w-5 h-5 text-amber-400" />
            </div>
            <a
              href="#air-quality"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('air-quality');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-amber-600 transition-colors"
            >
              Captain Haze
            </a>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  activeSection === item.id
                    ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button + alert threshold button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleAlertThreshold}
              title={alertThresholdActive ? 'Tourist Alert Active: Notifying if PSI > 100' : 'Enable Tourist Alert for PSI > 100'}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
                alertThresholdActive && isUnhealthy
                  ? 'bg-amber-50 border-amber-300 text-amber-800 animate-pulse'
                  : alertThresholdActive
                  ? 'bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              {alertThresholdActive ? (
                <BellRing className="w-4 h-4 text-amber-600" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {alertThresholdActive ? 'Alerts ON' : 'Notify'}
              </span>
            </button>

            <button
              onClick={onOpenAiChat}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask Concierge</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
