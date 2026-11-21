import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, BarChart2, X, ArrowRight } from 'lucide-react';
import { PakistanSindhMap } from '../maps/PakistanSindhMap';
import { useActiveLocation } from '../context/LocationContext';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DistrictData {
  id: string;
  name: string;
  province: string;
  lat: number;
  lon: number;
  temp_c: number;
  rainfall_mm: number;
  drought_index: string;
  flood_exposure: string;
  heat_risk: string;
  challenges: string[];
  source: string;
  period: string;
  resolution: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const ExplorePakistan: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLocation } = useActiveLocation();
  const initialDistrict = searchParams.get('district') || activeLocation?.id || 'khairpur';

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" style={{ background: '#07111F' }}>
      {/* ── Map + Side Panel Layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map — takes up most space */}
        <div className="flex-1 relative overflow-hidden">
          <PakistanSindhMap
            initialDistrict={initialDistrict}
            onDistrictSelect={setSelectedDistrict}
          />
        </div>

        {/* ── Side Panel ── */}
        <div
          className="w-72 flex-shrink-0 border-l border-white/10 flex flex-col overflow-y-auto"
          style={{ background: 'rgba(13,27,42,0.9)', backdropFilter: 'blur(12px)' }}
        >
          {selectedDistrict ? (
            <>
              {/* District telemetry panel */}
              <div className="p-4 border-b border-white/10 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-grotesk text-eco-muted uppercase tracking-wider">District Telemetry</span>
                  <h2 className="font-orbitron font-bold text-white text-lg mt-0.5">{selectedDistrict.name}</h2>
                  <p className="text-eco-blue text-xs font-grotesk mt-0.5">
                    {selectedDistrict.province} · {selectedDistrict.lat.toFixed(2)}°N, {selectedDistrict.lon.toFixed(2)}°E
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="p-1 rounded-lg text-eco-muted hover:text-white hover:bg-white/10 transition"
                  title="Close Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics */}
              <div className="p-4 border-b border-white/10 grid grid-cols-2 gap-2">
                <MetricCard label="Avg Temp" value={`${selectedDistrict.temp_c}°C`} color="text-eco-orange" />
                <MetricCard label="Rainfall" value={`${selectedDistrict.rainfall_mm} mm`} color="text-eco-blue" />
                <MetricCard label="Drought" value={selectedDistrict.drought_index} color="text-eco-orange" />
                <MetricCard label="Heat Risk" value={selectedDistrict.heat_risk.split(' – ')[0].split(' (')[0]} color="text-red-400" />
              </div>

              {/* Flood */}
              <div className="p-4 border-b border-white/10">
                <p className="text-[10px] text-eco-muted mb-1 uppercase tracking-wider">Flood Exposure</p>
                <p className="text-xs text-white/80 font-grotesk">{selectedDistrict.flood_exposure}</p>
              </div>

              {/* Challenges */}
              <div className="p-4 border-b border-white/10">
                <p className="text-[10px] text-eco-muted mb-2 uppercase tracking-wider">Key Challenges</p>
                <ul className="space-y-1.5">
                  {selectedDistrict.challenges.slice(0, 3).map((c) => (
                    <li key={c} className="flex items-start gap-2 text-[11px] text-white/80 font-grotesk">
                      <span className="text-eco-orange mt-0.5 flex-shrink-0">▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="p-4 mt-auto">
                <button
                  onClick={() => navigate(`/intelligence?district=${selectedDistrict.id}`)}
                  className="w-full py-3 rounded-xl bg-eco-blue text-eco-bg font-grotesk font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-neon-blue transition"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Analyze Climate Intelligence</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </>
          ) : (
            /* Empty state / Instructions */
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-eco-blue/10 border border-eco-blue/20 flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-eco-blue" />
              </div>
              <h3 className="font-orbitron font-semibold text-white text-sm mb-2">Select a District</h3>
              <p className="text-eco-muted text-xs font-grotesk leading-relaxed max-w-[200px]">
                Click any district on the Sindh map to view its climate risk profile and telemetry data.
              </p>

              {/* Data attribution */}
              <div className="mt-auto pt-6 text-[9px] text-eco-muted/50 font-mono leading-relaxed">
                <p>Sources: NASA POWER · PMD · World Bank</p>
                <p>Period: 1991–2020 · Res: 0.5°</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Helper component ─────────────────────────────────────────────────────────

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-eco-bg/60 rounded-lg p-2">
      <p className="text-[9px] text-eco-muted uppercase tracking-wider">{label}</p>
      <p className={`font-orbitron font-bold text-xs leading-tight mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}
