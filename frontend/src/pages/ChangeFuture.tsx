import React, { useState, useMemo } from 'react';
import {
  Zap,
  Trees,
  Waves,
  Droplets,
  Factory,
  SunMedium,
  RotateCcw,
  Play,
  Download,
  Shield,
  CheckCircle2,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';
import { generateClimatePDF } from '../reports/reportGenerator';

interface PolicyState {
  renewable_energy: number;     // 22%
  forest_afforestation: number; // 18%
  mangrove_conservation: number;// 15%
  water_canal_lining: number;   // 20%
  emission_reduction: number;   // 15%
  urban_greening: number;       // 10%
}

const DEFAULT_POLICIES: PolicyState = {
  renewable_energy: 70,
  forest_afforestation: 60,
  mangrove_conservation: 50,
  water_canal_lining: 65,
  emission_reduction: 75,
  urban_greening: 60,
};

export const ChangeFuture: React.FC = () => {
  const { activeLocation } = useActiveLocation();
  const districtName = activeLocation?.name || 'Sindh';

  const [policies, setPolicies] = useState<PolicyState>(DEFAULT_POLICIES);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Instant calculation of Climate Resilience Score (0 to 100)
  const activeScore = useMemo(() => {
    const raw = (
      policies.renewable_energy * 0.22 +
      policies.forest_afforestation * 0.18 +
      policies.mangrove_conservation * 0.15 +
      policies.water_canal_lining * 0.20 +
      policies.emission_reduction * 0.15 +
      policies.urban_greening * 0.10
    );
    return Math.min(100, Math.max(0, Math.round(raw)));
  }, [policies]);

  // Risk reduction percentage based on score
  const riskReductionPct = useMemo(() => {
    return Math.round((activeScore / 100) * 42);
  }, [activeScore]);

  // Dynamic Projection Chart Data (2026 to 2040)
  const projectionPoints = useMemo(() => {
    const years = [2026, 2030, 2035, 2040];
    const bauTemps = [27.0, 29.5, 32.2, 34.8]; // Business as Usual

    // Adaptation curve depends on policy resilience score
    const tempSavingsMax = (activeScore / 100) * 6.5; // Up to 6.5°C reduction by 2040
    const adaptedTemps = [
      27.0,
      +(29.5 - tempSavingsMax * 0.35).toFixed(1),
      +(32.2 - tempSavingsMax * 0.70).toFixed(1),
      +(34.8 - tempSavingsMax * 1.00).toFixed(1),
    ];

    return years.map((yr, idx) => ({
      year: yr,
      bau: bauTemps[idx],
      adapted: adaptedTemps[idx],
    }));
  }, [activeScore]);

  const updateSlider = (key: keyof PolicyState, val: number) => {
    setPolicies((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setPolicies(DEFAULT_POLICIES);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleExportPDF = () => {
    generateClimatePDF({
      location: activeLocation,
      timelineYear: 2035,
      scenario: 'CMIP6 Synthesis (SSP2-4.5 vs Adapted)',
      resilienceScore: activeScore,
      resilienceLevel: activeScore >= 70 ? 'High Resilience' : 'Moderate Resilience',
      policies: policies,
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // SVG Gauge calculations (Semi-circle 180 degrees)
  const gaugeRadius = 85;
  const strokeWidth = 14;
  const circumference = Math.PI * gaugeRadius; // Semi-circle circumference
  const strokeDashoffset = circumference - (activeScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#06111F] text-slate-100 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-20 font-inter w-full max-w-full overflow-x-hidden box-border">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white tracking-tight">
            Policy Simulator Lab
          </h1>
          <p className="text-slate-400 text-sm font-inter mt-0.5">
            Simulate provincial climate interventions and observe projected risk reductions in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-green border border-emerald-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
            <span>Interactive Model Active</span>
          </div>
        </div>
      </div>

      {/* ── 3-Column Policy Lab Layout (Tile 4) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ── Left Column: Policy Interventions (5 cols) ── */}
        <div className="lg:col-span-5 bg-[#10243A]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-space font-bold text-white text-base mb-1">
              Policy Interventions
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Calibrate sectoral mitigation &amp; adaptation investments.
            </p>

            {/* Sliders List */}
            <div className="space-y-4">
              {/* 1. Renewable Energy */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Zap className="w-4 h-4 text-emerald-green" /> Renewable Energy
                  </span>
                  <span className="font-mono text-primary-cyan font-bold">{policies.renewable_energy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={policies.renewable_energy}
                  onChange={(e) => updateSlider('renewable_energy', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#06111F] accent-[#20C5FF] cursor-pointer"
                />
              </div>

              {/* 2. Afforestation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Trees className="w-4 h-4 text-emerald-green" /> Afforestation
                  </span>
                  <span className="font-mono text-primary-cyan font-bold">{policies.forest_afforestation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={policies.forest_afforestation}
                  onChange={(e) => updateSlider('forest_afforestation', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#06111F] accent-[#20C5FF] cursor-pointer"
                />
              </div>

              {/* 3. Mangrove Conservation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Waves className="w-4 h-4 text-primary-cyan" /> Mangrove Conservation
                  </span>
                  <span className="font-mono text-primary-cyan font-bold">{policies.mangrove_conservation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={policies.mangrove_conservation}
                  onChange={(e) => updateSlider('mangrove_conservation', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#06111F] accent-[#20C5FF] cursor-pointer"
                />
              </div>

              {/* 4. Canal Lining */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Droplets className="w-4 h-4 text-blue-400" /> Canal Lining
                  </span>
                  <span className="font-mono text-primary-cyan font-bold">{policies.water_canal_lining}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={policies.water_canal_lining}
                  onChange={(e) => updateSlider('water_canal_lining', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#06111F] accent-[#20C5FF] cursor-pointer"
                />
              </div>

              {/* 5. Industrial Emissions Cap */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Factory className="w-4 h-4 text-warning-orange" /> Industrial Emissions Cap
                  </span>
                  <span className="font-mono text-primary-cyan font-bold">{policies.emission_reduction}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={policies.emission_reduction}
                  onChange={(e) => updateSlider('emission_reduction', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#06111F] accent-[#20C5FF] cursor-pointer"
                />
              </div>

              {/* 6. Urban Heat Mitigation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <SunMedium className="w-4 h-4 text-amber-400" /> Urban Heat Mitigation
                  </span>
                  <span className="font-mono text-primary-cyan font-bold">{policies.urban_greening}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={policies.urban_greening}
                  onChange={(e) => updateSlider('urban_greening', Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#06111F] accent-[#20C5FF] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Run Simulation & Reset */}
          <div className="flex items-center gap-3 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-white/10 w-full">
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-space font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(32,197,255,0.4)] active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
            <button
              onClick={handleReset}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-space text-xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ── Center Column: Climate Resilience Score Gauge (3.5 cols) ── */}
        <div className="lg:col-span-3 bg-[#10243A]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <h3 className="font-space font-bold text-white text-base">
              Climate Resilience Score
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Composite Provincial Index
            </p>
          </div>

          {/* Semi-circular radial gauge */}
          <div className="relative w-56 h-36 my-4 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 200 115" className="w-full h-full select-none">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#20C5FF" />
                  <stop offset="100%" stopColor="#22D3A0" />
                </linearGradient>
              </defs>

              {/* Background semi-circle track */}
              <path
                d="M 15 105 A 85 85 0 0 1 185 105"
                fill="none"
                stroke="#142B42"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Active illuminated gauge track */}
              <path
                d="M 15 105 A 85 85 0 0 1 185 105"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            </svg>

            {/* Score Text in Center */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-4xl font-space font-bold text-white tracking-tight">
                {activeScore}%
              </span>
            </div>
          </div>

          {/* Resilience Status Badge */}
          <div className="px-3.5 py-1.5 rounded-full text-xs font-space font-semibold bg-emerald-500/15 text-emerald-green border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <Shield className="w-4 h-4 text-emerald-green" />
            <span>{activeScore >= 70 ? 'High Resilience' : activeScore >= 50 ? 'Moderate Resilience' : 'Vulnerable'}</span>
          </div>

          {/* Takeaway Risk Reduction Card */}
          <div className="w-full mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-green shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-snug">
              Adaptation policies can reduce climate risks by up to <strong className="text-emerald-green font-bold">{riskReductionPct}%</strong> across vulnerable union councils.
            </p>
          </div>
        </div>

        {/* ── Right Column: Climate Projection Chart (Sindh) (3.5 cols) ── */}
        <div className="lg:col-span-4 bg-[#10243A]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-space font-bold text-white text-base">
                Climate Projection (Sindh)
              </h3>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-warning-orange">
                  <span className="w-2.5 h-2.5 rounded-full bg-warning-orange inline-block" /> BAU
                </span>
                <span className="flex items-center gap-1 text-emerald-green">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-green inline-block" /> Adapted
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Trajectory to 2040: Unmitigated warming vs Adaptive resilience.
            </p>
          </div>

          {/* Dual Line SVG Chart */}
          <div className="w-full my-3 bg-[#06111F]/60 rounded-xl p-3 border border-white/5">
            <svg viewBox="0 0 320 180" className="w-full h-auto select-none">
              <defs>
                {/* Gradient under adapted curve */}
                <linearGradient id="adaptedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3A0" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22D3A0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines: 20°C, 25°C, 30°C, 35°C */}
              {[
                { val: '35°C', y: 30 },
                { val: '30°C', y: 70 },
                { val: '25°C', y: 110 },
                { val: '20°C', y: 150 },
              ].map((grid) => (
                <g key={grid.val}>
                  <line x1="40" y1={grid.y} x2="310" y2={grid.y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <text x="32" y={grid.y + 4} fill="#64748B" fontSize="10" fontFamily="'JetBrains Mono', monospace" textAnchor="end">
                    {grid.val}
                  </text>
                </g>
              ))}

              {/* X-Axis labels: 2026, 2030, 2035, 2040 */}
              {projectionPoints.map((pt, i) => {
                const x = 55 + i * 80;
                return (
                  <text key={pt.year} x={x} y="170" fill="#64748B" fontSize="10" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">
                    {pt.year}
                  </text>
                );
              })}

              {/* Path calculations: mapping temperature 20°C -> y=150, 35°C -> y=30 */}
              {(() => {
                const getY = (t: number) => 150 - ((t - 20) / 15) * 120;
                const getX = (i: number) => 55 + i * 80;

                const bauCoords = projectionPoints.map((pt, i) => `${getX(i)},${getY(pt.bau)}`);
                const adaptedCoords = projectionPoints.map((pt, i) => `${getX(i)},${getY(pt.adapted)}`);

                const bauPath = `M ${bauCoords.join(' L ')}`;
                const adaptedPath = `M ${adaptedCoords.join(' L ')}`;
                const adaptedArea = `${adaptedPath} L ${getX(3)},150 L ${getX(0)},150 Z`;

                return (
                  <>
                    {/* Shaded Area under Adapted line */}
                    <path d={adaptedArea} fill="url(#adaptedFill)" />

                    {/* BAU Line (Orange) */}
                    <path d={bauPath} fill="none" stroke="#FFAA45" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Adapted Line (Emerald) */}
                    <path d={adaptedPath} fill="none" stroke="#22D3A0" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Points on BAU */}
                    {projectionPoints.map((pt, i) => (
                      <circle key={`bau-${pt.year}`} cx={getX(i)} cy={getY(pt.bau)} r="4" fill="#FFAA45" stroke="#06111F" strokeWidth="1.5" />
                    ))}

                    {/* Points on Adapted */}
                    {projectionPoints.map((pt, i) => (
                      <circle key={`ad-${pt.year}`} cx={getX(i)} cy={getY(pt.adapted)} r="4" fill="#22D3A0" stroke="#06111F" strokeWidth="1.5" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExportPDF}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-space font-semibold text-xs flex items-center justify-center gap-2 hover:border-primary-cyan/40 transition"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-green" />
                <span className="text-emerald-green">Report Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-primary-cyan" />
                <span>Export Report →</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
