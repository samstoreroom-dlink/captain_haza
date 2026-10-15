import React, { useState } from 'react';
import { Users, Baby, HeartPulse, Activity, Sparkles, UserCheck } from 'lucide-react';

export const AdvisoryMatrix: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<'healthy' | 'children' | 'elderly' | 'pregnant' | 'chronic'>('healthy');

  const groups = [
    {
      id: 'healthy' as const,
      label: 'Healthy Adults',
      icon: Activity,
      subtitle: 'Tourists without pre-existing conditions',
    },
    {
      id: 'children' as const,
      label: 'Children & Infants',
      icon: Baby,
      subtitle: 'Higher breathing rate & developing lungs',
    },
    {
      id: 'elderly' as const,
      label: 'Seniors (65+)',
      icon: Users,
      subtitle: 'Reduced respiratory reserve & circulation',
    },
    {
      id: 'pregnant' as const,
      label: 'Pregnant Women',
      icon: UserCheck,
      subtitle: 'Protecting maternal & fetal oxygenation',
    },
    {
      id: 'chronic' as const,
      label: 'Asthma / Heart Patients',
      icon: HeartPulse,
      subtitle: 'High risk of acute flare-ups',
    },
  ];

  const groupAdvisories = {
    healthy: {
      good: {
        action: 'Normal activities without restriction.',
        details: 'Enjoy all outdoor tourist attractions: Universal Studios, Zoo, Merlion Park, and outdoor hawker centers.',
      },
      moderate: {
        action: 'Normal activities.',
        details: 'Healthy tourists can continue outdoor sightseeing. Drink plenty of water and wear sunglasses to prevent eye irritation.',
      },
      unhealthy: {
        action: 'Reduce prolonged or strenuous outdoor physical exertion.',
        details: 'Avoid jogging or fast walking outdoors for >1 hour. Wear a certified N95 mask if walking outdoors. Switch afternoon trips to indoor malls or museum galleries.',
      },
      veryUnhealthy: {
        action: 'Avoid prolonged or strenuous outdoor exertion.',
        details: 'Minimize non-essential outdoor walking. Spend the day in climate-controlled indoor venues like Jewel Changi, S.E.A. Aquarium, or Flower Dome.',
      },
      hazardous: {
        action: 'Avoid all outdoor activity. Stay indoors.',
        details: 'Keep windows and doors closed. Use indoor air filters. Only travel outdoors for absolute necessities with a tightly sealed N95 mask.',
      },
    },
    children: {
      good: {
        action: 'Normal outdoor play and theme parks.',
        details: 'Children can run and play outdoors freely.',
      },
      moderate: {
        action: 'Normal activities; monitor for coughing or eye rubbing.',
        details: 'Ensure frequent sips of water. Bring saline eye drops if they complain of gritty eyes.',
      },
      unhealthy: {
        action: 'Minimize outdoor play; switch to indoor playgrounds.',
        details: 'Children breathe more air per kilogram of body weight than adults. Keep outdoor exposure under 30 minutes. Take them to Kiztopia, SuperPark, or ArtScience Museum.',
      },
      veryUnhealthy: {
        action: 'Avoid all outdoor activity. Stay indoors.',
        details: 'Children should remain in air-conditioned indoor spaces with closed windows. Standard adult N95 masks rarely fit children’s faces tightly; stay indoors rather than relying on masks.',
      },
      hazardous: {
        action: 'Strict indoor shelter.',
        details: 'Zero outdoor exposure. Use room air purifiers and maintain cool indoor air.',
      },
    },
    elderly: {
      good: {
        action: 'Normal activities.',
        details: 'Enjoy Singapore’s gardens, temples, and waterfronts.',
      },
      moderate: {
        action: 'Normal activities; take frequent rests in shade.',
        details: 'Stay well-hydrated in Singapore’s tropical humidity.',
      },
      unhealthy: {
        action: 'Avoid strenuous outdoor activities; reduce walking time.',
        details: 'Seniors have lower respiratory reserves. Avoid long outdoor walks around Marina Bay. Use air-conditioned MRT trains and underground mall walkways.',
      },
      veryUnhealthy: {
        action: 'Stay indoors with closed doors and windows.',
        details: 'Remain inside hotel or indoor attractions. If feeling lightheaded or breathless, visit an air-conditioned medical clinic immediately.',
      },
      hazardous: {
        action: 'Strict indoor shelter.',
        details: 'Complete rest indoors with air filtration.',
      },
    },
    pregnant: {
      good: {
        action: 'Normal tourist activities.',
        details: 'Stay hydrated and wear comfortable walking shoes.',
      },
      moderate: {
        action: 'Normal activities; avoid excessive heat exhaustion.',
        details: 'Take rest breaks every 45 minutes.',
      },
      unhealthy: {
        action: 'Avoid prolonged outdoor walking; wear N95 if outdoors.',
        details: 'Fine particulates can induce maternal vascular inflammation. Note: prolonged wearing of N95 masks increases breathing resistance—rest frequently.',
      },
      veryUnhealthy: {
        action: 'Stay indoors in air-conditioned environments.',
        details: 'Avoid outdoor movement. Spend time in spacious air-conditioned malls or hotel lounge.',
      },
      hazardous: {
        action: 'Strict indoor confinement.',
        details: 'Monitor fetal movement. Seek medical evaluation at KK Hospital if feeling chest tightness or breathing distress.',
      },
    },
    chronic: {
      good: {
        action: 'Normal activities; carry reliever inhaler at all times.',
        details: 'Keep fast-acting bronchodilator (e.g. Ventolin/Salbutamol) in your day bag.',
      },
      moderate: {
        action: 'Monitor symptoms; reduce intense exertion if feeling tight.',
        details: 'Take maintenance preventer inhaler regularly as prescribed.',
      },
      unhealthy: {
        action: 'Avoid outdoor physical exertion. Stay indoors.',
        details: 'High risk of acute asthma bronchospasm. Do NOT rely solely on an N95 mask outdoors, as increased breathing resistance can also provoke asthma symptoms. Stay in air-conditioned buildings.',
      },
      veryUnhealthy: {
        action: 'Strictly avoid outdoors. Stay in filtered indoor air.',
        details: 'Keep emergency inhalers within arm’s reach. If wheezing does not respond to 2-4 puffs of reliever, seek 24-hr emergency medical care immediately.',
      },
      hazardous: {
        action: 'Emergency indoor isolation.',
        details: 'Stay in a sealed room with HEPA air filtration running continuously.',
      },
    },
  };

  const currentAdv = groupAdvisories[selectedGroup];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Targeted Health Advisories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Impact of Haze by Age & Health Profile
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Based on Singapore Ministry of Health (MOH) & NEA guidelines
          </div>
        </div>

        {/* Group Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {groups.map((grp) => {
            const Icon = grp.icon;
            const isSelected = selectedGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${
                    isSelected ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold leading-snug">{grp.label}</div>
                  <div className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {grp.subtitle}
                  </div>
                </div>
                <div className={`text-[10px] font-semibold mt-3 pt-2 border-t ${
                  isSelected ? 'border-slate-800 text-amber-300' : 'border-slate-100 text-slate-400'
                }`}>
                  {isSelected ? 'Viewing Rules' : 'Click to view'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Rules Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Action Matrix for: {groups.find((g) => g.id === selectedGroup)?.label}
              </span>
            </div>
            <span className="text-xs text-slate-500">Official NEA Action Bands</span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Good */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="w-44 shrink-0 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Good (0 – 50 PSI)</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Clear Skies</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">{currentAdv.good.action}</div>
                <p className="text-xs text-slate-600 mt-0.5">{currentAdv.good.details}</p>
              </div>
            </div>

            {/* Moderate */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="w-44 shrink-0 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Moderate (51 – 100 PSI)</div>
                  <div className="text-[11px] text-blue-700 font-medium">Slight Haze</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">{currentAdv.moderate.action}</div>
                <p className="text-xs text-slate-600 mt-0.5">{currentAdv.moderate.details}</p>
              </div>
            </div>

            {/* Unhealthy */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-50/30 hover:bg-amber-50/60 transition-colors">
              <div className="w-44 shrink-0 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-950">Unhealthy (101 – 200 PSI)</div>
                  <div className="text-[11px] text-amber-800 font-bold">Action Required</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-amber-950">{currentAdv.unhealthy.action}</div>
                <p className="text-xs text-amber-900/80 mt-0.5">{currentAdv.unhealthy.details}</p>
              </div>
            </div>

            {/* Very Unhealthy */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-rose-50/30 hover:bg-rose-50/60 transition-colors">
              <div className="w-44 shrink-0 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-950">Very Unhealthy (201 – 300)</div>
                  <div className="text-[11px] text-rose-800 font-bold">Severe Smoke</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-rose-950">{currentAdv.veryUnhealthy.action}</div>
                <p className="text-xs text-rose-900/80 mt-0.5">{currentAdv.veryUnhealthy.details}</p>
              </div>
            </div>

            {/* Hazardous */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-purple-50/30 hover:bg-purple-50/60 transition-colors">
              <div className="w-44 shrink-0 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-purple-950">Hazardous (&gt; 300 PSI)</div>
                  <div className="text-[11px] text-purple-800 font-bold">Public Health Crisis</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-purple-950">{currentAdv.hazardous.action}</div>
                <p className="text-xs text-purple-900/80 mt-0.5">{currentAdv.hazardous.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
