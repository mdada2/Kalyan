import React from 'react';
import { Sparkles, Calendar, BookOpen, BarChart3, Calculator, ShieldCheck, Flame } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  latestDateStr: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  latestDateStr,
}) => {
  const isMr = language === 'mr';

  const navItems = [
    { id: 'predictor', label: isMr ? 'पक्के अंदाज' : 'Solid Predictor', icon: Sparkles },
    { id: 'chart', label: isMr ? 'कल्याण चार्ट' : 'Jodi & Panel Chart', icon: BarChart3 },
    { id: 'calculators', label: isMr ? 'अंक गणित टूल्स' : 'Math Calculators', icon: Calculator },
    { id: 'analytics', label: isMr ? 'वारंवारता सांख्यिकी' : 'Frequency Analytics', icon: Flame },
    { id: 'backtest', label: isMr ? 'बॅकटेस्ट लॅब' : 'Backtest Lab', icon: ShieldCheck },
    { id: 'guide', label: isMr ? 'मार्गदर्शक व नियम' : 'Study Guide', icon: BookOpen },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-xl">
            क
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>{isMr ? 'कल्याण अंक गणित & जोडी चार्ट' : 'Kalyan Ank Ganit & Jodi Chart'}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-amber-400 font-medium">{isMr ? 'शैक्षणिक अभ्यास' : 'Educational Study'}</span>
              <span aria-hidden="true">·</span>
              <span>272 {isMr ? 'आठवडे डेटा (2021-2026)' : 'Weeks Archive'}</span>
              <span aria-hidden="true">·</span>
              <span className="hidden sm:inline">{isMr ? 'चालू आठवडा:' : 'Active:'} {latestDateStr}</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                isMr
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                !isMr
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
