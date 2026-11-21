import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useActiveLocation } from '../context/LocationContext';
import { API_BASE } from '../config/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DistrictData {
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

export type OverlayType = 'temperature' | 'flood' | 'drought' | 'vegetation' | 'none';

interface PakistanSindhMapProps {
  initialDistrict?: string | null;
  selectedDistrictId?: string | null;
  onDistrictSelect?: (district: DistrictData | null) => void;
  overlay?: OverlayType;
  basemap?: 'dark' | 'satellite';
  showBoundaries?: boolean;
}

type ViewMode = 'pakistan' | 'sindh';

// ─── District Climate Database ────────────────────────────────────────────────

export const DISTRICT_DATA: Record<string, DistrictData> = {
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

  if (overlay === 'none') return '#20C5FF';

  if (overlay === 'temperature') {
    const risk = data?.heat_risk || props.heat_risk || '';
    if (risk.includes('Extreme') || risk.includes('Globally')) return '#FF5D63';
    if (risk.includes('Very High')) return '#FFAA45';
    if (risk.includes('High')) return '#FFD93D';
    return '#22D3A0';
  }

  if (overlay === 'flood') {
    const flood = data?.flood_exposure || props.flood_exposure || '';
    if (flood.toLowerCase().includes('extreme')) return '#FF5D63';
    if (flood.toLowerCase().includes('high')) return '#FFAA45';
    if (flood.toLowerCase().includes('moderate')) return '#FFD93D';
    return '#22D3A0';
  }

  if (overlay === 'drought') {
    const drought = data?.drought_index || props.drought_index || '';
    if (drought.includes('Critical')) return '#FF5D63';
    if (drought.includes('Very High')) return '#FFAA45';
    if (drought.includes('High')) return '#FFD93D';
    if (drought.includes('Moderate')) return '#A8B7C9';
    return '#22D3A0';
  }

  if (overlay === 'vegetation') {
    // NDVI estimate based on rainfall and proximity to Indus River
    const mm = data?.rainfall_mm || 100;
    if (mm > 180) return '#22D3A0';
    if (mm > 100) return '#86EFAC';
    if (mm > 80) return '#FDE047';
    return '#D97706';
  }

  return '#20C5FF';
}

function getProvinceColor(name: string): string {
  const palette: Record<string, string> = {
    'Sindh': '#20C5FF',
    'Punjab': '#22D3A0',
    'Balochistan': '#FFAA45',
    'Khyber Pakhtunkhwa': '#A78BFA',
    'Gilgit-Baltistan': '#38BDF8',
    'Islamabad Capital Territory': '#FF5D63',
    'Azad Jammu & Kashmir': '#F59E0B',
  };
  return palette[name] || '#A8B7C9';
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const PakistanSindhMap: React.FC<PakistanSindhMapProps> = ({
  initialDistrict,
  selectedDistrictId,
  onDistrictSelect,
  overlay = 'temperature',
  basemap = 'satellite',
  showBoundaries = true,
}) => {
  const { setActiveLocationId } = useActiveLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const provinceLayers = useRef<L.GeoJSON | null>(null);
  const districtLayers = useRef<L.GeoJSON | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('sindh');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pakistanGeo, setPakistanGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [sindhGeo, setSindhGeo] = useState<GeoJSON.FeatureCollection | null>(null);

  const activeOverlayRef = useRef<OverlayType>(overlay);
  activeOverlayRef.current = overlay;

  const showBoundariesRef = useRef<boolean>(showBoundaries);
  showBoundariesRef.current = showBoundaries;

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
        setError('Could not load geographic boundaries.');
        setLoading(false);
      });
  }, []);

  // ── Initialise Leaflet Map ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [26.8, 68.6],
      zoom: 6.8,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 14,
    });

    const tileUrl = basemap === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    const tileLayer = L.tileLayer(tileUrl, {
      maxNativeZoom: 16,
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Elegant Bottom-Right Zoom Control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Handle Basemap Switch (Satellite vs Dark) ───────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const tileUrl = basemap === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrl);
    }
  }, [basemap]);

  // ── Lookup district data helper ─────────────────────────────────────────
  const lookupDistrict = useCallback((feature: GeoJSON.Feature): DistrictData | null => {
    const props = feature.properties || {};
    const rawName = (props.id || props.name || props.district || '').toLowerCase();
    const normalized = rawName
      .replace(/\s+/g, '')
      .replace('shaheedbenazirabad', 'shaheedbenazirababad')
      .replace('mirpur khas', 'mirpurkhas');
    return DISTRICT_DATA[normalized] || DISTRICT_DATA[rawName] || null;
  }, []);

  // ── Place custom glowing Leaflet Pin ────────────────────────────────────
  const placeMarker = useCallback((lat: number, lon: number, name: string) => {
    if (!mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.remove();
    }

    const customIcon = L.divIcon({
      className: 'custom-gis-pin',
      html: `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translate(-50%, -100%);pointer-events:none;">
          <div style="background:#10243A;border:1px solid #20C5FF;box-shadow:0 0 15px rgba(32,197,255,0.6);border-radius:20px;padding:4px 10px;display:flex;align-items:center;gap:6px;white-space:nowrap;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#20C5FF;animation:pulse 1.5s infinite;"></span>
            <span style="color:#FFFFFF;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.02em;">${name}</span>
          </div>
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #20C5FF;margin-top:-1px;"></div>
          <div style="width:8px;height:4px;border-radius:50%;background:rgba(32,197,255,0.4);filter:blur(1px);margin-top:2px;"></div>
        </div>
      `,
      iconSize: [120, 40],
      iconAnchor: [60, 40],
    });

    const marker = L.marker([lat, lon], { icon: customIcon }).addTo(mapRef.current);
    markerRef.current = marker;
  }, []);

  // ── Style functions ─────────────────────────────────────────────────────
  const styleProvince = useCallback((feature?: GeoJSON.Feature) => {
    if (!feature) return {};
    const name = feature.properties?.name || '';
    const isVisible = showBoundariesRef.current;
    return {
      fillColor: getProvinceColor(name),
      fillOpacity: isVisible ? 0.22 : 0.05,
      color: getProvinceColor(name),
      weight: isVisible ? 2 : 0.5,
      opacity: isVisible ? 0.9 : 0.2,
    };
  }, []);

  const styleDistrict = useCallback((feature?: GeoJSON.Feature) => {
    if (!feature) return {};
    const color = getOverlayColor(feature, activeOverlayRef.current);
    const isDefault = activeOverlayRef.current === 'none';
    const isVisible = showBoundariesRef.current;
    return {
      fillColor: isDefault ? '#20C5FF' : color,
      fillOpacity: isDefault ? 0.25 : 0.62,
      color: isVisible ? '#FFFFFF' : color,
      weight: isVisible ? 1.5 : 0.5,
      opacity: 0.95,
      dashArray: isVisible ? undefined : '3, 3',
    };
  }, []);

  // ── Render Province Layer (Pakistan view) ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !pakistanGeo) return;
    if (provinceLayers.current) provinceLayers.current.remove();

    const layer = L.geoJSON(pakistanGeo as GeoJSON.GeoJsonObject, {
      style: styleProvince,
      onEachFeature: (feature, lyr) => {
        const name = feature.properties?.name || 'Province';
        lyr.bindTooltip(
          `<span style="color:#F8FAFC;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;text-shadow:0 1px 4px rgba(0,0,0,0.8);">${name.toUpperCase()}</span>`,
          { permanent: true, direction: 'center', className: 'province-map-label' }
        );
        lyr.on('click', () => {
          if (name === 'Sindh') {
            setViewMode('sindh');
            mapRef.current?.flyTo([26.8, 68.6], 7, { duration: 1.2 });
          }
        });
      }
    });

    if (viewMode === 'pakistan') {
      layer.addTo(mapRef.current);
    }
    provinceLayers.current = layer;
  }, [pakistanGeo, styleProvince, viewMode]);

  // ── Render District Layer (Sindh Choropleth) ───────────────────────────
  useEffect(() => {
    if (!mapRef.current || !sindhGeo) return;
    if (districtLayers.current) districtLayers.current.remove();

    const layer = L.geoJSON(sindhGeo as GeoJSON.GeoJsonObject, {
      style: styleDistrict,
      onEachFeature: (feature, lyr) => {
        const distData = lookupDistrict(feature);
        const name = distData?.name || feature.properties?.name || 'District';

        lyr.bindTooltip(
          `<div style="font-family:'Space Grotesk',sans-serif;color:#F8FAFC;font-weight:700;font-size:10.5px;letter-spacing:0.03em;text-shadow:0 1px 3px rgba(0,0,0,0.9);">${name}</div>`,
          { permanent: true, direction: 'center', className: 'district-map-label' }
        );

        lyr.on('mouseover', function () {
          (this as L.Path).setStyle({ fillOpacity: 0.85, weight: 2.5, color: '#20C5FF' });
        });
        lyr.on('mouseout', function () {
          layer.resetStyle(this as L.Layer);
        });
        lyr.on('click', function () {
          const bounds = (lyr as L.Polygon).getBounds();
          mapRef.current?.flyToBounds(bounds, { padding: [50, 50], duration: 1.0 });
          if (distData) {
            placeMarker(distData.lat, distData.lon, distData.name);
            setActiveLocationId(distData.id);
            onDistrictSelect?.(distData);
          }
        });
      }
    });

    layer.addTo(mapRef.current);
    districtLayers.current = layer;
  }, [sindhGeo, styleDistrict, lookupDistrict, placeMarker, onDistrictSelect, setActiveLocationId]);

  // ── Handle Overlay Updates ──────────────────────────────────────────────
  useEffect(() => {
    if (districtLayers.current) {
      districtLayers.current.setStyle(styleDistrict);
    }
  }, [overlay, showBoundaries, styleDistrict]);

  // ── Handle external district selection & deep-link ─────────────────────
  useEffect(() => {
    const targetId = selectedDistrictId || initialDistrict;
    if (!targetId || !sindhGeo || !mapRef.current) return;

    const normalized = targetId.toLowerCase().replace(/\s+/g, '');
    const distData = DISTRICT_DATA[normalized] ||
      Object.values(DISTRICT_DATA).find(d => d.name.toLowerCase().replace(/\s+/g, '') === normalized);

    if (distData) {
      mapRef.current.flyTo([distData.lat, distData.lon], 8.5, { duration: 1.2 });
      placeMarker(distData.lat, distData.lon, distData.name);
      onDistrictSelect?.(distData);
    }
  }, [selectedDistrictId, initialDistrict, sindhGeo, placeMarker, onDistrictSelect]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#06111F] overflow-hidden">
      {/* ── Map Canvas ── */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[500px]"
        style={{ background: '#06111F' }}
      />

      {/* ── Loading Overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-[#06111F]/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-primary-cyan font-grotesk text-xs uppercase tracking-wider">Loading GIS Boundaries…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-[#06111F]/90">
          <div className="text-center max-w-sm px-4">
            <p className="text-danger-red font-grotesk text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
