import React, { useState } from 'react';
import { Header } from './components/Header';
import { PredictorView } from './components/PredictorView';
import { ChartExplorer } from './components/ChartExplorer';
import { MathCalculators } from './components/MathCalculators';
import { FrequencyAnalytics } from './components/FrequencyAnalytics';
import { BacktestingLab } from './components/BacktestingLab';
import { EducationalGuide } from './components/EducationalGuide';
import { kalyanHistory, latestWeek } from './data/historicalData';
import { Language } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('mr');
  const [activeTab, setActiveTab] = useState<string>('predictor');

  const latestDateStr = latestWeek ? latestWeek.week : '12-10-26 to 18-10-26';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        latestDateStr={latestDateStr}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'predictor' && (
          <PredictorView
            history={kalyanHistory}
            language={language}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'chart' && (
          <ChartExplorer
            history={kalyanHistory}
            language={language}
          />
        )}

        {activeTab === 'calculators' && (
          <MathCalculators
            language={language}
          />
        )}

        {activeTab === 'analytics' && (
          <FrequencyAnalytics
            history={kalyanHistory}
            language={language}
          />
        )}

        {activeTab === 'backtest' && (
          <BacktestingLab
            history={kalyanHistory}
            language={language}
          />
        )}

        {activeTab === 'guide' && (
          <EducationalGuide
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span>कल्याण अंक गणित & जोडी चार्ट अभ्यास</span>
            <span aria-hidden="true">·</span>
            <span>Educational Pattern & Combinatorics Engine</span>
            <span aria-hidden="true">·</span>
            <span>272 आठवडे डेटा संग्रह</span>
          </div>
          <p className="text-[11px] text-slate-600">
            केवळ शैक्षणिक आणि संख्याशास्त्रीय अभ्यासासाठी. All calculations are mathematical models based on historical panel distributions.
          </p>
        </div>
      </footer>
    </div>
  );
}
