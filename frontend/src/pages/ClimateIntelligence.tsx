import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Database, 
  MapPin, 
  Calendar, 
  Layers, 
  ChevronDown,
  ArrowRight,
  Cpu,
  CloudRain,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';
import { HistoricalTempChart } from '../dashboard/HistoricalTempChart';
import { RainfallMonsoonChart } from '../dashboard/RainfallMonsoonChart';
import { ScenarioComparisonChart } from '../dashboard/ScenarioComparisonChart';
import { RiskRadarChart } from '../dashboard/RiskRadarChart';
import { MachineLearningPanel } from '../dashboard/MachineLearningPanel';
import { WorkflowNextBanner } from '../components/GuidedWorkflow';

export const ClimateIntelligence: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLocation, setActiveLocationId, allLocations } = useActiveLocation();

  const districtParam = searchParams.get('district') || activeLocation.id || 'khairpur';
  const [currentDistrict, setCurrentDistrict] = useState(districtParam);

  const [historicalData, setHistoricalData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [mlData, setMlData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state if URL changes or context changes
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
      fetch(`${BASE}/api/climate/ml-analysis?district=${currentDistrict}`).then(r => r.json())
    ])
      .then(([hist, sum, risk, scen, ml]) => {
        setHistoricalData(hist);
        setSummaryData(sum);
        setRiskData(risk);
        setScenarioData(scen);
        setMlData(ml);
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
    { id: 'shaheedbenazirabad', name: 'Shaheed Benazirabad' },
    { id: 'sanghar', name: 'Sanghar' },
    { id: 'jamshoro', name: 'Jamshoro' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-eco-green font-grotesk text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-eco-green" /> Step 3: Climate Intelligence &amp; ML Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
            Climate Intelligence Dashboard
          </h1>
          <p className="text-eco-muted text-xs sm:text-sm mt-1">
            Empirical historical baselines (NASA POWER, PMD 1980–2025) &amp; CMIP6 Projections (2027, 2030, 2035).
          </p>
        </div>

        {/* District Selector & Attribution */}
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

          <span className="px-2.5 py-1.5 rounded-xl text-[10px] font-mono bg-eco-green/10 text-eco-green border border-eco-green/20 flex items-center gap-1">
            <Database className="w-3 h-3" /> NASA POWER / PMD Validated
          </span>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="hud-card p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-2 border-eco-blue border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-eco-blue font-grotesk text-sm">Computing Scikit-learn climate regression models...</p>
        </div>
      )}

      {error && (
        <div className="hud-card p-8 rounded-2xl border-eco-red/40 bg-eco-red/5 text-center">
          <AlertTriangle className="w-8 h-8 text-eco-red mx-auto mb-2" />
          <p className="text-eco-red font-semibold text-sm">{error}</p>
          <p className="text-eco-muted text-xs mt-1">Ensure backend uvicorn is running on port 8000.</p>
        </div>
      )}

      {!loading && !error && summaryData && (
        <>
          {/* ── Metric Highlights (4 Cards) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="hud-card p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
                Mean Warming Rate
              </span>
              <div className="text-xl sm:text-2xl font-orbitron font-bold text-eco-orange mt-1">
                +{summaryData.warming_rate_per_decade}°C
              </div>
              <span className="text-[10px] text-eco-muted mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-eco-orange" /> Per decade (Scikit-Learn ML)
              </span>
            </div>

            <div className="hud-card p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
                Observed Warming
              </span>
              <div className="text-xl sm:text-2xl font-orbitron font-bold text-eco-red mt-1">
                +{summaryData.observed_warming_since_1980}°C
              </div>
              <span className="text-[10px] text-eco-muted mt-1 flex items-center gap-1">
                Since 1980 vs baseline
              </span>
            </div>

            <div className="hud-card p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
                Record Summer Peak
              </span>
              <div className="text-xl sm:text-2xl font-orbitron font-bold text-white mt-1">
                {summaryData.record_max_temp}°C
              </div>
              <span className="text-[10px] text-eco-muted mt-1">
                Year: {summaryData.record_max_temp_year} Extreme
              </span>
            </div>

            <div className="hud-card p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
                Record Flood Inundation
              </span>
              <div className="text-xl sm:text-2xl font-orbitron font-bold text-eco-blue mt-1">
                {summaryData.record_flood_rainfall} mm
              </div>
              <span className="text-[10px] text-eco-muted mt-1">
                Year: {summaryData.record_flood_year} (+460% anomaly)
              </span>
            </div>
          </div>

          {/* ── Main Section 1: Historical Charts (Side-by-Side) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Temperature & ML Trend Line */}
            <div className="hud-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-orbitron font-bold text-white text-base">
                  Historical Temperature Trend &amp; ML Regression (1980–2025)
                </h3>
                <p className="text-xs text-eco-muted mt-0.5">
                  Observed annual mean anomaly vs. Scikit-learn trend line for {summaryData.district_name}.
                </p>
              </div>
              <div className="my-3 min-h-[290px]">
                {historicalData && (
                  <HistoricalTempChart
                    records={historicalData.records}
                    baselineTemp={historicalData.empirical_baseline_temp}
                    warmingRate={summaryData.warming_rate_per_decade}
                    districtName={summaryData.district_name}
                  />
                )}
              </div>
              <span className="text-[10px] text-eco-muted/70 font-mono border-t border-white/5 pt-2">
                Data Source: NASA POWER Climate API / PMD Weather Observatories (0.5° Grid)
              </span>
            </div>

            {/* Chart 2: Rainfall & Monsoon Surge */}
            <div className="hud-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-orbitron font-bold text-white text-base">
                  Annual Rainfall &amp; Monsoon Surge Extremes
                </h3>
                <p className="text-xs text-eco-muted mt-0.5">
                  Multi-decadal precipitation totals highlighting 2010 and 2022 catastrophic floods.
                </p>
              </div>
              <div className="my-3 min-h-[290px]">
                {historicalData && (
                  <RainfallMonsoonChart
                    records={historicalData.records}
                    baselineRainfall={summaryData.baseline_annual_rainfall}
                    districtName={summaryData.district_name}
                  />
                )}
              </div>
              <span className="text-[10px] text-eco-muted/70 font-mono border-t border-white/5 pt-2">
                Baseline: {summaryData.baseline_annual_rainfall} mm (1991–2020 PMD Normal)
              </span>
            </div>
          </div>

          {/* ── Main Section 2: Projections & Risk Radar (Side-by-Side) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CMIP6 Multi-Scenario Projection (2 cols) */}
            <div className="lg:col-span-2 hud-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-orbitron font-bold text-white text-base">
                  CMIP6 Multi-Scenario Climate Projections (2027 • 2030 • 2035 • 2050)
                </h3>
                <p className="text-xs text-eco-muted mt-0.5">
                  Comparison of SSP1-2.6 (Paris Goal), SSP2-4.5 (Middle of Road), and SSP5-8.5 (Fossil-Fueled).
                </p>
              </div>
              <div className="my-3">
                {scenarioData && (
                  <ScenarioComparisonChart
                    scenarios={scenarioData.scenarios}
                    districtName={summaryData.district_name}
                    baselineTemp={summaryData.baseline_mean_temp}
                  />
                )}
              </div>
              <span className="text-[10px] text-eco-muted/70 font-mono border-t border-white/5 pt-2">
                Ensemble: CMIP6 Working Group I / Downscaled with PMD Climate Baseline
              </span>
            </div>

            {/* 6-Axis Risk Radar (1 col) */}
            <div className="hud-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-orbitron font-bold text-white text-base">
                  District Climate Risk Radar
                </h3>
                <p className="text-xs text-eco-muted mt-0.5">
                  6-dimension multidimensional vulnerability profile for {summaryData.district_name}.
                </p>
              </div>
              <div className="my-2 flex-1 flex items-center justify-center">
                {riskData && (
                  <RiskRadarChart
                    indicators={riskData.indicators}
                    overallIndex={riskData.overall_climate_vulnerability_index}
                    districtName={summaryData.district_name}
                  />
                )}
              </div>
              <span className="text-[10px] text-eco-muted/70 font-mono border-t border-white/5 pt-2">
                Spatial Resolution: 0.5° (~55 km) | NASA POWER / NDMA Pakistan
              </span>
            </div>
          </div>

          {/* ── Main Section 3: Machine Learning Engine Panel ── */}
          <div className="hud-card p-5 rounded-2xl border border-white/10">
            {mlData && (
              <MachineLearningPanel
                metrics={mlData.model_metrics}
                futureProjections={mlData.ml_future_projections}
                anomalies={mlData.detected_anomalies}
                clustering={mlData.kmeans_clustering}
                scientificInterpretation={mlData.scientific_interpretation}
                districtName={summaryData.district_name}
              />
            )}
          </div>
        </>
      )}

      {/* ── Guided Workflow Next Step Banner ── */}
      <WorkflowNextBanner
        currentStepLabel="Step 3: Analytics Completed"
        nextStepName="Policy Lab & Action Simulator"
        nextStepPath={`/change?district=${currentDistrict}`}
        subtext="Simulate adaptation policies, test renewable solutions, and export PDF report"
      />
    </div>
  );
};
