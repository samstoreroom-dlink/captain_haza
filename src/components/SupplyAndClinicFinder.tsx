import React, { useState } from 'react';
import {
  MEDICAL_SUPPLIES,
  TOURIST_PHARMACIES,
  MEDICAL_FACILITIES,
  MULTILINGUAL_PHRASES,
} from '../data/hazeData';
import {
  ShieldCheck,
  ShoppingBag,
  Hospital,
  Languages,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const SupplyAndClinicFinder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'supplies' | 'pharmacies' | 'hospitals' | 'translate'>('supplies');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Mandarin (中文)');

  const zones = ['All', 'Marina Bay / City Hall', 'Orchard Road', 'Chinatown / Bugis', 'Sentosa / HarbourFront', 'Changi Airport'];

  const filteredPharmacies = selectedZone === 'All'
    ? TOURIST_PHARMACIES
    : TOURIST_PHARMACIES.filter((p) => p.zone === selectedZone);

  return (
    <section id="supplies-clinics" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Essential Tourist Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Supplies, Pharmacies & Medical Help
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Find certified N95 respirators, eye drops, 24-hour pharmacies, and international hospital emergency departments across Singapore’s key tourist zones.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl max-w-2xl overflow-x-auto scrollbar-none mb-8 shadow-xs">
          <button
            onClick={() => setActiveTab('supplies')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'supplies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            1. What to Buy (Catalog)
          </button>
          <button
            onClick={() => setActiveTab('pharmacies')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'pharmacies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            2. Where to Buy (Pharmacies)
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'hospitals'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-rose-400" />
            3. Clinics & 24h Hospitals
          </button>
          <button
            onClick={() => setActiveTab('translate')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'translate'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            4. Pharmacy Flashcards
          </button>
        </div>

        {/* Tab 1: What to Buy Catalog */}
        {activeTab === 'supplies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDICAL_SUPPLIES.map((supply) => (
              <div
                key={supply.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase tracking-wider">
                      {supply.badge}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {supply.typicalPriceSgd}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">
                    {supply.name}
                  </h3>

                  <div className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="font-bold">Recommended: </span>
                    {supply.recommendedModel}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {supply.whyNeeded}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-700">Usage Instructions:</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{supply.usageTips}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Where to Buy (Pharmacies) */}
        {activeTab === 'pharmacies' && (
          <div>
            {/* Zone Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Tourist Area:</span>
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    selectedZone === zone
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPharmacies.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {store.brand}
                      </span>
                      {store.hasPharmacist && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Pharmacist On Duty
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2.5">
                      {store.name}
                    </h4>

                    <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <span className="text-amber-700 font-bold">MRT:</span>
                        <span>{store.nearestMrt}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{store.operatingHours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    {store.phone ? (
                      <a
                        href={`tel:${store.phone.replace(/\s+/g, '')}`}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{store.phone}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Islandwide Store</span>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.googleMapsQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Clinics & 24h Hospitals */}
        {activeTab === 'hospitals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MEDICAL_FACILITIES.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      facility.isEmergency24h
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {facility.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {facility.zone}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mt-2">
                    {facility.name}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {facility.touristNotes}
                  </p>

                  <div className="space-y-1.5 mt-4 text-xs text-slate-600 p-3 rounded-xl bg-slate-50">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{facility.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold">Nearest MRT:</span>
                      <span>{facility.nearestMrt}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${facility.phone.replace(/\s+/g, '')}`}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                    <span>Call {facility.phone}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.googleMapsQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Multi-Language Pharmacy Flashcards */}
        {activeTab === 'translate' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="max-w-xl mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Tourist Communication Tool
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Pharmacy Flashcard for Local Staff
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Show this digital screen to cashiers or pharmacists at Guardian, Watsons, Unity, or 7-Eleven in Singapore.
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100 scrollbar-none">
              {MULTILINGUAL_PHRASES.map((lang) => (
                <button
                  key={lang.language}
                  onClick={() => setSelectedLanguage(lang.language)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    selectedLanguage === lang.language
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.language}
                </button>
              ))}
            </div>

            {/* Selected Language Flashcards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MULTILINGUAL_PHRASES.find((l) => l.language === selectedLanguage)?.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      English:
                    </div>
                    <div className="text-xs text-slate-700 font-medium mt-1">
                      "{item.english}"
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200">
                      <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                        Show to Shopkeeper:
                      </div>
                      <div className="text-sm font-bold text-slate-950 mt-1 leading-snug">
                        {item.translation}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-[10px] text-amber-800 font-medium">
                    Tap to show on mobile screen
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
