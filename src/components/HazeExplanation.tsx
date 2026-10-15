import React, { useState } from 'react';
import { Wind, HelpCircle, ShieldCheck, AlertCircle, Building2, Flame, Droplets, ArrowRight } from 'lucide-react';

export const HazeExplanation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'origins' | 'metrics' | 'masks' | 'hotel'>('origins');

  return (
    <section id="what-is-haze" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Essential Traveler Knowledge
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Understanding the Singapore Haze
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Visiting Singapore during the haze season can feel unexpected. Here is everything you need to know about the science, air indices, mask efficacy, and hotel safety.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-2xl overflow-x-auto scrollbar-none mb-8">
          <button
            onClick={() => setActiveTab('origins')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'origins'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Where Does It Come From?
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'metrics'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-blue-600" />
            PSI vs 1-Hr PM2.5
          </button>
          <button
            onClick={() => setActiveTab('masks')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'masks'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Why Surgical Masks Fail
          </button>
          <button
            onClick={() => setActiveTab('hotel')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'hotel'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            Hotel Room Guide
          </button>
        </div>

        {/* Tab 1: Origins & Transboundary Science */}
        {activeTab === 'origins' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-700" />
                  Transboundary Agricultural & Peatland Fires
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                  Singapore itself has virtually no open agricultural burning. The haze is transboundary air pollution primarily originating from slash-and-burn land clearing and peat swamp fires in central/southern Sumatra and Kalimantan (Indonesia).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-slate-700" />
                  The Southwest Monsoon Driver
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Between July and October, the Southeast Asian climate undergoes the Southwest Monsoon. Prevailing winds blow consistently from the south and southwest across the equator, sweeping massive smoke plumes directly over Singapore and Peninsular Malaysia.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Tropical Rain Relief
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Singapore often experiences sudden tropical thunderstorms in the late afternoon. Heavy localized rainfall washes airborne particulates out of the atmosphere, causing PSI numbers to plunge rapidly within 1 to 2 hours.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Quick Fact for Tourists
                </span>
                <h4 className="text-lg font-bold mt-1 text-white">
                  Why does it smell like campfire or burning wood?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  Peat soil is composed of partially decayed vegetation meters deep. When peat burns, it smolders underground at lower temperatures without flame, releasing high concentrations of volatile organic compounds (VOCs), microscopic soot, and sulfur dioxide.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Official Tracking:</span>
                <a
                  href="https://www.haze.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  haze.gov.sg &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PSI vs 1-Hr PM2.5 */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 24-Hour PSI Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Macro Health Index
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    24-Hour Average
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  24-Hour Pollutant Standards Index (PSI)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  Calculated from a 24-hour moving average of six key pollutants: PM2.5, PM10, sulfur dioxide (SO2), carbon monoxide (CO), ozone (O3), and nitrogen dioxide (NO2).
                </p>

                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Official NEA Bands:</div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-semibold text-emerald-800">0 – 50: Good</span>
                      <span className="text-slate-500">Normal tourist activity</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-semibold text-blue-800">51 – 100: Moderate</span>
                      <span className="text-slate-500">Normal activities for healthy</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <span className="font-semibold text-amber-900">101 – 200: Unhealthy</span>
                      <span className="text-amber-800">Reduce strenuous outdoors</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="font-semibold text-rose-900">201 – 300: Very Unhealthy</span>
                      <span className="text-rose-800">Avoid outdoor exertion</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
                Best for: Overall daily trip planning & government school/work guidance.
              </div>
            </div>

            {/* 1-Hour PM2.5 Card */}
            <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Tourists' Immediate Guide
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                    Real-Time 1-Hour
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  1-Hour PM2.5 Concentration (µg/m³)
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed">
                  Direct concentration of ultra-fine particles (smaller than 2.5 micrometers) over the past 60 minutes. Because smoke plumes shift rapidly with gusts, this indicates current ground conditions right now.
                </p>

                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold text-amber-950">How to use for sightseeing:</div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-semibold text-emerald-800">≤ 55 µg/m³ (Normal)</span>
                      <span className="text-slate-600">Great for outdoor walks</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-semibold text-amber-800">56 – 150 µg/m³ (Elevated)</span>
                      <span className="text-slate-600">Shorten outdoor exposure</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="font-semibold text-rose-800">151 – 250 µg/m³ (High)</span>
                      <span className="text-rose-700 font-semibold">Head indoors to malls/domes</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-200">
                      <span className="font-semibold text-purple-900">&gt; 250 µg/m³ (Very High)</span>
                      <span className="text-purple-800 font-semibold">Stay in air-conditioned room</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-200 text-xs font-semibold text-amber-900">
                Rule of Thumb: Check 1-Hr PM2.5 before stepping outside your hotel!
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Why Surgical Masks Fail */}
        {activeTab === 'masks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="/src/assets/images/tourist_mask_guide_1792052193161.jpg"
                alt="Tourist wearing certified N95 mask in Singapore"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-slate-900 text-white">
                <div className="text-xs font-bold text-amber-400">Certified N95 Respirator</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Provides a hermetic facial seal and electrostatic PM2.5 microfiltration.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                      The Critical Mistake: Blue Surgical & Cloth Masks
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-900 mt-1 leading-relaxed">
                      Many tourists grab standard surgical masks from convenience stores. <strong>Surgical masks DO NOT protect against PM2.5 haze particulates.</strong> Surgical masks are designed to catch large liquid droplets from coughing or sneezing; they leak 40% to 70% of air around the cheeks, nose bridge, and chin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">
                      What Works: N95, FFP2, or KF94 with Tight Seal
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-900 mt-1 leading-relaxed">
                      N95 respirators filter at least 95% of airborne particles down to 0.3 microns. Because they form a tight perimeter seal against your face, all inhaled air passes through the electret filter material instead of leaking around the edges.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span>Looking for where to purchase genuine N95 masks?</span>
                <a
                  href="#supplies-clinics"
                  className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  Locate Pharmacies &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Hotel Room Survival Guide */}
        {activeTab === 'hotel' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Keep Windows Firmly Latched
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Even a small gap allows millions of microscopic PM2.5 particulates into your room. Keep balcony doors closed 24/7 during hazy days.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-blue-700 font-semibold">
                Tip: Avoid hotel laundry on open balconies
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Aircon Recirculation Mode
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ensure your room thermostat is set to cooling with internal air recirculation. Avoid settings marked "Fresh Air Intake" which suck in outside air.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-amber-800 font-semibold">
                Keep fan on medium speed for continuous filtration
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Request an Air Purifier
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Most 4-star and 5-star hotels in Singapore (MBS, Pan Pacific, Shangri-La, Marriott) keep HEPA air purifiers for guests with respiratory sensitivities upon request.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-emerald-800 font-semibold">
                Dial '0' or 'Concierge' to ask for one
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm mb-3">
                  4
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Towel Under Door Draft
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  If the hotel hallway smells of smoke, place a rolled slightly damp bath towel along the floor gap of your entrance door to block particulate infiltration.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-purple-800 font-semibold">
                Simple & effective traveler trick
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
