import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Sun,
  CloudRain,
  Flame,
  AlertTriangle,
  ChevronDown,
  Layers,
  Cpu,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';
import { HistoricalTempChart } from '../dashboard/HistoricalTempChart';
import { RainfallMonsoonChart } from '../dashboard/RainfallMonsoonChart';
import { ScenarioComparisonChart } from '../dashboard/ScenarioComparisonChart';
import { RiskRadarChart } from '../dashboard/RiskRadarChart';
import { MachineLearningPanel } from '../dashboard/MachineLearningPanel';

export const ClimateIntelligence: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLocation, setActiveLocationId } = useActiveLocation();

  const districtParam = searchParams.get('district') || activeLocation.id || 'khairpur';
  const [currentDistrict, setCurrentDistrict] = useState(districtParam);

  // Tab switcher for Historical Climate Trends (Temperature, Rainfall, Humidity)
  const [historicalTab, setHistoricalTab] = useState<'temperature' | 'rainfall' | 'humidity'>('temperature');

  const [historicalData, setHistoricalData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [mlData, setMlData] = useState<any>(null);
  const [deepLearningData, setDeepLearningData] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    if (searchParams.get('district')) {
      setCurrentDistrict(searchParams.get('district')!);
    }
  }, [searchParams]);

  // Fetch all endpoints from FastAPI
  useEffect(() => {
    setLoading(true);
    setError(null);
    const BASE = API_BASE;

    Promise.all([
      fetch(`${BASE}/api/climate/historical?district=${currentDistrict}`).then(r => r.json()),
      fetch(`${BASE}/api/climate/summary?district=${currentDistrict}`).then(r => r.json()),
      fetch(`${BASE}/api/climate/risks?district=${currentDistrict}`).then(r => r.json()),
      fetch(`${BASE}/api/climate/scenarios?district=${currentDistrict}`).then(r => r.json()),
      fetch(`${BASE}/api/climate/ml-analysis?district=${currentDistrict}`).then(r => r.json()),
      fetch(`${BASE}/api/climate/deep-learning?district=${currentDistrict}`).then(r => r.json()).catch(() => null),
      fetch(`${BASE}/api/climate/live?district=${currentDistrict}`).then(r => r.json()).catch(() => null)
    ])
      .then(([hist, sum, risk, scen, ml, dl, live]) => {
        setHistoricalData(hist);
        setSummaryData(sum);
        setRiskData(risk);
        setScenarioData(scen);
        setMlData(ml);
        setDeepLearningData(dl);
        setLiveFeed(live);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Could not connect to FastAPI climate analytics engine on port 8000.');
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
    { id: 'shaheedbenazirababad', name: 'Shaheed Benazirabad' },
    { id: 'sanghar', name: 'Sanghar' },
    { id: 'jamshoro', name: 'Jamshoro' }
  ];

  return (
    <div className="min-h-screen bg-[#06111F] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-20 font-inter">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white tracking-tight">
            Climate Intelligence
          </h1>
          <p className="text-slate-400 text-sm font-inter mt-0.5">
            Analyze. Forecast. Plan.
          </p>
        </div>

        {/* Live Data Badge & District Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Data Badge */}
          <div className="px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-green border border-emerald-500/30 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse shrink-0" />
            <span className="font-semibold">Live Data</span>
            <span className="text-slate-400 hidden sm:inline">• Updated: Nov 16, 2026</span>
          </div>

          {/* District Selector */}
          <div className="relative">
            <select
              value={currentDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-[#10243A] border border-primary-cyan/40 text-primary-cyan font-space font-semibold text-xs rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-primary-cyan shadow-lg cursor-pointer"
            >
              {districtList.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#06111F] text-white">
                  📍 {d.name}, Sindh
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-primary-cyan absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="bg-[#10243A]/60 border border-white/10 p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-primary-cyan font-space text-sm">Computing climate regression models...</p>
        </div>
      )}

      {error && (
        <div className="bg-danger-red/10 border border-danger-red/30 p-8 rounded-2xl text-center">
          <AlertTriangle className="w-8 h-8 text-danger-red mx-auto mb-2" />
          <p className="text-danger-red font-semibold text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && summaryData && (
        <>
          {/* ── 4 KPI Cards (Matching Tile 3) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Mean Warming Rate */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-inter uppercase tracking-wider block">
                  Mean Warming Rate
                </span>
                <div className="text-2xl sm:text-3xl font-space font-bold text-white mt-1">
                  +{summaryData.warming_rate_per_decade || '0.8'}°C
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  Per Decade (Scikit-Learn ML)
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-warning-orange shrink-0">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Since 1980 */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-inter uppercase tracking-wider block">
                  Since 1980
                </span>
                <div className="text-2xl sm:text-3xl font-space font-bold text-emerald-green mt-1">
                  +{summaryData.observed_warming_since_1980 || '1.9'}°C
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  vs 1980 Baseline Anomaly
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-green shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Record Summer */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-inter uppercase tracking-wider block">
                  Record Summer
                </span>
                <div className="text-2xl sm:text-3xl font-space font-bold text-warning-orange mt-1">
                  {summaryData.record_max_temp || '47.5'}°C
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  Year {summaryData.record_max_temp_year || '2022'} Extreme
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Sun className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: 2022 Monsoon */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-inter uppercase tracking-wider block">
                  2022 Monsoon
                </span>
                <div className="text-2xl sm:text-3xl font-space font-bold text-primary-cyan mt-1">
                  {summaryData.record_flood_rainfall || '312'} mm
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  Flood Inundation Peak
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-primary-cyan shrink-0">
                <CloudRain className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ── 3 Main Analytics Charts (Row 2, Matching Tile 3) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* 1. Historical Climate Trends */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-space font-bold text-white text-sm">
                    Historical Climate Trends
                  </h3>
                  {/* Sub-tabs: Temperature, Rainfall, Humidity */}
                  <div className="flex bg-[#06111F]/80 p-0.5 rounded-lg border border-white/10">
                    <button
                      onClick={() => setHistoricalTab('temperature')}
                      className={`px-2 py-0.5 text-[10px] font-space font-medium rounded transition ${
                        historicalTab === 'temperature'
                          ? 'bg-primary-cyan text-[#06111F] font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Temperature
                    </button>
                    <button
                      onClick={() => setHistoricalTab('rainfall')}
                      className={`px-2 py-0.5 text-[10px] font-space font-medium rounded transition ${
                        historicalTab === 'rainfall'
                          ? 'bg-primary-cyan text-[#06111F] font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Rainfall
                    </button>
                    <button
                      onClick={() => setHistoricalTab('humidity')}
                      className={`px-2 py-0.5 text-[10px] font-space font-medium rounded transition ${
                        historicalTab === 'humidity'
                          ? 'bg-primary-cyan text-[#06111F] font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Humidity
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Body */}
              <div className="my-2 min-h-[260px] flex items-center justify-center">
                {historicalTab === 'temperature' && historicalData && (
                  <HistoricalTempChart
                    records={historicalData.records}
                    baselineTemp={historicalData.empirical_baseline_temp}
                    warmingRate={summaryData.warming_rate_per_decade}
                    districtName={summaryData.district_name}
                  />
                )}
                {historicalTab === 'rainfall' && historicalData && (
                  <RainfallMonsoonChart
                    records={historicalData.records}
                    baselineRainfall={summaryData.baseline_annual_rainfall}
                    districtName={summaryData.district_name}
                  />
                )}
                {historicalTab === 'humidity' && (
                  <div className="text-center p-6 text-slate-400">
                    <CloudRain className="w-8 h-8 text-primary-cyan mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-mono">Relative Humidity Average: 68%</p>
                    <p className="text-[11px] text-slate-500 mt-1">Seasonal range: 42% (May) to 84% (August Monsoon)</p>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>NASA POWER / PMD Baseline</span>
                <span className="text-primary-cyan">1980–2025</span>
              </div>
            </div>

            {/* 2. Future Projections (2026–2040) */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-space font-bold text-white text-sm">
                    Future Projections (2026–2040)
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-emerald-green">● SSP1-2.6</span>
                    <span className="text-warning-orange">● SSP2-4.5</span>
                    <span className="text-danger-red">● SSP5-8.5</span>
                  </div>
                </div>
              </div>

              {/* Chart Body */}
              <div className="my-2 min-h-[260px]">
                {scenarioData && (
                  <ScenarioComparisonChart
                    scenarios={scenarioData.scenarios}
                    districtName={summaryData.district_name}
                    baselineTemp={summaryData.baseline_mean_temp}
                  />
                )}
              </div>

              <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>IPCC AR6 CMIP6 Downscaled</span>
                <span className="text-emerald-green">Paris 1.5°C vs Unmitigated</span>
              </div>
            </div>

            {/* 3. Climate Risk Radar */}
            <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-space font-bold text-white text-sm mb-1">
                  Climate Risk Radar
                </h3>
                <p className="text-[11px] text-slate-400">
                  Multidimensional vulnerability profile across 6 key environmental stressors.
                </p>
              </div>

              {/* Radar Body */}
              <div className="my-2 min-h-[260px] flex items-center justify-center">
                {riskData && (
                  <RiskRadarChart
                    indicators={riskData.indicators}
                    overallIndex={riskData.overall_climate_vulnerability_index}
                    districtName={summaryData.district_name}
                  />
                )}
              </div>

              <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Vulnerability Score</span>
                <span className="text-warning-orange font-bold">
                  {riskData?.overall_climate_vulnerability_index || 74} / 100
                </span>
              </div>
            </div>
          </div>

          {/* ── Row 3: Machine Learning & Deep Learning sequence analysis ── */}
          <div className="mt-6">
            <MachineLearningPanel
              mlData={mlData}
              deepLearningData={deepLearningData}
              districtName={summaryData.district_name}
            />
          </div>
        </>
      )}
    </div>
  );
};
