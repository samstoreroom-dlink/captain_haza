import React from 'react';
import { RefreshCw, Wind, Droplets, Thermometer, Compass, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { RegionKey, PsiApiResponse } from '../types/haze';

interface HeroAirQualityProps {
  psiData: PsiApiResponse | null;
  selectedRegion: RegionKey;
  onSelectRegion: (reg: RegionKey) => void;
  onRefresh: () => void;
  loading: boolean;
  onOpenConcierge: () => void;
}

export const HeroAirQuality: React.FC<HeroAirQualityProps> = ({
  psiData,
  selectedRegion,
  onSelectRegion,
  onRefresh,
  loading,
  onOpenConcierge,
}) => {
  const regions: { id: RegionKey; label: string; sub: string }[] = [
    { id: 'national', label: 'All Singapore', sub: 'Islandwide Average' },
    { id: 'south', label: 'South', sub: 'Marina Bay / Sentosa' },
    { id: 'central', label: 'Central', sub: 'Orchard / Bugis' },
    { id: 'east', label: 'East', sub: 'Changi Airport' },
    { id: 'west', label: 'West', sub: 'Jurong' },
    { id: 'north', label: 'North', sub: 'Woodlands / Zoo' },
  ];

  const currentData = psiData?.regions[selectedRegion] || {
    psi: 168,
    pm25_one_hr: 142,
    status: 'Unhealthy' as const,
    color: 'amber' as const,
    advice: 'Reduce prolonged outdoor physical exertion. Sensitive persons avoid outdoors.',
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Moderate':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Unhealthy':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Very Unhealthy':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Hazardous':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getPsiGaugePercentage = (psi: number) => {
    // 0 - 300 scale
    return Math.min(100, Math.max(5, (psi / 300) * 100));
  };

  const formatUpdateTime = (isoStr?: string) => {
    if (!isoStr) return 'Just now';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' SGT';
    } catch {
      return 'Recent';
    }
  };

  return (
    <section id="air-quality" className="relative pt-6 pb-12 overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Kicker & Live NEA Feed Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Singapore Air Quality Portal</span>
              <span aria-hidden="true">·</span>
              <span>Official NEA & data.gov.sg Feed</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-700">Updated {formatUpdateTime(psiData?.update_timestamp)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Singapore Tourist Haze Guide & Live PSI
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Readings</span>
            </button>
            <button
              onClick={onOpenConcierge}
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5 border border-amber-300 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Travel AI Helper</span>
            </button>
          </div>
        </div>

        {/* Region Selector Tab Bar */}
        <div className="mt-6">
          <div className="text-xs font-medium text-slate-500 mb-2">Select Tourist Destination Zone:</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {regions.map((reg) => {
              const regData = psiData?.regions[reg.id];
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => onSelectRegion(reg.id)}
                  className={`px-3.5 py-2 text-left rounded-xl transition-all whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{reg.label}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {reg.sub}
                    </span>
                    {regData && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        isSelected
                          ? 'bg-slate-800 text-amber-300'
                          : regData.psi > 100
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {regData.psi} PSI
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Split: Air Quality Status Dial + Visual Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          {/* Left Column: Big PSI & PM2.5 Dashboard Box */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold tracking-wide uppercase text-slate-300">
                    {regions.find((r) => r.id === selectedRegion)?.label} Singapore
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusBadgeClass(currentData.status)}`}>
                  {currentData.status}
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-800">
                {/* 24-hr PSI */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>24-Hour PSI</span>
                    <span className="text-[11px] text-slate-500">Official Index</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-white tabular-nums">
                      {currentData.psi}
                    </span>
                    <span className="text-xs font-bold text-amber-400 uppercase">PSI</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Pollutant Standards Index aggregate over 24 hours.
                  </p>
                </div>

                {/* 1-hr PM2.5 */}
                <div className="sm:border-l sm:border-slate-800 sm:pl-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>1-Hour PM2.5</span>
                    <span className="text-[11px] text-amber-400 font-semibold">Immediate Real-Time</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-amber-400 tabular-nums">
                      {currentData.pm25_one_hr}
                    </span>
                    <span className="text-xs font-bold text-slate-300">µg/m³</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Key indicator for what to do over the next 1-2 hours.
                  </p>
                </div>
              </div>

              {/* Visual Gauge Bar */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                  <span>Good (0-50)</span>
                  <span>Moderate (51-100)</span>
                  <span className="text-amber-400 font-bold">Unhealthy (101-200)</span>
                  <span className="text-rose-400">Very Unhealthy (201-300)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      currentData.psi <= 50
                        ? 'bg-emerald-500'
                        : currentData.psi <= 100
                        ? 'bg-blue-500'
                        : currentData.psi <= 200
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${getPsiGaugePercentage(currentData.psi)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Practical Tourist Advice Kicker */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Health Advisory for Tourists
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {currentData.advice} If doing outdoor walking in Marina Bay or Orchard, limit exposure to under 45 minutes and wear a certified N95 respirator.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Skyline Card + Meteorological Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 relative">
            {/* Skyline Image */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden">
              <img
                src="/src/assets/images/sg_haze_skyline_1792052192623.jpg"
                alt="Singapore Marina Bay Skyline in Atmospheric Haze"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 px-2 py-0.5 bg-black/50 rounded backdrop-blur-xs">
                  Atmospheric Observation
                </span>
                <p className="text-xs font-medium text-slate-200 mt-1">
                  Transboundary smoke haze transported by southwesterly monsoon winds over the Singapore Strait.
                </p>
              </div>
            </div>

            {/* Weather & Monsoon Telemetry Grid */}
            <div className="p-5 bg-white flex-1 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Current Meteorological Telemetry
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Prevailing Wind</div>
                    <div className="text-xs font-bold text-slate-900">{psiData?.weather.wind_direction || 'South-Southwest (SSW)'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Wind Speed</div>
                    <div className="text-xs font-bold text-slate-900 font-mono">{psiData?.weather.wind_speed_kmh || 16} km/h</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Temperature</div>
                    <div className="text-xs font-bold text-slate-900 font-mono">{psiData?.weather.temperature_c || 31}°C (88°F)</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Relative Humidity</div>
                    <div className="text-xs font-bold text-slate-900 font-mono">{psiData?.weather.humidity_pct || 76}%</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Southwest Monsoon Season</span>
                <span className="font-semibold text-slate-700">June – October Period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
