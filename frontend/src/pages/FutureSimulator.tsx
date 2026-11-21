import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  SunMedium, 
  Waves, 
  CloudRain, 
  ShieldCheck, 
  RotateCcw, 
  AlertTriangle, 
  Database, 
  ChevronDown, 
  Flame, 
  Droplets, 
  Zap, 
  Layers, 
  Thermometer,
  Info
} from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';
import { CitySimulator3D } from '../simulator/CitySimulator3D';
import type { SimulationMode, CameraPreset } from '../simulator/CitySimulator3D';
import { WorkflowNextBanner } from '../components/GuidedWorkflow';

export const FutureSimulator: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLocation, setActiveLocationId, allLocations } = useActiveLocation();

  const districtParam = searchParams.get('district') || activeLocation.id || 'khairpur';
  const [currentDistrict, setCurrentDistrict] = useState(districtParam);

  const [activeSimulation, setActiveSimulation] = useState<SimulationMode>('heatwave');
  const [selectedYear, setSelectedYear] = useState<number>(2030);
  const [selectedScenario, setSelectedScenario] = useState<string>('ssp2_45');

  const [scenariosData, setScenariosData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync state if URL changes
  useEffect(() => {
    if (searchParams.get('district')) {
      setCurrentDistrict(searchParams.get('district')!);
    }
  }, [searchParams]);

  // Fetch CMIP6 scenario telemetry from backend
  useEffect(() => {
    setLoading(true);
    const BASE = API_BASE;

    Promise.all([
      fetch(`${BASE}/api/climate/scenarios?district=${currentDistrict}`).then(r => r.json()),
      fetch(`${BASE}/api/climate/summary?district=${currentDistrict}`).then(r => r.json())
    ])
      .then(([scen, sum]) => {
        setScenariosData(scen);
        setSummaryData(sum);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Simulator fetch error:', err);
        setLoading(false);
      });
  }, [currentDistrict]);

  const handleDistrictChange = (newDistrict: string) => {
    setCurrentDistrict(newDistrict);
    setActiveLocationId(newDistrict);
    setSearchParams({ district: newDistrict });
  };

  const districtList = [
    { id: 'khairpur', name: 'Khairpur' },
    { id: 'larkana', name: 'Larkana' },
    { id: 'sukkur', name: 'Sukkur' },
    { id: 'karachi', name: 'Karachi' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'tharparkar', name: 'Tharparkar' },
    { id: 'jacobabad', name: 'Jacobabad' },
    { id: 'badin', name: 'Badin' },
    { id: 'thatta', name: 'Thatta' },
    { id: 'mirpurkhas', name: 'Mirpur Khas' },
    { id: 'dadu', name: 'Dadu' },
    { id: 'shaheedbenazirabad', name: 'Shaheed Benazirabad' },
    { id: 'sanghar', name: 'Sanghar' },
    { id: 'jamshoro', name: 'Jamshoro' }
  ];

  // Active projection values
  const activeScenarioObj = scenariosData?.scenarios?.find((s: any) => s.scenario_id === selectedScenario);
  const activeProjection = activeScenarioObj?.projections?.find((p: any) => p.year === selectedYear) || {
    projected_mean_temp: 29.2,
    temp_anomaly_c: 1.15,
    projected_annual_rainfall_mm: 110,
    projected_extreme_heat_days: 34,
    flood_frequency_multiplier: 1.25
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-eco-blue font-grotesk text-xs uppercase tracking-wider mb-1">
            <Eye className="w-4 h-4 text-eco-blue" /> Step 4: 3D Future Earth Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
            3D Future Earth Simulator
          </h1>
          <p className="text-eco-muted text-xs sm:text-sm mt-1">
            Interactive Three.js physics &amp; environmental visualization driven by empirical CMIP6 climate projections.
          </p>
        </div>

        {/* Region & Scenario Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District Dropdown Selector */}
          <div className="relative">
            <select
              value={currentDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-eco-surface border border-eco-blue/40 text-eco-blue font-grotesk font-semibold text-xs rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-eco-blue shadow-lg cursor-pointer"
            >
              {districtList.map((d) => (
                <option key={d.id} value={d.id} className="bg-eco-bg text-white">
                  📍 {d.name}, Sindh
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-eco-blue absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeline Buttons */}
          <div className="flex bg-eco-surface rounded-xl p-1 border border-white/10 shadow-md">
            {[2027, 2030, 2035, 2050].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-grotesk font-semibold transition ${
                  selectedYear === yr
                    ? 'bg-eco-blue text-eco-bg shadow-sm'
                    : 'text-eco-muted hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* CMIP6 Scenario Dropdown */}
          <div className="flex bg-eco-surface rounded-xl p-1 border border-white/10 shadow-md">
            {[
              { id: 'ssp1_26', label: 'SSP1-2.6 (Paris 1.5°C)' },
              { id: 'ssp2_45', label: 'SSP2-4.5 (Middle)' },
              { id: 'ssp5_85', label: 'SSP5-8.5 (Fossil)' },
            ].map((scen) => (
              <button
                key={scen.id}
                onClick={() => setSelectedScenario(scen.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-grotesk font-semibold transition ${
                  selectedScenario === scen.id
                    ? scen.id === 'ssp1_26'
                      ? 'bg-eco-green text-eco-bg'
                      : scen.id === 'ssp2_45'
                      ? 'bg-eco-orange text-eco-bg'
                      : 'bg-eco-red text-eco-bg'
                    : 'text-eco-muted hover:text-white'
                }`}
              >
                {scen.label.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Simulator Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D WebGL Canvas Viewport (Takes 3 columns) */}
        <div className="lg:col-span-3 h-[560px] hud-card rounded-2xl border border-eco-blue/30 relative overflow-hidden flex flex-col">
          {/* Header Bar within 3D Card */}
          <div className="p-3 bg-eco-surface/80 border-b border-white/10 flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-white uppercase">
                {currentDistrict.toUpperCase()}, SINDH
              </span>
              <span className="text-eco-muted font-mono">• {selectedYear} Simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-eco-blue/20 text-eco-blue border border-eco-blue/30">
                Three.js WebGL Real-Time Engine
              </span>
            </div>
          </div>

          {/* 3D Simulation Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <CitySimulator3D
              mode={activeSimulation}
              year={selectedYear}
              scenario={selectedScenario}
              districtId={currentDistrict}
              districtName={summaryData?.district_name || 'Khairpur'}
            />
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="p-3 bg-eco-surface/90 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono z-10">
            <div>
              <span className="text-eco-muted block text-[10px]">Projected Temp</span>
              <strong className="text-white text-sm font-orbitron">{activeProjection.projected_mean_temp}°C</strong>
              <span className="text-eco-orange text-[10px] ml-1">(+{activeProjection.temp_anomaly_c}°C)</span>
            </div>
            <div>
              <span className="text-eco-muted block text-[10px]">Extreme Heat Days</span>
              <strong className="text-eco-orange text-sm font-orbitron">{activeProjection.projected_extreme_heat_days} days/yr</strong>
            </div>
            <div>
              <span className="text-eco-muted block text-[10px]">Flood Frequency</span>
              <strong className="text-eco-blue text-sm font-orbitron">{activeProjection.flood_frequency_multiplier}x Normal</strong>
            </div>
            <div>
              <span className="text-eco-muted block text-[10px]">Adaptation Benefit</span>
              <strong className={activeSimulation === 'sustainable' ? 'text-eco-green text-sm font-orbitron' : 'text-eco-muted text-sm font-orbitron'}>
                {activeSimulation === 'sustainable' ? '-2.8°C Urban Heat' : 'Baseline Unmitigated'}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Simulation Controls & Environment Modes (1 column) */}
        <div className="hud-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-orbitron font-bold text-white text-base mb-1">
              Simulation Modes
            </h3>
            <p className="text-xs text-eco-muted mb-4 font-grotesk">
              Select environmental stressor to observe 3D physical response:
            </p>

            <div className="space-y-2.5">
              {/* 1. Heatwave Mode */}
              <button
                onClick={() => setActiveSimulation('heatwave')}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                  activeSimulation === 'heatwave'
                    ? 'border-eco-orange bg-eco-orange/15 text-white shadow-lg shadow-eco-orange/10'
                    : 'border-white/10 hover:border-white/20 text-eco-muted bg-eco-surface/40'
                }`}
              >
                <div className="p-2 rounded-lg bg-eco-orange/20 text-eco-orange shrink-0 mt-0.5">
                  <SunMedium className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-grotesk font-bold text-sm text-white">1. Extreme Heatwave</div>
                  <div className="text-[11px] text-eco-muted mt-0.5 leading-snug">
                    Amber haze lighting, thermal building stress, +{activeProjection.temp_anomaly_c}°C peak heat domes.
                  </div>
                </div>
              </button>

              {/* 2. Flood Mode */}
              <button
                onClick={() => setActiveSimulation('flood')}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                  activeSimulation === 'flood'
                    ? 'border-eco-blue bg-eco-blue/15 text-white shadow-lg shadow-eco-blue/10'
                    : 'border-white/10 hover:border-white/20 text-eco-muted bg-eco-surface/40'
                }`}
              >
                <div className="p-2 rounded-lg bg-eco-blue/20 text-eco-blue shrink-0 mt-0.5">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-grotesk font-bold text-sm text-white">2. Monsoon Flood Surge</div>
                  <div className="text-[11px] text-eco-muted mt-0.5 leading-snug">
                    River plane rises submerging low banks, agricultural paddies, and rain downpour particles.
                  </div>
                </div>
              </button>

              {/* 3. Drought Mode */}
              <button
                onClick={() => setActiveSimulation('drought')}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                  activeSimulation === 'drought'
                    ? 'border-amber-500 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10'
                    : 'border-white/10 hover:border-white/20 text-eco-muted bg-eco-surface/40'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0 mt-0.5">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-grotesk font-bold text-sm text-white">3. Severe Aridity &amp; Drought</div>
                  <div className="text-[11px] text-eco-muted mt-0.5 leading-snug">
                    Receding river exposes dry bed, cracked parched soil, crop failure, and drifting dust haze.
                  </div>
                </div>
              </button>

              {/* 4. Sustainable Mode */}
              <button
                onClick={() => setActiveSimulation('sustainable')}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                  activeSimulation === 'sustainable'
                    ? 'border-eco-green bg-eco-green/15 text-white shadow-lg shadow-eco-green/10'
                    : 'border-white/10 hover:border-white/20 text-eco-muted bg-eco-surface/40'
                }`}
              >
                <div className="p-2 rounded-lg bg-eco-green/20 text-eco-green shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-grotesk font-bold text-sm text-white">4. Resilient Sustainable City</div>
                  <div className="text-[11px] text-eco-muted mt-0.5 leading-snug">
                    Rooftop solar panel canopy, lush green buffers, regulated canals, crystal-clear atmosphere.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Scenario Description */}
          <div className="pt-3 border-t border-white/10">
            <div className="p-2.5 rounded-xl bg-eco-bg/50 border border-white/5 text-[11px] font-grotesk text-eco-muted leading-relaxed">
              <strong className="text-white block mb-0.5">Active Scenario Focus:</strong>
              {activeScenarioObj?.description || 'CMIP6 Shared Socioeconomic Pathway intermediate trajectory.'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mandatory Scientific Responsibility & Attribution Banner (Part 8) ── */}
      <div className="hud-card p-4 rounded-xl border border-white/10 bg-eco-surface/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-grotesk">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-eco-blue/10 border border-eco-blue/30 text-eco-blue shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-eco-blue uppercase tracking-wider px-2 py-0.5 rounded bg-eco-blue/10 border border-eco-blue/20">
                SCIENTIFIC RESPONSIBILITY PROTOCOL
              </span>
              <span className="text-white font-semibold">
                Illustrative 3D Scenario Visualization
              </span>
            </div>
            <p className="text-eco-muted text-[11px] mt-1 leading-relaxed">
              Driven by downscaled <strong>CMIP6 Multi-Model Ensemble</strong> projections and NASA POWER / PMD baselines (0.5° spatial grid). 
              The 3D physical environment represents a regional archetype (not an exact building-level GPS CAD reproduction). 
              Timelines (2027, 2030, 2035) reflect centered multi-year decadal windows with documented statistical uncertainty.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-eco-muted">
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Grid: 0.5° (~55 km)</span>
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">IPCC AR6 WGI</span>
        </div>
      </div>

      {/* ── Guided Workflow Next Step Banner ── */}
      <WorkflowNextBanner
        currentStepLabel="Step 4: 3D Simulation Completed"
        nextStepName="Test Policy & Action Interventions"
        nextStepPath="/change"
        subtext="Explore solar transition, canal lining, and mangrove afforestation impact models"
      />
    </div>
  );
};
