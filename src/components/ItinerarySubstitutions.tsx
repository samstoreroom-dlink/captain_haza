import React, { useState } from 'react';
import { ITINERARY_SWAPS } from '../data/hazeData';
import { ArrowRight, ShieldCheck, MapPin, Sparkles, Compass, CheckCircle2, Ticket } from 'lucide-react';

export const ItinerarySubstitutions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Nature Under Glass', 'Family & Kids', 'Iconic Sights', 'Culture & Museums', 'Shopping & Dining'];

  const filteredSwaps = selectedCategory === 'All'
    ? ITINERARY_SWAPS
    : ITINERARY_SWAPS.filter((s) => s.indoorReplacement.category === selectedCategory);

  return (
    <section id="itineraries" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Smart Itinerary Substitution Logic
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Enjoy Your Singapore Holiday Despite the Haze
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Don't let smoky skies ruin your vacation. Singapore is home to some of the world’s most advanced climate-controlled architectural wonders and filtered indoor attractions.
            </p>
          </div>
        </div>

        {/* Featured Hero Showcase: Cloud Forest Dome */}
        <div className="mb-10 rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-12 shadow-md">
          <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-auto min-h-[260px]">
            <img
              src="/src/assets/images/cloud_forest_dome_1792052193505.jpg"
              alt="Gardens by the Bay Cloud Forest Glass Conservatory"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-amber-400 border border-slate-700">
              #1 Recommended Haze Haven
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>HEPA Filtered & 24°C Climate Regulated Biome</span>
              </div>

              <h3 className="text-2xl font-black mt-2 text-white">
                Instead of Outdoor Supertree Walk &rarr; Flower Dome & Cloud Forest
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Step into a colossal glass biosphere featuring a 35-meter indoor lush mountain, misty cascading waterfall, and rare highland flora. While outside air may be hazy, the air inside the conservatories undergoes multi-stage hospital-grade filtration and continuous dehumidification.
              </p>

              <div className="mt-5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>18 Marina Gardens Dr · Bayfront MRT (CE1/DT16)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Book online to skip ticketing booths outside</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Gardens by the Bay</span>
              <a
                href="https://www.gardensbythebay.com.sg"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition-colors shadow-xs"
              >
                Official Tickets & Info &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Experience:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Substitution Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSwaps.map((swap) => (
            <div
              key={swap.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Outdoor Original Pill */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Outdoor Plan Cancelled?</span>
                    <span className="text-rose-600 font-semibold">High Exposure Risk</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {swap.outdoorOriginal.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {swap.outdoorOriginal.tagline}
                  </div>
                  <div className="text-[11px] text-rose-700 mt-1.5 font-medium bg-rose-50/80 p-1.5 rounded-lg border border-rose-100">
                    Haze Impact: {swap.outdoorOriginal.hazeIssue}
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="my-4 flex items-center justify-center">
                  <div className="h-px bg-slate-200 flex-1" />
                  <div className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-amber-700" />
                    <span>Swap With Indoor Haven</span>
                  </div>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                {/* Indoor Replacement */}
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {swap.indoorReplacement.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      Clean Air Verified
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-amber-800 mt-1">
                    {swap.indoorReplacement.tagline}
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    {swap.indoorReplacement.highlight}
                  </p>

                  <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{swap.indoorReplacement.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold">Nearest MRT:</span>
                      <span>{swap.indoorReplacement.nearestMrt}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {swap.indoorReplacement.tips}
                </span>
                <span className="font-bold text-slate-900 shrink-0 ml-2">
                  Air-Conditioned
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
