import React from 'react';
import { RegionKey, PsiApiResponse } from '../types/haze';
import { MapPin, Navigation, Info } from 'lucide-react';

interface SingaporeMapProps {
  psiData: PsiApiResponse | null;
  selectedRegion: RegionKey;
  onSelectRegion: (reg: RegionKey) => void;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  psiData,
  selectedRegion,
  onSelectRegion,
}) => {
  const regionConfig: {
    key: RegionKey;
    name: string;
    landmarks: string[];
    description: string;
    pathD: string;
    labelX: number;
    labelY: number;
  }[] = [
    {
      key: 'north',
      name: 'North Region',
      landmarks: ['Singapore Zoo', 'Mandai Wildlife Reserve', 'Woodlands', 'Yishun'],
      description: 'Lush nature reserves and wildlife parks. High tree density, but open forest exposure during haze.',
      pathD: 'M 250 80 Q 380 40 450 70 L 460 130 Q 360 150 260 130 Z',
      labelX: 350,
      labelY: 100,
    },
    {
      key: 'central',
      name: 'Central Region',
      landmarks: ['Orchard Road', 'Bugis', 'Botanic Gardens', 'Bishan', 'Marina Center'],
      description: 'Main shopping, dining, and cultural core. Underground MRT connections provide excellent haze shelter.',
      pathD: 'M 260 130 Q 360 150 460 130 L 470 210 Q 350 230 250 200 Z',
      labelX: 355,
      labelY: 175,
    },
    {
      key: 'south',
      name: 'South Region',
      landmarks: ['Marina Bay Sands', 'Sentosa Island', 'Chinatown', 'Gardens by the Bay', 'CBD'],
      description: 'Prime tourist attractions and seaside boardwalks. High exposure to direct coastal winds from Singapore Strait.',
      pathD: 'M 250 200 Q 350 230 470 210 L 450 290 Q 340 310 240 280 Z',
      labelX: 350,
      labelY: 255,
    },
    {
      key: 'west',
      name: 'West Region',
      landmarks: ['Jurong Bird Paradise', 'Science Centre', 'NTU', 'Clementi', 'West Coast'],
      description: 'Major industrial and educational hub. Often records slightly elevated readings due to proximity to the Malacca Strait.',
      pathD: 'M 70 140 Q 200 110 260 130 L 250 280 Q 140 290 60 210 Z',
      labelX: 160,
      labelY: 195,
    },
    {
      key: 'east',
      name: 'East Region',
      landmarks: ['Jewel Changi Airport', 'East Coast Park', 'Katong / Joo Chiat', 'Pasir Ris'],
      description: 'Airport corridor and famous food heritage streets. Jewel Changi offers the ultimate indoor haze refuge.',
      pathD: 'M 460 100 Q 600 130 650 180 L 590 260 Q 480 250 460 190 Z',
      labelX: 535,
      labelY: 180,
    },
  ];

  const getRegionFill = (key: RegionKey) => {
    const psi = psiData?.regions[key]?.psi || 100;
    const isSelected = selectedRegion === key;

    if (isSelected) {
      return '#0f172a'; // slate-900 highlight
    }
    if (psi <= 50) return '#10b981'; // emerald
    if (psi <= 100) return '#3b82f6'; // blue
    if (psi <= 200) return '#f59e0b'; // amber
    if (psi <= 300) return '#f43f5e'; // rose
    return '#a855f7'; // purple
  };

  const activeRegionInfo = regionConfig.find((r) => r.key === selectedRegion) || regionConfig[2]; // default south
  const activeRegionData = psiData?.regions[selectedRegion] || {
    psi: 168,
    pm25_one_hr: 142,
    status: 'Unhealthy' as const,
  };

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Interactive Regional Map
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Singapore 5-Zone Air Quality Monitor
            </h2>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Click any sector on the map to switch regional live data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive SVG Map */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Republic of Singapore Regional Bounds
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Good
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Moderate
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Unhealthy
                </span>
              </div>
            </div>

            <div className="w-full aspect-[16/9] max-h-[380px] flex items-center justify-center">
              <svg
                viewBox="0 0 700 360"
                className="w-full h-full drop-shadow-md select-none"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.04))' }}
              >
                {/* Background water */}
                <rect width="700" height="360" rx="16" fill="#f8fafc" />

                {/* Grid guidelines */}
                <path d="M 0 180 L 700 180" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 350 0 L 350 360" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Regions */}
                {regionConfig.map((reg) => {
                  const isSelected = selectedRegion === reg.key;
                  const regData = psiData?.regions[reg.key];
                  const psiVal = regData?.psi || 150;

                  return (
                    <g
                      key={reg.key}
                      onClick={() => onSelectRegion(reg.key)}
                      className="cursor-pointer transition-all duration-300 group"
                    >
                      <path
                        d={reg.pathD}
                        fill={getRegionFill(reg.key)}
                        fillOpacity={isSelected ? 0.95 : 0.45}
                        stroke={isSelected ? '#0f172a' : '#cbd5e1'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-all duration-200 group-hover:fill-opacity-75"
                      />

                      {/* Region Tag Center */}
                      <g transform={`translate(${reg.labelX}, ${reg.labelY})`}>
                        <rect
                          x="-45"
                          y="-16"
                          width="90"
                          height="32"
                          rx="8"
                          fill={isSelected ? '#0f172a' : '#ffffff'}
                          stroke={isSelected ? '#f59e0b' : '#e2e8f0'}
                          strokeWidth="1.5"
                          className="shadow-sm"
                        />
                        <text
                          textAnchor="middle"
                          y="-2"
                          className={`text-[11px] font-bold ${isSelected ? 'fill-white' : 'fill-slate-800'}`}
                        >
                          {reg.name.replace(' Region', '')}
                        </text>
                        <text
                          textAnchor="middle"
                          y="11"
                          className={`text-[10px] font-mono font-semibold ${
                            isSelected
                              ? 'fill-amber-400'
                              : psiVal > 100
                              ? 'fill-amber-700'
                              : 'fill-emerald-700'
                          }`}
                        >
                          {psiVal} PSI
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Sentosa Island at bottom */}
                <path
                  d="M 320 310 Q 370 305 390 320 Q 350 330 320 310 Z"
                  fill="#94a3b8"
                  fillOpacity="0.4"
                  stroke="#64748b"
                  strokeWidth="1"
                />
                <text x="355" y="322" textAnchor="middle" className="text-[8px] fill-slate-500 font-bold">
                  Sentosa
                </text>
              </svg>
            </div>

            <div className="mt-3 text-center text-xs text-slate-400">
              Singapore Straits (South) · Johor Straits (North) · Real-time NEA spatial breakdown
            </div>
          </div>

          {/* Right Column: Zone Tourist Context & Landmark Spotlights */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tourist Zone Focus
                  </span>
                </div>
                <button
                  onClick={() => onSelectRegion('national')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    selectedRegion === 'national'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                  }`}
                >
                  View All Singapore
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                {activeRegionInfo.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeRegionInfo.description}
              </p>

              {/* Live Numbers for this region */}
              <div className="grid grid-cols-2 gap-3 mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">24-Hr PSI</div>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
                    {activeRegionData.psi}
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">
                    {activeRegionData.status} Air
                  </div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="text-[11px] text-slate-500 font-medium">1-Hr PM2.5</div>
                  <div className="text-2xl font-black font-mono text-amber-600 mt-0.5">
                    {activeRegionData.pm25_one_hr} <span className="text-xs text-slate-500 font-normal">µg/m³</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Real-time Particulates
                  </div>
                </div>
              </div>

              {/* Tourist landmarks in this zone */}
              <div className="mt-5">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Key Tourist Attractions in this Zone:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRegionInfo.landmarks.map((place, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Looking for shelter?</span>
              <a
                href="#itineraries"
                className="font-semibold text-amber-700 hover:text-amber-800 underline"
              >
                Browse indoor attractions &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
