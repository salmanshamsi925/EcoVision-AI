import React, { useEffect, useState } from 'react';
import { Info, Database, Server, CheckCircle2, ShieldCheck, Globe, Cpu, Award } from 'lucide-react';
import { API_BASE } from '../config/api';

export const AboutProject: React.FC = () => {
  const [backendHealth, setBackendHealth] = useState<'checking' | 'online' | 'offline'>('checking');
  const [locationsCount, setLocationsCount] = useState<number>(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setBackendHealth('online');
      })
      .catch(() => setBackendHealth('offline'));

    fetch(`${API_BASE}/api/locations`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLocationsCount(data.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#06111F] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 pb-24 font-inter">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-primary-cyan font-space text-xs uppercase tracking-wider mb-1.5 font-bold">
          <Info className="w-4 h-4" /> System Telemetry &amp; Project Mission
        </div>
        <h1 className="text-3xl sm:text-4xl font-space font-bold text-white tracking-tight">
          About EcoVision-AI
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Climate Intelligence for a Sustainable Pakistan. Advanced environmental intelligence, cinematic 3D Earth digital twin, downscaled IPCC AR6 CMIP6 scenarios, and machine learning for provincial climate resilience.
        </p>
      </div>

      {/* Application Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-space text-slate-400">FastAPI Engine</span>
            <Server className="w-4 h-4 text-primary-cyan" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${
                backendHealth === 'online' ? 'bg-emerald-green animate-pulse' : 'bg-danger-red'
              }`}
            />
            <span className="text-xl font-space font-bold uppercase text-white">
              {backendHealth}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">REST API: /api/health</p>
        </div>

        <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-space text-slate-400">GIS Districts</span>
            <Database className="w-4 h-4 text-emerald-green" />
          </div>
          <div className="text-xl font-space font-bold text-emerald-green mt-1">
            {locationsCount > 0 ? `${locationsCount} Verified Districts` : '14 Sindh Districts'}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">GeoJSON &amp; Real-time Telemetry</p>
        </div>

        <div className="bg-[#10243A]/80 border border-white/10 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-space text-slate-400">Architecture</span>
            <CheckCircle2 className="w-4 h-4 text-primary-cyan" />
          </div>
          <div className="text-xl font-space font-bold text-white mt-1">
            100% Free &amp; Keyless
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">Open-Meteo &bull; NASA POWER &bull; PMD</p>
        </div>
      </div>

      {/* Mission & Purpose */}
      <div className="bg-[#10243A]/80 border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="font-space font-bold text-white text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-green" /> Mission &amp; Academic Background
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Pakistan ranks among the top 10 most vulnerable countries to climate change globally according to the Global Climate Risk Index, despite contributing less than 1% of global greenhouse emissions. The unprecedented 2022 Indus floods submerged one-third of Pakistan and devastated Sindh's agricultural heartland.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          EcoVision-AI bridges the gap between complex climate science and actionable decision-making. Designed for researchers, policy planners, students, and citizens, the platform combines machine learning predictions, real-time satellite telemetry, and an interactive policy simulator to model adaptation pathways for Sindh and Pakistan.
        </p>
      </div>

      {/* Scientific Data Grounding */}
      <div className="bg-[#10243A]/80 border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="font-space font-bold text-white text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-cyan" /> Scientific Grounding &amp; Data Sources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#06111F]/60 border border-white/5 space-y-1">
            <h4 className="font-space font-bold text-primary-cyan text-sm">NASA POWER Meteorological API</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Historical 0.5° grid data covering daily temperatures, solar radiation, and precipitation from 1981 to 2025.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#06111F]/60 border border-white/5 space-y-1">
            <h4 className="font-space font-bold text-emerald-green text-sm">Pakistan Meteorological Department (PMD)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ground-station calibrated weather records, 1991–2020 climatic normals, and historical heatwave records.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#06111F]/60 border border-white/5 space-y-1">
            <h4 className="font-space font-bold text-warning-orange text-sm">IPCC AR6 CMIP6 Multi-Model Projections</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Downscaled Shared Socioeconomic Pathways (SSP1-2.6, SSP2-4.5, SSP5-8.5) projecting warming out to 2035 &amp; 2050.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#06111F]/60 border border-white/5 space-y-1">
            <h4 className="font-space font-bold text-blue-400 text-sm">Open-Meteo Real-Time Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-frequency live meteorological telemetry for 14 Sindh districts with zero API key dependencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
