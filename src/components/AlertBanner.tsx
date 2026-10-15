import React from 'react';
import { AlertTriangle, ShieldCheck, MapPin, X } from 'lucide-react';
import { RegionData } from '../types/haze';

interface AlertBannerProps {
  currentRegionData: RegionData;
  regionName: string;
  onNavigateToSwaps: () => void;
  onNavigateToSupplies: () => void;
  onDismiss?: () => void;
  isDismissed?: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  currentRegionData,
  regionName,
  onNavigateToSwaps,
  onNavigateToSupplies,
  onDismiss,
  isDismissed,
}) => {
  if (isDismissed) return null;

  const isUnhealthy = currentRegionData.psi > 100;
  const isHazardous = currentRegionData.psi > 300;

  if (!isUnhealthy) return null;

  return (
    <div className={`border-b ${isHazardous ? 'bg-purple-50 border-purple-200 text-purple-950' : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 sm:mt-0 ${isHazardous ? 'bg-purple-200 text-purple-900' : 'bg-amber-200 text-amber-900'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                  Tourist Advisory: {currentRegionData.status} ({currentRegionData.psi} PSI)
                </span>
                <span className="text-xs text-amber-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3 inline" /> {regionName} Singapore
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 mt-1 font-medium">
                {currentRegionData.advice} Standard cloth masks do not block PM2.5. Switch outdoor walking plans to climate-controlled indoor attractions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={onNavigateToSwaps}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition-colors shadow-sm whitespace-nowrap"
            >
              Indoor Swaps
            </button>
            <button
              onClick={onNavigateToSupplies}
              className="px-3 py-1.5 text-xs font-medium bg-white text-amber-950 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              N95 Stores
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 text-amber-700 hover:text-amber-950 transition-colors ml-1"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
