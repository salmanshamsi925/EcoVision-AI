import React from 'react';
import { ShieldAlert, Flame, CloudRain, SunMedium, Droplets, Leaf } from 'lucide-react';

interface IndicatorItem {
  axis: string;
  score: number;
  severity: string;
}

interface RiskRadarChartProps {
  indicators: IndicatorItem[];
  overallIndex: number;
  districtName: string;
}

const AXIS_ICONS: Record<string, string> = {
  heat: '🔥',
  flood: '🌧️',
  drought: '🏜️',
  water: '💧',
  agricultural: '🌾',
  coastal: '🌊',
  ecosystem: '🌿',
};

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({
  indicators,
  overallIndex = 78,
  districtName = 'Sindh'
}) => {
  if (!indicators || indicators.length === 0) return null;

  const size = 260;
  const center = size / 2;
  const radius = 80;
  const numAxes = indicators.length;

  const getCoord = (index: number, val: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const gridLevels = [25, 50, 75, 100];

  const polyPoints = indicators.map((ind, i) => {
    const pt = getCoord(i, ind.score);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col h-full justify-between space-y-2 font-inter">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-0.5">
        <div className="flex items-center gap-1.5 text-xs font-space font-semibold text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-warning-orange shrink-0" />
          <span>Vulnerability Radar</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
            overallIndex >= 80 ? 'bg-danger-red/20 text-danger-red border border-danger-red/30' :
            overallIndex >= 65 ? 'bg-warning-orange/20 text-warning-orange border border-warning-orange/30' :
            'bg-emerald-green/20 text-emerald-green border border-emerald-green/30'
          }`}>
            Score: {overallIndex}/100
          </span>
        </div>
      </div>

      {/* ── Responsive SVG Radar Canvas ── */}
      <div className="relative flex items-center justify-center py-1">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[210px] h-auto select-none overflow-visible">
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#20C5FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22D3A0" stopOpacity="0.12" />
            </radialGradient>
          </defs>

          {/* Concentric grid webs */}
          {gridLevels.map((lvl) => {
            const pts = Array.from({ length: numAxes }).map((_, i) => {
              const pt = getCoord(i, lvl);
              return `${pt.x},${pt.y}`;
            }).join(' ');
            return (
              <polygon
                key={lvl}
                points={pts}
                fill="none"
                stroke="rgba(255,255,255,0.09)"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Axis lines */}
          {indicators.map((ind, i) => {
            const endPt = getCoord(i, 100);
            return (
              <line
                key={ind.axis}
                x1={center}
                y1={center}
                x2={endPt.x}
                y2={endPt.y}
                stroke="rgba(255,255,255,0.12)"
              />
            );
          })}

          {/* Filled Risk Polygon */}
          <polygon
            points={polyPoints}
            fill="url(#radarFill)"
            stroke="#20C5FF"
            strokeWidth="2"
          />

          {/* Vertex dots & Axis Labels */}
          {indicators.map((ind, i) => {
            const pt = getCoord(i, ind.score);
            const labelPt = getCoord(i, 118);
            const shortName = ind.axis.split(' ')[0];

            return (
              <g key={ind.axis}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={3.5}
                  fill={ind.score >= 85 ? '#FF5D63' : ind.score >= 70 ? '#FFAA45' : '#22D3A0'}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  fill="#F8FAFC"
                  fontSize="8.5"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {shortName}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y + 10}
                  fill={ind.score >= 85 ? '#FF5D63' : ind.score >= 70 ? '#FFAA45' : '#22D3A0'}
                  fontSize="7.5"
                  fontFamily="'JetBrains Mono', monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {ind.score}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Clear Breakdown Chips (HCI Compliant) ── */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[10px] font-mono">
        {indicators.slice(0, 3).map((ind) => {
          const key = ind.axis.toLowerCase();
          const icon = AXIS_ICONS[Object.keys(AXIS_ICONS).find(k => key.includes(k)) || 'heat'];
          return (
            <div key={ind.axis} className="bg-[#06111F]/70 border border-white/5 p-1.5 rounded-lg text-center">
              <span className="text-slate-400 block truncate text-[9px] mb-0.5">
                {icon} {ind.axis.split(' ')[0]}
              </span>
              <span className={`font-bold text-[10px] block ${ind.score >= 85 ? 'text-danger-red' : ind.score >= 70 ? 'text-warning-orange' : 'text-emerald-green'}`}>
                {ind.score}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
