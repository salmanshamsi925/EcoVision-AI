import React, { useState, useMemo } from 'react';
import { Thermometer, Sun, CloudRain, Info, ShieldAlert, Sparkles } from 'lucide-react';

interface ScenarioProjection {
  year: number;
  projected_mean_temp: number;
  temp_anomaly_c: number;
  projected_annual_rainfall_mm: number;
  projected_extreme_heat_days: number;
  flood_frequency_multiplier: number;
}

interface ScenarioItem {
  scenario_id: string;
  scenario_name: string;
  description: string;
  projections: ScenarioProjection[];
}

interface ScenarioComparisonChartProps {
  scenarios: ScenarioItem[];
  districtName: string;
  baselineTemp: number;
}

export const ScenarioComparisonChart: React.FC<ScenarioComparisonChartProps> = ({
  scenarios,
  districtName,
  baselineTemp = 28.1,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2030);
  const [activeScenario, setActiveScenario] = useState<string>('ssp2_45');

  const years = [2026, 2030, 2035, 2040];

  // Map scenario data for 2026-2040 curve
  const chartData = useMemo(() => {
    const ssp1 = scenarios.find(s => s.scenario_id.includes('1_26') || s.scenario_id.includes('126'))?.projections || [];
    const ssp2 = scenarios.find(s => s.scenario_id.includes('2_45') || s.scenario_id.includes('245'))?.projections || [];
    const ssp5 = scenarios.find(s => s.scenario_id.includes('5_85') || s.scenario_id.includes('585'))?.projections || [];

    const getVal = (list: ScenarioProjection[], yr: number, fallback: number) => {
      const match = list.find(p => p.year === yr);
      return match ? match.projected_mean_temp : fallback;
    };

    return years.map(yr => ({
      year: yr,
      ssp1: getVal(ssp1, yr, +(baselineTemp + (yr - 2025) * 0.05).toFixed(1)),
      ssp2: getVal(ssp2, yr, +(baselineTemp + (yr - 2025) * 0.12).toFixed(1)),
      ssp5: getVal(ssp5, yr, +(baselineTemp + (yr - 2025) * 0.22).toFixed(1)),
    }));
  }, [scenarios, baselineTemp]);

  // Selected scenario stats for the chosen timeline year
  const currentProjection = useMemo(() => {
    const scen = scenarios.find(s => s.scenario_id === activeScenario) || scenarios[1] || scenarios[0];
    if (!scen) return null;
    const proj = scen.projections.find(p => p.year === selectedYear) || scen.projections[0];
    return {
      name: scen.scenario_name.split(' (')[0],
      desc: scen.description,
      temp: proj?.projected_mean_temp || 29.5,
      anomaly: proj?.temp_anomaly_c || 1.4,
      heatDays: proj?.projected_extreme_heat_days || 48,
      floodMult: proj?.flood_frequency_multiplier || 1.4,
    };
  }, [scenarios, selectedYear, activeScenario]);

  // SVG Chart Dimensions
  const width = 360;
  const height = 170;
  const padding = { top: 20, right: 25, bottom: 28, left: 38 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Temperature scale: 20°C to 36°C
  const minT = 22;
  const maxT = 36;
  const getX = (idx: number) => padding.left + (idx / (years.length - 1)) * chartW;
  const getY = (t: number) => padding.top + chartH - ((t - minT) / (maxT - minT)) * chartH;

  // Paths
  const ssp5Points = chartData.map((d, i) => `${getX(i)},${getY(d.ssp5)}`);
  const ssp2Points = chartData.map((d, i) => `${getX(i)},${getY(d.ssp2)}`);
  const ssp1Points = chartData.map((d, i) => `${getX(i)},${getY(d.ssp1)}`);

  const ssp5Path = `M ${ssp5Points.join(' L ')}`;
  const ssp2Path = `M ${ssp2Points.join(' L ')}`;
  const ssp1Path = `M ${ssp1Points.join(' L ')}`;

  // Area under curves
  const ssp5Area = `${ssp5Path} L ${getX(years.length - 1)},${getY(minT)} L ${getX(0)},${getY(minT)} Z`;
  const ssp2Area = `${ssp2Path} L ${getX(years.length - 1)},${getY(minT)} L ${getX(0)},${getY(minT)} Z`;
  const ssp1Area = `${ssp1Path} L ${getX(years.length - 1)},${getY(minT)} L ${getX(0)},${getY(minT)} Z`;

  return (
    <div className="flex flex-col justify-between h-full space-y-3 font-inter">
      {/* ── Top Legend & Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <button
            onClick={() => setActiveScenario('ssp1_26')}
            className={`flex items-center gap-1.5 transition ${activeScenario === 'ssp1_26' ? 'text-emerald-green font-bold scale-105' : 'text-slate-400 hover:text-white'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-green inline-block shadow-[0_0_8px_#22D3A0]" />
            <span>SSP1-2.6</span>
          </button>
          <button
            onClick={() => setActiveScenario('ssp2_45')}
            className={`flex items-center gap-1.5 transition ${activeScenario === 'ssp2_45' ? 'text-warning-orange font-bold scale-105' : 'text-slate-400 hover:text-white'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-warning-orange inline-block shadow-[0_0_8px_#FFAA45]" />
            <span>SSP2-4.5</span>
          </button>
          <button
            onClick={() => setActiveScenario('ssp5_85')}
            className={`flex items-center gap-1.5 transition ${activeScenario === 'ssp5_85' ? 'text-danger-red font-bold scale-105' : 'text-slate-400 hover:text-white'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-danger-red inline-block shadow-[0_0_8px_#FF5D63]" />
            <span>SSP5-8.5</span>
          </button>
        </div>

        {/* Year Selector Pills */}
        <div className="flex items-center bg-[#06111F] p-0.5 rounded-lg border border-white/10">
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition ${selectedYear === yr ? 'bg-primary-cyan text-[#06111F] font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* ── Area Chart (Matching Tile 3 of Design Reference) ── */}
      <div className="relative w-full bg-[#06111F]/70 rounded-xl p-2 border border-white/5 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-hidden">
          <defs>
            <linearGradient id="ssp5Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5D63" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FF5D63" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ssp2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFAA45" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFAA45" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ssp1Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3A0" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#22D3A0" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[25, 30, 35].map(t => (
            <g key={t}>
              <line x1={padding.left} y1={getY(t)} x2={width - padding.right} y2={getY(t)} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <text x={padding.left - 6} y={getY(t) + 3} fill="#64748B" fontSize="9" fontFamily="'JetBrains Mono', monospace" textAnchor="end">
                {t}°C
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {years.map((yr, i) => (
            <text key={yr} x={getX(i)} y={height - 8} fill={selectedYear === yr ? '#20C5FF' : '#64748B'} fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight={selectedYear === yr ? 'bold' : 'normal'} textAnchor="middle">
              {yr}
            </text>
          ))}

          {/* Shaded Areas */}
          <path d={ssp5Area} fill="url(#ssp5Grad)" />
          <path d={ssp2Area} fill="url(#ssp2Grad)" />
          <path d={ssp1Area} fill="url(#ssp1Grad)" />

          {/* Curve Lines */}
          <path d={ssp5Path} fill="none" stroke="#FF5D63" strokeWidth="2.2" strokeLinecap="round" />
          <path d={ssp2Path} fill="none" stroke="#FFAA45" strokeWidth="2.2" strokeLinecap="round" />
          <path d={ssp1Path} fill="none" stroke="#22D3A0" strokeWidth="2.2" strokeLinecap="round" />

          {/* Vertex dots */}
          {chartData.map((d, i) => (
            <g key={d.year}>
              <circle cx={getX(i)} cy={getY(d.ssp5)} r={selectedYear === d.year ? 4.5 : 3} fill="#FF5D63" stroke="#06111F" strokeWidth="1.5" />
              <circle cx={getX(i)} cy={getY(d.ssp2)} r={selectedYear === d.year ? 4.5 : 3} fill="#FFAA45" stroke="#06111F" strokeWidth="1.5" />
              <circle cx={getX(i)} cy={getY(d.ssp1)} r={selectedYear === d.year ? 4.5 : 3} fill="#22D3A0" stroke="#06111F" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Clear, Human-Readable Metric Strip (HCI Compliant) ── */}
      {currentProjection && (
        <div className="bg-[#06111F]/60 border border-white/10 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/5">
            <span className="font-space font-semibold text-white flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeScenario === 'ssp1_26' ? 'bg-emerald-green' : activeScenario === 'ssp2_45' ? 'bg-warning-orange' : 'bg-danger-red'}`} />
              {currentProjection.name} ({selectedYear})
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Anomaly: <strong className="text-white">+{currentProjection.anomaly}°C</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#10243A] p-2 rounded-lg border border-white/5">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] mb-0.5">
                <Thermometer className="w-3 h-3 text-warning-orange" /> Mean Temp
              </div>
              <span className="font-space font-bold text-white text-xs sm:text-sm">
                {currentProjection.temp}°C
              </span>
            </div>

            <div className="bg-[#10243A] p-2 rounded-lg border border-white/5">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] mb-0.5">
                <Sun className="w-3 h-3 text-amber-400" /> Heat Days
              </div>
              <span className="font-space font-bold text-amber-300 text-xs sm:text-sm">
                {currentProjection.heatDays} d/yr
              </span>
            </div>

            <div className="bg-[#10243A] p-2 rounded-lg border border-white/5">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] mb-0.5">
                <CloudRain className="w-3 h-3 text-primary-cyan" /> Flood Risk
              </div>
              <span className="font-space font-bold text-primary-cyan text-xs sm:text-sm">
                {currentProjection.floodMult}x
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Human-Readable Guide for Admin / Evaluators */}
      <div className="text-[11px] text-slate-400 leading-snug flex items-start gap-1.5 pt-1">
        <Info className="w-3.5 h-3.5 text-primary-cyan shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-200">HCI Scenario Guide: </strong>
          <span className="text-emerald-green">SSP1-2.6</span> is sustainable Paris 1.5°C goal; <span className="text-warning-orange">SSP2-4.5</span> is moderate baseline; <span className="text-danger-red">SSP5-8.5</span> is unmitigated high warming.
        </span>
      </div>
    </div>
  );
};
