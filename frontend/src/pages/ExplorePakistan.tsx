import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Thermometer,
  CloudRain,
  Sun,
  Trees,
  Layers,
  Globe,
  Search,
  MapPin,
  Wind,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Flame,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { PakistanSindhMap, DISTRICT_DATA } from '../maps/PakistanSindhMap';
import type { DistrictData, OverlayType } from '../maps/PakistanSindhMap';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';

// Curated authentic landmarks for major districts
const DISTRICT_IMAGES: Record<string, string> = {
  khairpur: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=700&q=80',
  karachi: 'https://images.unsplash.com/photo-1572978803138-0bc92f98f6d9?auto=format&fit=crop&w=700&q=80',
  sukkur: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=700&q=80',
  larkana: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=700&q=80',
  tharparkar: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80',
  hyderabad: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
  thatta: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80',
  badin: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80',
  dadu: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
  jacobabad: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80',
  sanghar: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
  jamshoro: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
  shaheedbenazirababad: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
  mirpurkhas: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
};

export const ExplorePakistan: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLocation, setActiveLocationId } = useActiveLocation();

  const districtParam = searchParams.get('district') || activeLocation?.id || 'khairpur';
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(
    DISTRICT_DATA[districtParam.toLowerCase()] || DISTRICT_DATA['khairpur']
  );

  // Mobile navigation tab: 'map', 'layers', or 'details'
  const [mobileTab, setMobileTab] = useState<'map' | 'layers' | 'details'>('map');

  // GIS Layer Controls State
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>('temperature');
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [isSatellite, setIsSatellite] = useState<boolean>(true);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [liveWeather, setLiveWeather] = useState<any>(null);

  // Sync with selected district live weather
  useEffect(() => {
    if (!selectedDistrict?.id) return;
    fetch(`${API_BASE}/api/climate/live?district=${selectedDistrict.id}`)
      .then((res) => res.json())
      .then((data) => setLiveWeather(data))
      .catch(() => setLiveWeather(null));
  }, [selectedDistrict?.id]);

  const handleDistrictPick = (id: string) => {
    const data = DISTRICT_DATA[id.toLowerCase()];
    if (data) {
      setSelectedDistrict(data);
      setActiveLocationId(data.id);
      setSearchParams({ district: data.id });
    }
  };

  const filteredDistricts = Object.values(DISTRICT_DATA).filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col w-full max-w-full h-[calc(100dvh-56px)] sm:h-[calc(100dvh-64px)] bg-[#06111F] text-slate-100 overflow-x-hidden ${mobileTab === 'map' ? 'overflow-hidden' : 'overflow-y-auto'} lg:overflow-hidden font-inter`}>
      {/* ── Mobile Navigation Tabs (Sleek 3-Pill Switcher) ── */}
      <div className="lg:hidden flex items-center justify-between p-2 bg-[#0B1B2D]/95 backdrop-blur-xl border-b border-white/10 shrink-0 z-20 gap-1.5">
        <button
          type="button"
          onClick={() => {
            setMobileTab('map');
            window.dispatchEvent(new Event('resize'));
          }}
          className={`flex-1 h-10 px-2 rounded-xl text-xs font-grotesk font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation cursor-pointer ${
            mobileTab === 'map'
              ? 'bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-bold shadow-md shadow-[#20C5FF]/25 border-transparent'
              : 'bg-[#10243A]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Globe className={`w-3.5 h-3.5 shrink-0 ${mobileTab === 'map' ? 'text-[#06111F]' : 'text-[#20C5FF]'}`} />
          <span className="truncate">GIS Map</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('layers')}
          className={`flex-1 h-10 px-2 rounded-xl text-xs font-grotesk font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation cursor-pointer ${
            mobileTab === 'layers'
              ? 'bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-bold shadow-md shadow-[#20C5FF]/25 border-transparent'
              : 'bg-[#10243A]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Search className={`w-3.5 h-3.5 shrink-0 ${mobileTab === 'layers' ? 'text-[#06111F]' : 'text-[#20C5FF]'}`} />
          <span className="truncate">Search & Layers</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('details')}
          className={`flex-1 h-10 px-2 rounded-xl text-xs font-grotesk font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation cursor-pointer ${
            mobileTab === 'details'
              ? 'bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-bold shadow-md shadow-[#20C5FF]/25 border-transparent'
              : 'bg-[#10243A]/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <MapPin className={`w-3.5 h-3.5 shrink-0 ${mobileTab === 'details' ? 'text-[#06111F]' : 'text-[#22D3A0]'}`} />
          <span className="truncate">District Data</span>
        </button>
      </div>

      {/* ── 3-Column GIS Interface (Desktop side-by-side, Mobile single-tab view) ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* ── Left Column: GIS Layers & Search ── */}
        <div
          className={`w-full lg:w-72 xl:w-80 bg-[#0B1B2D]/95 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col gap-4 overflow-y-auto z-10 shrink-0 ${
            mobileTab === 'layers' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
        >
          {/* Mobile Back to Map button */}
          <div className="lg:hidden flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={() => {
                setMobileTab('map');
                window.dispatchEvent(new Event('resize'));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10243A] border border-[#20C5FF]/30 text-xs text-[#20C5FF] font-grotesk font-semibold active:scale-95 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Interactive Map</span>
            </button>
          </div>

          {/* GIS Layers Card */}
          <div className="bg-[#10243A]/80 border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
              <Layers className="w-4 h-4 text-primary-cyan" />
              <h3 className="font-space text-sm font-bold tracking-wide text-white">GIS Layers</h3>
            </div>

            <div className="space-y-2.5">
              {/* Temperature Risk Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-warning-orange">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Temperature Risk</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeOverlay === 'temperature'}
                  onChange={() => setActiveOverlay(activeOverlay === 'temperature' ? 'none' : 'temperature')}
                  className="w-4 h-4 accent-[#20C5FF] cursor-pointer"
                />
              </label>

              {/* Flood Risk Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-primary-cyan">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Flood Risk</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeOverlay === 'flood'}
                  onChange={() => setActiveOverlay(activeOverlay === 'flood' ? 'none' : 'flood')}
                  className="w-4 h-4 accent-[#20C5FF] cursor-pointer"
                />
              </label>

              {/* Drought Risk Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Drought Risk</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeOverlay === 'drought'}
                  onChange={() => setActiveOverlay(activeOverlay === 'drought' ? 'none' : 'drought')}
                  className="w-4 h-4 accent-[#20C5FF] cursor-pointer"
                />
              </label>

              {/* Vegetation Index Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-green">
                    <Trees className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Vegetation Index</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeOverlay === 'vegetation'}
                  onChange={() => setActiveOverlay(activeOverlay === 'vegetation' ? 'none' : 'vegetation')}
                  className="w-4 h-4 accent-[#20C5FF] cursor-pointer"
                />
              </label>

              {/* District Boundaries Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">District Boundaries</span>
                </div>
                <input
                  type="checkbox"
                  checked={showBoundaries}
                  onChange={(e) => setShowBoundaries(e.target.checked)}
                  className="w-4 h-4 accent-[#20C5FF] cursor-pointer"
                />
              </label>

              {/* Satellite View Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Satellite View</span>
                </div>
                <input
                  type="checkbox"
                  checked={isSatellite}
                  onChange={(e) => setIsSatellite(e.target.checked)}
                  className="w-4 h-4 accent-[#20C5FF] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* District Search Card */}
          <div className="bg-[#10243A]/80 border border-white/10 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
            <h3 className="font-space text-sm font-bold tracking-wide text-white mb-2.5">District Search</h3>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#06111F]/70 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary-cyan transition"
              />
            </div>

            {/* Quick District Chips */}
            <div className="space-y-1.5 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
              {(searchQuery ? filteredDistricts : Object.values(DISTRICT_DATA)).map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    handleDistrictPick(d.id);
                    setMobileTab('map');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    selectedDistrict?.id === d.id
                      ? 'bg-gradient-to-r from-primary-cyan/20 to-emerald-green/10 border border-primary-cyan/40 text-primary-cyan font-bold'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${selectedDistrict?.id === d.id ? 'text-primary-cyan' : 'text-slate-400'}`} />
                    <span>{d.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{d.temp_c}°C</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Center Column: Interactive Map Canvas ── */}
        <div
          className={`flex-1 relative min-h-[350px] lg:min-h-0 bg-[#06111F] ${
            mobileTab === 'map' ? 'flex flex-col h-full' : 'hidden lg:flex'
          }`}
        >
          <PakistanSindhMap
            initialDistrict={selectedDistrict?.id}
            selectedDistrictId={selectedDistrict?.id}
            onDistrictSelect={setSelectedDistrict}
            overlay={activeOverlay}
            basemap={isSatellite ? 'satellite' : 'dark'}
            showBoundaries={showBoundaries}
            isTabActive={mobileTab === 'map'}
          />

          {/* ── Floating Live GIS Layer HUD Dock (Directly on Map Canvas) ── */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-[1500] pointer-events-auto select-none">
            <div className="bg-[#0B1B2D]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth select-none">
              
              {/* Active Overlay Status Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10243A]/90 rounded-xl border border-white/10 shrink-0 select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse shrink-0" />
                <span className="text-[10px] font-mono text-emerald-green font-bold uppercase tracking-wider">
                  {activeOverlay === 'none' ? 'LIVE MAP' : activeOverlay}
                </span>
              </div>

              {/* Heat Risk Pill */}
              <button
                type="button"
                onClick={() => setActiveOverlay(activeOverlay === 'temperature' ? 'none' : 'temperature')}
                className={`shrink-0 h-8 px-2.5 rounded-xl text-xs font-grotesk font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  activeOverlay === 'temperature'
                    ? 'bg-gradient-to-r from-orange-500/35 to-red-500/35 text-orange-200 border border-orange-400/80 shadow-md shadow-orange-500/20 font-bold'
                    : 'bg-[#10243A]/70 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <Thermometer className={`w-3.5 h-3.5 shrink-0 ${activeOverlay === 'temperature' ? 'text-orange-400 animate-pulse' : 'text-slate-400'}`} />
                <span>Heat Risk</span>
              </button>

              {/* Flood Risk Pill */}
              <button
                type="button"
                onClick={() => setActiveOverlay(activeOverlay === 'flood' ? 'none' : 'flood')}
                className={`shrink-0 h-8 px-2.5 rounded-xl text-xs font-grotesk font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  activeOverlay === 'flood'
                    ? 'bg-gradient-to-r from-cyan-500/35 to-blue-500/35 text-cyan-200 border border-cyan-400/80 shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-[#10243A]/70 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <CloudRain className={`w-3.5 h-3.5 shrink-0 ${activeOverlay === 'flood' ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                <span>Flood Risk</span>
              </button>

              {/* Drought Risk Pill */}
              <button
                type="button"
                onClick={() => setActiveOverlay(activeOverlay === 'drought' ? 'none' : 'drought')}
                className={`shrink-0 h-8 px-2.5 rounded-xl text-xs font-grotesk font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  activeOverlay === 'drought'
                    ? 'bg-gradient-to-r from-amber-500/35 to-yellow-500/35 text-amber-200 border border-amber-400/80 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-[#10243A]/70 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 shrink-0 ${activeOverlay === 'drought' ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                <span>Drought Risk</span>
              </button>

              {/* Vegetation Index Pill */}
              <button
                type="button"
                onClick={() => setActiveOverlay(activeOverlay === 'vegetation' ? 'none' : 'vegetation')}
                className={`shrink-0 h-8 px-2.5 rounded-xl text-xs font-grotesk font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  activeOverlay === 'vegetation'
                    ? 'bg-gradient-to-r from-emerald-500/35 to-teal-500/35 text-emerald-200 border border-emerald-400/80 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-[#10243A]/70 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <Trees className={`w-3.5 h-3.5 shrink-0 ${activeOverlay === 'vegetation' ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span>Vegetation</span>
              </button>

              {/* Satellite / Dark Map Toggle Pill */}
              <button
                type="button"
                onClick={() => setIsSatellite(!isSatellite)}
                className={`shrink-0 h-8 px-2.5 rounded-xl text-xs font-grotesk font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  isSatellite
                    ? 'bg-gradient-to-r from-purple-500/30 to-[#20C5FF]/30 text-purple-200 border border-purple-400/70 shadow-md shadow-purple-500/20 font-bold'
                    : 'bg-[#10243A]/70 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <Eye className={`w-3.5 h-3.5 shrink-0 ${isSatellite ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{isSatellite ? 'Satellite' : 'Dark Map'}</span>
              </button>

              {/* District Boundaries Toggle Pill */}
              <button
                type="button"
                onClick={() => setShowBoundaries(!showBoundaries)}
                className={`shrink-0 h-8 px-2.5 rounded-xl text-xs font-grotesk font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  showBoundaries
                    ? 'bg-[#10243A] text-[#20C5FF] border border-[#20C5FF]/60 font-semibold'
                    : 'bg-[#10243A]/70 text-slate-400 border border-white/10 line-through'
                }`}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>Borders</span>
              </button>
            </div>
          </div>

          {/* Mobile Bottom Quick-Action Bar (Fixed z-[2000] to always stay on top of map tiles) */}
          {selectedDistrict && (
            <div className="lg:hidden absolute bottom-3 left-3 right-3 z-[2000] bg-[#0B1B2D]/95 border border-[#20C5FF]/40 backdrop-blur-xl rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xl gap-2 pointer-events-auto">
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-mono text-[#20C5FF] uppercase tracking-wider block">Selected District</span>
                <div className="font-grotesk font-bold text-white text-sm truncate">
                  {selectedDistrict.name} <span className="text-[#22D3A0] font-mono font-semibold ml-1">({selectedDistrict.temp_c}°C)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileTab('details')}
                className="shrink-0 h-10 px-3.5 rounded-xl bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-grotesk font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#20C5FF]/30 active:scale-95 transition-all touch-manipulation cursor-pointer"
              >
                <span>Full Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* ── Right Column: Selected District Information ── */}
        <div
          className={`w-full lg:w-80 xl:w-88 bg-[#0B1B2D]/95 backdrop-blur-xl border-l border-white/10 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto z-10 shrink-0 ${
            mobileTab === 'details' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
        >
          {selectedDistrict ? (
            <>
              {/* Mobile Back to Map button */}
              <div className="lg:hidden flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileTab('map');
                    window.dispatchEvent(new Event('resize'));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10243A] border border-[#20C5FF]/30 text-xs text-[#20C5FF] font-grotesk font-semibold active:scale-95 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Interactive Map</span>
                </button>
              </div>

              {/* District Name Header */}
              <div>
                <span className="text-[10px] font-space text-slate-400 uppercase tracking-widest">
                  {selectedDistrict.province} PROVINCE • CLIMATE TELEMETRY
                </span>
                <h2 className="text-xl font-space font-bold text-white mt-0.5">
                  {selectedDistrict.name} District
                </h2>
                <p className="text-[11px] font-mono text-primary-cyan mt-0.5">
                  {selectedDistrict.lat.toFixed(2)}°N, {selectedDistrict.lon.toFixed(2)}°E
                </p>
              </div>

              {/* Landmark Image */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg group h-36">
                <img
                  src={DISTRICT_IMAGES[selectedDistrict.id] || DISTRICT_IMAGES['khairpur']}
                  alt={selectedDistrict.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DISTRICT_IMAGES['khairpur'];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06111F] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90">
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    📍 {selectedDistrict.name} Landmark
                  </span>
                </div>
              </div>

              {/* Live Telemetry Data List */}
              <div className="bg-[#10243A]/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-warning-orange" /> Temperature
                  </span>
                  <span className="font-mono font-bold text-white">
                    {liveWeather?.temperature_c ? `${liveWeather.temperature_c}°C` : `${selectedDistrict.temp_c}°C`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-red-400" /> Feels Like
                  </span>
                  <span className="font-mono font-bold text-white">
                    {liveWeather?.apparent_temp_c ? `${liveWeather.apparent_temp_c}°C` : `${(selectedDistrict.temp_c + 2.1).toFixed(1)}°C`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-primary-cyan" /> Rainfall
                  </span>
                  <span className="font-mono font-bold text-white">
                    {liveWeather?.precipitation_mm !== undefined ? `${liveWeather.precipitation_mm} mm` : '1.8 mm'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-primary-cyan" /> Humidity
                  </span>
                  <span className="font-mono font-bold text-white">
                    {liveWeather?.relative_humidity_pct ? `${liveWeather.relative_humidity_pct}%` : '72%'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-emerald-green" /> Wind Speed
                  </span>
                  <span className="font-mono font-bold text-white">
                    {liveWeather?.wind_speed_kmh ? `${liveWeather.wind_speed_kmh} km/h` : '14 km/h'}
                  </span>
                </div>
              </div>

              {/* Climate Baseline & Risk Statistics */}
              <div className="bg-[#10243A]/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Avg Temp (1991–2020)</span>
                  <span className="font-mono text-warning-orange font-semibold">{selectedDistrict.temp_c}°C</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Avg Annual Rainfall</span>
                  <span className="font-mono text-primary-cyan font-semibold">{selectedDistrict.rainfall_mm} mm</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Drought Index</span>
                  <span className="font-mono text-slate-200 font-semibold">{selectedDistrict.drought_index}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-slate-400">Heat Risk Profile</span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                    {selectedDistrict.heat_risk}
                  </span>
                </div>
              </div>

              {/* Detailed Report Action Button */}
              <button
                onClick={() => navigate(`/intelligence?district=${selectedDistrict.id}`)}
                className="w-full mt-auto py-3 px-4 rounded-xl bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-grotesk font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#20C5FF]/30 active:scale-95 hover:shadow-[0_0_20px_rgba(32,197,255,0.4)] transition cursor-pointer"
              >
                <span>View Detailed Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MapPin className="w-8 h-8 text-primary-cyan mb-2 opacity-50" />
              <p className="text-xs">Click any district on the map or select from the list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
