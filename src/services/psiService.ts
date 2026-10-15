import { RegionalPsiData, SingaporeRegion, PsiApiResponse } from '../types/haze';
import { FALLBACK_PSI_DATA } from '../data/hazeData';

function determinePsiStatus(psiValue: number): RegionalPsiData['status'] {
  if (psiValue <= 50) return 'Good';
  if (psiValue <= 100) return 'Moderate';
  if (psiValue <= 200) return 'Unhealthy';
  if (psiValue <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getStatusDescription(status: RegionalPsiData['status']): string {
  switch (status) {
    case 'Good':
      return 'Air quality is pristine. Normal outdoor activities can be enjoyed without restrictions.';
    case 'Moderate':
      return 'Air quality is acceptable. Normal activities for most; sensitive individuals monitor exertion.';
    case 'Unhealthy':
      return 'Elevated smoke haze. Healthy individuals reduce prolonged outdoor workouts; sensitive groups stay indoors.';
    case 'Very Unhealthy':
      return 'Significant transboundary smoke haze. Avoid prolonged outdoor exposure; wear certified N95 masks.';
    case 'Hazardous':
      return 'Emergency air quality levels. Stay indoors in air-conditioned facilities with closed windows.';
  }
}

export async function fetchLiveSingaporePsi(): Promise<{
  data: Record<SingaporeRegion, RegionalPsiData>;
  isLive: boolean;
  timestamp: string;
}> {
  const tryFetch = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  };

  try {
    let json: any = null;
    try {
      // First try internal serverless proxy (/api/psi)
      json = await tryFetch('/api/psi');
    } catch {
      // Fallback to direct public NEA endpoint
      json = await tryFetch('https://api.data.gov.sg/v1/environment/psi');
    }

    const latestItem = json?.data?.items?.[0] || json?.items?.[0];

    if (!latestItem || !latestItem.readings) {
      throw new Error('Invalid format from PSI feed');
    }

    const psi24 = latestItem.readings.psi_twenty_four_hourly || {};
    const pm25 =
      latestItem.readings.pm25_one_hourly ||
      latestItem.readings.pm25_twenty_four_hourly ||
      latestItem.readings.pm25_sub_index ||
      {};

    const rawTimestamp = latestItem.updatedTimestamp || latestItem.update_timestamp || latestItem.timestamp;
    const formattedTime = rawTimestamp
      ? new Date(rawTimestamp).toLocaleTimeString('en-SG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Singapore',
        })
      : new Date().toLocaleTimeString('en-SG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Singapore',
        });

    // Compute islandwide averages if national reading is not provided
    const validPsiVals = ['central', 'south', 'north', 'east', 'west']
      .map((k) => psi24[k])
      .filter((v): v is number => typeof v === 'number');
    const computedNationalPsi =
      validPsiVals.length > 0 ? Math.round(validPsiVals.reduce((a, b) => a + b, 0) / validPsiVals.length) : 68;

    const validPm25Vals = ['central', 'south', 'north', 'east', 'west']
      .map((k) => pm25[k])
      .filter((v): v is number => typeof v === 'number');
    const computedNationalPm25 =
      validPm25Vals.length > 0 ? Math.round(validPm25Vals.reduce((a, b) => a + b, 0) / validPm25Vals.length) : 25;

    const regions: Array<{ id: SingaporeRegion; name: string; apiKey: string }> = [
      { id: 'national', name: 'All Singapore (National Avg)', apiKey: 'national' },
      { id: 'central', name: 'Central (Orchard, Marina Bay, CBD)', apiKey: 'central' },
      { id: 'south', name: 'South (Sentosa, HarbourFront)', apiKey: 'south' },
      { id: 'north', name: 'North (Woodlands, Mandai Zoo)', apiKey: 'north' },
      { id: 'east', name: 'East (Changi Airport, Tampines)', apiKey: 'east' },
      { id: 'west', name: 'West (Jurong, Clementi)', apiKey: 'west' },
    ];

    const result: Partial<Record<SingaporeRegion, RegionalPsiData>> = {};

    for (const r of regions) {
      let psiVal: number;
      let pm25Val: number;

      if (r.id === 'national') {
        psiVal = psi24['national'] !== undefined ? Math.round(psi24['national']) : computedNationalPsi;
        pm25Val = pm25['national'] !== undefined ? Math.round(pm25['national']) : computedNationalPm25;
      } else {
        psiVal = Math.round(psi24[r.apiKey] ?? computedNationalPsi);
        pm25Val = Math.round(pm25[r.apiKey] ?? computedNationalPm25);
      }

      const status = determinePsiStatus(psiVal);

      result[r.id] = {
        region: r.id,
        displayName: r.name,
        psi24Hourly: psiVal,
        pm25OneHourly: pm25Val,
        status,
        description: getStatusDescription(status),
        updateTime: `Updated ${formattedTime} SGT (Live NEA)`,
      };
    }

    return {
      data: result as Record<SingaporeRegion, RegionalPsiData>,
      isLive: true,
      timestamp: formattedTime,
    };
  } catch (err) {
    console.warn('Using NEA cached baseline data due to network:', err);
    return {
      data: FALLBACK_PSI_DATA as Record<SingaporeRegion, RegionalPsiData>,
      isLive: false,
      timestamp: 'Simulated Baseline (Live fallback)',
    };
  }
}
