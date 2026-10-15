import React, { useState } from 'react';
import { SYMPTOMS_LIST } from '../data/hazeData';
import { AlertTriangle, CheckCircle2, PhoneCall, Stethoscope, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

interface SymptomCheckerProps {
  onOpenSupplies: () => void;
  onOpenAiConciergeWithPrompt: (prompt: string) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  onOpenSupplies,
  onOpenAiConciergeWithPrompt,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAll = () => setSelectedSymptoms([]);

  const selectedList = SYMPTOMS_LIST.filter((s) => selectedSymptoms.includes(s.id));
  const hasRedFlags = selectedList.some((s) => s.isRedFlag);
  const hasMildSymptoms = selectedList.some((s) => !s.isRedFlag);
  const isEvaluated = selectedSymptoms.length > 0;

  return (
    <section id="symptoms" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Self-Triage & Treatment Protocol
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Haze Symptom Checker for Tourists
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Select any symptoms you or your travel companions are currently experiencing in Singapore to receive immediate medical triage advice.
            </p>
          </div>

          {isEvaluated && (
            <button
              onClick={resetAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Selection</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Symptom Checklist */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select all that apply:
            </div>

            {SYMPTOMS_LIST.map((symptom) => {
              const isChecked = selectedSymptoms.includes(symptom.id);
              return (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isChecked
                      ? symptom.isRedFlag
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400'
                        : 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by div container click
                    className={`mt-0.5 h-4 w-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer ${
                      symptom.isRedFlag ? 'accent-rose-600' : 'accent-amber-600'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${
                        isChecked ? (symptom.isRedFlag ? 'text-rose-950' : 'text-amber-950') : 'text-slate-900'
                      }`}>
                        {symptom.name}
                      </span>
                      {symptom.isRedFlag && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                          Red Flag Symptom
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {symptom.organ}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {symptom.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Triage Advice Result */}
          <div className="lg:col-span-5 sticky top-20">
            {!isEvaluated ? (
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Symptoms Selected</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Click on any symptom from the list on the left to see immediate Singapore doctor advice, pharmacy remedies, or emergency hospital contacts.
                </p>
              </div>
            ) : hasRedFlags ? (
              /* Severe / Red Flag Warning Card */
              <div className="p-6 rounded-3xl bg-rose-900 text-white shadow-xl">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Immediate Medical Attention Required</span>
                </div>

                <h3 className="text-xl font-black mt-2 text-white">
                  Emergency Evaluation Needed
                </h3>

                <p className="text-xs sm:text-sm text-rose-100 mt-3 leading-relaxed">
                  You selected symptoms indicating acute respiratory distress or cardiovascular strain (e.g. wheezing, asthma flare-up, chest tightness, or severe shortness of breath). Do not wait.
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Singapore Emergency Contacts:
                  </div>

                  <a
                    href="tel:995"
                    className="w-full py-3 px-4 bg-white text-rose-900 hover:bg-rose-50 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-rose-700" />
                    <span>Call 995 (SCDF Emergency Ambulance)</span>
                  </a>

                  <div className="text-[11px] text-rose-200 text-center">
                    Toll-free 24/7. Singapore paramedics speak English, Mandarin, and Malay.
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-xs text-rose-100">
                  <div className="font-semibold text-white">Nearest Emergency Hospitals:</div>
                  <div>· <strong>Singapore General Hospital (SGH)</strong> – Outram Road</div>
                  <div>· <strong>Raffles Hospital</strong> – 585 North Bridge Rd (Bugis)</div>
                  <div>· <strong>KK Hospital</strong> – For children & pregnant mothers</div>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-800/80">
                  <a
                    href="#supplies-clinics"
                    className="text-xs font-semibold text-rose-200 hover:text-white flex items-center gap-1"
                  >
                    View Hospital Addresses & Map &rarr;
                  </a>
                </div>
              </div>
            ) : (
              /* Mild Irritation / Home Care Protocol */
              <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-300 text-slate-900 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mild Haze Irritation (Self-Care Protocol)</span>
                </div>

                <h3 className="text-lg font-bold mt-2 text-slate-900">
                  Recommended Tourist Care Steps
                </h3>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  These symptoms are common physiological reactions to inhaled sulfur dioxide and fine ash. They can be effectively relieved with OTC supplies:
                </p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-amber-200">
                    <div className="font-bold text-slate-900">1. For Eyes (Red / Gritty)</div>
                    <p className="text-slate-600 mt-0.5">
                      Flush with preservative-free artificial tears (Systane, Refresh). Avoid rubbing eyes. Switch to eyeglasses if you wear contacts.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-amber-200">
                    <div className="font-bold text-slate-900">2. For Nose & Sinuses</div>
                    <p className="text-slate-600 mt-0.5">
                      Use isotonic saline spray (Sterimar, Flo) to rinse trapped soot particles from nasal cilia.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-amber-200">
                    <div className="font-bold text-slate-900">3. For Throat & Cough</div>
                    <p className="text-slate-600 mt-0.5">
                      Suck on Difflam or Strepsils lozenges. Drink 2.5L+ warm water or chrysanthemum tea.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onOpenSupplies}
                    className="flex-1 py-2.5 px-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Find Nearest Pharmacy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const names = selectedList.map((s) => s.name).join(', ');
                      onOpenAiConciergeWithPrompt(`I am a tourist in Singapore experiencing these symptoms due to haze: ${names}. What specific remedies and foods/drinks can I get at nearby 7-Eleven or Guardian?`);
                    }}
                    className="py-2.5 px-3 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-semibold text-xs hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ask AI Advice</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
