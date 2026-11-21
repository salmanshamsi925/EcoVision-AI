import React from 'react';
import { ShieldAlert } from 'lucide-react';

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

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({
  indicators,
  overallIndex,
  districtName
}) => {
  if (!indicators || indicators.length === 0) return null;

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const numAxes = indicators.length;

  const getCoord = (index: number, val: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Concentric polygon grids (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [25, 50, 75, 100];

  // Polygon points for data
  const polyPoints = indicators.map((ind, i) => {
    const pt = getCoord(i, ind.score);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-eco-orange" />
          <span className="text-xs font-grotesk text-eco-muted uppercase tracking-wider">6-Axis Climate Risk Radar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-eco-muted uppercase">Vulnerability Index:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-orbitron font-bold ${
            overallIndex >= 80 ? 'bg-eco-red/20 text-eco-red border border-eco-red/30' :
            overallIndex >= 65 ? 'bg-eco-orange/20 text-eco-orange border border-eco-orange/30' :
            'bg-eco-green/20 text-eco-green border border-eco-green/30'
          }`}>
            {overallIndex} / 100
          </span>
        </div>
      </div>

      {/* SVG Radar */}
      <div className="relative flex items-center justify-center my-1">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none overflow-visible">
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22B8FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#35D39A" stopOpacity="0.10" />
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
                stroke="rgba(255,255,255,0.08)"
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
            stroke="#22B8FF"
            strokeWidth="2.2"
          />

          {/* Vertex dots & Axis Labels */}
          {indicators.map((ind, i) => {
            const pt = getCoord(i, ind.score);
            const labelPt = getCoord(i, 122);

            return (
              <g key={ind.axis}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={4.5}
                  fill={ind.score >= 85 ? '#FF5555' : ind.score >= 70 ? '#FF9F43' : '#35D39A'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  fill="#F5F7FA"
                  fontSize="9"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {ind.axis.split(' ')[0]}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y + 11}
                  fill={ind.score >= 85 ? '#FF5555' : ind.score >= 70 ? '#FF9F43' : '#35D39A'}
                  fontSize="8"
                  fontFamily="monospace"
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

      {/* Breakdown list */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5 text-[10px] font-mono">
        {indicators.slice(0, 3).map((ind) => (
          <div key={ind.axis} className="bg-eco-bg/40 p-1.5 rounded">
            <span className="text-eco-muted block truncate">{ind.axis}</span>
            <span className={`font-bold ${ind.score >= 85 ? 'text-eco-red' : ind.score >= 70 ? 'text-eco-orange' : 'text-eco-green'}`}>
              {ind.score}/100 · {ind.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

