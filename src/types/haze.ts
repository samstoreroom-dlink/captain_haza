export type RegionKey = 'national' | 'central' | 'south' | 'east' | 'west' | 'north';

export interface RegionData {
  psi: number;
  pm25_one_hr: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
  advice: string;
}

export interface PsiApiResponse {
  source: string;
  timestamp: string;
  update_timestamp: string;
  regions: Record<RegionKey, RegionData>;
  weather: {
    wind_direction: string;
    wind_speed_kmh: number;
    temperature_c: number;
    humidity_pct: number;
    summary: string;
  };
}

export interface MedicalSupply {
  id: string;
  name: string;
  category: 'mask' | 'eyes' | 'nasal' | 'throat' | 'purifier';
  recommendedModel: string;
  whyNeeded: string;
  usageTips: string;
  typicalPriceSgd: string;
  isN95Required: boolean;
  badge: string;
}

export interface PharmacyStore {
  id: string;
  brand: 'Guardian' | 'Watsons' | 'Unity' | '7-Eleven' | 'Hospital';
  name: string;
  zone: 'Marina Bay / City Hall' | 'Orchard Road' | 'Chinatown / Bugis' | 'Sentosa / HarbourFront' | 'Changi Airport';
  address: string;
  nearestMrt: string;
  operatingHours: string;
  phone?: string;
  hasPharmacist: boolean;
  googleMapsQuery: string;
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: '24h Emergency Hospital' | '24h GP Clinic' | 'Polyclinic' | 'Specialist';
  zone: string;
  address: string;
  nearestMrt: string;
  phone: string;
  isEmergency24h: boolean;
  touristNotes: string;
  googleMapsQuery: string;
}

export interface ItinerarySwap {
  id: string;
  outdoorOriginal: {
    name: string;
    tagline: string;
    hazeIssue: string;
  };
  indoorReplacement: {
    name: string;
    tagline: string;
    airQualityStatus: string;
    highlight: string;
    location: string;
    nearestMrt: string;
    category: 'Iconic Sights' | 'Family & Kids' | 'Culture & Museums' | 'Shopping & Dining' | 'Nature Under Glass';
    tips: string;
  };
}

export interface Symptom {
  id: string;
  name: string;
  organ: 'Eyes' | 'Throat & Nose' | 'Lungs & Breathing' | 'Systemic';
  isRedFlag: boolean;
  description: string;
}

export interface UserLocationResult {
  query: string;
  matchedName: string;
  region: RegionKey;
  regionLabel: string;
  nearestStation: string;
  coordinates?: { lat: number; lng: number };
  nearestIndoorHaven: {
    name: string;
    description: string;
    nearestMrt: string;
  };
  nearestPharmacy: {
    name: string;
    address: string;
    nearestMrt: string;
  };
  nearestHospital: {
    name: string;
    phone: string;
    address: string;
  };
}

