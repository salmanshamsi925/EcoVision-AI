import React, { useEffect, useState } from 'react';
import { Info, Database, Server, CheckCircle2, FileText, Download } from 'lucide-react';
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-eco-blue font-grotesk text-sm uppercase tracking-wider mb-1">
          <Info className="w-4 h-4" /> System Telemetry & Documentation
        </div>
        <h1 className="text-3xl font-orbitron font-bold text-white">About EcoVision-AI & Admin Status</h1>
        <p className="text-eco-muted text-sm mt-1">
          AI-Powered Climate Intelligence & Future Simulation Platform for Pakistan & Sindh.
        </p>
      </div>

      {/* Backend & Application Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="hud-card p-5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-grotesk text-eco-muted">FastAPI Service</span>
            <Server className="w-4 h-4 text-eco-blue" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                backendHealth === 'online' ? 'bg-eco-green animate-pulse' : 'bg-eco-red'
              }`}
            />
            <span className="text-lg font-orbitron font-bold uppercase text-white">
              {backendHealth}
            </span>
          </div>
          <p className="text-[11px] text-eco-muted mt-2">REST API: http://127.0.0.1:8000/api/health</p>
        </div>

        <div className="hud-card p-5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-grotesk text-eco-muted">Connected Endpoints</span>
            <Database className="w-4 h-4 text-eco-green" />
          </div>
          <div className="text-2xl font-orbitron font-bold text-eco-green">
            {locationsCount > 0 ? `${locationsCount} Verified Locations` : 'Checking...'}
          </div>
          <p className="text-[11px] text-eco-muted mt-2">API: /api/locations</p>
        </div>

        <div className="hud-card p-5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-grotesk text-eco-muted">Exhibition Mode</span>
            <CheckCircle2 className="w-4 h-4 text-eco-blue" />
          </div>
          <div className="text-2xl font-orbitron font-bold text-white">Zero-Cost Offline</div>
          <p className="text-[11px] text-eco-muted mt-2">No paid API keys required</p>
        </div>
      </div>

      {/* Scientific Disclaimers & Sources */}
      <div className="mt-6 hud-card p-6 rounded-2xl border border-white/10">
        <h3 className="font-orbitron font-bold text-white text-lg mb-3">Scientific Grounding & Compliance</h3>
        <p className="text-sm text-eco-muted leading-relaxed">
          EcoVision-AI is an educational, interactive climate intelligence platform. In accordance with Parts 6, 7, and 8 of the project specifications, climate datasets are derived from authoritative institutions:
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-eco-muted list-disc list-inside">
          <li><strong>NASA POWER:</strong> Historical meteorological and surface solar data (1981–2025).</li>
          <li><strong>World Bank Climate Knowledge Portal:</strong> Pakistan country and provincial climate baselines.</li>
          <li><strong>Pakistan Meteorological Department (PMD):</strong> National climate records & 2022 disaster baselines.</li>
          <li><strong>IPCC Sixth Assessment Report (AR6):</strong> CMIP6 Shared Socioeconomic Pathways (SSP1-2.6, SSP2-4.5, SSP5-8.5).</li>
        </ul>
      </div>
    </div>
  );
};

