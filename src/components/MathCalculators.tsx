import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Hash, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRightLeft, 
  Zap, 
  Grid 
} from 'lucide-react';
import { Language } from '../types';
import { 
  CUT_MAP, 
  getCutAnk, 
  getFamilyJodis, 
  isRedJodi, 
  calculatePanaSum, 
  ALL_PANAS, 
  generateMotorPanas 
} from '../utils/matkaMath';

interface MathCalculatorsProps {
  language: Language;
}

export const MathCalculators: React.FC<MathCalculatorsProps> = ({ language }) => {
  const isMr = language === 'mr';

  // Sub-tabs
  const [activeTool, setActiveTool] = useState<'cut' | 'family' | 'pana' | 'motor' | 'matrix'>('cut');

  // Tool 1: Cut Ank State
  const [selectedCutDigit, setSelectedCutDigit] = useState<number>(0);

  // Tool 2: Family Jodi State
  const [familyInput, setFamilyInput] = useState<string>('24');
  const [copiedFamily, setCopiedFamily] = useState(false);

  // Tool 3: Pana Explorer State
  const [panaAnkSelect, setPanaAnkSelect] = useState<number>(5);
  const [customPanaInput, setCustomPanaInput] = useState<string>('159');

  // Tool 4: Motor Pana State
  const [selectedMotorDigits, setSelectedMotorDigits] = useState<number[]>([1, 2, 4, 7]);
  const [copiedMotor, setCopiedMotor] = useState(false);

  const toggleMotorDigit = (d: number) => {
    if (selectedMotorDigits.includes(d)) {
      if (selectedMotorDigits.length > 3) {
        setSelectedMotorDigits(selectedMotorDigits.filter(x => x !== d));
      }
    } else {
      if (selectedMotorDigits.length < 6) {
        setSelectedMotorDigits([...selectedMotorDigits, d].sort((a, b) => a - b));
      }
    }
  };

  const motorPanas = generateMotorPanas(selectedMotorDigits);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Tool Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-wrap items-center gap-2">
        {[
          { id: 'cut', label: isMr ? '१. कट अंक तक्ता' : '1. Cut Ank Table', icon: ArrowRightLeft },
          { id: 'family', label: isMr ? '२. फॅमिली जोडी' : '2. Family Jodi', icon: Hash },
          { id: 'pana', label: isMr ? '३. पाना / पत्ती शोधक' : '3. Pana Explorer', icon: Layers },
          { id: 'motor', label: isMr ? '४. मोटर पाना मेकर' : '4. Motor Pana', icon: Zap },
          { id: 'matrix', label: isMr ? '५. बेरीज व फरक तक्ता' : '5. Total-Diff Matrix', icon: Grid },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: CUT ANK CALCULATOR */}
      {activeTool === 'cut' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>{isMr ? 'कल्याण कट अंक नियम व तक्ता (Cut Ank Rules)' : 'Kalyan Cut Ank Rules & Table'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isMr
                ? 'कल्याण अंक गणितात ५ चा फरक असणारे अंक एकमेकांचे "कट अंक" मानले जातात. सूत्र: (अंक + ५) % १०'
                : 'In Indian Matka math, digits differing by 5 are reciprocal Cut pairs. Formula: (Digit + 5) % 10.'}
            </p>
          </div>

          {/* Cut Pair Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { a: 0, b: 5 },
              { a: 1, b: 6 },
              { a: 2, b: 7 },
              { a: 3, b: 8 },
              { a: 4, b: 9 },
            ].map(pair => (
              <div
                key={pair.a}
                onClick={() => setSelectedCutDigit(pair.a)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedCutDigit === pair.a || selectedCutDigit === pair.b
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 font-mono font-black text-2xl sm:text-3xl">
                  <span className="text-amber-400">{pair.a}</span>
                  <span className="text-slate-600 text-sm">↔</span>
                  <span className="text-amber-400">{pair.b}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isMr ? `जोडी: ${pair.a}${pair.b} (लाल)` : `Red: ${pair.a}${pair.b}`}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Digit Selector */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 mb-2">
              {isMr ? 'कोणताही अंक निवडून त्याचा कट व परिणाम तपासा:' : 'Select any digit to inspect its Cut effect:'}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedCutDigit(d)}
                  className={`py-2 rounded-lg font-mono font-bold text-base transition-all ${
                    selectedCutDigit === d
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">{isMr ? 'निवडलेला अंक: ' : 'Selected Digit: '}</span>
                <span className="font-bold text-amber-400 font-mono text-base mr-3">{selectedCutDigit}</span>
                <span className="text-slate-400">{isMr ? 'त्याचा कट अंक: ' : 'Its Cut Ank: '}</span>
                <span className="font-bold text-emerald-400 font-mono text-base">{getCutAnk(selectedCutDigit)}</span>
              </div>
              <div className="text-slate-400">
                {isMr
                  ? `उदा. जर ओपन ${selectedCutDigit} आला, तर क्लोजमध्ये कट ${getCutAnk(selectedCutDigit)} येण्याची शक्यता जास्त असते.`
                  : `If Open is ${selectedCutDigit}, historical symmetry shows high frequency of Cut ${getCutAnk(selectedCutDigit)} in Close.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: FAMILY JODI GENERATOR */}
      {activeTool === 'family' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-amber-400" />
              <span>{isMr ? 'कल्याण फॅमिली जोडी जनरेटर (Family Jodi Generator)' : 'Kalyan Family Jodi Generator'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isMr
                ? 'कोणतीही २ अंकी जोडी प्रविष्ट करा. प्रणाली तात्काळ त्या जोडीची संपूर्ण ८ (किंवा कट जोडीची ४) फॅमिली जोड्या तयार करेल.'
                : 'Enter any 2-digit Jodi to generate its 8 (or 4 for red/cut) family pairs based on cut permutations.'}
            </p>
          </div>

          {/* Input Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {isMr ? '२ अंकी जोडी टाका (उदा. 24, 38, 55):' : 'Enter 2-digit pair (e.g. 24, 38, 55):'}
              </label>
              <input
                type="text"
                maxLength={2}
                value={familyInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setFamilyInput(val);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 font-mono text-xl font-bold text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {['14', '24', '35', '55', '78'].map(sample => (
                <button
                  key={sample}
                  onClick={() => setFamilyInput(sample)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 hover:border-amber-500/50"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Results Output */}
          {familyInput.length === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {isMr ? `जोडी ${familyInput} ची फॅमिली:` : `Family of ${familyInput}:`}
                </span>
                <span className="text-xs text-slate-400">
                  {getFamilyJodis(familyInput).length} {isMr ? 'एकूण जोड्या' : 'total pairs'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {getFamilyJodis(familyInput).map(jodi => {
                  const isRed = isRedJodi(jodi);
                  return (
                    <div
                      key={jodi}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center ${
                        jodi === familyInput
                          ? 'bg-amber-500/20 border-amber-500 text-white'
                          : isRed
                          ? 'bg-red-950/40 border-red-500/50 text-red-300'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="text-3xl font-black font-mono">
                        {jodi}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {jodi === familyInput ? (isMr ? 'मूळ जोडी' : 'Base Pair') : isRed ? (isMr ? 'लाल जोडी' : 'Red Pair') : (isMr ? 'फॅमिली' : 'Family')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: PANA EXPLORER */}
      {activeTool === 'pana' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>{isMr ? 'पाना / पत्ती कॅल्क्युलेटर व तक्ता (220 Panels)' : 'Pana / Patti Explorer (220 Panels)'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isMr
                ? 'प्रत्येक अंकाचे (० ते ९) १२ सिंगल पाने, ९ डबल पाने, आणि १ ट्रिपल पाना असतात.'
                : 'Each digit (0-9) corresponds to exactly 12 Single Panas, 9 Double Panas, and 1 Triple Pana.'}
            </p>
          </div>

          {/* Quick Pana Check */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {isMr ? 'कोणताही ३ अंकी पाना तपासा (उदा. 159, 234, 777):' : 'Check any 3-digit Pana (e.g. 159, 234):'}
              </label>
              <input
                type="text"
                maxLength={3}
                value={customPanaInput}
                onChange={(e) => setCustomPanaInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 font-mono text-xl font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {customPanaInput.length === 3 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center sm:min-w-[180px]">
                <div className="text-[11px] text-slate-400">{isMr ? 'बेरीज व अंक:' : 'Resulting Ank:'}</div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {calculatePanaSum(customPanaInput)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ∑ = {customPanaInput.split('').join(' + ')} = {parseInt(customPanaInput[0], 10) + parseInt(customPanaInput[1], 10) + parseInt(customPanaInput[2], 10)}
                </div>
              </div>
            )}
          </div>

          {/* Select Ank to View All Its Panas */}
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2">
              {isMr ? 'अंक निवडा आणि त्याचे सर्व २२ पाने पाहा:' : 'Select digit to view its full 22 Pana set:'}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                <button
                  key={d}
                  onClick={() => setPanaAnkSelect(d)}
                  className={`py-2 rounded-lg font-mono font-bold text-base transition-all ${
                    panaAnkSelect === d
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Displaying Panas for panaAnkSelect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Single Panas */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Single Pana (SP)</span>
                  <span className="text-[10px] text-amber-400 font-mono">12 Panas</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                  {(ALL_PANAS.singlePanas[panaAnkSelect] || []).map(p => (
                    <span key={p} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-center text-slate-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Double Panas */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Double Pana (DP)</span>
                  <span className="text-[10px] text-amber-400 font-mono">9 Panas</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                  {(ALL_PANAS.doublePanas[panaAnkSelect] || []).map(p => (
                    <span key={p} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-center text-amber-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Triple Pana */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Triple Pana (TP)</span>
                  <span className="text-[10px] text-amber-400 font-mono">1 Pana</span>
                </div>
                <div className="flex items-center justify-center p-4">
                  {(ALL_PANAS.triplePanas[panaAnkSelect] || []).map(p => (
                    <span key={p} className="bg-red-950/60 border border-red-500/50 px-4 py-2 rounded-xl text-lg font-mono font-bold text-red-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: MOTOR PANA GENERATOR */}
      {activeTool === 'motor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>{isMr ? 'मोटर पाना जनरेटर (Motor Pana Generator)' : 'Motor Pana Generator'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isMr
                ? 'कोणतेही ४ किंवा ५ अंक निवडा. प्रणाली त्या अंकांचे सर्व शक्य सिंगल व डबल पाने तयार करेल.'
                : 'Select 4 or 5 digits to auto-generate all possible Single and Double Motor Panas.'}
            </p>
          </div>

          {/* Digit Pickers */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 mb-2">
              {isMr ? '४ किंवा ५ अंक निवडा:' : 'Select 4 to 5 digits:'}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
                const isSelected = selectedMotorDigits.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleMotorDigit(d)}
                    className={`py-2 rounded-lg font-mono font-bold text-base transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motor Pana Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Single Motor Panas */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Single Motor Panas (SP)</span>
                <span className="text-xs text-amber-400 font-mono">{motorPanas.sp.length} Panas</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {motorPanas.sp.map(p => (
                  <span key={p} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-white">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Double Motor Panas */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Double Motor Panas (DP)</span>
                <span className="text-xs text-amber-400 font-mono">{motorPanas.dp.length} Panas</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {motorPanas.dp.map(p => (
                  <span key={p} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-amber-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: TOTAL & DIFFERENCE MATRIX */}
      {activeTool === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-400" />
              <span>{isMr ? 'जोडी बेरीज व फरक मॅट्रिक्स (100 Pairs Matrix)' : 'Jodi Total & Difference Matrix'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isMr
                ? '०० ते ९९ मधील प्रत्येक जोडीची बेरीज आणि फरक खालील तक्त्यावरून समजून घ्या.'
                : 'Inspect the sum total (A+B)%10 and absolute difference |A-B| for all 100 possible pairs.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-2 text-amber-400">O \ C</th>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => (
                    <th key={c} className="p-2 text-slate-200">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(o => (
                  <tr key={o} className="hover:bg-slate-800/50">
                    <td className="p-2 font-bold text-amber-400 bg-slate-950">{o}</td>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => {
                      const jodi = `${o}${c}`;
                      const isRed = isRedJodi(jodi);
                      const total = (o + c) % 10;
                      return (
                        <td
                          key={c}
                          className={`p-1.5 ${isRed ? 'bg-red-950/30 text-red-400 font-bold' : 'text-slate-300'}`}
                          title={`Jodi: ${jodi}, Total: ${total}, Diff: ${Math.abs(o - c)}`}
                        >
                          <div>{jodi}</div>
                          <div className="text-[9px] text-slate-500">T:{total}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
