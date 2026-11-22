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
  const [liveWeather, setLiveWeather] = useState<{
    temperature_c?: number;
    feels_like_c?: number;
    humidity_percent?: number;
    precipitation_mm?: number;
    condition_summary?: string;
  } | null>(null);

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

  // Fetch live weather telemetry for the active/selected city
  useEffect(() => {
    const targetId = selectedLocation?.id || 'khairpur';
    fetch(`${API_BASE}/api/climate/live?district=${targetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.temperature_c !== undefined) {
          setLiveWeather(data);
        }
      })
      .catch(() => {
        setLiveWeather(null);
      });
  }, [selectedLocation?.id]);

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
    <div
      id="home-container"
      className="relative w-full max-w-full h-[calc(100dvh-56px)] sm:h-[calc(100dvh-64px)] overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-[#07111F] select-none"
    >
      {/* 1. FIXED 3D EARTH CANVAS (Pinned in the background, scaled & positioned on the right) */}
      <div className="fixed inset-0 top-14 sm:top-16 z-0 pointer-events-auto max-w-full overflow-hidden">
        <EarthGlobe
          selectedLocation={selectedLocation}
          flyToTrigger={flyToTrigger}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 2. COCKPIT INTERFACE (Desktop: Left 50% column | Mobile: Clear Upper Earth View + Sleek Bottom Hero matching Tile 6) */}
      {!fullScreenGlobe && (
        <div className="relative z-20 w-full max-w-full lg:w-1/2 min-h-full flex flex-col justify-end lg:justify-between p-3 sm:p-6 lg:p-8 lg:pl-12 pointer-events-none pb-3 lg:pb-8 box-border min-w-0 overflow-x-hidden">
          
          {/* Top: Google Earth-Style City Search Bar & Quick Chips (Desktop only to keep mobile 100% clean & focused on 3D Earth) */}
          <div className="hidden lg:block w-full max-w-lg pointer-events-auto">
            <div className="hud-card rounded-2xl flex items-center px-4 py-2.5 border border-[#20C5FF]/30 backdrop-blur-xl shadow-2xl transition-all focus-within:border-[#20C5FF] focus-within:shadow-neon-blue">
              <Search className="w-4 h-4 text-[#20C5FF] shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search location... (e.g. Khairpur, Karachi, Sukkur)"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-eco-muted/70 focus:outline-none font-inter"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation(null);
                  }}
                  className="p-1 hover:text-white text-eco-muted transition"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const first = filteredLocations[0] || locations[0];
                    if (first) handleSelectCity(first);
                  }}
                  className="w-6 h-6 rounded-lg bg-[#20C5FF]/20 hover:bg-[#20C5FF] text-[#20C5FF] hover:text-[#06111F] flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchFocused && filteredLocations.length > 0 && (
              <div className="absolute top-14 left-3 sm:left-6 lg:left-12 right-3 sm:right-auto sm:w-[480px] bg-[#0B1B2D]/98 border border-[#20C5FF]/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl max-h-60 overflow-y-auto z-40">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectCity(loc)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#20C5FF]/15 border-b border-white/5 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#22D3A0] group-hover:text-[#20C5FF] transition" />
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
                      <span className="text-[11px] font-mono text-[#FFAA45] block">
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

            {/* Quick-Select City Chips (Hidden on small mobile screens to prevent clutter) */}
            <div className="hidden sm:flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-none">
              {['Khairpur', 'Karachi', 'Sukkur', 'Larkana', 'Islamabad'].map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => {
                    const target = locations.find((l) => l.name.toLowerCase() === cityName.toLowerCase());
                    if (target) handleSelectCity(target);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-grotesk font-medium transition whitespace-nowrap border ${
                    selectedLocation?.name.toLowerCase() === cityName.toLowerCase()
                      ? 'bg-[#20C5FF] text-[#06111F] border-[#20C5FF] font-bold shadow-md shadow-[#20C5FF]/30'
                      : 'bg-[#10243A]/80 border-white/10 text-eco-muted hover:text-white hover:border-[#20C5FF]/40'
                  }`}
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Hero Briefing & Action CTAs (Pinned cleanly to bottom on mobile, matching Tile 6) */}
          <div className="w-full max-w-full lg:max-w-lg pointer-events-auto space-y-2.5 sm:space-y-4 min-w-0">
            {/* Small Label Pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#10243A]/90 border border-[#20C5FF]/30 backdrop-blur-md shadow-lg max-w-full">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22D3A0] animate-pulse shrink-0" />
              <span className="font-grotesk text-[9px] sm:text-[10.5px] tracking-wider text-[#20C5FF] uppercase font-bold truncate">
                Pakistan Climate Command &bull; Live Intelligence
              </span>
            </div>

            {/* Headline with Cyan to Emerald Gradient */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-orbitron font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] break-words">
              THE FUTURE IS IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20C5FF] via-[#22D3A0] to-[#22D3A0]">
                YOUR HANDS
              </span>
            </h1>

            {/* Subtitle (Hidden on small mobile screens to keep view 100% clean and fit-screen) */}
            <p className="hidden sm:block text-xs sm:text-sm text-slate-200 font-inter leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-md">
              Smart Climate Intelligence for Pakistan &amp; Sindh Powered by AI, GIS and Real-Time Data. Explore verified near-term climate projection timelines.
            </p>

            {/* Action Buttons matching Tile 1 & Tile 6 */}
            <div className="flex items-center gap-2 w-full max-w-full">
              <button
                onClick={handleEnterExperience}
                className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#22D3A0] to-[#20C5FF] text-[#06111F] font-grotesk font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#22D3A0]/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer min-w-0"
              >
                <Globe className={`w-3.5 h-3.5 ${isEnteringExperience ? 'animate-spin' : ''} shrink-0`} />
                <span className="truncate">{isEnteringExperience ? 'Rotating...' : 'Enter Experience'}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => navigate('/pakistan')}
                className="px-4 py-2.5 rounded-full bg-[#10243A]/90 border border-[#20C5FF]/40 text-[#20C5FF] font-grotesk font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#20C5FF]/10 transition backdrop-blur-md cursor-pointer shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-[#22D3A0]" />
                <span>Map</span>
              </button>
            </div>

            {/* Floating Metric Strip (Grid-based 5 items, 100% fitted without horizontal scroll) */}
            <div className="w-full max-w-full pointer-events-auto min-w-0">
              <div className="hud-card px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl grid grid-cols-5 items-center justify-between text-xs border border-white/10 shadow-2xl w-full max-w-full gap-1 text-center">
                <div className="flex flex-col items-center justify-center min-w-0">
                  <span className="text-[11px] leading-none mb-0.5">🌡️</span>
                  <span className="font-orbitron font-bold text-white text-[9.5px] xs:text-[11px] truncate w-full">
                    {liveWeather?.temperature_c !== undefined ? `${liveWeather.temperature_c}°C` : '28.7°C'}
                  </span>
                  <span className="text-[7.5px] xs:text-[9px] text-eco-muted font-grotesk truncate w-full">Temp</span>
                </div>

                <div className="flex flex-col items-center justify-center min-w-0">
                  <span className="text-[11px] leading-none mb-0.5">🌧️</span>
                  <span className="font-orbitron font-bold text-white text-[9.5px] xs:text-[11px] truncate w-full">
                    {liveWeather?.precipitation_mm !== undefined ? `${liveWeather.precipitation_mm}mm` : '0 mm'}
                  </span>
                  <span className="text-[7.5px] xs:text-[9px] text-eco-muted font-grotesk truncate w-full">Rain</span>
                </div>

                <div className="flex flex-col items-center justify-center min-w-0">
                  <span className="text-[11px] leading-none mb-0.5">💧</span>
                  <span className="font-orbitron font-bold text-white text-[9.5px] xs:text-[11px] truncate w-full">
                    {liveWeather?.humidity_percent !== undefined ? `${liveWeather.humidity_percent}%` : '36%'}
                  </span>
                  <span className="text-[7.5px] xs:text-[9px] text-eco-muted font-grotesk truncate w-full">Humidity</span>
                </div>

                <div className="flex flex-col items-center justify-center min-w-0">
                  <span className="text-[11px] leading-none mb-0.5">🍃</span>
                  <span className="font-orbitron font-bold text-[#22D3A0] text-[9.5px] xs:text-[11px] truncate w-full">AQI 42</span>
                  <span className="text-[7.5px] xs:text-[9px] text-eco-muted font-grotesk truncate w-full">Good</span>
                </div>

                <div className="flex flex-col items-center justify-center min-w-0">
                  <span className="text-[11px] leading-none mb-0.5">🛡️</span>
                  <span className="font-orbitron font-bold text-[#FFAA45] text-[9.5px] xs:text-[11px] truncate w-full">
                    {selectedLocation?.heat_risk ? selectedLocation.heat_risk.split(' ')[0] : 'Low'}
                  </span>
                  <span className="text-[7.5px] xs:text-[9px] text-eco-muted font-grotesk truncate w-full">Risk</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. FLOATING BOTTOM-RIGHT CONTROLS: Sound, Reduced Motion, Full-Screen Globe (Desktop only) */}
      <div className="hidden lg:flex absolute right-6 bottom-6 z-30 items-center gap-2.5 pointer-events-auto">
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-[#07111F]/90 border border-eco-green/50 backdrop-blur-md text-xs font-mono text-eco-green pointer-events-auto flex items-center gap-3 shadow-2xl">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
            3D Earth Free-Fly Active
          </span>
          <button
            onClick={() => setFullScreenGlobe(false)}
            className="text-white hover:text-eco-blue font-bold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer flex items-center gap-1"
          >
            <span>✕ Show Text &amp; Menu</span>
          </button>
        </div>
      )}
    </div>
  );
};
