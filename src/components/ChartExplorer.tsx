import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, X, Eye, Info, Sparkles, Layers } from 'lucide-react';
import { DayKey, Language, WeekRecord } from '../types';
import { 
  DAY_NAMES, 
  DAY_KEYS, 
  isRedJodi, 
  getCutAnk, 
  getJodiTotal, 
  getJodiDifference, 
  getFamilyJodis,
  calculatePanaSum,
  ALL_PANAS
} from '../utils/matkaMath';

interface ChartExplorerProps {
  history: WeekRecord[];
  language: Language;
}

export const ChartExplorer: React.FC<ChartExplorerProps> = ({
  history,
  language,
}) => {
  const isMr = language === 'mr';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [onlyRed, setOnlyRed] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Selected cell for detailed modal
  const [activeCellDetail, setActiveCellDetail] = useState<{
    week: string;
    dayKey: DayKey;
    openPana: string;
    jodi: string;
    closePana: string;
  } | null>(null);

  // Available years in dataset
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    history.forEach(rec => {
      // week format: "02-08-21 to 07-08-21" or "12-10-26 to 18-10-26"
      const match = rec.week.match(/-(\d{2})$/);
      if (match) {
        years.add('20' + match[1]);
      }
    });
    return Array.from(years).sort().reverse();
  }, [history]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return history.filter(row => {
      // Year filter
      if (selectedYear !== 'all') {
        const shortYear = selectedYear.slice(-2);
        if (!row.week.includes(`-${shortYear}`)) {
          return false;
        }
      }

      // Search term filter (jodi or pana)
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        let match = false;
        for (const d of DAY_KEYS) {
          const c = row[d];
          if (c) {
            if (c.jodi.includes(term) || c.openPana.includes(term) || c.closePana.includes(term)) {
              match = true;
              break;
            }
          }
        }
        if (!match) return false;
      }

      // Only red jodi filter
      if (onlyRed) {
        let hasRed = false;
        for (const d of DAY_KEYS) {
          if (isRedJodi(row[d]?.jodi)) {
            hasRed = true;
            break;
          }
        }
        if (!hasRed) return false;
      }

      return true;
    }).reverse(); // Most recent first
  }, [history, selectedYear, searchTerm, onlyRed]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handleCellClick = (week: string, dayKey: DayKey, cell: { openPana: string; jodi: string; closePana: string }) => {
    if (!cell || cell.jodi.includes('*')) return;
    setActiveCellDetail({
      week,
      dayKey,
      openPana: cell.openPana,
      jodi: cell.jodi,
      closePana: cell.closePana,
    });
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-12">
      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>{isMr ? 'कल्याण जोडी व पॅनल चार्ट (२०२१ - २०२६)' : 'Kalyan Jodi & Panel Chart Archive'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isMr 
                ? '२७२ आठवड्यांचा संपूर्ण चार्ट. कोणत्याही जोडीवर क्लिक करून सखोल गणित तपासा.'
                : 'Complete historical panel database. Click on any pair to inspect formulas and panas.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="all">{isMr ? 'सर्व वर्षे (All Years)' : 'All Years'}</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Red Jodi Toggle */}
            <button
              onClick={() => {
                setOnlyRed(!onlyRed);
                setPage(1);
              }}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                onlyRed
                  ? 'bg-red-950/60 border-red-500 text-red-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyRed ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{isMr ? 'फक्त लाल जोड्या' : 'Red Jodis Only'}</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder={isMr ? 'जोडी किंवा पाना शोधा... (उदा. 55, 34, 159)' : 'Search Jodi or Pana (e.g. 55, 34, 159)...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chart Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs sm:text-sm">
                <th className="py-3 px-3 font-semibold tracking-wider text-left min-w-[120px]">
                  {isMr ? 'तारीख (Week)' : 'Week Dates'}
                </th>
                {DAY_KEYS.map((day) => (
                  <th key={day} className="py-3 px-2 font-bold tracking-wider text-amber-400 min-w-[130px]">
                    {DAY_NAMES[day][language]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm font-mono">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    {isMr ? 'कोणतेही निकाल आढळले नाहीत.' : 'No records found matching filters.'}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.week} className="hover:bg-slate-800/40 transition-colors">
                    {/* Week Date Column */}
                    <td className="py-3 px-3 text-left font-sans text-xs text-slate-400 font-medium whitespace-nowrap">
                      {row.week}
                    </td>

                    {/* Day Cells */}
                    {DAY_KEYS.map((day) => {
                      const cell = row[day];
                      if (!cell) return <td key={day} className="py-2 px-1 text-slate-600">-</td>;

                      const isRed = isRedJodi(cell.jodi);
                      const isPending = cell.jodi.includes('*');

                      return (
                        <td
                          key={day}
                          onClick={() => handleCellClick(row.week, day, cell)}
                          className={`py-2 px-2 transition-all cursor-pointer ${
                            isPending
                              ? 'bg-slate-950/20 text-slate-600 cursor-default'
                              : isRed
                              ? 'bg-red-950/20 hover:bg-red-950/40'
                              : 'hover:bg-amber-500/10'
                          }`}
                          title={isPending ? undefined : (isMr ? 'सविस्तर गणित पाहण्यासाठी क्लिक करा' : 'Click to inspect')}
                        >
                          {isPending ? (
                            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs">
                              <span>***</span>
                              <span className="font-bold">**</span>
                              <span>***</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              {/* Open Pana */}
                              <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                                {cell.openPana}
                              </span>

                              {/* Jodi */}
                              <span
                                className={`text-base sm:text-lg font-black tracking-tight px-1.5 py-0.5 rounded ${
                                  isRed
                                    ? 'text-red-400 bg-red-950/60 font-black'
                                    : 'text-amber-300 font-black'
                                }`}
                              >
                                {cell.jodi}
                              </span>

                              {/* Close Pana */}
                              <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                                {cell.closePana}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span>
              {isMr
                ? `एकूण ${filteredRows.length} आठवडे (पृष्ठ ${page} पैकी ${totalPages})`
                : `Showing page ${page} of ${totalPages} (${filteredRows.length} weeks)`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isMr ? 'मागील (Prev)' : 'Previous'}
            </button>
            <span className="px-2 font-mono text-slate-200">{page}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isMr ? 'पुढील (Next)' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* CELL INSPECTOR MODAL */}
      {activeCellDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveCellDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {DAY_NAMES[activeCellDetail.dayKey][language]} · {activeCellDetail.week}
              </div>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                <span>{isMr ? 'कल्याण निकाल सविस्तर गणित' : 'Result Mathematical Breakdown'}</span>
              </h3>
            </div>

            {/* Core Box: Pana - Jodi - Pana */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] text-slate-400 mb-0.5">{isMr ? 'ओपन पाना' : 'Open Pana'}</div>
                <div className="text-xl font-black font-mono text-slate-200">{activeCellDetail.openPana}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  ∑ = {calculatePanaSum(activeCellDetail.openPana)} (अंक)
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800" />

              <div>
                <div className="text-[11px] text-slate-400 mb-0.5">{isMr ? 'जोडी' : 'Jodi'}</div>
                <div
                  className={`text-3xl font-black font-mono ${
                    isRedJodi(activeCellDetail.jodi) ? 'text-red-400' : 'text-amber-400'
                  }`}
                >
                  {activeCellDetail.jodi}
                </div>
                <div className="text-[10px] font-semibold mt-1">
                  {isRedJodi(activeCellDetail.jodi) ? (
                    <span className="text-red-400">{isMr ? 'लाल जोडी' : 'Red Jodi'}</span>
                  ) : (
                    <span className="text-slate-400">{isMr ? 'रेग्युलर जोडी' : 'Standard Jodi'}</span>
                  )}
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800" />

              <div>
                <div className="text-[11px] text-slate-400 mb-0.5">{isMr ? 'क्लोज पाना' : 'Close Pana'}</div>
                <div className="text-xl font-black font-mono text-slate-200">{activeCellDetail.closePana}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  ∑ = {calculatePanaSum(activeCellDetail.closePana)} (अंक)
                </div>
              </div>
            </div>

            {/* Mathematical Properties */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-slate-400 block">{isMr ? 'जोडी बेरीज (Total):' : 'Jodi Sum Total:'}</span>
                <span className="text-base font-bold font-mono text-white">
                  {getJodiTotal(activeCellDetail.jodi)}
                </span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
                <span className="text-slate-400 block">{isMr ? 'जोडी फरक (Difference):' : 'Jodi Difference:'}</span>
                <span className="text-base font-bold font-mono text-white">
                  {getJodiDifference(activeCellDetail.jodi)}
                </span>
              </div>
            </div>

            {/* Cut Ank Table for this Jodi */}
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-amber-400 block">
                {isMr ? 'कट अंक संबंध (Cut Ank Relationship):' : 'Cut Ank Relationship:'}
              </span>
              <div className="text-slate-300 flex items-center justify-between">
                <span>
                  ओपन {activeCellDetail.jodi[0]} चा कट: <strong className="text-white font-mono">{getCutAnk(parseInt(activeCellDetail.jodi[0], 10))}</strong>
                </span>
                <span>
                  क्लोज {activeCellDetail.jodi[1]} चा कट: <strong className="text-white font-mono">{getCutAnk(parseInt(activeCellDetail.jodi[1], 10))}</strong>
                </span>
              </div>
            </div>

            {/* Family Jodis */}
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  {isMr ? 'या जोडीची संपूर्ण फॅमिली (Family Jodis):' : 'Complete Family Pairs:'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {getFamilyJodis(activeCellDetail.jodi).length} {isMr ? 'जोड्या' : 'pairs'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-sm">
                {getFamilyJodis(activeCellDetail.jodi).map(fj => (
                  <span
                    key={fj}
                    className={`px-2 py-1 rounded-lg border font-bold ${
                      fj === activeCellDetail.jodi
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : isRedJodi(fj)
                        ? 'bg-red-950/40 border-red-500/40 text-red-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {fj}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setActiveCellDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                {isMr ? 'बंद करा' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
