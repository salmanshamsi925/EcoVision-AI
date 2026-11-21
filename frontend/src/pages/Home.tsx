import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Globe, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  Waves, 
  Droplets,
  X,
  Compass
} from 'lucide-react';
import { EarthGlobe } from '../scenes/EarthGlobe';
import type { LocationTarget } from '../scenes/EarthGlobe';
import { ambientAudio } from '../services/ambientAudio';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';

export interface LocationDetail extends LocationTarget {
  category: string;
  heat_risk: string;
  flood_exposure: string;
  drought_indicator: string;
  temp_anomaly: string;
  summary: string;
}

// Fallback locations in case backend is offline
const fallbackLocations: LocationDetail[] = [
  {
    id: "larkana",
    name: "Larkana",
    province: "Sindh",
    latitude: 27.5590,
    longitude: 68.2120,
    category: "Sindh Priority",
    heat_risk: "Extreme (Surpassing 50°C in May-June)",
    flood_exposure: "Very High (Right Bank Outfall Drainage Zone)",
    drought_indicator: "Moderate",
    temp_anomaly: "+2.8°C above historical baseline",
    summary: "Historical Indus riverine floodplain with acute summer heat peaks and heavy monsoon inundation risk."
  },
  {
    id: "khairpur",
    name: "Khairpur",
    province: "Sindh",
    latitude: 27.5295,
    longitude: 68.7592,
    category: "Sindh Priority",
    heat_risk: "Very High",
    flood_exposure: "High (Canal breached zone)",
    drought_indicator: "Moderate to Severe",
    temp_anomaly: "+2.4°C above baseline",
    summary: "Major date-palm and wheat hub vulnerable to compound heat and pre-monsoon moisture stress."
  },
  {
    id: "sukkur",
    name: "Sukkur",
    province: "Sindh",
    latitude: 27.7052,
    longitude: 68.8574,
    category: "Sindh Priority",
    heat_risk: "Very High",
    flood_exposure: "Critical (Sukkur Barrage Discharge Gateway)",
    drought_indicator: "Low to Moderate",
    temp_anomaly: "+2.3°C above baseline",
    summary: "Indus Barrage apex controlling water distribution across millions of agricultural hectares in Sindh."
  },
  {
    id: "karachi",
    name: "Karachi",
    province: "Sindh",
    latitude: 24.8607,
    longitude: 67.0011,
    category: "Sindh Priority",
    heat_risk: "High (Severe Urban Heat Island effect & Maritime Humidity)",
    flood_exposure: "Very High (Urban Flash Pluvial Flooding & Coastal Sea Level)",
    drought_indicator: "Low",
    temp_anomaly: "+2.1°C above baseline",
    summary: "Megacity coastal ecosystem challenged by dense asphalt heat retention and storm surge drainage stress."
  },
  {
    id: "tharparkar",
    name: "Tharparkar",
    province: "Sindh",
    latitude: 24.7436,
    longitude: 69.7997,
    category: "Sindh Priority",
    heat_risk: "Very High",
    flood_exposure: "Low",
    drought_indicator: "Extreme (Persistent Groundwater Drought)",
    temp_anomaly: "+2.6°C above baseline",
    summary: "Arid desert ecosystem facing recurrent groundwater depletion, livestock fodder stress, and heat anomalies."
  },
  {
    id: "dadu",
    name: "Dadu",
    province: "Sindh",
    latitude: 26.7341,
    longitude: 67.7795,
    category: "Sindh Priority",
    heat_risk: "Extreme (49°C peaks)",
    flood_exposure: "Critical (Manchar Lake & Kirthar hill-torrent floods)",
    drought_indicator: "High",
    temp_anomaly: "+2.9°C above baseline",
    summary: "Ground zero for compound disasters: extreme Kirthar range flash torrents followed by punishing heatwaves."
  },
  {
    id: "islamabad",
    name: "Islamabad",
    province: "Federal",
    latitude: 33.6844,
    longitude: 73.0479,
    category: "Federal Capital",
    heat_risk: "Moderate",
    flood_exposure: "Moderate (Margalla catchment flash urban drainage)",
    drought_indicator: "Low",
    temp_anomaly: "+1.6°C above baseline",
    summary: "Sub-Himalayan plateau with shifting winter rainfall timing and cloudburst hazards."
  },
  {
    id: "gilgit",
    name: "Gilgit",
    province: "Gilgit-Baltistan",
    latitude: 35.9221,
    longitude: 74.3087,
    category: "Glacial & Mountain Hub",
    heat_risk: "Low (Direct) / Critical (Glacial Melt)",
    flood_exposure: "Extreme (GLOF & Landslide Dam Breaches)",
    drought_indicator: "Low",
    temp_anomaly: "+2.8°C (Amplified High-Altitude Warming)",
    summary: "Karakoram junction monitoring accelerated cryosphere melt, expanding supraglacial lakes, and GLOF alerts."
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveLocationId } = useActiveLocation();

  // State
  const [locations, setLocations] = useState<LocationDetail[]>(fallbackLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationDetail | null>(null);
  const [flyToTrigger, setFlyToTrigger] = useState(0);

  // Experience Controls
  const [audioActive, setAudioActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fullScreenGlobe, setFullScreenGlobe] = useState(false);
  const [isEnteringExperience, setIsEnteringExperience] = useState(false);

  // Fetch verified locations from FastAPI backend
  useEffect(() => {
    fetch(`${API_BASE}/api/locations`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLocations(data);
        }
      })
      .catch(() => {
        // graceful offline fallback is already loaded
      });
  }, []);

  // Filtered search list
  const filteredLocations = searchQuery.trim()
    ? locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectCity = (loc: LocationDetail) => {
    setSelectedLocation(loc);
    setSearchQuery(loc.name);
    setSearchFocused(false);
    setActiveLocationId(loc.id);
    setFlyToTrigger((prev) => prev + 1);
  };

  const handleAudioToggle = () => {
    const active = ambientAudio.toggle();
    setAudioActive(active);
  };

  const handleEnterExperience = () => {
    setIsEnteringExperience(true);
    setSelectedLocation({
      id: 'pakistan',
      name: 'Pakistan',
      province: 'Sindh Region',
      latitude: 28.5,
      longitude: 69.0,
      category: 'National Geographic Center',
      heat_risk: 'High',
      flood_exposure: 'High',
      drought_indicator: 'Moderate',
      temp_anomaly: '+1.82°C',
      summary: 'Central Indus River Basin & Sindh agricultural delta.'
    });
    setFlyToTrigger((prev) => prev + 1);

    // Google Earth cinematic rotation spins globe to Pakistan for 1.2s, then opens GIS map
    setTimeout(() => {
      navigate('/pakistan');
    }, 1200);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#07111F]">
      {/* 1. INTERACTIVE 3D EARTH CANVAS (Background Layer) */}
      <div className="absolute inset-0 z-0">
        <EarthGlobe
          selectedLocation={selectedLocation}
          flyToTrigger={flyToTrigger}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 2. FLOATING TOP HUD: Google Earth-Style City Search Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-auto">
        <div className="relative">
          <div className="hud-card rounded-2xl flex items-center px-4 py-2.5 border border-eco-blue/30 backdrop-blur-xl shadow-2xl transition-all focus-within:border-eco-blue focus-within:shadow-neon-blue">
            <Search className="w-5 h-5 text-eco-blue shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search any city or district in Pakistan (e.g. Khairpur, Karachi, Sukkur, Larkana, Tharparkar...)"
              className="w-full bg-transparent text-sm text-white placeholder-eco-muted/70 focus:outline-none font-inter"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation(null);
                }}
                className="p-1 hover:text-white text-eco-muted transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchFocused && filteredLocations.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#07111F]/95 border border-eco-blue/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl max-h-72 overflow-y-auto z-40">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectCity(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-eco-blue/15 border-b border-white/5 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-eco-green group-hover:text-eco-blue transition" />
                    <div>
                      <span className="font-grotesk font-semibold text-sm text-white block">
                        {loc.name}
                      </span>
                      <span className="text-[11px] text-eco-muted">
                        {loc.province} • {loc.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-eco-orange block">
                      {loc.temp_anomaly}
                    </span>
                    <span className="text-[10px] text-eco-muted">
                      {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick-Select City Chips */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-grotesk font-medium text-eco-muted whitespace-nowrap mr-1">
              Quick Fly-To:
            </span>
            {['Khairpur', 'Karachi', 'Sukkur', 'Larkana', 'Tharparkar', 'Dadu', 'Islamabad', 'Gilgit'].map((cityName) => (
              <button
                key={cityName}
                onClick={() => {
                  const target = locations.find((l) => l.name.toLowerCase() === cityName.toLowerCase());
                  if (target) handleSelectCity(target);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-grotesk font-medium transition whitespace-nowrap border ${
                  selectedLocation?.name.toLowerCase() === cityName.toLowerCase()
                    ? 'bg-eco-blue text-eco-bg border-eco-blue font-bold shadow-neon-blue'
                    : 'bg-eco-surface/80 border-white/10 text-eco-muted hover:text-white hover:border-eco-blue/40'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CINEMATIC HERO & ACTION BUTTONS (Glassmorphic High-Contrast Card for Mobile & Desktop) */}
      {!fullScreenGlobe && !selectedLocation && (
        <>
          <div className="absolute left-4 right-4 sm:left-6 md:left-12 sm:right-auto top-28 z-20 max-w-xl pointer-events-auto">
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#07111F]/85 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3.5">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-blue/15 border border-eco-blue/35">
                <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
                <span className="font-grotesk text-[11px] tracking-wider text-eco-blue uppercase font-bold">
                  Pakistan Climate Command • Live
                </span>
              </div>

              {/* High-Contrast Hero Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-orbitron font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                THE FUTURE IS IN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-blue via-eco-green to-cyan-300">
                  YOUR HANDS
                </span>
              </h1>

              {/* Crisp, Highly Readable Subtitle */}
              <p className="text-xs sm:text-sm text-slate-200 font-inter leading-relaxed max-w-lg">
                One Planet. Two Possible Futures. One Choice. Explore realistic near-term climate projection timelines for Pakistan &amp; Sindh.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleEnterExperience}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-eco-blue to-cyan-500 text-eco-bg font-grotesk font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-neon-blue hover:opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Globe className={`w-4 h-4 ${isEnteringExperience ? 'animate-spin' : ''}`} />
                  <span>{isEnteringExperience ? 'ROTATING TO PAKISTAN...' : 'ENTER THE EXPERIENCE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/pakistan')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-white font-grotesk font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:border-eco-blue transition backdrop-blur-md cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-eco-green" />
                  <span>Explore Sindh &amp; Pakistan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right-Side Floating Planetary Telemetry Card (Desktop Composition Balance) */}
          <div className="hidden xl:flex flex-col gap-3 absolute top-28 right-8 z-20 w-80 pointer-events-auto">
            <div className="hud-card p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl space-y-3" style={{ background: 'rgba(7,17,31,0.85)' }}>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-orbitron font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-eco-green" /> Planetary Telemetry
                </span>
                <span className="text-[10px] font-mono text-eco-blue bg-eco-blue/10 px-2 py-0.5 rounded border border-eco-blue/30">
                  REAL-TIME SATELLITE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-eco-muted font-grotesk">Global Atmospheric CO₂</span>
                  <span className="font-mono text-eco-orange font-bold">424.8 ppm</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-eco-muted font-grotesk">Pakistan Mean Anomaly</span>
                  <span className="font-mono text-red-400 font-bold">+1.82°C</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-eco-muted font-grotesk">Indus Basin Stress Level</span>
                  <span className="font-mono text-amber-400 font-bold">High Inflow Risk</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-eco-muted">
                <span>Model: CMIP6 AR6</span>
                <span className="text-eco-green">&bull; 100% Keyless</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. FLOATING HUD TELEMETRY CARD: Selected City Snapshot */}
      {selectedLocation && !fullScreenGlobe && (
        <div className="absolute right-6 top-24 bottom-12 z-30 w-full max-w-sm pointer-events-auto animate-in fade-in slide-in-from-right duration-300">
          <div className="h-full hud-card rounded-2xl p-5 border border-eco-blue/40 flex flex-col justify-between backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-eco-blue/20 text-eco-blue border border-eco-blue/30 uppercase">
                  {selectedLocation.category}
                </span>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-eco-muted hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Coordinates */}
              <div className="mt-4">
                <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-eco-green" />
                  {selectedLocation.name}
                </h2>
                <span className="text-xs text-eco-muted font-grotesk block mt-0.5">
                  {selectedLocation.province}, Pakistan
                </span>
                <span className="text-[11px] font-mono text-eco-blue/90 block mt-1">
                  Coords: {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E
                </span>
              </div>

              {/* Metric Highlights */}
              <div className="space-y-3 mt-5">
                <div className="p-3 rounded-xl bg-eco-bg/70 border border-white/5">
                  <div className="flex items-center justify-between text-xs font-grotesk text-eco-muted mb-1">
                    <span className="flex items-center gap-1.5 text-eco-orange">
                      <Flame className="w-3.5 h-3.5" /> Peak Heat Risk
                    </span>
                    <span className="font-mono text-white text-[10px]">MAY–JULY</span>
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {selectedLocation.heat_risk}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-eco-bg/70 border border-white/5">
                  <div className="flex items-center justify-between text-xs font-grotesk text-eco-muted mb-1">
                    <span className="flex items-center gap-1.5 text-eco-blue">
                      <Waves className="w-3.5 h-3.5" /> Flood Hazard Exposure
                    </span>
                    <span className="font-mono text-white text-[10px]">MONSOON</span>
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {selectedLocation.flood_exposure}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-eco-bg/70 border border-white/5">
                  <div className="flex items-center justify-between text-xs font-grotesk text-eco-muted mb-1">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Droplets className="w-3.5 h-3.5" /> Drought Indicator
                    </span>
                    <span className="font-mono text-eco-orange text-[10px]">{selectedLocation.temp_anomaly}</span>
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {selectedLocation.drought_indicator}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-eco-bg/40 border border-white/5">
                  <span className="text-[10px] font-grotesk uppercase text-eco-muted block mb-1">Regional Context</span>
                  <p className="text-[11px] text-eco-muted/90 leading-relaxed font-inter">
                    {selectedLocation.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => navigate(`/pakistan?district=${selectedLocation.id}`)}
                className="w-full py-2.5 rounded-xl bg-eco-blue text-eco-bg font-grotesk font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-neon-blue"
              >
                <Compass className="w-4 h-4" /> Open in Sindh Map
              </button>
              <button
                onClick={() => navigate(`/change?district=${selectedLocation.id}`)}
                className="w-full py-2.5 rounded-xl bg-eco-surface border border-eco-green/40 text-eco-green font-grotesk font-semibold text-xs flex items-center justify-center gap-2 hover:bg-eco-green/10 transition"
              >
                <Sparkles className="w-4 h-4" /> Open Policy Lab &amp; Solutions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING BOTTOM-RIGHT CONTROLS: Sound, Reduced Motion, Full-Screen Globe */}
      <div className="absolute right-6 bottom-6 z-30 flex items-center gap-2.5 pointer-events-auto">
        {/* Ambient Sound Synthesizer */}
        <button
          onClick={handleAudioToggle}
          title={audioActive ? 'Mute Ambient Space Hum' : 'Play Ambient Space Hum'}
          className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
            audioActive
              ? 'bg-eco-blue/20 border-eco-blue text-eco-blue shadow-neon-blue'
              : 'bg-eco-surface/80 border-white/10 text-eco-muted hover:text-white'
          }`}
        >
          {audioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Reduced Motion / Low-Spec Mode */}
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          title={reducedMotion ? 'Enable Full Quality & Particle Shaders' : 'Enable Reduced Motion / Low-Spec Mode'}
          className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
            reducedMotion
              ? 'bg-eco-orange/20 border-eco-orange text-eco-orange'
              : 'bg-eco-surface/80 border-white/10 text-eco-muted hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Full-Screen Globe Viewport (Google Earth style inspection) */}
        <button
          onClick={() => setFullScreenGlobe(!fullScreenGlobe)}
          title={fullScreenGlobe ? 'Restore Command Overlays' : 'Full-Screen Globe Mode (Hide UI)'}
          className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
            fullScreenGlobe
              ? 'bg-eco-green/20 border-eco-green text-eco-green shadow-neon-green'
              : 'bg-eco-surface/80 border-white/10 text-eco-muted hover:text-white'
          }`}
        >
          {fullScreenGlobe ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Instruction pill when in full-screen globe mode */}
      {fullScreenGlobe && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-eco-surface/90 border border-eco-blue/40 backdrop-blur-md text-xs font-mono text-eco-blue pointer-events-auto flex items-center gap-2">
          <span>Click & drag to rotate globe • Scroll to zoom</span>
          <button
            onClick={() => setFullScreenGlobe(false)}
            className="text-white hover:text-eco-green font-bold ml-2 underline"
          >
            Show HUD
          </button>
        </div>
      )}
    </div>
  );
};
