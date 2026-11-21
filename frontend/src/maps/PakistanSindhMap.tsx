import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface PakistanSindhMapProps {
  initialDistrict?: string | null;
  onDistrictSelect?: (district: DistrictData | null) => void;
}

type OverlayType = 'none' | 'heat' | 'flood' | 'drought';
type ViewMode = 'pakistan' | 'sindh';

// ─── District Climate Database ────────────────────────────────────────────────

const DISTRICT_DATA: Record<string, DistrictData> = {
  karachi: {
    id: 'karachi', name: 'Karachi', province: 'Sindh',
    lat: 24.8607, lon: 67.0011,
    temp_c: 26.8, rainfall_mm: 197,
    drought_index: 'Moderate', flood_exposure: 'High (Urban Flash & Coastal Surge)',
    heat_risk: 'Extreme', challenges: ['Urban heat islands', 'Coastal cyclone vulnerability', 'Water scarcity', 'Poor drainage infrastructure'],
    source: 'NASA POWER / PMD Karachi Observatory', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  larkana: {
    id: 'larkana', name: 'Larkana', province: 'Sindh',
    lat: 27.5590, lon: 68.2120,
    temp_c: 28.4, rainfall_mm: 88,
    drought_index: 'High', flood_exposure: 'High (Indus Riverine & Monsoon Flash)',
    heat_risk: 'Extreme', challenges: ['Heatwave frequency 48°C+', 'Indus flood plain risk', 'Agricultural stress', 'Groundwater depletion'],
    source: 'NASA POWER / PMD Sindh', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  khairpur: {
    id: 'khairpur', name: 'Khairpur', province: 'Sindh',
    lat: 27.5295, lon: 68.7590,
    temp_c: 28.1, rainfall_mm: 92,
    drought_index: 'High', flood_exposure: 'Extreme (Indus left bank breaches)',
    heat_risk: 'Very High', challenges: ['Indus flooding 2022 severely affected', 'Date palm agriculture water stress', 'Salinity intrusion', 'Livestock losses'],
    source: 'NASA POWER / World Bank GFDRR', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  sukkur: {
    id: 'sukkur', name: 'Sukkur', province: 'Sindh',
    lat: 27.7052, lon: 68.8570,
    temp_c: 28.7, rainfall_mm: 85,
    drought_index: 'High', flood_exposure: 'Extreme (Sukkur Barrage overflow zone)',
    heat_risk: 'Extreme', challenges: ['Record 53°C temps (2010)', 'Barrage-dependent agriculture', 'Water logging & salinity', 'Desert encroachment'],
    source: 'NASA POWER / PMD Sindh', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  hyderabad: {
    id: 'hyderabad', name: 'Hyderabad', province: 'Sindh',
    lat: 25.3960, lon: 68.3578,
    temp_c: 27.5, rainfall_mm: 156,
    drought_index: 'Moderate to High', flood_exposure: 'High (Indus right bank & urban drainage)',
    heat_risk: 'Very High', challenges: ['Industrial pollution', 'Indus water dependency', 'Urban sprawl & flooding', 'Deforestation in Kohistan'],
    source: 'NASA POWER / PMD Hyderabad', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  tharparkar: {
    id: 'tharparkar', name: 'Tharparkar', province: 'Sindh',
    lat: 25.0000, lon: 69.7500,
    temp_c: 27.2, rainfall_mm: 148,
    drought_index: 'Critical', flood_exposure: 'Low (Desert terrain, episodic flash)',
    heat_risk: 'Very High', challenges: ['Chronic desert drought', 'Child malnutrition crisis', 'Groundwater scarcity 600m+ depth', 'Livestock fodder failure'],
    source: 'NASA POWER / NDMA Pakistan', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  badin: {
    id: 'badin', name: 'Badin', province: 'Sindh',
    lat: 24.6567, lon: 68.8373,
    temp_c: 26.9, rainfall_mm: 225,
    drought_index: 'Low to Moderate', flood_exposure: 'Extreme (Coastal & Cyclone Delta)',
    heat_risk: 'High', challenges: ['Cyclone Biparjoy impact 2023', 'Sea water intrusion in farmland', 'Drainage failure', 'Shrimp & rice crop damage'],
    source: 'NASA POWER / NDMA Pakistan', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  thatta: {
    id: 'thatta', name: 'Thatta', province: 'Sindh',
    lat: 24.7461, lon: 67.9224,
    temp_c: 26.5, rainfall_mm: 183,
    drought_index: 'Moderate', flood_exposure: 'Extreme (Indus Delta & Coastal)',
    heat_risk: 'High', challenges: ['Indus delta shrinkage', 'Mangrove deforestation', 'Freshwater–saltwater interface shift', 'Fishing community displacement'],
    source: 'NASA POWER / IUCN Pakistan', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  mirpurkhas: {
    id: 'mirpurkhas', name: 'Mirpur Khas', province: 'Sindh',
    lat: 25.5270, lon: 69.0167,
    temp_c: 27.0, rainfall_mm: 135,
    drought_index: 'High', flood_exposure: 'High (Nara Canal overflow)',
    heat_risk: 'Very High', challenges: ['Mango orchard heat stress', 'Nara canal salinity', 'Poverty-climate nexus', 'Reduced cotton yields'],
    source: 'NASA POWER / PMD Sindh', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  dadu: {
    id: 'dadu', name: 'Dadu', province: 'Sindh',
    lat: 26.7319, lon: 67.7764,
    temp_c: 27.9, rainfall_mm: 78,
    drought_index: 'Very High', flood_exposure: 'High (Hill torrent & Indus right bank)',
    heat_risk: 'Very High', challenges: ['Hill torrent devastation', 'Water scarcity 2022 floods paradox', 'Kirthar hills erosion', 'Livestock mortality'],
    source: 'NASA POWER / World Bank', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  shaheedbenazirababad: {
    id: 'shaheedbenazirababad', name: 'Shaheed Benazirabad', province: 'Sindh',
    lat: 26.2442, lon: 68.3880,
    temp_c: 27.8, rainfall_mm: 95,
    drought_index: 'High', flood_exposure: 'High (Indus right bank & internal drainage)',
    heat_risk: 'Very High', challenges: ['Cotton crop failure due to heat', 'Indus barrage water allocation disputes', 'Rural-urban migration', 'Pest outbreaks'],
    source: 'NASA POWER / PMD Sindh', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  jacobabad: {
    id: 'jacobabad', name: 'Jacobabad', province: 'Sindh',
    lat: 28.2769, lon: 68.4514,
    temp_c: 29.8, rainfall_mm: 72,
    drought_index: 'Very High', flood_exposure: 'High (Balochistan hill torrents)',
    heat_risk: 'Extreme – Globally Hottest',
    challenges: ['Hottest city on Earth 53.5°C (2021)', 'Wet bulb temperature threshold crossed', 'Outdoor labor impossible in summer', 'Mass seasonal migration'],
    source: 'NASA POWER / Nature Climate Change (Pal & Eltahir 2016)', period: '1991–2021', resolution: '0.5° (~55 km)'
  },
  sanghar: {
    id: 'sanghar', name: 'Sanghar', province: 'Sindh',
    lat: 26.0478, lon: 68.9505,
    temp_c: 27.3, rainfall_mm: 115,
    drought_index: 'High', flood_exposure: 'Moderate (Internal drainage challenges)',
    heat_risk: 'Very High', challenges: ['Wheat & cotton stress', 'Saline groundwater', 'Irrigation system deterioration', 'Rural poverty'],
    source: 'NASA POWER / PMD Sindh', period: '1991–2020', resolution: '0.5° (~55 km)'
  },
  jamshoro: {
    id: 'jamshoro', name: 'Jamshoro', province: 'Sindh',
    lat: 25.4344, lon: 68.2774,
    temp_c: 27.6, rainfall_mm: 142,
    drought_index: 'Moderate', flood_exposure: 'High (Indus riverine)',
    heat_risk: 'Very High', challenges: ['Thar coal power environmental impact', 'Indus river bank erosion', 'Industrial pollution nexus', 'Limestone mining land degradation'],
    source: 'NASA POWER / PMD Sindh', period: '1991–2020', resolution: '0.5° (~55 km)'
  }
};

// ─── Overlay Colour Functions ──────────────────────────────────────────────

function getOverlayColor(feature: GeoJSON.Feature, overlay: OverlayType): string {
  const props = feature.properties || {};
  const districtId = (props.id || props.name || '').toLowerCase().replace(/\s+/g, '').replace('mirpurkhas', 'mirpurkhas').replace('shaheedbenazirabad', 'shaheedbenazirababad');
  const data = DISTRICT_DATA[districtId];

  if (overlay === 'none') return 'rgba(34,184,255,0.15)';

  if (overlay === 'heat') {
    const risk = data?.heat_risk || props.heat_risk || '';
    if (risk.includes('Extreme') || risk.includes('Globally')) return '#FF5555';
    if (risk.includes('Very High')) return '#FF9F43';
    if (risk.includes('High')) return '#FFD93D';
    return '#35D39A';
  }

  if (overlay === 'flood') {
    const flood = data?.flood_exposure || props.flood_exposure || '';
    if (flood.toLowerCase().includes('extreme')) return '#FF5555';
    if (flood.toLowerCase().includes('high')) return '#FF9F43';
    if (flood.toLowerCase().includes('moderate')) return '#FFD93D';
    return '#35D39A';
  }

  if (overlay === 'drought') {
    const drought = data?.drought_index || props.drought_index || '';
    if (drought.includes('Critical')) return '#FF5555';
    if (drought.includes('Very High')) return '#FF9F43';
    if (drought.includes('High')) return '#FFD93D';
    if (drought.includes('Moderate')) return '#A8B4C5';
    return '#35D39A';
  }

  if (overlay === 'rainfall') {
    const mm = data?.rainfall_mm || 150;
    if (mm < 80) return '#FF5555';
    if (mm < 120) return '#FF9F43';
    if (mm < 180) return '#FFD93D';
    if (mm < 250) return '#35D39A';
    return '#22B8FF';
  }

  return 'rgba(34,184,255,0.15)';
}

function getProvinceColor(name: string): string {
  const palette: Record<string, string> = {
    'Sindh': '#22B8FF',
    'Punjab': '#35D39A',
    'Balochistan': '#FF9F43',
    'Khyber Pakhtunkhwa': '#9B59B6',
    'Gilgit-Baltistan': '#1ABC9C',
    'Islamabad Capital Territory': '#E74C3C',
    'Azad Jammu & Kashmir': '#F39C12',
  };
  return palette[name] || '#A8B4C5';
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND_CONFIG: Record<OverlayType, { title: string; items: { color: string; label: string }[] }> = {
  none: { title: 'Provinces / Districts', items: [] },
  heat: {
    title: 'Heat Risk Level',
    items: [
      { color: '#FF5555', label: 'Extreme / Globally Critical' },
      { color: '#FF9F43', label: 'Very High' },
      { color: '#FFD93D', label: 'High' },
      { color: '#35D39A', label: 'Moderate / Low' },
    ]
  },
  flood: {
    title: 'Flood Exposure',
    items: [
      { color: '#FF5555', label: 'Extreme' },
      { color: '#FF9F43', label: 'High' },
      { color: '#FFD93D', label: 'Moderate' },
      { color: '#35D39A', label: 'Low' },
    ]
  },
  drought: {
    title: 'Drought / Aridity Index',
    items: [
      { color: '#FF5555', label: 'Critical' },
      { color: '#FF9F43', label: 'Very High' },
      { color: '#FFD93D', label: 'High' },
      { color: '#A8B4C5', label: 'Moderate' },
      { color: '#35D39A', label: 'Low' },
    ]
  },
  rainfall: {
    title: 'Annual Rainfall (mm)',
    items: [
      { color: '#FF5555', label: '< 80 mm (Arid)' },
      { color: '#FF9F43', label: '80–120 mm (Semi-Arid)' },
      { color: '#FFD93D', label: '120–180 mm (Sub-Humid)' },
      { color: '#35D39A', label: '180–250 mm (Humid)' },
      { color: '#22B8FF', label: '> 250 mm (Wet)' },
    ]
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const PakistanSindhMap: React.FC<PakistanSindhMapProps> = ({
  initialDistrict,
  onDistrictSelect
}) => {
  const { setActiveLocationId } = useActiveLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const provinceLayers = useRef<L.GeoJSON | null>(null);
  const districtLayers = useRef<L.GeoJSON | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('pakistan');
  const [overlay, setOverlay] = useState<OverlayType>('none');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pakistanGeo, setPakistanGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [sindhGeo, setSindhGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const overlayRef = useRef<OverlayType>('none');
  overlayRef.current = overlay;

  // ── Fetch GeoJSON Data ──────────────────────────────────────────────────
  useEffect(() => {
    const BASE = API_BASE;
    Promise.all([
      fetch(`${BASE}/api/geography/pakistan`).then(r => r.json()),
      fetch(`${BASE}/api/geography/sindh`).then(r => r.json()),
    ])
      .then(([pak, sindh]) => {
        setPakistanGeo(pak);
        setSindhGeo(sindh);
        setLoading(false);
      })
      .catch(err => {
        console.error('GeoJSON fetch error:', err);
        setError('Could not load geographic data. Is the backend running on port 8000?');
        setLoading(false);
      });
  }, []);

  // ── Initialise Leaflet Map (100% KEYLESS OSM DARK / VECTOR GRID) ────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30.0, 69.5],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 12,
    });

    // 100% Free, Keyless, Zero-Watermark Dark Canvas Basemap (Esri ArcGIS Dark Gray)
    const darkTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Esri, © OpenStreetMap contributors',
        maxNativeZoom: 16,
        maxZoom: 18,
      }
    );
    darkTile.addTo(map);
    tileLayerRef.current = darkTile;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.control.attribution({ position: 'bottomleft', prefix: '' })
      .addAttribution('Data: NASA POWER / PMD / World Bank | © EcoVision-AI 2027')
      .addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Lookup district data helper ─────────────────────────────────────────
  const lookupDistrict = useCallback((feature: GeoJSON.Feature): DistrictData | null => {
    const props = feature.properties || {};
    const rawName = (props.name || props.district || '').toLowerCase();
    const normalized = rawName
      .replace(/\s+/g, '')
      .replace('shaheedbenazirabad', 'shaheedbenazirababad')
      .replace('mirpur khas', 'mirpurkhas')
      .replace('mirpurkhas', 'mirpurkhas');
    return DISTRICT_DATA[normalized] || DISTRICT_DATA[rawName] || null;
  }, []);

  // ── Style functions ─────────────────────────────────────────────────────
  const styleProvince = useCallback((feature?: GeoJSON.Feature) => {
    if (!feature) return {};
    const name = feature.properties?.name || '';
    return {
      fillColor: getProvinceColor(name),
      fillOpacity: 0.18,
      color: getProvinceColor(name),
      weight: 2,
      opacity: 0.9,
    };
  }, []);

  const styleDistrict = useCallback((feature?: GeoJSON.Feature) => {
    if (!feature) return {};
    const color = getOverlayColor(feature, overlayRef.current);
    const isDefault = overlayRef.current === 'none';
    return {
      fillColor: isDefault ? '#0ea5e9' : color,
      fillOpacity: isDefault ? 0.30 : 0.65,
      color: isDefault ? '#38bdf8' : color,
      weight: 2,
      opacity: 0.95,
    };
  }, []);

  // ── Place a glowing marker ──────────────────────────────────────────────
  const placeMarker = useCallback((lat: number, lon: number) => {
    if (!mapRef.current) return;
    if (markerRef.current) { markerRef.current.remove(); }
    markerRef.current = L.circleMarker([lat, lon], {
      radius: 10,
      fillColor: '#22B8FF',
      fillOpacity: 0.8,
      color: '#FFFFFF',
      weight: 2,
    }).addTo(mapRef.current);
  }, []);

  // ── Render province layer ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !pakistanGeo) return;
    if (provinceLayers.current) { provinceLayers.current.remove(); }

    const layer = L.geoJSON(pakistanGeo as GeoJSON.GeoJsonObject, {
      style: styleProvince,
      onEachFeature: (feature, lyr) => {
        const name = feature.properties?.name || 'Province';
        // Permanent high-contrast province label centered on region
        lyr.bindTooltip(
          `<span style="color:${getProvinceColor(name)};font-weight:800;font-size:12px;letter-spacing:0.06em">${name.toUpperCase()}</span>`,
          { permanent: true, direction: 'center', className: 'province-map-label' }
        );
        lyr.on('mouseover', function () {
          (this as L.Path).setStyle({ fillOpacity: 0.35, weight: 3 });
        });
        lyr.on('mouseout', function () {
          layer.resetStyle(this as L.Layer);
        });
        lyr.on('click', function () {
          const bounds = (lyr as L.Polygon).getBounds();
          mapRef.current?.flyToBounds(bounds, { padding: [30, 30], duration: 1.2 });
          if (name === 'Sindh') {
            setTimeout(() => {
              setViewMode('sindh');
            }, 600);
          }
        });
      }
    });

    if (viewMode === 'pakistan') {
      layer.addTo(mapRef.current);
    }
    provinceLayers.current = layer;
  }, [pakistanGeo, styleProvince, viewMode]);

  // ── Render district layer ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !sindhGeo) return;
    if (districtLayers.current) { districtLayers.current.remove(); }

    const layer = L.geoJSON(sindhGeo as GeoJSON.GeoJsonObject, {
      style: styleDistrict,
      onEachFeature: (feature, lyr) => {
        const distData = lookupDistrict(feature);
        const name = distData?.name || feature.properties?.name || 'District';
        // Permanent high-contrast district name label centered directly on map
        lyr.bindTooltip(
          `<span style="color:#22B8FF;font-weight:700;font-size:11px;letter-spacing:0.04em">${name}</span>`,
          { permanent: true, direction: 'center', className: 'district-map-label' }
        );
        lyr.on('mouseover', function () {
          (this as L.Path).setStyle({ fillOpacity: 0.75, weight: 2.5, color: '#FFFFFF' });
        });
        lyr.on('mouseout', function () {
          layer.resetStyle(this as L.Layer);
        });
        lyr.on('click', function () {
          const bounds = (lyr as L.Polygon).getBounds();
          mapRef.current?.flyToBounds(bounds, { padding: [60, 60], duration: 1.0 });
          if (distData) {
            placeMarker(distData.lat, distData.lon);
            setSelectedDistrict(distData);
            setActiveLocationId(distData.id);
            onDistrictSelect?.(distData);
          }
        });
      }
    });

    if (viewMode === 'sindh') {
      layer.addTo(mapRef.current);
    }
    districtLayers.current = layer;
  }, [sindhGeo, styleDistrict, viewMode, lookupDistrict, placeMarker, onDistrictSelect]);

  // ── Handle view mode switch ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    if (viewMode === 'pakistan') {
      districtLayers.current?.remove();
      if (pakistanGeo) provinceLayers.current?.addTo(mapRef.current);
      mapRef.current.flyTo([30.0, 69.5], 5, { duration: 1.2 });
      setSelectedDistrict(null);
    } else {
      provinceLayers.current?.remove();
      if (sindhGeo) districtLayers.current?.addTo(mapRef.current);
      mapRef.current.flyTo([26.5, 68.5], 7, { duration: 1.2 });
    }
  }, [viewMode, pakistanGeo, sindhGeo]);

  // ── Handle overlay change ───────────────────────────────────────────────
  useEffect(() => {
    if (districtLayers.current) {
      districtLayers.current.setStyle((feature) => {
        if (!feature) return {};
        const color = getOverlayColor(feature, overlay);
        const isDefault = overlay === 'none';
        return {
          fillColor: isDefault ? '#0ea5e9' : color,
          fillOpacity: isDefault ? 0.30 : 0.65,
          color: isDefault ? '#38bdf8' : color,
          weight: 2,
          opacity: 0.95,
        };
      });
    }
  }, [overlay]);

  // ── Handle initial district deep-link ──────────────────────────────────
  useEffect(() => {
    if (!initialDistrict || !sindhGeo || !mapRef.current) return;

    const normalized = initialDistrict.toLowerCase().replace(/\s+/g, '');
    const distData = DISTRICT_DATA[normalized] ||
      Object.values(DISTRICT_DATA).find(d => d.name.toLowerCase().replace(/\s+/g, '') === normalized);

    if (distData) {
      setViewMode('sindh');
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.flyTo([distData.lat, distData.lon], 9, { duration: 1.5 });
          placeMarker(distData.lat, distData.lon);
          setSelectedDistrict(distData);
          onDistrictSelect?.(distData);
        }
      }, 800);
    }
  }, [initialDistrict, sindhGeo, placeMarker, onDistrictSelect]);

  // ─── Render ────────────────────────────────────────────────────────────────

  const legend = LEGEND_CONFIG[overlay];

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#07111F' }}>
      {/* ── Minimal Top Controls ── */}
      <div className="absolute top-4 left-4 sm:left-6 z-[1000] flex flex-wrap gap-2.5 max-w-[calc(100%-120px)]">
        {/* View Mode Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 shadow-lg" style={{ backdropFilter: 'blur(12px)' }}>
          <button
            onClick={() => setViewMode('pakistan')}
            className={`px-3.5 py-2 text-xs font-grotesk font-semibold whitespace-nowrap transition-all ${
              viewMode === 'pakistan'
                ? 'bg-eco-blue text-eco-bg font-bold shadow-sm'
                : 'bg-[#0B1A2C]/90 text-eco-muted hover:text-white'
            }`}
          >
            Pakistan
          </button>
          <button
            onClick={() => setViewMode('sindh')}
            className={`px-3.5 py-2 text-xs font-grotesk font-semibold whitespace-nowrap transition-all border-l border-white/10 ${
              viewMode === 'sindh'
                ? 'bg-eco-blue text-eco-bg font-bold shadow-sm'
                : 'bg-[#0B1A2C]/90 text-eco-muted hover:text-white'
            }`}
          >
            Sindh Districts
          </button>
        </div>

        {/* Climate Layer Filter (only show in Sindh view) */}
        {viewMode === 'sindh' && (
          <div className="flex rounded-xl overflow-hidden border border-white/10 shadow-lg" style={{ backdropFilter: 'blur(12px)' }}>
            {(['none', 'heat', 'flood', 'drought'] as OverlayType[]).map((ov) => (
              <button
                key={ov}
                onClick={() => setOverlay(ov)}
                className={`px-3 py-2 text-xs font-grotesk whitespace-nowrap transition-all border-l border-white/10 first:border-l-0 ${
                  overlay === ov
                    ? 'bg-eco-orange text-eco-bg font-bold shadow-sm'
                    : 'bg-[#0B1A2C]/90 text-eco-muted hover:text-white'
                }`}
              >
                {ov === 'none' ? 'Overview' : ov === 'heat' ? 'Heat Risk' : ov === 'flood' ? 'Flood Risk' : 'Drought'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Map Canvas ── */}
      <div
        ref={mapContainerRef}
        className="flex-1 w-full"
        style={{ background: '#07111F', minHeight: 420 }}
      />

      {/* ── Loading / Error Overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-eco-bg/80">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-eco-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-eco-blue font-grotesk text-sm">Loading map data…</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-eco-bg/90">
          <div className="text-center max-w-sm px-4">
            <div className="text-red-400 text-4xl mb-3">⚠</div>
            <p className="text-red-400 font-grotesk text-sm font-semibold">{error}</p>
            <p className="text-eco-muted text-xs mt-2">Start backend: uvicorn app.main:app --port 8000</p>
          </div>
        </div>
      )}

      {/* ── Legend (only when overlay is active) ── */}
      {legend.items.length > 0 && (
        <div
          className="absolute bottom-4 left-4 z-[1000] rounded-xl p-3 text-xs font-grotesk shadow-lg"
          style={{ background: 'rgba(11,26,44,0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(34,184,255,0.2)' }}
        >
          <p className="text-eco-blue font-semibold mb-2 uppercase tracking-wider text-[10px]">{legend.title}</p>
          {legend.items.map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <span className="text-eco-muted">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

