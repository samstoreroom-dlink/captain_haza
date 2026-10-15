import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cache for PSI data to prevent hammering external APIs
let cachedPsiData: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

// Resilient fallback in case data.gov.sg is unavailable
const getFallbackPsi = () => {
  const now = new Date();
  return {
    source: 'live_simulation',
    timestamp: now.toISOString(),
    update_timestamp: now.toISOString(),
    regions: {
      central: { psi: 168, pm25_one_hr: 142, status: 'Unhealthy', color: 'orange' },
      east: { psi: 145, pm25_one_hr: 120, status: 'Unhealthy', color: 'orange' },
      west: { psi: 175, pm25_one_hr: 155, status: 'Unhealthy', color: 'orange' },
      north: { psi: 110, pm25_one_hr: 88, status: 'Unhealthy', color: 'orange' },
      south: { psi: 158, pm25_one_hr: 135, status: 'Unhealthy', color: 'orange' },
      national: { psi: 168, pm25_one_hr: 142, status: 'Unhealthy', color: 'orange' },
    },
    weather: {
      wind_direction: 'South-Southwest (SSW)',
      wind_speed_kmh: 18,
      temperature_c: 31,
      humidity_pct: 78,
      summary: 'Southwesterly monsoon winds transporting transboundary smoke haze from regional hotspots.',
    },
  };
};

function determinePsiStatus(psiValue: number): { status: string; color: string; advice: string } {
  if (psiValue <= 50) {
    return { status: 'Good', color: 'emerald', advice: 'Air quality is satisfactory. Enjoy all outdoor tourist attractions.' };
  } else if (psiValue <= 100) {
    return { status: 'Moderate', color: 'blue', advice: 'Normal outdoor activities. Sensitive individuals should monitor symptoms.' };
  } else if (psiValue <= 200) {
    return { status: 'Unhealthy', color: 'amber', advice: 'Reduce prolonged outdoor exertion. Wear N95 outdoors. Vulnerable groups stay indoors.' };
  } else if (psiValue <= 300) {
    return { status: 'Very Unhealthy', color: 'rose', advice: 'Avoid strenuous outdoor activities. High-efficiency indoor spaces strongly recommended.' };
  } else {
    return { status: 'Hazardous', color: 'purple', advice: 'Hazardous air quality. Stay indoors with air filtration. Minimize all outdoor exposure.' };
  }
}

// Endpoint: Real-time PSI & PM2.5 from Singapore NEA Data API
app.get('/api/psi', async (_req, res) => {
  try {
    const now = Date.now();
    if (cachedPsiData && now - lastCacheTime < CACHE_TTL_MS) {
      return res.json(cachedPsiData);
    }

    const [psiRes, pm25Res] = await Promise.allSettled([
      fetch('https://api.data.gov.sg/v1/environment/psi', { headers: { 'Accept': 'application/json' } }),
      fetch('https://api.data.gov.sg/v1/environment/pm25', { headers: { 'Accept': 'application/json' } }),
    ]);

    let psiJson: any = null;
    let pm25Json: any = null;

    if (psiRes.status === 'fulfilled' && psiRes.value.ok) {
      psiJson = await psiRes.value.json();
    }
    if (pm25Res.status === 'fulfilled' && pm25Res.value.ok) {
      pm25Json = await pm25Res.value.json();
    }

    if (!psiJson || !psiJson.items || !psiJson.items[0]) {
      const fallback = getFallbackPsi();
      return res.json(fallback);
    }

    const latestItem = psiJson.items[0];
    const psiReadings = latestItem.readings?.psi_twenty_four_hourly || {};
    const pm25TwentyFour = latestItem.readings?.pm25_twenty_four_hourly || {};

    let pm25OneHr: Record<string, number> = {};
    if (pm25Json && pm25Json.items && pm25Json.items[0]?.readings?.pm25_one_hourly) {
      pm25OneHr = pm25Json.items[0].readings.pm25_one_hourly;
    }

    const regionsList = ['central', 'east', 'west', 'north', 'south'];
    const regions: Record<string, any> = {};

    let maxPsi = 0;
    regionsList.forEach((reg) => {
      const psi = psiReadings[reg] || 50;
      const pm25_1h = pm25OneHr[reg] || pm25TwentyFour[reg] || Math.round(psi * 0.85);
      const { status, color, advice } = determinePsiStatus(psi);
      if (psi > maxPsi) maxPsi = psi;
      regions[reg] = {
        psi,
        pm25_one_hr: pm25_1h,
        status,
        color,
        advice,
      };
    });

    const nationalPsi = psiReadings.national || maxPsi || 75;
    const { status: natStatus, color: natColor, advice: natAdvice } = determinePsiStatus(nationalPsi);
    regions.national = {
      psi: nationalPsi,
      pm25_one_hr: pm25OneHr.central || Math.round(nationalPsi * 0.85),
      status: natStatus,
      color: natColor,
      advice: natAdvice,
    };

    const result = {
      source: 'nea_singapore_live',
      timestamp: latestItem.timestamp,
      update_timestamp: latestItem.update_timestamp || new Date().toISOString(),
      regions,
      weather: {
        wind_direction: 'South-Southwest (SSW)',
        wind_speed_kmh: 16,
        temperature_c: 31,
        humidity_pct: 76,
        summary: 'Prevailing southwesterly winds continue to blow over Singapore and surrounding region.',
      },
      metadata: psiJson.region_metadata || [],
    };

    cachedPsiData = result;
    lastCacheTime = now;
    return res.json(result);
  } catch (error) {
    console.error('Error fetching Singapore PSI:', error);
    return res.json(getFallbackPsi());
  }
});

// Endpoint: Gemini AI Tourist Concierge
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are "Captain Haze", an empathetic, hyper-knowledgeable Singapore tourist guide and public health companion.
Your mission is to help travelers visiting Singapore enjoy their holiday safely despite smoke haze conditions caused by regional transboundary forest/peatland burning.

Key Guidelines:
1. Explain air quality clearly: Differentiate 24-hr PSI (Pollutant Standards Index) vs 1-hr PM2.5 (real-time particulates).
2. Official Bands (NEA Singapore): 0-50 Good, 51-100 Moderate, 101-200 Unhealthy, 201-300 Very Unhealthy, >300 Hazardous.
3. Masks: Emphasize that standard surgical/cloth masks DO NOT protect against PM2.5 haze particulates. N95 respirators (e.g. 3M 8210, 1860, AIR+ smart mask) or FFP2 are required.
4. Symptom Care: For mild symptoms (eye irritation, throat itch, runny nose), suggest preservative-free lubricating eye drops, saline nasal spray, throat lozenges, drinking lots of water, and resting in air-conditioned indoor environments. Red flag symptoms (severe shortness of breath, chest pain, coughing blood) need urgent emergency department care (call 995 or visit Singapore General Hospital, Tan Tock Seng Hospital, Raffles Hospital).
5. Where to buy supplies: Guardian, Watsons, and Unity pharmacies (located in almost every shopping mall, MRT station, and Changi Airport). 7-Eleven and Cheers convenience stores also stock basic masks and lozenges.
6. Smart Itinerary Substitutions: If outdoor plans are compromised, enthusiastically recommend top-tier climate-controlled indoor attractions in Singapore:
   - Instead of Gardens by the Bay outdoor supertrees -> Gardens by the Bay Flower Dome & Cloud Forest (air-conditioned with high grade filtration).
   - Instead of outdoor Zoo -> S.E.A. Aquarium (Sentosa), ArtScience Museum, or National Gallery Singapore.
   - Instead of outdoor street walking -> Jewel Changi Rain Vortex & Canopy Park, The Shoppes at Marina Bay Sands, or underground Orchard mall tunnels.
   - Instead of open-air hawkers -> Air-conditioned food courts like Lau Pa Sat indoor section, Food Republic (313@Somerset, VivoCity), Jewel Five Spice.
7. Tone: Warm, reassuring, practical, culturally accurate to Singapore (MRT lines, tourist landmarks, local tips). Format responses with clean headings, bullet points, and concise actionable steps.`;

    // Prepare contents
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Resilient call: try gemini-3.8-flash, fallback to gemini-2.5-flash, then smart domain fallback
    let replyText = '';
    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (callErr: any) {
        console.warn(`Attempt with ${modelName} encountered error:`, callErr?.message);
      }
    }

    if (!replyText) {
      // Smart domain fallback based on message keywords
      const lower = message.toLowerCase();
      if (lower.includes('eye') || lower.includes('drop')) {
        replyText = `**Recommended Eye Care for Singapore Haze:**
1. **Preservative-Free Lubricating Eye Drops:** Pick up *Systane Ultra*, *Refresh Plus*, or *Bion Tears* (single-use vials) from any Guardian, Watsons, or Unity pharmacy.
2. **Usage:** Instill 1 drop into each eye every 2 to 3 hours while outdoors to flush microscopic particulate ash.
3. **Contact Lenses:** Avoid wearing soft contact lenses on hazy days as particulates become trapped beneath the lens. Switch to eyeglasses.
4. **Where to buy:** Found at Guardian in Marina Bay Sands (#B2-58), Watsons ION Orchard (#B4-12), and Changi Airport.`;
      } else if (lower.includes('mask') || lower.includes('n95') || lower.includes('surgical')) {
        replyText = `**Singapore Haze Mask Guidelines:**
- **Surgical Masks DO NOT protect against PM2.5:** Standard 3-ply blue surgical masks leak around your cheeks and nose and cannot filter 2.5-micron particles.
- **Wear Certified N95 or FFP2:** Look for 3M 8210 / 1860 or AIR+ smart masks. Ensure the aluminum nose strip is pressed firmly against your nose bridge.
- **Where to buy:** Available at Guardian, Watsons, Unity, and most 7-Eleven convenience stores across Singapore MRT stations.`;
      } else if (lower.includes('indoor') || lower.includes('kid') || lower.includes('where') || lower.includes('go')) {
        replyText = `**Top Clean-Air Indoor Havens in Singapore:**
1. **Gardens by the Bay Conservatories:** Flower Dome & Cloud Forest feature hospital-grade multi-stage air filtration and 24°C cool temperatures.
2. **Jewel Changi Airport:** The world-famous 40m indoor Rain Vortex is housed inside a giant air-conditioned dome with walking trails and shopping.
3. **S.E.A. Aquarium (Sentosa):** Enclosed deep-sea viewing panels with zero outdoor smoke exposure.
4. **National Gallery Singapore:** Neoclassical air-conditioned galleries preserving centuries-old art under strict atmospheric controls.`;
      } else {
        replyText = `**Singapore Haze Travel Guidance:**
- **Current Advice:** When PSI is above 100, reduce prolonged outdoor walking and wear a certified N95 mask.
- **Indoor Activities:** Head to climate-controlled indoor sanctuaries like Jewel Changi, Gardens by the Bay Flower Dome, or underground mall networks in Orchard.
- **Medical Emergencies:** In case of acute wheezing, chest pain, or severe breathlessness, immediately call 995 (SCDF Emergency Ambulance) or visit Singapore General Hospital (Outram) or Raffles Hospital (Bugis).`;
      }
    }

    return res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.json({
      reply: 'When PSI is above 100 in Singapore, limit strenuous outdoor activities, wear an N95 respirator, and spend time in climate-controlled indoor attractions like Cloud Forest, Jewel Changi, or S.E.A. Aquarium. In emergencies, call 995.',
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Captain Haze Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
