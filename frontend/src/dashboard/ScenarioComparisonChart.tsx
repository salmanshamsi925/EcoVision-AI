import React, { useState } from 'react';
import { Layers, Thermometer, ShieldAlert, Zap } from 'lucide-react';

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

const SCENARIO_COLORS: Record<string, { stroke: string; fill: string; badge: string }> = {
  ssp1_26: { stroke: '#35D39A', fill: 'rgba(53,211,154,0.15)', badge: 'text-eco-green bg-eco-green/10 border-eco-green/30' },
  ssp2_45: { stroke: '#FF9F43', fill: 'rgba(255,159,67,0.15)', badge: 'text-eco-orange bg-eco-orange/10 border-eco-orange/30' },
  ssp5_85: { stroke: '#FF5555', fill: 'rgba(255,85,85,0.15)', badge: 'text-eco-red bg-eco-red/10 border-eco-red/30' },
};

export const ScenarioComparisonChart: React.FC<ScenarioComparisonChartProps> = ({
  scenarios,
  districtName,
  baselineTemp
}) => {
  const [selectedTimeline, setSelectedTimeline] = useState<number>(2030);

  if (!scenarios || scenarios.length === 0) return null;

  const timelines = [2027, 2030, 2035, 2050];

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Timeline Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-grotesk text-eco-muted uppercase tracking-wider">Target Timeline:</span>
          <div className="flex bg-eco-surface rounded-lg p-0.5 border border-white/10">
            {timelines.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedTimeline(yr)}
                className={`px-3 py-1 rounded text-xs font-grotesk font-semibold transition ${
                  selectedTimeline === yr
                    ? 'bg-eco-blue text-eco-bg shadow-sm'
                    : 'text-eco-muted hover:text-white'
                }`}
              >
                {yr} {yr <= 2035 ? '• Near' : ''}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[11px] font-mono text-eco-muted/70">
          IPCC AR6 / CMIP6 Multi-Model Ensemble
        </span>
      </div>

      {/* 3-Column Scenario Card Comparison for the selected timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2">
        {scenarios.map((scen) => {
          const colors = SCENARIO_COLORS[scen.scenario_id] || SCENARIO_COLORS.ssp2_45;
          const proj = scen.projections.find(p => p.year === selectedTimeline) || scen.projections[0];

          return (
            <div
              key={scen.scenario_id}
              className="p-4 rounded-xl border flex flex-col justify-between transition hover:border-white/20"
              style={{ background: 'rgba(13,27,42,0.65)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${colors.badge}`}>
                    {scen.scenario_id.toUpperCase().replace('_', '-')}
                  </span>
                  <span className="text-[10px] font-mono text-white/80 font-bold">{selectedTimeline}</span>
                </div>
                <h4 className="font-orbitron font-semibold text-white text-xs mt-1 truncate" title={scen.scenario_name}>
                  {scen.scenario_name.split(' (')[0]}
                </h4>
                <p className="text-[10px] text-eco-muted mt-1 leading-snug line-clamp-2">
                  {scen.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-eco-muted font-grotesk">Mean Temperature</span>
                  <span className="font-orbitron font-bold text-sm text-white">
                    {proj.projected_mean_temp}°C{' '}
                    <span className="text-xs" style={{ color: colors.stroke }}>
                      (+{proj.temp_anomaly_c}°C)
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-eco-muted font-grotesk">Extreme Heat Days</span>
                  <span className="font-mono font-bold text-xs text-eco-orange">
                    {proj.projected_extreme_heat_days} days / yr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-eco-muted font-grotesk">Monsoon Flood Multiplier</span>
                  <span className="font-mono font-bold text-xs" style={{ color: colors.stroke }}>
                    {proj.flood_frequency_multiplier}x baseline
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific interpretation footer */}
      <p className="text-[11px] text-eco-muted/80 font-grotesk mt-2 leading-relaxed">
        <strong className="text-white">CMIP6 Projection Insights:</strong> Under the high-emissions{' '}
        <span className="text-eco-red font-semibold">SSP5-8.5</span> scenario by {selectedTimeline}, {districtName}{' '}
        confronts up to +{scenarios.find(s=>s.scenario_id==='ssp5_85')?.projections.find(p=>p.year===selectedTimeline)?.temp_anomaly_c}°C warming above baseline, 
        surpassing human wet-bulb tolerance limits and doubling severe flood recurrence frequency.
      </p>
    </div>
  );
};

