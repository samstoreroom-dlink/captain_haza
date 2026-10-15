import React from 'react';
import { Wind, Shield, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Wordmark & Purpose */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <span>Captain Haze</span>
            </div>
            <p className="text-xs text-slate-400 mt-2.5 max-w-sm leading-relaxed">
              An independent tourist health and travel companion designed to help visitors explore Singapore safely during transboundary haze periods.
            </p>
            <div className="text-[11px] text-slate-500 mt-4">
              Real-time atmospheric telemetry sourced from Singapore National Environment Agency (NEA) via data.gov.sg.
            </div>
          </div>

          {/* Col 2: Emergency Hotlines */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Singapore Emergency Hotlines
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a href="tel:995" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-semibold text-rose-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>995 (SCDF Emergency Ambulance)</span>
                </a>
              </li>
              <li>
                <a href="tel:1777" className="hover:text-slate-200 transition-colors flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>1777 (Non-Emergency Ambulance)</span>
                </a>
              </li>
              <li>
                <a href="tel:18002255664" className="hover:text-slate-200 transition-colors flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>1800-225-5664 (MOH General)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Official Singapore Portals
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://www.haze.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>NEA Haze Portal (haze.gov.sg)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.stb.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>Singapore Tourism Board (STB)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.moh.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>Ministry of Health (MOH)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>data.gov.sg Open Data</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Captain Haze · Built for tourists visiting Singapore.
          </div>
          <div>
            Always heed official National Environment Agency (NEA) health advisories.
          </div>
        </div>
      </div>
    </footer>
  );
};
