import React, { useState, useMemo } from 'react';
import {
  Gamepad2,
  Award,
  Coins,
  RefreshCw,
  Flame,
  Waves,
  Droplets,
  Trees,
  Zap,
  Building,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  Check
} from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';
import { jsPDF } from 'jspdf';

interface Allocations {
  solarMicrogrids: number;
  canalLining: number;
  riverineForests: number;
  mangroveBuffer: number;
  urbanCooling: number;
  emergencyResponse: number;
}

const DEFAULT_ALLOCATIONS: Allocations = {
  solarMicrogrids: 20,
  canalLining: 25,
  riverineForests: 15,
  mangroveBuffer: 15,
  urbanCooling: 15,
  emergencyResponse: 10,
};

const CRISES = [
  {
    id: 'heatwave',
    title: 'Jacobabad & Upper Sindh Lethal Heatwave',
    intensity: '51.5°C Peak',
    desc: 'Lethal 35°C wet-bulb thermal dome threatening agrarian laborers in Larkana and Jacobabad.',
    targetLevers: ['solarMicrogrids', 'urbanCooling'],
    icon: Flame,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  {
    id: 'flood',
    title: 'Indus River Monsoon Flash Inundation',
    intensity: 'Super-Monsoon',
    desc: 'Swelling Indus tributaries threatening barrage breaches and agricultural inundation in Khairpur.',
    targetLevers: ['canalLining', 'riverineForests', 'emergencyResponse'],
    icon: Waves,
    color: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  {
    id: 'drought',
    title: 'Tharparkar Groundwater Exhaustion',
    intensity: 'Severe Deficit',
    desc: 'Erratic rainfall dropping rangeland water tables below 90m, starving livestock.',
    targetLevers: ['canalLining', 'solarMicrogrids'],
    icon: Droplets,
    color: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  {
    id: 'coast',
    title: 'Arabian Sea Seawater Intrusion & Cyclone Surge',
    intensity: '3.2 mm/yr Rise',
    desc: 'Seawater advancing into Thatta & Badin, swallowing 2M+ acres of fertile delta soil.',
    targetLevers: ['mangroveBuffer', 'emergencyResponse'],
    icon: ShieldAlert,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
];

export const ClimateChallenge: React.FC = () => {
  const { activeLocation } = useActiveLocation();
  const districtName = activeLocation?.name || 'Khairpur';

  const [playerName, setPlayerName] = useState('Presidential Envoy');
  const [allocations, setAllocations] = useState<Allocations>(DEFAULT_ALLOCATIONS);
  const [termSimulated, setTermSimulated] = useState(false);
  const [downloadedCert, setDownloadedCert] = useState(false);

  // Grassroots citizen pledges state
  const [pledges, setPledges] = useState<Record<string, boolean>>({
    trees: true,
    solar: false,
    water: true,
    coolRoof: false,
  });

  const totalUsed = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remainingCredits = 100 - totalUsed;

  const updateAllocation = (key: keyof Allocations, val: number) => {
    const current = allocations[key];
    const diff = val - current;
    if (diff > remainingCredits) return;
    setAllocations((prev) => ({ ...prev, [key]: Math.max(0, val) }));
    setTermSimulated(false);
  };

  // Presidential Performance Evaluation Algorithm
  const evaluation = useMemo(() => {
    const {
      solarMicrogrids,
      canalLining,
      riverineForests,
      mangroveBuffer,
      urbanCooling,
      emergencyResponse,
    } = allocations;

    // Heatwave Defense
    const heatScore = Math.min(100, (solarMicrogrids * 1.5 + urbanCooling * 2.2));
    // Flood Defense
    const floodScore = Math.min(100, (canalLining * 1.4 + riverineForests * 1.8 + emergencyResponse * 1.5));
    // Drought Defense
    const droughtScore = Math.min(100, (canalLining * 2.0 + solarMicrogrids * 1.2));
    // Coastal Defense
    const coastalScore = Math.min(100, (mangroveBuffer * 2.6 + emergencyResponse * 1.0));

    // Weighted Overall Presidential Survival Index
    const survivalIndex = Math.round(
      heatScore * 0.28 + floodScore * 0.30 + droughtScore * 0.24 + coastalScore * 0.18
    );

    // Approval Rating based on balanced allocation vs extreme deficits
    const hasExtremeDeficit = Object.values(allocations).some((v) => v < 8);
    const balancePenalty = hasExtremeDeficit ? 14 : 0;
    const approvalRating = Math.max(12, Math.min(98, survivalIndex - balancePenalty + (remainingCredits === 0 ? 5 : -10)));

    // Lives & Resources Shielded
    const livesShieldedM = (approvalRating * 0.24).toFixed(1);
    const waterSavedMAF = (canalLining * 0.08).toFixed(2);

    // Letter Grade & Award
    let grade = 'B';
    let badge = 'Regional Climate Protector';
    let gradeColor = 'text-sky-400';
    let verdict = 'Steady governance. Most provincial sectors adequately defended.';

    if (approvalRating >= 90) {
      grade = 'A+';
      badge = 'Grand Champion of the Indus Basin';
      gradeColor = 'text-emerald-400';
      verdict = 'Exemplary Presidential Leadership! All 5 major climate shocks neutralized with maximum resilience.';
    } else if (approvalRating >= 80) {
      grade = 'A';
      badge = 'Distinguished Climate Commander';
      gradeColor = 'text-eco-green';
      verdict = 'Outstanding performance. Significant reduction in summer heat casualties and flood inundation.';
    } else if (approvalRating >= 65) {
      grade = 'B';
      badge = 'Prudent Environmental Administrator';
      gradeColor = 'text-sky-400';
      verdict = 'Competent term. Minor vulnerabilities in coastal zones or urban heat islands remain.';
    } else if (approvalRating >= 50) {
      grade = 'C';
      badge = 'Under-Prepared Crisis Bureaucrat';
      gradeColor = 'text-amber-400';
      verdict = 'Mixed results. Severe water deficits and agricultural damage reported in tail-end canals.';
    } else {
      grade = 'F';
      badge = 'Impeachment Alert: Ecological Crisis';
      gradeColor = 'text-red-400';
      verdict = 'Term failed. Catastrophic heatwave and flood damages overwhelmed provincial emergency infrastructure.';
    }

    return {
      survivalIndex,
      approvalRating,
      livesShieldedM,
      waterSavedMAF,
      grade,
      badge,
      gradeColor,
      verdict,
      crisesStatus: [
        { name: 'Heatwave Stress', score: Math.round(heatScore), pass: heatScore >= 60 },
        { name: 'Monsoon Flood Barrier', score: Math.round(floodScore), pass: floodScore >= 60 },
        { name: 'Drought & Groundwater', score: Math.round(droughtScore), pass: droughtScore >= 60 },
        { name: 'Delta Coastal Protection', score: Math.round(coastalScore), pass: coastalScore >= 60 },
      ],
    };
  }, [allocations, remainingCredits]);

  const handleSimulate = () => {
    setTermSimulated(true);
  };

  const handleDownloadCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Dark Blue Border & Background
    doc.setFillColor(7, 17, 31);
    doc.rect(0, 0, w, h, 'F');

    // Ornate Border Lines
    doc.setDrawColor(34, 184, 255);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, w - 20, h - 20);

    doc.setDrawColor(53, 211, 154);
    doc.setLineWidth(0.6);
    doc.rect(13, 13, w - 26, h - 26);

    // Header Emblem
    doc.setTextColor(34, 184, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('OFFICIAL CLIMATE PRESIDENTIAL CITATION', w / 2, 35, { align: 'center' });

    doc.setTextColor(245, 247, 250);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('GOVERNMENT OF SINDH & PAKISTAN CLIMATE DEFENSE INITIATIVE', w / 2, 43, { align: 'center' });

    // Certificate Body
    doc.setTextColor(200, 215, 235);
    doc.setFontSize(12);
    doc.text('This presidential decree is conferred upon:', w / 2, 60, { align: 'center' });

    doc.setTextColor(53, 211, 154);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(playerName.toUpperCase(), w / 2, 75, { align: 'center' });

    doc.setTextColor(220, 230, 245);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(
      `For successfully serving as Climate President of ${districtName} & Sindh during the 2026–2030 Term,`,
      w / 2,
      90,
      { align: 'center' }
    );
    doc.text(
      `allocating 100 Climate Credits to shield ${evaluation.livesShieldedM} Million citizens and conserve ${evaluation.waterSavedMAF} MAF of Indus river flow.`,
      w / 2,
      97,
      { align: 'center' }
    );

    // Grade & Distinction Box
    doc.setFillColor(13, 27, 42);
    doc.roundedRect(w / 2 - 75, 110, 150, 32, 2, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Official Presidential Distinction: ${evaluation.badge}`, w / 2, 122, { align: 'center' });

    doc.setTextColor(53, 211, 154);
    doc.setFontSize(12);
    doc.text(`Approval Rating: ${evaluation.approvalRating}%   |   Presidential Grade: ${evaluation.grade}`, w / 2, 132, { align: 'center' });

    // Signatures
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.4);
    doc.line(40, 175, 100, 175);
    doc.line(w - 100, 175, w - 40, 175);

    doc.setTextColor(150, 165, 185);
    doc.setFontSize(8.5);
    doc.text('EcoVision-AI Climate Modeling Council', 70, 181, { align: 'center' });
    doc.text('Minister of Climate Adaptation, Sindh', w - 70, 181, { align: 'center' });

    doc.save(`Climate_President_Citation_${playerName.replace(/\s+/g, '_')}.pdf`);
    setDownloadedCert(true);
    setTimeout(() => setDownloadedCert(false), 3500);
  };

  const togglePledge = (key: string) => {
    setPledges((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-eco-green font-grotesk text-xs uppercase tracking-wider mb-1 font-bold">
            <Gamepad2 className="w-4 h-4" /> Module 8 &bull; The Climate President Decision Challenge
          </div>
          <h1 className="text-2xl md:text-3xl font-orbitron font-black text-white tracking-wide">
            The Climate President: <span className="text-eco-green">{districtName} &amp; Sindh</span>
          </h1>
          <p className="text-eco-muted text-sm mt-1 max-w-3xl">
            You hold executive office for the 2026–2030 Presidential Term. You have a fixed budget of <strong>100 Climate Credits ($10B Green Adaptation Fund)</strong>. Neutralize the 5 regional crises below before your term expires.
          </p>
        </div>

        {/* Treasury Counter & Player Name */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-eco-surface border border-white/10 flex items-center gap-3">
            <Coins className="w-5 h-5 text-eco-green animate-pulse" />
            <div>
              <span className="text-[10px] text-eco-muted uppercase block font-grotesk">Treasury Reserve</span>
              <span className={`text-xl font-orbitron font-bold ${remainingCredits < 0 ? 'text-red-400' : 'text-eco-green'}`}>
                {remainingCredits} <span className="text-xs text-eco-muted font-normal">/ 100 Credits</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setAllocations(DEFAULT_ALLOCATIONS);
              setTermSimulated(false);
            }}
            title="Reset Allocations"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-eco-muted hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 5 Live Regional Crisis Scenarios Alert Banner ───────────────────── */}
      <div className="space-y-2">
        <span className="text-xs font-orbitron uppercase text-eco-orange font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> 4 Active Provincial Crisis Vectors
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CRISES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.id} className={`hud-card p-3 rounded-xl border ${c.border} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-grotesk font-bold flex items-center gap-1.5 ${c.color}`}>
                    <Icon className="w-3.5 h-3.5" /> {c.title.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/80 border border-white/10">
                    {c.intensity}
                  </span>
                </div>
                <p className="text-[11px] text-eco-muted leading-tight line-clamp-2">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6 Policy Budget Allocations (The Levers) ───────────────────────── */}
      <div className="hud-card p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
              Executive Cabinet Budget Allocations
            </h2>
            <p className="text-xs text-eco-muted mt-0.5">
              Distribute your 100 Credits across all 6 sectors. Balanced governance yields the highest approval rating.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your Leader Name..."
              className="bg-eco-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-eco-blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Solar & Microgrids */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-grotesk font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" /> Distributed Solar &amp; Tubewells
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {allocations.solarMicrogrids} C
              </span>
            </div>
            <p className="text-[11px] text-eco-muted leading-tight">
              Solarizes irrigation pumps and cold chain storage against heatwave power grid blackouts.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              value={allocations.solarMicrogrids}
              onChange={(e) => updateAllocation('solarMicrogrids', Number(e.target.value))}
              className="w-full accent-sky-400 bg-eco-bg h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. Canal Lining */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-grotesk font-bold text-white flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-400" /> Indus Canal Concrete Lining
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {allocations.canalLining} C
              </span>
            </div>
            <p className="text-[11px] text-eco-muted leading-tight">
              Stops 38% water seepage loss in secondary distributaries and supplies tail-end farmers.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              value={allocations.canalLining}
              onChange={(e) => updateAllocation('canalLining', Number(e.target.value))}
              className="w-full accent-cyan-400 bg-eco-bg h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. Riverine Afforestation */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-grotesk font-bold text-white flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-400" /> Indus Riverine Forests
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {allocations.riverineForests} C
              </span>
            </div>
            <p className="text-[11px] text-eco-muted leading-tight">
              Babul &amp; Kandi flood retention belts that slow torrential monsoon runoff and restore aquifers.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              value={allocations.riverineForests}
              onChange={(e) => updateAllocation('riverineForests', Number(e.target.value))}
              className="w-full accent-emerald-400 bg-eco-bg h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 4. Delta Mangroves */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-grotesk font-bold text-white flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-blue-400" /> Mangrove Delta Buffers
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {allocations.mangroveBuffer} C
              </span>
            </div>
            <p className="text-[11px] text-eco-muted leading-tight">
              Protects Thatta, Badin, and Karachi from Arabian Sea cyclone surges and tidal wave energy.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              value={allocations.mangroveBuffer}
              onChange={(e) => updateAllocation('mangroveBuffer', Number(e.target.value))}
              className="w-full accent-blue-400 bg-eco-bg h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 5. Urban Cooling */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-grotesk font-bold text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-teal-400" /> Urban Cool Roofs &amp; Canopies
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                {allocations.urbanCooling} C
              </span>
            </div>
            <p className="text-[11px] text-eco-muted leading-tight">
              High-albedo reflective coatings and urban shaded corridors in Karachi and Sukkur.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              value={allocations.urbanCooling}
              onChange={(e) => updateAllocation('urbanCooling', Number(e.target.value))}
              className="w-full accent-teal-400 bg-eco-bg h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* 6. Emergency Relief */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-grotesk font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Early Warning &amp; Elevated Dykes
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {allocations.emergencyResponse} C
              </span>
            </div>
            <p className="text-[11px] text-eco-muted leading-tight">
              Doppler radar alerts, community evacuation boats, and reinforced flood protection dykes.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              value={allocations.emergencyResponse}
              onChange={(e) => updateAllocation('emergencyResponse', Number(e.target.value))}
              className="w-full accent-amber-400 bg-eco-bg h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Simulate Term Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-eco-muted font-grotesk">
            Budget Status: {remainingCredits === 0 ? '✓ Budget 100% Fully Allocated' : `${remainingCredits} Credits Remaining to spend`}
          </span>

          <button
            onClick={handleSimulate}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-eco-green to-emerald-400 text-eco-bg font-grotesk font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition"
          >
            <Award className="w-4 h-4" />
            <span>Simulate Presidential Term (2026–2030)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Official Presidential Climate Report Card (Simulation Outcome) ── */}
      {termSimulated && (
        <div className="hud-card p-6 rounded-2xl border border-eco-green/40 bg-eco-green/[0.02] space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-grotesk font-bold uppercase tracking-wider text-eco-green flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Term Completed: 2026–2030 Evaluation
              </span>
              <h2 className="text-2xl font-orbitron font-black text-white mt-1">
                Presidential Climate Report Card: {playerName}
              </h2>
              <p className="text-xs text-eco-muted mt-0.5">{evaluation.verdict}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-eco-muted uppercase block font-grotesk">Presidential Grade</span>
                <span className={`text-3xl font-orbitron font-black ${evaluation.gradeColor}`}>
                  {evaluation.grade}
                </span>
              </div>
              <button
                onClick={handleDownloadCertificate}
                className="px-4 py-2 rounded-xl bg-eco-blue hover:bg-sky-400 text-eco-bg font-grotesk font-bold text-xs flex items-center gap-2 shadow-neon-blue transition"
              >
                <Download className="w-4 h-4" />
                <span>{downloadedCert ? 'Downloaded!' : 'Download Official Citation (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Vital Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-eco-muted font-grotesk">Approval Rating</span>
              <p className="text-2xl font-orbitron font-bold text-white">{evaluation.approvalRating}%</p>
              <span className="text-[10px] font-mono text-eco-green">&bull; Public Confidence</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-eco-muted font-grotesk">Provincial Survival Index</span>
              <p className="text-2xl font-orbitron font-bold text-eco-blue">{evaluation.survivalIndex} / 100</p>
              <span className="text-[10px] font-mono text-eco-blue">&bull; Infrastructure Resilience</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-eco-muted font-grotesk">Citizens Shielded</span>
              <p className="text-2xl font-orbitron font-bold text-emerald-400">{evaluation.livesShieldedM}M</p>
              <span className="text-[10px] font-mono text-emerald-400">&bull; Protected from Shocks</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs text-eco-muted font-grotesk">Freshwater Conserved</span>
              <p className="text-2xl font-orbitron font-bold text-cyan-400">+{evaluation.waterSavedMAF} MAF</p>
              <span className="text-[10px] font-mono text-cyan-400">&bull; Indus Basin Seepage Saved</span>
            </div>
          </div>

          {/* 4 Crisis Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {evaluation.crisesStatus.map((cs, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-xs font-grotesk text-white">{cs.name}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${cs.pass ? 'bg-eco-green/10 text-eco-green' : 'bg-red-500/10 text-red-400'}`}>
                  {cs.score}% {cs.pass ? 'Defended' : 'Vulnerable'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Community Action: Grassroots Citizen Climate Pledges ──────────── */}
      <div className="hud-card p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-eco-green" />
          <div>
            <h3 className="text-base font-orbitron font-bold text-white">
              Tangible Grassroots Action &bull; Citizen Pledges for Sindh
            </h3>
            <p className="text-xs text-eco-muted">
              Policy alone is insufficient. Pledge concrete environmental actions in your local neighborhood.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { id: 'trees', title: 'Plant 5 Indigenous Trees', desc: 'Plant Kandi or Neem trees to combat localized thermal heat.' },
            { id: 'solar', title: 'Solarize Household Appliances', desc: 'Switch home water pumping to localized solar PV panels.' },
            { id: 'water', title: 'Drip Garden & Water Reuse', desc: 'Recycle greywater for home gardens and reduce tap waste.' },
            { id: 'coolRoof', title: 'Reflective Cool Roof Coating', desc: 'Coat rooftop with high-albedo white paint to cut indoor heat by 4°C.' },
          ].map((pl) => (
            <div
              key={pl.id}
              onClick={() => togglePledge(pl.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                pledges[pl.id]
                  ? 'bg-eco-green/10 border-eco-green/40'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 transition ${
                  pledges[pl.id] ? 'bg-eco-green text-eco-bg font-bold' : 'border border-white/20 text-transparent'
                }`}
              >
                <Check className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-grotesk font-bold text-white block">{pl.title}</span>
                <p className="text-[11px] text-eco-muted leading-tight">{pl.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
