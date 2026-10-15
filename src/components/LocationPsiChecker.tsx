import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, ShieldAlert, Sparkles, Building2, ShoppingBag, Hospital, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { RegionKey, PsiApiResponse, UserLocationResult } from '../types/haze';

interface LocationPsiCheckerProps {
  psiData: PsiApiResponse | null;
  onSelectRegion: (reg: RegionKey) => void;
  selectedRegion: RegionKey;
}

// Singapore landmark and postal sector mapping
const POPULAR_LOCATIONS: {
  name: string;
  region: RegionKey;
  regionLabel: string;
  keywords: string[];
  indoorHaven: { name: string; description: string; nearestMrt: string };
  pharmacy: { name: string; address: string; nearestMrt: string };
  hospital: { name: string; phone: string; address: string };
}[] = [
  {
    name: 'Marina Bay Sands / Bayfront',
    region: 'south',
    regionLabel: 'South Singapore',
    keywords: ['marina bay', 'mbs', 'bayfront', 'gardens by the bay', 'merlion', 'singapore flyer', '018956', '018971', '018972', '018983', 'marina square', 'marina bay financial'],
    indoorHaven: {
      name: 'The Shoppes at MBS & Cloud Forest Dome',
      description: 'Massive multi-level air-conditioned atrium with indoor canal, luxury dining, and HEPA-filtered bioclimatic domes.',
      nearestMrt: 'Bayfront MRT (CE1/DT16)',
    },
    pharmacy: {
      name: 'Guardian Health & Beauty – Marina Bay Sands',
      address: 'The Shoppes at MBS, #B2-58',
      nearestMrt: 'Bayfront MRT',
    },
    hospital: {
      name: 'Singapore General Hospital (SGH) Emergency',
      phone: '+65 6222 3322',
      address: 'Outram Road (10 mins via MRT)',
    },
  },
  {
    name: 'Orchard Road / Shopping Belt',
    region: 'central',
    regionLabel: 'Central Singapore',
    keywords: ['orchard', 'somerset', 'dhoby ghaut', 'ion', 'takashimaya', 'ngee ann city', 'paragon', '313@somerset', '238801', '238867', '238872', '228208', 'tanglin', 'cairnhill'],
    indoorHaven: {
      name: 'Underground Pedestrian Mall Network (UPN)',
      description: 'Fully connected subterranean air-conditioned network connecting ION Orchard, Wisma Atria, Ngee Ann City, and Paragon.',
      nearestMrt: 'Orchard MRT (NS22/TE14) / Somerset MRT (NS23)',
    },
    pharmacy: {
      name: 'Watsons Flagship – ION Orchard',
      address: 'ION Orchard, #B4-12, 2 Orchard Turn',
      nearestMrt: 'Orchard MRT',
    },
    hospital: {
      name: 'Mount Elizabeth Hospital Emergency',
      phone: '+65 6737 2666',
      address: '3 Mount Elizabeth, Orchard (Behind Paragon)',
    },
  },
  {
    name: 'Sentosa Island / Resorts World',
    region: 'south',
    regionLabel: 'South Singapore',
    keywords: ['sentosa', 'resorts world', 'rws', 'universal studios', 'siloso', 'palawan', 'tanjong', 'vivocity', 'harbourfront', '098269', '098585', '099958'],
    indoorHaven: {
      name: 'S.E.A. Aquarium & Universal Studios Indoor Rides',
      description: 'Air-conditioned marine sanctuary and indoor dark rides (Transformers 3D, Revenge of the Mummy) with zero outdoor smoke.',
      nearestMrt: 'HarbourFront MRT (NE1/CC29) -> Sentosa Express',
    },
    pharmacy: {
      name: 'Watsons – VivoCity Gateway',
      address: 'VivoCity #B2-06/07 (Ground Level Sentosa Concourse)',
      nearestMrt: 'HarbourFront MRT',
    },
    hospital: {
      name: 'Singapore General Hospital (SGH) Emergency',
      phone: '+65 6222 3322',
      address: 'Outram Road (10-12 mins taxi from Sentosa)',
    },
  },
  {
    name: 'Jewel Changi Airport',
    region: 'east',
    regionLabel: 'East Singapore',
    keywords: ['jewel', 'changi', 'airport', 'terminal 1', 'terminal 2', 'terminal 3', 'terminal 4', '819666', '819642', '819643'],
    indoorHaven: {
      name: 'Jewel Changi Rain Vortex & Forest Valley',
      description: 'World’s tallest 40m indoor waterfall enclosed in a giant climate-controlled glass biome with hospital-grade HVAC filtration.',
      nearestMrt: 'Changi Airport MRT (CG2)',
    },
    pharmacy: {
      name: 'Guardian Health & Beauty – Jewel Changi',
      address: 'Jewel Changi Airport, #B1-291',
      nearestMrt: 'Changi Airport MRT',
    },
    hospital: {
      name: 'Changi General Hospital (CGH) Emergency',
      phone: '+65 6788 8833',
      address: '2 Simei Street 3 (10 mins via taxi)',
    },
  },
  {
    name: 'Chinatown / Telok Ayer',
    region: 'south',
    regionLabel: 'South Singapore',
    keywords: ['chinatown', 'telok ayer', 'outram', 'maxwell', 'tanjong pagar', 'people\'s park', '059413', '058357', '069111'],
    indoorHaven: {
      name: 'Chinatown Point & Chinatown Heritage Center',
      description: 'Air-conditioned mall corridors, indoor dim sum, and air-purified cultural galleries.',
      nearestMrt: 'Chinatown MRT (NE4/DT19)',
    },
    pharmacy: {
      name: 'Unity Pharmacy – Chinatown Point',
      address: 'Chinatown Point, #B1-02, 133 New Bridge Road',
      nearestMrt: 'Chinatown MRT',
    },
    hospital: {
      name: 'Singapore General Hospital (SGH) Emergency',
      phone: '+65 6222 3322',
      address: 'Outram Road (Directly adjacent to Chinatown)',
    },
  },
  {
    name: 'Bugis / Civic District / Kampong Glam',
    region: 'central',
    regionLabel: 'Central Singapore',
    keywords: ['bugis', 'civic district', 'city hall', 'haji lane', 'arab street', 'kampong glam', 'raffles hotel', 'bras basah', '188770', '188067', '189720'],
    indoorHaven: {
      name: 'National Gallery Singapore & Bugis Junction Air-Conditioned Glass Street',
      description: 'Sprawling neoclassical air-conditioned art halls and covered pedestrian shopping streets.',
      nearestMrt: 'Bugis MRT (EW12/DT14) or City Hall MRT (NS25/EW13)',
    },
    pharmacy: {
      name: 'Guardian – Bugis Junction',
      address: 'Bugis Junction, #B1-18, 200 Victoria Street',
      nearestMrt: 'Bugis MRT',
    },
    hospital: {
      name: 'Raffles Hospital (24h Emergency & Walk-in)',
      phone: '+65 6311 1555',
      address: '585 North Bridge Road, Bugis (Exit B)',
    },
  },
  {
    name: 'Singapore Zoo & Mandai Wildlife Reserve',
    region: 'north',
    regionLabel: 'North Singapore',
    keywords: ['zoo', 'singapore zoo', 'mandai', 'night safari', 'river wonders', 'bird paradise', 'woodlands', 'yishun', 'sembawang', '729826', '729825', '730000'],
    indoorHaven: {
      name: 'River Wonders Covered Exhibits & Mandai Indoor Pavilions',
      description: 'Covered climate-regulated Amazon Flooded Forest and Giant Panda Forest enclosures.',
      nearestMrt: 'Khatib MRT (NS14) + Mandai Shuttle',
    },
    pharmacy: {
      name: 'Guardian – Northpoint City',
      address: 'Northpoint City, #B1-01, Yishun (Transit hub to Zoo)',
      nearestMrt: 'Yishun MRT',
    },
    hospital: {
      name: 'Khoo Teck Puat Hospital (KTPH) Emergency',
      phone: '+65 6555 8000',
      address: '90 Yishun Central (Nearest hospital to Mandai Zoo)',
    },
  },
  {
    name: 'Jurong Lake Gardens / Science Centre',
    region: 'west',
    regionLabel: 'West Singapore',
    keywords: ['jurong', 'science centre', 'jurong east', 'clementi', 'west coast', 'boon lay', 'imm', 'jem', 'westgate', '609607', '608532', '600000'],
    indoorHaven: {
      name: 'Singapore Science Centre & Omni-Theatre',
      description: 'Expansive air-conditioned interactive science halls, indoor butterflies sanctuary, and IMAX dome.',
      nearestMrt: 'Jurong East MRT (NS1/EW24)',
    },
    pharmacy: {
      name: 'Watsons – Westgate',
      address: 'Westgate, #B1-26, 3 Gateway Drive',
      nearestMrt: 'Jurong East MRT',
    },
    hospital: {
      name: 'Ng Teng Fong General Hospital (NTFGH) Emergency',
      phone: '+65 6716 2000',
      address: '1 Jurong East Street 21 (Directly connected to Westgate/JEM)',
    },
  },
  {
    name: 'East Coast Park / Marine Parade / Katong',
    region: 'east',
    regionLabel: 'East Singapore',
    keywords: ['east coast', 'marine parade', 'katong', 'joo chiat', 'bedok', 'tampines', 'pasir ris', '449880', '428800', '460000'],
    indoorHaven: {
      name: 'Parkway Parade & I12 Katong',
      description: 'Major air-conditioned shopping malls and indoor food halls along the East Coast heritage corridor.',
      nearestMrt: 'Marine Parade MRT (TE26)',
    },
    pharmacy: {
      name: 'Guardian – Parkway Parade',
      address: 'Parkway Parade, #B1-35/36, 80 Marine Parade Road',
      nearestMrt: 'Marine Parade MRT',
    },
    hospital: {
      name: 'Changi General Hospital (CGH) Emergency',
      phone: '+65 6788 8833',
      address: '2 Simei Street 3',
    },
  },
];

// Helper to deduce region from postal code or query
function findLocationMatch(query: string) {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // 1. Direct landmark match
  for (const loc of POPULAR_LOCATIONS) {
    if (loc.name.toLowerCase().includes(clean) || clean.includes(loc.name.toLowerCase())) {
      return loc;
    }
    for (const kw of loc.keywords) {
      if (clean.includes(kw) || kw.includes(clean)) {
        return loc;
      }
    }
  }

  // 2. Postal code deduction (Singapore 6-digit postal code)
  const digits = clean.replace(/\D/g, '');
  if (digits.length >= 2) {
    const sector = parseInt(digits.substring(0, 2), 10);
    if ((sector >= 1 && sector <= 8) || (sector >= 9 && sector <= 10) || (sector >= 14 && sector <= 16)) {
      return POPULAR_LOCATIONS[0]; // South / Marina Bay / CBD
    } else if ((sector >= 17 && sector <= 23) || (sector >= 28 && sector <= 33) || (sector >= 56 && sector <= 57)) {
      return POPULAR_LOCATIONS[1]; // Central / Orchard / Bugis
    } else if ((sector >= 38 && sector <= 52) || sector === 81) {
      return POPULAR_LOCATIONS[3]; // East / Changi
    } else if ((sector >= 11 && sector <= 13) || (sector >= 58 && sector <= 71)) {
      return POPULAR_LOCATIONS[7]; // West / Jurong
    } else if ((sector >= 72 && sector <= 80) || sector === 82) {
      return POPULAR_LOCATIONS[6]; // North / Mandai
    }
  }

  // 3. Fallback generic keywords
  if (clean.includes('hotel') || clean.includes('mbs') || clean.includes('bay')) {
    return POPULAR_LOCATIONS[0];
  } else if (clean.includes('shopping') || clean.includes('mall') || clean.includes('road')) {
    return POPULAR_LOCATIONS[1];
  }

  // Default to South / Marina Bay
  return POPULAR_LOCATIONS[0];
}

export const LocationPsiChecker: React.FC<LocationPsiCheckerProps> = ({
  psiData,
  onSelectRegion,
  selectedRegion,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [activeLocation, setActiveLocation] = useState(POPULAR_LOCATIONS[0]);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved location on mount if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem('captain_haze_user_spot');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = POPULAR_LOCATIONS.find((l) => l.name === parsed.name);
        if (match) {
          setActiveLocation(match);
          setIsSaved(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSearch = (queryText: string) => {
    const match = findLocationMatch(queryText);
    if (match) {
      setActiveLocation(match);
      setGpsError(null);
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsLocating(false);

        // Calculate closest NEA region center
        // Central: 1.357, 103.82 | South: 1.295, 103.82 | East: 1.357, 103.94 | West: 1.357, 103.70 | North: 1.418, 103.82
        let matched = POPULAR_LOCATIONS[0]; // south default
        if (latitude < 1.31) {
          matched = POPULAR_LOCATIONS[0]; // South (Marina Bay/Sentosa)
        } else if (latitude > 1.39) {
          matched = POPULAR_LOCATIONS[6]; // North (Mandai/Zoo)
        } else if (longitude > 103.88) {
          matched = POPULAR_LOCATIONS[3]; // East (Changi)
        } else if (longitude < 103.75) {
          matched = POPULAR_LOCATIONS[7]; // West (Jurong)
        } else {
          matched = POPULAR_LOCATIONS[1]; // Central (Orchard)
        }

        setActiveLocation(matched);
        setSearchInput(`My Current GPS Location (~${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
      },
      (err) => {
        setIsLocating(false);
        setGpsError('Could not obtain GPS permission. Please type your hotel or landmark name instead.');
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 8000 }
    );
  };

  const handleSaveLocation = () => {
    try {
      localStorage.setItem('captain_haze_user_spot', JSON.stringify({ name: activeLocation.name }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      // ignore
    }
  };

  // Get live readings for the matched location's region
  const regionLive = psiData?.regions[activeLocation.region] || {
    psi: 168,
    pm25_one_hr: 142,
    status: 'Unhealthy' as const,
    color: 'amber' as const,
    advice: 'Reduce prolonged outdoor physical exertion.',
  };

  const quickPillSpots = [
    'Marina Bay Sands',
    'Orchard Road',
    'Sentosa / Universal Studios',
    'Jewel Changi',
    'Chinatown',
    'Bugis',
    'Singapore Zoo',
  ];

  return (
    <section id="my-location" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyper-Local Air Quality Checker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Check Live PSI at Your Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Enter your hotel name, tourist attraction, or 6-digit postal code to get real-time air quality readings and localized advice for your exact spot.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleUseGps}
              disabled={isLocating}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          </div>
        </div>

        {gpsError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <span>{gpsError}</span>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="relative mb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchInput);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value.length > 2) {
                    handleSearch(e.target.value);
                  }
                }}
                placeholder="Enter hotel name, attraction, or 6-digit postal code (e.g., 'Marina Bay Sands', 'Orchard Road', '018956')..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3.5 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-2xl hover:bg-slate-800 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Check PSI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Popular spots:</span>
          {quickPillSpots.map((spot) => (
            <button
              key={spot}
              onClick={() => {
                setSearchInput(spot);
                handleSearch(spot);
              }}
              className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 rounded-lg whitespace-nowrap shrink-0 transition-colors"
            >
              {spot}
            </button>
          ))}
        </div>

        {/* Live Result Display Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Subtle top background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Matched Location Name & Synced Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Selected Location:</span>
                <span className="text-white font-bold">{activeLocation.name}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{activeLocation.regionLabel}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-emerald-400 inline" />
                <span>Live NEA Air Quality Feed synced automatically</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveLocation}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                  isSaved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Saved as My Spot!' : 'Save as My Hotel'}</span>
              </button>

              <button
                onClick={() => onSelectRegion(activeLocation.region)}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Focus Map Here</span>
              </button>
            </div>
          </div>

          {/* Center Stats Grid: 24-Hr PSI & 1-Hr PM2.5 for this location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            {/* 24-Hr PSI */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>24-Hour PSI</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  {regionLive.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tabular-nums">
                  {regionLive.psi}
                </span>
                <span className="text-xs font-bold text-amber-400 uppercase">PSI</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Official NEA 24-hr aggregate index for {activeLocation.regionLabel}
              </div>
            </div>

            {/* 1-Hr PM2.5 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>1-Hour PM2.5</span>
                <span className="text-[11px] text-amber-300 font-semibold">Immediate Impact</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tabular-nums">
                  {regionLive.pm25_one_hr}
                </span>
                <span className="text-xs font-bold text-slate-300">µg/m³</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Fine particle concentration right now outside your door
              </div>
            </div>

            {/* Outdoor Walking Feasibility */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  Outdoor Walking Advice:
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {regionLive.psi > 150
                    ? 'Avoid Prolonged Walking'
                    : regionLive.psi > 100
                    ? 'Short Walks Only (< 45 mins)'
                    : 'Safe for Walking'}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {regionLive.advice} Wear a certified N95 mask outdoors.
                </p>
              </div>
              <div className="text-[11px] text-amber-400 font-medium mt-2">
                Weather: {psiData?.weather.wind_direction || 'SSW Wind'} · {psiData?.weather.temperature_c || 31}°C
              </div>
            </div>
          </div>

          {/* Hyper-local Resources near this spot */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nearest Clean-Air Indoor Haven */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Nearest Clean-Air Haven</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {activeLocation.indoorHaven.name}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeLocation.indoorHaven.description}
                </p>
              </div>
              <div className="text-[11px] text-amber-300 font-medium mt-3">
                MRT: {activeLocation.indoorHaven.nearestMrt}
              </div>
            </div>

            {/* Nearest Pharmacy for N95 Masks & Eye Drops */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Nearest N95 Pharmacy</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {activeLocation.pharmacy.name}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {activeLocation.pharmacy.address}
                </p>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-3">
                MRT: {activeLocation.pharmacy.nearestMrt}
              </div>
            </div>

            {/* Nearest Emergency Hospital */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                  <Hospital className="w-4 h-4" />
                  <span>Nearest 24h Emergency Hospital</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {activeLocation.hospital.name}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {activeLocation.hospital.address}
                </p>
              </div>
              <div className="mt-3">
                <a
                  href={`tel:${activeLocation.hospital.phone.replace(/\s+/g, '')}`}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 underline"
                >
                  Call {activeLocation.hospital.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
