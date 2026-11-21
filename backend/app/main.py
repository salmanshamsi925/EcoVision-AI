import sys
import os
import json
from pathlib import Path

# Ensure backend root is always on sys.path regardless of where script is called from
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from app.climate_service import climate_engine
from app.climate_gpt_service import climate_gpt

app = FastAPI(title="EcoVision-AI Backend", version="0.4.0")

# CORS configuration - allow frontend origin
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok", 
        "message": "EcoVision-AI backend is healthy",
        "version": "0.4.0 (Phase 4 - Climate Intelligence & ML Engine Ready)"
    }

class Location(BaseModel):
    id: str
    name: str
    province: str
    latitude: float
    longitude: float
    category: str
    heat_risk: str
    flood_exposure: str
    drought_indicator: str
    temp_anomaly: str
    summary: str

# Verified district coordinates and empirical risk telemetry
locations_database: List[Location] = [
    # Sindh Priority Districts (Section 5.3 & Section 6.1)
    Location(
        id="larkana",
        name="Larkana",
        province="Sindh",
        latitude=27.5590,
        longitude=68.2120,
        category="Sindh Priority",
        heat_risk="Extreme (Surpassing 50°C in May-June)",
        flood_exposure="Very High (Right Bank Outfall Drainage Zone)",
        drought_indicator="Moderate",
        temp_anomaly="+2.8°C above historical baseline",
        summary="Historical Indus riverine floodplain with acute summer heat peaks and heavy monsoon inundation risk."
    ),
    Location(
        id="khairpur",
        name="Khairpur",
        province="Sindh",
        latitude=27.5295,
        longitude=68.7592,
        category="Sindh Priority",
        heat_risk="Very High",
        flood_exposure="High (Canal breached zone)",
        drought_indicator="Moderate to Severe (Arid agricultural margin)",
        temp_anomaly="+2.4°C above baseline",
        summary="Major date-palm and wheat hub vulnerable to compound heat and pre-monsoon moisture stress."
    ),
    Location(
        id="sukkur",
        name="Sukkur",
        province="Sindh",
        latitude=27.7052,
        longitude=68.8574,
        category="Sindh Priority",
        heat_risk="Very High",
        flood_exposure="Critical (Sukkur Barrage Discharge Gateway)",
        drought_indicator="Low to Moderate",
        temp_anomaly="+2.3°C above baseline",
        summary="Indus Barrage apex controlling water distribution across millions of agricultural hectares in Sindh."
    ),
    Location(
        id="karachi",
        name="Karachi",
        province="Sindh",
        latitude=24.8607,
        longitude=67.0011,
        category="Sindh Priority",
        heat_risk="High (Severe Urban Heat Island effect & Maritime Humidity)",
        flood_exposure="Very High (Urban Flash Pluvial Flooding & Coastal Sea Level)",
        drought_indicator="Low",
        temp_anomaly="+2.1°C above baseline",
        summary="Megacity coastal ecosystem challenged by dense asphalt heat retention and storm surge drainage stress."
    ),
    Location(
        id="hyderabad",
        name="Hyderabad",
        province="Sindh",
        latitude=25.3960,
        longitude=68.3578,
        category="Sindh Priority",
        heat_risk="High",
        flood_exposure="High (Left Bank Indus Basin)",
        drought_indicator="Moderate",
        temp_anomaly="+2.2°C above baseline",
        summary="Key economic and agricultural transit node facing compound seasonal temperature shifts."
    ),
    Location(
        id="tharparkar",
        name="Tharparkar",
        province="Sindh",
        latitude=24.7436,
        longitude=69.7997,
        category="Sindh Priority",
        heat_risk="Very High",
        flood_exposure="Low (Depression pockets during hyper-monsoons)",
        drought_indicator="Extreme (Persistent Meteorological & Groundwater Drought)",
        temp_anomaly="+2.6°C above baseline",
        summary="Arid desert ecosystem facing recurrent groundwater depletion, livestock fodder stress, and heat anomalies."
    ),
    Location(
        id="badin",
        name="Badin",
        province="Sindh",
        latitude=24.6560,
        longitude=68.8370,
        category="Sindh Priority",
        heat_risk="Moderate to High",
        flood_exposure="Extreme (Coastal Cyclone & Saline Water Intrusion)",
        drought_indicator="Low",
        temp_anomaly="+1.8°C above baseline",
        summary="Lower Indus Delta rim experiencing seawater intrusion, tidal surges, and mangrove degradation."
    ),
    Location(
        id="thatta",
        name="Thatta",
        province="Sindh",
        latitude=24.7474,
        longitude=67.9235,
        category="Sindh Priority",
        heat_risk="Moderate to High",
        flood_exposure="Critical (Indus Delta Discharge & Coastal Tidal Ingress)",
        drought_indicator="Low",
        temp_anomaly="+1.9°C above baseline",
        summary="Cradle of Indus Delta mangrove forests facing erosion, diminished freshwater silt, and salinization."
    ),
    Location(
        id="mirpur-khas",
        name="Mirpur Khas",
        province="Sindh",
        latitude=25.5276,
        longitude=69.0159,
        category="Sindh Priority",
        heat_risk="High",
        flood_exposure="High (Irrigation spillways)",
        drought_indicator="Moderate",
        temp_anomaly="+2.1°C above baseline",
        summary="Renowned horticultural belt (mangoes/cotton) sensitive to flowering season heat spikes."
    ),
    Location(
        id="dadu",
        name="Dadu",
        province="Sindh",
        latitude=26.7341,
        longitude=67.7795,
        category="Sindh Priority",
        heat_risk="Extreme (49°C peaks)",
        flood_exposure="Critical (Manchar Lake & Kirthar hill-torrent floods)",
        drought_indicator="High",
        temp_anomaly="+2.9°C above baseline",
        summary="Ground zero for compound disasters: extreme Kirthar range flash torrents followed by punishing heatwaves."
    ),
    Location(
        id="shaheed-benazirabad",
        name="Shaheed Benazirabad",
        province="Sindh",
        latitude=26.2483,
        longitude=68.4096,
        category="Sindh Priority",
        heat_risk="Extreme (Recorded highest national temperatures)",
        flood_exposure="High",
        drought_indicator="Moderate",
        temp_anomaly="+2.7°C above baseline",
        summary="Centrally located fertile plains enduring sustained summer thermal peaks impacting human survivability."
    ),
    Location(
        id="jacobabad",
        name="Jacobabad",
        province="Sindh",
        latitude=28.2835,
        longitude=68.4388,
        category="Sindh Priority",
        heat_risk="Critical (Exceeds 35°C Wet-Bulb physiological limit)",
        flood_exposure="High",
        drought_indicator="Moderate",
        temp_anomaly="+3.1°C above baseline",
        summary="Globally recognized hot-spot where wet-bulb temperature frequently approaches the threshold of human endurance."
    ),

    # Major Federal & Provincial Centers of Pakistan
    Location(
        id="islamabad",
        name="Islamabad",
        province="Federal",
        latitude=33.6844,
        longitude=73.0479,
        category="Federal Capital",
        heat_risk="Moderate",
        flood_exposure="Moderate (Margalla catchment flash urban drainage)",
        drought_indicator="Low",
        temp_anomaly="+1.6°C above baseline",
        summary="Sub-Himalayan plateau with shifting winter rainfall timing and cloudburst hazards."
    ),
    Location(
        id="lahore",
        name="Lahore",
        province="Punjab",
        latitude=31.5204,
        longitude=74.3587,
        category="Provincial Capital",
        heat_risk="Very High",
        flood_exposure="Moderate to High (Ravi River & urban water-logging)",
        drought_indicator="Moderate (Groundwater overdraft)",
        temp_anomaly="+2.2°C above baseline",
        summary="Dense metropolitan region challenged by compound severe winter smog and blistering summer heat domes."
    ),
    Location(
        id="peshawar",
        name="Peshawar",
        province="Khyber Pakhtunkhwa",
        latitude=34.0151,
        longitude=71.5249,
        category="Provincial Capital",
        heat_risk="High",
        flood_exposure="High (Kabul & Swat river basins)",
        drought_indicator="Moderate",
        temp_anomaly="+2.0°C above baseline",
        summary="Valley ecosystem susceptible to glacial lake outburst floods (GLOF) upstream and valley heat traps."
    ),
    Location(
        id="quetta",
        name="Quetta",
        province="Balochistan",
        latitude=30.1798,
        longitude=66.9750,
        category="Provincial Capital",
        heat_risk="Moderate to High",
        flood_exposure="High (Hill torrent surges in valleys)",
        drought_indicator="Critical (Severe underground aquifer depletion)",
        temp_anomaly="+2.5°C above baseline",
        summary="High-altitude basin confronting critical groundwater exhaustion and sudden dry-riverbed flash surges."
    ),
    Location(
        id="gilgit",
        name="Gilgit",
        province="Gilgit-Baltistan",
        latitude=35.9221,
        longitude=74.3087,
        category="Glacial & Mountain Hub",
        heat_risk="Low (Direct) / Critical (Glacial Melt)",
        flood_exposure="Extreme (GLOF & Landslide Dam Breaches)",
        drought_indicator="Low",
        temp_anomaly="+2.8°C (Amplified High-Altitude Warming)",
        summary="Karakoram junction monitoring accelerated cryosphere melt, expanding supraglacial lakes, and GLOF alerts."
    ),
    Location(
        id="gwadar",
        name="Gwadar",
        province="Balochistan",
        latitude=25.1216,
        longitude=62.3254,
        category="Strategic Coastal Hub",
        heat_risk="Moderate to High",
        flood_exposure="High (Arabian Sea Cyclones & Coastal Inundation)",
        drought_indicator="Very High",
        temp_anomaly="+1.9°C above baseline",
        summary="Deep-sea coastal port situated on the Makran coast sensitive to tropical cyclones and acute freshwater deficits."
    )
]

# Geography GeoJSON data directory
DATA_GEO_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "geographic"

@app.get("/api/geography/pakistan")
async def get_pakistan_geography():
    geo_path = DATA_GEO_DIR / "pakistan_provinces.geojson"
    if not geo_path.exists():
        raise HTTPException(status_code=404, detail="Pakistan GeoJSON boundary file not found")
    with open(geo_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/geography/sindh")
async def get_sindh_geography():
    geo_path = DATA_GEO_DIR / "sindh_districts.geojson"
    if not geo_path.exists():
        raise HTTPException(status_code=404, detail="Sindh districts GeoJSON boundary file not found")
    with open(geo_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/locations")
async def get_locations():
    return locations_database

@app.get("/api/locations/{location_id}")
async def get_location_by_id(location_id: str):
    loc = next((l for l in locations_database if l.id.lower() == location_id.lower()), None)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found")
    return loc

# ==============================================================================
# PHASE 4: CLIMATE INTELLIGENCE & MACHINE LEARNING ANALYTICS ENDPOINTS
# ==============================================================================

@app.get("/api/climate/historical")
async def get_climate_historical(district: Optional[str] = "khairpur"):
    return climate_engine.get_historical(district or "khairpur")

@app.get("/api/climate/summary")
async def get_climate_summary(district: Optional[str] = "khairpur"):
    return climate_engine.get_summary(district or "khairpur")

@app.get("/api/climate/risks")
async def get_climate_risks(district: Optional[str] = "khairpur"):
    return climate_engine.get_risk_indicators(district or "khairpur")

@app.get("/api/climate/scenarios")
async def get_climate_scenarios(district: Optional[str] = "khairpur"):
    return climate_engine.get_cmip6_scenarios(district or "khairpur")

@app.get("/api/climate/ml-analysis")
async def get_climate_ml_analysis(district: Optional[str] = "khairpur"):
    return climate_engine.get_ml_analysis(district or "khairpur")

# ==============================================================================
# PHASE 6: CHANGE THE FUTURE — ENVIRONMENTAL POLICY DECISION SIMULATOR
# ==============================================================================

class PolicySimulationRequest(BaseModel):
    district_id: str = "khairpur"
    renewable_energy: float = 40.0         # 0-100% (Weight: 22%)
    forest_afforestation: float = 30.0     # 0-100% (Weight: 18%)
    mangrove_conservation: float = 35.0    # 0-100% (Weight: 15%)
    water_canal_lining: float = 45.0       # 0-100% (Weight: 20%)
    emission_reduction: float = 25.0       # 0-100% (Weight: 15%)
    urban_greening: float = 30.0           # 0-100% (Weight: 10%)

@app.post("/api/simulator/calculate")
async def calculate_policy_resilience(payload: PolicySimulationRequest):
    r = max(0.0, min(100.0, float(payload.renewable_energy)))
    f = max(0.0, min(100.0, float(payload.forest_afforestation)))
    m = max(0.0, min(100.0, float(payload.mangrove_conservation)))
    w = max(0.0, min(100.0, float(payload.water_canal_lining)))
    e = max(0.0, min(100.0, float(payload.emission_reduction)))
    u = max(0.0, min(100.0, float(payload.urban_greening)))

    # Transparent Educational Resilience Score Formula (Sum of weights = 1.0)
    score = round(0.22 * r + 0.18 * f + 0.15 * m + 0.20 * w + 0.15 * e + 0.10 * u, 1)

    # Classification
    if score < 40.0:
        level = "Extreme Climate Vulnerability"
        color = "#ef4444"
        desc = "Severe exposure to catastrophic heatwaves, canal breaches, and agricultural failure."
    elif score < 65.0:
        level = "Moderate Resilience"
        color = "#f59e0b"
        desc = "Partial adaptation. Still vulnerable to compound climate hazards and Indus water shortages."
    elif score < 85.0:
        level = "High Climate Resilience"
        color = "#38bdf8"
        desc = "Robust climate defenses. Substantial reduction in peak thermal stress and flood impact."
    else:
        level = "Net-Zero Climate Champion"
        color = "#10b981"
        desc = "Exemplary sustainable ecosystem with maximum renewable penetration, restored river basins, and food security."

    # Quantitative empirical outcome projections (Relative to 2050 Unmitigated SSP5-8.5 Baseline)
    temp_reduction = round(0.4 + ((e * 0.40 + r * 0.35 + u * 0.25) / 100.0) * 2.4, 2)
    flood_reduction = round(12.0 + ((f * 0.35 + m * 0.35 + w * 0.30) / 100.0) * 53.0, 1)
    water_saved = round(0.4 + ((w * 0.70 + f * 0.30) / 100.0) * 3.8, 2)
    crop_protection = round(8.0 + ((w * 0.40 + temp_reduction * 10 + r * 0.15) / 100.0) * 32.0, 1)
    carbon_sequestered = round(350.0 + ((f * 0.50 + m * 0.50) / 100.0) * 5100.0, 0)
    clean_power = round(600.0 + (r / 100.0) * 7800.0, 0)

    # Location lookup for tailored recommendations
    d_id = payload.district_id.lower().strip()
    loc = next((l for l in locations_database if l.id.lower() == d_id), None)
    d_name = loc.name if loc else d_id.capitalize()

    # District tailored recommendations
    coastal_ids = ["karachi", "thatta", "badin", "sujawal"]
    arid_ids = ["tharparkar", "umerkot", "jacobabad"]
    agri_ids = ["khairpur", "sukkur", "larkana", "shaheed_benazirabad", "hyderabad", "ghotki", "naushahro_feroze"]

    recommendations = []
    if d_id in coastal_ids:
        recommendations.append(f"Expand Indus Delta mangrove buffers by at least {int(m)}% to dissipate coastal storm surges and combat Arabian Sea intrusion.")
        recommendations.append(f"Accelerate urban heat island mitigation in {d_name} through reflective cool roofs and coastal wind-flow corridors.")
        recommendations.append("Deploy decentralized solar microgrids across fishing settlements to safeguard cold-storage supply chains.")
    elif d_id in arid_ids:
        recommendations.append(f"Scale rangeland rainwater harvesting ponds and micro-check dams across {d_name} to combat extreme drought cycles.")
        recommendations.append("Cultivate heat-resilient indigenous date-palm and drought-tolerant millet varieties.")
        recommendations.append("Deploy shaded thermal corridors and localized solar chilling centers for human and livestock protection.")
    else:
        recommendations.append(f"Execute comprehensive canal lining and drip micro-irrigation across {d_name} to conserve up to {water_saved} MAF of Indus river flow.")
        recommendations.append(f"Protect agricultural crop yields against thermal shock via agroforestry tree belts and smart solar-powered tubewells.")
        recommendations.append(f"Transition municipal and industrial energy supplies to clean distributed solar arrays generating up to {int(clean_power)} GWh/yr.")

    return {
        "district_id": d_id,
        "district_name": d_name,
        "resilience_score": score,
        "resilience_level": level,
        "resilience_color": color,
        "resilience_description": desc,
        "weights": {
            "renewable_energy": 0.22,
            "forest_afforestation": 0.18,
            "mangrove_conservation": 0.15,
            "water_canal_lining": 0.20,
            "emission_reduction": 0.15,
            "urban_greening": 0.10,
        },
        "component_scores": {
            "renewable_energy": round(0.22 * r, 2),
            "forest_afforestation": round(0.18 * f, 2),
            "mangrove_conservation": round(0.15 * m, 2),
            "water_canal_lining": round(0.20 * w, 2),
            "emission_reduction": round(0.15 * e, 2),
            "urban_greening": round(0.10 * u, 2),
        },
        "quantitative_impacts": {
            "temp_reduction_c": temp_reduction,
            "flood_reduction_pct": flood_reduction,
            "water_saved_maf": water_saved,
            "crop_protection_pct": crop_protection,
            "carbon_sequestered_kt": carbon_sequestered,
            "clean_power_gwh": clean_power,
        },
        "comparative_metrics": [
            {
                "label": "Peak Summer Temperature Reduction",
                "baseline_2050": "+4.2°C (SSP5-8.5)",
                "simulated_2050": f"+{max(1.4, round(4.2 - temp_reduction, 1))}°C",
                "delta": f"-{temp_reduction}°C",
                "unit": "°C Cooler",
                "impact_positive": True
            },
            {
                "label": "Flood Inundation & Damaged Land",
                "baseline_2050": "100% Vulnerable Area",
                "simulated_2050": f"{round(100.0 - flood_reduction, 1)}% Area Exposed",
                "delta": f"-{flood_reduction}%",
                "unit": "% Damage Mitigated",
                "impact_positive": True
            },
            {
                "label": "Annual Freshwater Conserved",
                "baseline_2050": "0.0 MAF (Severe Seepage)",
                "simulated_2050": f"{water_saved} MAF Saved",
                "delta": f"+{water_saved} MAF",
                "unit": "Million Acre-Feet",
                "impact_positive": True
            },
            {
                "label": "Crop Harvests Protected",
                "baseline_2050": "-42% Yield Loss",
                "simulated_2050": f"-{max(4.0, round(42.0 - crop_protection, 1))}% Protected Yield",
                "delta": f"+{crop_protection}%",
                "unit": "% Harvest Saved",
                "impact_positive": True
            }
        ],
        "recommendations": recommendations
    }

# ==============================================================================
# PHASE 7: CLIMATEGPT (MODULE 6) & PERSONALIZED REPORT GENERATOR (MODULE 7)
# ==============================================================================

class AIQueryRequest(BaseModel):
    query: str
    active_district_id: Optional[str] = "khairpur"

@app.post("/api/ai/ask")
async def ask_climate_gpt(payload: AIQueryRequest):
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return climate_gpt.query(payload.query, payload.active_district_id)

class ReportMetadataRequest(BaseModel):
    district_id: str = "khairpur"
    timeline_year: int = 2030
    scenario_id: str = "SSP2-4.5"
    policies: Optional[dict] = None
    resilience_score: float = 65.0

@app.post("/api/reports/generate")
async def generate_climate_report_metadata(payload: ReportMetadataRequest):
    import time
    rep_id = f"EV-{payload.district_id.upper()[:4]}-{int(time.time())}"
    return {
        "report_id": rep_id,
        "district_id": payload.district_id,
        "timeline_year": payload.timeline_year,
        "scenario_id": payload.scenario_id,
        "resilience_score": payload.resilience_score,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "status": "ready"
    }

# ------------------------------------------------------------------------------
# SPA & Static Frontend File Serving (Unified port 8000 support)
# ------------------------------------------------------------------------------
DIST_DIR = BACKEND_DIR.parent / "frontend" / "dist"
if DIST_DIR.exists():
    if (DIST_DIR / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")
    if (DIST_DIR / "textures").exists():
        app.mount("/textures", StaticFiles(directory=str(DIST_DIR / "textures")), name="textures")

    @app.get("/{full_path:path}")
    async def serve_frontend_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        target_file = DIST_DIR / full_path
        if target_file.is_file():
            return FileResponse(target_file)
        return FileResponse(DIST_DIR / "index.html")

if __name__ == "__main__":
    import uvicorn
    print("\n========================================================")
    print(" EcoVision-AI Unified Server Ready!")
    print(" Open in Browser: http://127.0.0.1:8000")
    print("========================================================\n")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)


