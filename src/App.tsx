import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { HeroAirQuality } from './components/HeroAirQuality';
import { LocationPsiChecker } from './components/LocationPsiChecker';
import { SingaporeMap } from './components/SingaporeMap';
import { HazeExplanation } from './components/HazeExplanation';
import { AdvisoryMatrix } from './components/AdvisoryMatrix';
import { SymptomChecker } from './components/SymptomChecker';
import { SupplyAndClinicFinder } from './components/SupplyAndClinicFinder';
import { ItinerarySubstitutions } from './components/ItinerarySubstitutions';
import { AiTouristConcierge } from './components/AiTouristConcierge';
import { Footer } from './components/Footer';
import { RegionKey, PsiApiResponse } from './types/haze';

export default function App() {
  const [psiData, setPsiData] = useState<PsiApiResponse | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('south');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('air-quality');
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiChatPrompt, setAiChatPrompt] = useState<string>('');
  const [alertThresholdActive, setAlertThresholdActive] = useState<boolean>(true);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  const fetchPsiData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/psi');
      if (res.ok) {
        const data = await res.json();
        setPsiData(data);
      } else {
        console.warn('API returned non-ok status, falling back');
      }
    } catch (err) {
      console.error('Failed to load PSI:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsiData();
    // Auto-refresh every 3 minutes
    const interval = setInterval(fetchPsiData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const currentRegionData = psiData?.regions[selectedRegion] || {
    psi: 168,
    pm25_one_hr: 142,
    status: 'Unhealthy' as const,
    color: 'amber' as const,
    advice: 'Reduce prolonged or strenuous outdoor physical exertion. Sensitive groups stay indoors.',
  };

  const getRegionDisplayName = (key: RegionKey) => {
    switch (key) {
      case 'south':
        return 'South (Marina Bay & Sentosa)';
      case 'central':
        return 'Central (Orchard & Bugis)';
      case 'east':
        return 'East (Changi Airport)';
      case 'west':
        return 'West (Jurong)';
      case 'north':
        return 'North (Woodlands & Zoo)';
      default:
        return 'National Average';
    }
  };

  const handleOpenAiConciergeWithPrompt = (prompt: string) => {
    setAiChatPrompt(prompt);
    setIsAiChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenAiChat={() => {
          setAiChatPrompt('');
          setIsAiChatOpen(true);
        }}
        alertThresholdActive={alertThresholdActive}
        onToggleAlertThreshold={() => setAlertThresholdActive((prev) => !prev)}
        currentPsi={currentRegionData.psi}
      />

      {/* Real-time Tourist Alert Banner */}
      {alertThresholdActive && (
        <AlertBanner
          currentRegionData={currentRegionData}
          regionName={getRegionDisplayName(selectedRegion)}
          onNavigateToSwaps={() => {
            const el = document.getElementById('itineraries');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToSupplies={() => {
            const el = document.getElementById('supplies-clinics');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onDismiss={() => setBannerDismissed(true)}
          isDismissed={bannerDismissed}
        />
      )}

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Live PSI & Air Quality Dial */}
        <HeroAirQuality
          psiData={psiData}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            setBannerDismissed(false); // Reset banner when region changes
          }}
          onRefresh={fetchPsiData}
          loading={loading}
          onOpenConcierge={() => {
            setAiChatPrompt('');
            setIsAiChatOpen(true);
          }}
        />

        {/* 2. User Location Live PSI Checker */}
        <LocationPsiChecker
          psiData={psiData}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            setBannerDismissed(false);
          }}
        />

        {/* 3. Interactive Singapore 5-Zone Map */}
        <SingaporeMap
          psiData={psiData}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            setBannerDismissed(false);
          }}
        />

        {/* 3. What is Haze? (Origins, PSI vs PM2.5, Mask efficacy, Hotel hacks) */}
        <HazeExplanation />

        {/* 4. Age-Group & Vulnerability Action Matrix */}
        <AdvisoryMatrix />

        {/* 5. Indoor Itinerary Substitutions ("Enjoy Your Holiday Despite Haze") */}
        <ItinerarySubstitutions />

        {/* 6. Symptom Checker & Medical Self-Triage */}
        <SymptomChecker
          onOpenSupplies={() => {
            const el = document.getElementById('supplies-clinics');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAiConciergeWithPrompt={handleOpenAiConciergeWithPrompt}
        />

        {/* 7. Supplies, Pharmacies, 24/7 Hospitals & Multi-language Cards */}
        <SupplyAndClinicFinder />
      </main>

      {/* Footer with Hotlines & Official Portals */}
      <Footer />

      {/* AI Tourist Concierge Modal (Gemini 3.8 Flash) */}
      <AiTouristConcierge
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        initialPrompt={aiChatPrompt}
      />
    </div>
  );
}
