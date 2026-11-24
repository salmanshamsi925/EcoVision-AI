import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationInfo {
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
}

export const DEFAULT_LOCATIONS: Record<string, LocationInfo> = {
  khairpur: {
    id: 'khairpur', name: 'Khairpur', province: 'Sindh',
    lat: 27.5295, lon: 68.7590,
    temp_c: 28.1, rainfall_mm: 92,
    drought_index: 'High', flood_exposure: 'Extreme (Indus left bank breaches)',
    heat_risk: 'Very High', challenges: ['2022 Floods severely impacted date palms', 'Agricultural salinity', 'Groundwater stress'],
    source: 'NASA POWER / World Bank GFDRR'
  },
  larkana: {
    id: 'larkana', name: 'Larkana', province: 'Sindh',
    lat: 27.5590, lon: 68.2120,
    temp_c: 28.4, rainfall_mm: 88,
    drought_index: 'High', flood_exposure: 'High (Indus Riverine & Monsoon Flash)',
    heat_risk: 'Extreme', challenges: ['Heatwave frequency 48°C+', 'Indus flood plain risk', 'Agricultural stress'],
    source: 'NASA POWER / PMD Sindh'
  },
  karachi: {
    id: 'karachi', name: 'Karachi', province: 'Sindh',
    lat: 24.8607, lon: 67.0011,
    temp_c: 26.8, rainfall_mm: 197,
    drought_index: 'Moderate', flood_exposure: 'High (Urban Flash & Coastal Surge)',
    heat_risk: 'Extreme', challenges: ['Urban heat islands', 'Coastal cyclone vulnerability', 'Water scarcity'],
    source: 'NASA POWER / PMD Karachi'
  },
  sukkur: {
    id: 'sukkur', name: 'Sukkur', province: 'Sindh',
    lat: 27.7052, lon: 68.8570,
    temp_c: 28.7, rainfall_mm: 85,
    drought_index: 'High', flood_exposure: 'Extreme (Sukkur Barrage overflow zone)',
    heat_risk: 'Extreme', challenges: ['Record 53°C temps', 'Barrage-dependent agriculture', 'Salinity'],
    source: 'NASA POWER / PMD Sindh'
  },
  tharparkar: {
    id: 'tharparkar', name: 'Tharparkar', province: 'Sindh',
    lat: 25.0000, lon: 69.7500,
    temp_c: 27.2, rainfall_mm: 148,
    drought_index: 'Critical', flood_exposure: 'Low (Desert terrain)',
    heat_risk: 'Very High', challenges: ['Chronic desert drought', 'Deep aquifer depletion', 'Child malnutrition risk'],
    source: 'NASA POWER / NDMA Pakistan'
  },
  jacobabad: {
    id: 'jacobabad', name: 'Jacobabad', province: 'Sindh',
    lat: 28.2769, lon: 68.4514,
    temp_c: 29.8, rainfall_mm: 72,
    drought_index: 'Very High', flood_exposure: 'High (Hill torrents)',
    heat_risk: 'Extreme – Globally Hottest',
    challenges: ['Wet bulb 35°C threshold crossed', '53.5°C peak heatwaves', 'Outdoor labor bans in summer'],
    source: 'NASA POWER / Nature Climate Change'
  },
  hyderabad: {
    id: 'hyderabad', name: 'Hyderabad', province: 'Sindh',
    lat: 25.3960, lon: 68.3578,
    temp_c: 27.5, rainfall_mm: 156,
    drought_index: 'Moderate to High', flood_exposure: 'High (Indus right bank)',
    heat_risk: 'Very High', challenges: ['Industrial heat stress', 'Indus flow dependency', 'Urban flash drainage'],
    source: 'NASA POWER / PMD Hyderabad'
  },
  badin: {
    id: 'badin', name: 'Badin', province: 'Sindh',
    lat: 24.6567, lon: 68.8373,
    temp_c: 26.9, rainfall_mm: 225,
    drought_index: 'Low to Moderate', flood_exposure: 'Extreme (Coastal & Cyclone Delta)',
    heat_risk: 'High', challenges: ['Seawater intrusion', 'Cyclone vulnerability', 'Agricultural inundation'],
    source: 'NASA POWER / NDMA Pakistan'
  },
  thatta: {
    id: 'thatta', name: 'Thatta', province: 'Sindh',
    lat: 24.7461, lon: 67.9224,
    temp_c: 26.5, rainfall_mm: 183,
    drought_index: 'Moderate', flood_exposure: 'Extreme (Indus Delta & Coastal)',
    heat_risk: 'High', challenges: ['Indus delta shrinkage', 'Mangrove deforestation', 'Freshwater–saltwater interface shift'],
    source: 'NASA POWER / IUCN Pakistan'
  },
  mirpurkhas: {
    id: 'mirpurkhas', name: 'Mirpur Khas', province: 'Sindh',
    lat: 25.5270, lon: 69.0167,
    temp_c: 27.0, rainfall_mm: 135,
    drought_index: 'High', flood_exposure: 'High (Nara Canal overflow)',
    heat_risk: 'Very High', challenges: ['Mango orchard heat stress', 'Nara canal salinity', 'Reduced cotton yields'],
    source: 'NASA POWER / PMD Sindh'
  },
  dadu: {
    id: 'dadu', name: 'Dadu', province: 'Sindh',
    lat: 26.7319, lon: 67.7764,
    temp_c: 27.9, rainfall_mm: 78,
    drought_index: 'Very High', flood_exposure: 'High (Hill torrent & Indus right bank)',
    heat_risk: 'Very High', challenges: ['Hill torrent devastation', 'Water scarcity paradox', 'Kirthar hills erosion'],
    source: 'NASA POWER / World Bank'
  },
  shaheedbenazirababad: {
    id: 'shaheedbenazirababad', name: 'Shaheed Benazirabad', province: 'Sindh',
    lat: 26.2442, lon: 68.3880,
    temp_c: 27.8, rainfall_mm: 95,
    drought_index: 'High', flood_exposure: 'High (Indus right bank & internal drainage)',
    heat_risk: 'Very High', challenges: ['Cotton crop failure due to heat', 'Indus barrage water allocation disputes'],
    source: 'NASA POWER / PMD Sindh'
  },
  sanghar: {
    id: 'sanghar', name: 'Sanghar', province: 'Sindh',
    lat: 26.0478, lon: 68.9505,
    temp_c: 27.3, rainfall_mm: 115,
    drought_index: 'High', flood_exposure: 'Moderate (Internal drainage challenges)',
    heat_risk: 'Very High', challenges: ['Wheat & cotton stress', 'Saline groundwater', 'Irrigation system deterioration'],
    source: 'NASA POWER / PMD Sindh'
  },
  jamshoro: {
    id: 'jamshoro', name: 'Jamshoro', province: 'Sindh',
    lat: 25.4344, lon: 68.2774,
    temp_c: 27.6, rainfall_mm: 142,
    drought_index: 'Moderate', flood_exposure: 'High (Indus riverine)',
    heat_risk: 'Very High', challenges: ['Thar coal power environmental impact', 'Indus river bank erosion', 'Industrial pollution nexus'],
    source: 'NASA POWER / PMD Sindh'
  }
};

interface LocationContextType {
  activeLocation: LocationInfo;
  setActiveLocationId: (id: string) => void;
  allLocations: Record<string, LocationInfo>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLocationId, setActiveLocationIdState] = useState<string>(() => {
    return localStorage.getItem('ecovision_active_location') || 'khairpur';
  });

  const setActiveLocationId = (id: string) => {
    const normalized = id.toLowerCase().replace(/\s+/g, '');
    setActiveLocationIdState(normalized);
    localStorage.setItem('ecovision_active_location', normalized);
  };

  const activeLocation = DEFAULT_LOCATIONS[activeLocationId] || DEFAULT_LOCATIONS.khairpur;

  useEffect(() => {
    localStorage.setItem('ecovision_active_location', activeLocationId);
  }, [activeLocationId]);

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocationId, allLocations: DEFAULT_LOCATIONS }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useActiveLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useActiveLocation must be used within a LocationProvider');
  }
  return context;
};
