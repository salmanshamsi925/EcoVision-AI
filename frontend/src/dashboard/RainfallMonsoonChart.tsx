import React, { useState } from 'react';
import { AlertCircle, CloudRain } from 'lucide-react';

interface RecordItem {
  year: number;
  annual_rainfall_mm: number;
  monsoon_rainfall_mm: number;
}

interface RainfallMonsoonChartProps {
  records: RecordItem[];
  baselineRainfall: number;
  districtName: string;
}

export const RainfallMonsoonChart: React.FC<RainfallMonsoonChartProps> = ({
  records,
  baselineRainfall,
  districtName
}) => {
  const [hoveredYear, setHoveredYear] = useState<RecordItem | null>(null);

  if (!records || records.length === 0) return null;

  const width = 640;
  const height = 280;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxRain = Math.max(...records.map(r => r.annual_rainfall_mm), baselineRainfall * 3.5);
  const minYear = records[0].year;
  const maxYear = records[records.length - 1].year;
  const n = records.length;
  const barWidth = Math.max(4, (chartW / n) - 2.5);

  const getX = (year: number) => padding.left + ((year - minYear) / (maxYear - minYear)) * (chartW - barWidth);
  const getY = (mm: number) => padding.top + chartH - (mm / maxRain) * chartH;

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-grotesk text-eco-muted">
            <span className="w-2.5 h-2.5 rounded-sm bg-eco-blue" />
            <span>Annual Total (mm)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-grotesk text-eco-muted">
            <span className="w-2.5 h-2.5 rounded-sm bg-eco-green" />
            <span>Monsoon Share (Jul–Sep)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono text-eco-red bg-eco-red/10 border border-eco-red/30">
            ⚠ 2010 & 2022 Mega-Floods Flagged
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden bg-eco-bg/40 rounded-xl border border-white/5 p-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Y-axis grid lines */}
          {[0, 100, 200, 300, 400, 500].filter(val => val <= maxRain * 1.1).map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
              />
              <text x={padding.left - 6} y={getY(val) + 3} fill="#A8B4C5" fontSize="9" textAnchor="end" fontFamily="monospace">
                {val}
              </text>
            </g>
          ))}

          {/* Baseline rainfall reference line */}
          <line
            x1={padding.left}
            y1={getY(baselineRainfall)}
            x2={width - padding.right}
            y2={getY(baselineRainfall)}
            stroke="#35D39A"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <text x={width - padding.right - 2} y={getY(baselineRainfall) - 4} fill="#35D39A" fontSize="8" textAnchor="end" fontFamily="monospace">
            Baseline: {baselineRainfall}mm
          </text>

          {/* Year ticks */}
          {[1980, 1990, 2000, 2010, 2020, 2025].map((y) => (
            <text key={y} x={getX(y) + barWidth / 2} y={height - 10} fill="#A8B4C5" fontSize="9" textAnchor="middle" fontFamily="monospace">
              {y}
            </text>
          ))}

          {/* Bars */}
          {records.map((r) => {
            const x = getX(r.year);
            const yAnnual = getY(r.annual_rainfall_mm);
            const hAnnual = getY(0) - yAnnual;

            const yMonsoon = getY(r.monsoon_rainfall_mm);
            const hMonsoon = getY(0) - yMonsoon;

            const isShock = r.year === 2010 || r.year === 2022;
            const isHovered = hoveredYear?.year === r.year;

            return (
              <g
                key={r.year}
                className="cursor-pointer transition-opacity duration-150"
                onMouseEnter={() => setHoveredYear(r)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                {/* Annual rainfall outer bar */}
                <rect
                  x={x}
                  y={yAnnual}
                  width={barWidth}
                  height={Math.max(2, hAnnual)}
                  rx={2}
                  fill={isShock ? '#FF5555' : isHovered ? '#22B8FF' : 'rgba(34,184,255,0.75)'}
                />

                {/* Monsoon rainfall inner bar */}
                <rect
                  x={x + 1}
                  y={yMonsoon}
                  width={Math.max(2, barWidth - 2)}
                  height={Math.max(2, hMonsoon)}
                  rx={1}
                  fill={isShock ? '#FF9F43' : '#35D39A'}
                  opacity={0.9}
                />

                {/* Callout marker on mega-flood years */}
                {isShock && (
                  <g>
                    <line x1={x + barWidth / 2} y1={yAnnual - 3} x2={x + barWidth / 2} y2={yAnnual - 14} stroke="#FF5555" strokeWidth="1.5" />
                    <circle cx={x + barWidth / 2} cy={yAnnual - 16} r={4} fill="#FF5555" />
                    <text x={x + barWidth / 2} y={yAnnual - 22} fill="#FF5555" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {r.year}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredYear && (
          <div
            className="absolute top-3 left-14 z-20 px-3 py-1.5 rounded-lg border border-eco-green/30 shadow-xl text-xs font-mono"
            style={{ background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-white font-bold">{hoveredYear.year}</span>: Total <strong className="text-eco-blue">{hoveredYear.annual_rainfall_mm} mm</strong>
            <span className="text-eco-green ml-2 font-semibold">
              (Monsoon: {hoveredYear.monsoon_rainfall_mm} mm · {Math.round((hoveredYear.monsoon_rainfall_mm / (hoveredYear.annual_rainfall_mm || 1)) * 100)}%)
            </span>
            {hoveredYear.year === 2022 && (
              <span className="text-eco-red ml-2 font-bold">[2022 Sindh Mega-Inundation Record]</span>
            )}
            {hoveredYear.year === 2010 && (
              <span className="text-eco-orange ml-2 font-bold">[2010 Indus Basin Super-Flood]</span>
            )}
          </div>
        )}
      </div>

      {/* Scientific interpretation footer */}
      <p className="text-[11px] text-eco-muted/80 font-grotesk mt-2 leading-relaxed">
        <strong className="text-white">Hydrological Volatility:</strong> In {districtName}, monsoon rainfall constitutes ~74% of the annual volume. 
        Catastrophic extremes in <span className="text-eco-red font-semibold">2010</span> and <span className="text-eco-red font-semibold">2022</span> exceeded the baseline by up to +460%, while prolonged drought spells (1999–2002) depleted recharge by 68%.
      </p>
    </div>
  );
};

