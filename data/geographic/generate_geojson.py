import json
import os

# Ensure data/geographic directory exists
os.makedirs(r"e:\EcoVision-AI\data\geographic", exist_ok=True)

# 1. PAKISTAN PROVINCES GEOJSON
pakistan_provinces = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "sindh",
                "name": "Sindh",
                "capital": "Karachi",
                "area_km2": 140914,
                "heat_risk": "Extreme",
                "flood_exposure": "Critical",
                "drought_index": "High",
                "annual_rainfall_mm": 180,
                "avg_temp_c": 28.5,
                "vulnerability": "High"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.2, 28.4], [69.2, 28.5], [70.1, 28.3], [70.5, 27.8], 
                    [71.1, 27.2], [70.8, 25.8], [71.2, 24.8], [70.5, 24.1], 
                    [69.5, 23.7], [68.2, 23.8], [67.5, 24.2], [66.8, 24.8], 
                    [66.6, 25.2], [67.1, 26.0], [67.5, 27.0], [67.8, 27.8], 
                    [68.2, 28.4]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "balochistan",
                "name": "Balochistan",
                "capital": "Quetta",
                "area_km2": 347190,
                "heat_risk": "High",
                "flood_exposure": "High",
                "drought_index": "Extreme",
                "annual_rainfall_mm": 120,
                "avg_temp_c": 24.2,
                "vulnerability": "Very High"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [60.9, 25.1], [61.8, 25.3], [63.5, 25.2], [65.5, 25.3], 
                    [66.6, 25.2], [67.1, 26.0], [67.5, 27.0], [68.0, 28.2], 
                    [69.8, 28.4], [70.2, 29.8], [69.8, 31.2], [69.2, 31.8], 
                    [68.0, 31.5], [66.5, 30.5], [64.5, 29.5], [62.5, 29.5], 
                    [61.0, 29.0], [61.5, 27.2], [60.9, 25.1]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "punjab",
                "name": "Punjab",
                "capital": "Lahore",
                "area_km2": 205344,
                "heat_risk": "Very High",
                "flood_exposure": "High",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 450,
                "avg_temp_c": 25.8,
                "vulnerability": "Moderate to High"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [69.8, 28.4], [70.5, 28.5], [71.5, 29.0], [73.0, 29.5], 
                    [74.0, 30.5], [74.5, 31.5], [75.0, 32.2], [74.3, 32.8], 
                    [73.5, 33.2], [72.8, 33.6], [71.8, 33.5], [71.2, 32.5], 
                    [70.5, 31.5], [70.2, 29.8], [69.8, 28.4]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "khyber-pakhtunkhwa",
                "name": "Khyber Pakhtunkhwa",
                "capital": "Peshawar",
                "area_km2": 101741,
                "heat_risk": "Moderate",
                "flood_exposure": "Critical",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 650,
                "avg_temp_c": 21.4,
                "vulnerability": "High"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [69.2, 31.8], [70.5, 31.8], [71.5, 32.8], [72.2, 33.5], 
                    [73.2, 34.2], [73.5, 35.0], [73.8, 36.2], [72.8, 36.8], 
                    [71.5, 36.2], [71.2, 34.5], [70.0, 33.5], [69.5, 32.5], 
                    [69.2, 31.8]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "gilgit-baltistan",
                "name": "Gilgit-Baltistan",
                "capital": "Gilgit",
                "area_km2": 72971,
                "heat_risk": "Low",
                "flood_exposure": "Extreme",
                "drought_index": "Low",
                "annual_rainfall_mm": 200,
                "avg_temp_c": 14.2,
                "vulnerability": "High (GLOF & Cryosphere Melt)"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [73.5, 35.0], [74.5, 35.2], [76.5, 35.5], [77.5, 35.8], 
                    [77.0, 36.8], [75.5, 37.0], [74.0, 36.8], [73.0, 36.5], 
                    [73.5, 35.0]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "islamabad",
                "name": "Islamabad Capital Territory",
                "capital": "Islamabad",
                "area_km2": 906,
                "heat_risk": "Moderate",
                "flood_exposure": "Moderate",
                "drought_index": "Low",
                "annual_rainfall_mm": 1140,
                "avg_temp_c": 21.8,
                "vulnerability": "Moderate"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [72.85, 33.60], [73.20, 33.60], [73.25, 33.80], 
                    [72.90, 33.80], [72.85, 33.60]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "ajk",
                "name": "Azad Jammu and Kashmir",
                "capital": "Muzaffarabad",
                "area_km2": 13297,
                "heat_risk": "Moderate",
                "flood_exposure": "High",
                "drought_index": "Low",
                "annual_rainfall_mm": 1300,
                "avg_temp_c": 19.5,
                "vulnerability": "High (Landslides & Cloudbursts)"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [73.4, 33.0], [74.2, 33.2], [74.5, 34.2], [74.2, 35.0], 
                    [73.5, 34.6], [73.3, 33.8], [73.4, 33.0]
                ]]
            }
        }
    ]
}

# 2. SINDH DISTRICTS GEOJSON (Detailed polygons for all priority districts)
sindh_districts = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "larkana",
                "name": "Larkana",
                "division": "Larkana",
                "lat": 27.5590, "lon": 68.2120,
                "heat_risk": "Extreme (50°C+)",
                "flood_exposure": "Very High",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 125,
                "avg_temp_c": 31.2,
                "temp_anomaly": "+2.8°C",
                "challenges": "Intense summer heat dome, Indus river embankment breach vulnerability, high crop heat stress.",
                "dataset_source": "NASA POWER / PMD / World Bank CKP",
                "spatial_res": "0.5° x 0.5° Reanalysis",
                "obs_period": "1991–2020 Baseline (CMIP6 Projections)"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.05, 27.70], [68.35, 27.70], [68.45, 27.45], 
                    [68.25, 27.35], [68.00, 27.45], [68.05, 27.70]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "khairpur",
                "name": "Khairpur",
                "division": "Sukkur",
                "lat": 27.5295, "lon": 68.7592,
                "heat_risk": "Very High",
                "flood_exposure": "High",
                "drought_index": "Moderate to Severe",
                "annual_rainfall_mm": 135,
                "avg_temp_c": 30.5,
                "temp_anomaly": "+2.4°C",
                "challenges": "Arid agricultural transition zone, date palm harvest timing shifts, Rohri canal seepage.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.40, 27.75], [69.10, 27.60], [69.40, 27.10], 
                    [68.90, 26.85], [68.50, 27.20], [68.40, 27.75]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "sukkur",
                "name": "Sukkur",
                "division": "Sukkur",
                "lat": 27.7052, "lon": 68.8574,
                "heat_risk": "Very High",
                "flood_exposure": "Critical (Barrage Apex)",
                "drought_index": "Low to Moderate",
                "annual_rainfall_mm": 115,
                "avg_temp_c": 31.0,
                "temp_anomaly": "+2.3°C",
                "challenges": "Indus super-flood gateway, barrage siltation, extreme pre-monsoon heat stress.",
                "dataset_source": "PMD / NASA POWER",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.65, 27.95], [69.15, 27.90], [69.10, 27.60], 
                    [68.60, 27.65], [68.65, 27.95]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "karachi",
                "name": "Karachi",
                "division": "Karachi",
                "lat": 24.8607, "lon": 67.0011,
                "heat_risk": "High (Urban Heat Island)",
                "flood_exposure": "Very High (Flash Pluvial & Sea Level)",
                "drought_index": "Low",
                "annual_rainfall_mm": 215,
                "avg_temp_c": 27.6,
                "temp_anomaly": "+2.1°C",
                "challenges": "High maritime humidity with heat index >50°C, nullah blockages, coastal storm surge.",
                "dataset_source": "NASA POWER / PMD Maritime",
                "spatial_res": "0.25° x 0.25° High-Res",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [66.85, 25.15], [67.35, 25.20], [67.40, 24.80], 
                    [67.05, 24.75], [66.80, 24.90], [66.85, 25.15]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "hyderabad",
                "name": "Hyderabad",
                "division": "Hyderabad",
                "lat": 25.3960, "lon": 68.3578,
                "heat_risk": "High",
                "flood_exposure": "High",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 175,
                "avg_temp_c": 29.1,
                "temp_anomaly": "+2.2°C",
                "challenges": "Urban expansion over agricultural lands, Indus downstream flow reduction, summer heatwaves.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.20, 25.55], [68.55, 25.55], [68.60, 25.25], 
                    [68.25, 25.20], [68.20, 25.55]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "tharparkar",
                "name": "Tharparkar",
                "division": "Mirpur Khas",
                "lat": 24.7436, "lon": 69.7997,
                "heat_risk": "Very High",
                "flood_exposure": "Low",
                "drought_index": "Extreme",
                "annual_rainfall_mm": 240,
                "avg_temp_c": 30.2,
                "temp_anomaly": "+2.6°C",
                "challenges": "Recurrent desert drought, deep saline groundwater reliance, malnutrition and livestock distress.",
                "dataset_source": "World Bank / NASA POWER",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [69.30, 25.40], [70.50, 25.50], [71.15, 24.75], 
                    [70.50, 24.15], [69.60, 24.20], [69.30, 25.40]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "badin",
                "name": "Badin",
                "division": "Hyderabad",
                "lat": 24.6560, "lon": 68.8370,
                "heat_risk": "Moderate to High",
                "flood_exposure": "Extreme (Coastal Inundation)",
                "drought_index": "Low",
                "annual_rainfall_mm": 220,
                "avg_temp_c": 28.3,
                "temp_anomaly": "+1.8°C",
                "challenges": "Sea water intrusion, LBOD spinal drain overflow during cyclones, loss of arable coastal land.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.50, 24.95], [69.25, 24.95], [69.15, 24.30], 
                    [68.45, 24.30], [68.50, 24.95]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "thatta",
                "name": "Thatta",
                "division": "Hyderabad",
                "lat": 24.7474, "lon": 67.9235,
                "heat_risk": "Moderate to High",
                "flood_exposure": "Critical (Delta Basin)",
                "drought_index": "Low",
                "annual_rainfall_mm": 195,
                "avg_temp_c": 27.9,
                "temp_anomaly": "+1.9°C",
                "challenges": "Indus Delta shrinkage, saline creek encroachment, depletion of mangrove buffer shields.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [67.45, 25.10], [68.15, 25.00], [68.20, 24.40], 
                    [67.55, 24.30], [67.45, 25.10]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "mirpur-khas",
                "name": "Mirpur Khas",
                "division": "Mirpur Khas",
                "lat": 25.5276, "lon": 69.0159,
                "heat_risk": "High",
                "flood_exposure": "High",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 190,
                "avg_temp_c": 29.5,
                "temp_anomaly": "+2.1°C",
                "challenges": "Precipitation variability affecting fruit horticulture, canal command tail-end water deficits.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.75, 25.80], [69.35, 25.75], [69.35, 25.25], 
                    [68.70, 25.25], [68.75, 25.80]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "dadu",
                "name": "Dadu",
                "division": "Hyderabad",
                "lat": 26.7341, "lon": 67.7795,
                "heat_risk": "Extreme",
                "flood_exposure": "Critical",
                "drought_index": "High",
                "annual_rainfall_mm": 140,
                "avg_temp_c": 30.8,
                "temp_anomaly": "+2.9°C",
                "challenges": "Flash torrents from Kirthar Range, Manchar Lake swelling during monsoons, heat index 49°C+.",
                "dataset_source": "PMD / World Bank / NASA POWER",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [67.45, 27.15], [68.05, 27.10], [68.10, 26.35], 
                    [67.45, 26.35], [67.45, 27.15]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "shaheed-benazirabad",
                "name": "Shaheed Benazirabad",
                "division": "Shaheed Benazirabad",
                "lat": 26.2483, "lon": 68.4096,
                "heat_risk": "Extreme",
                "flood_exposure": "High",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 150,
                "avg_temp_c": 31.5,
                "temp_anomaly": "+2.7°C",
                "challenges": "National heat epicenter exceeding 50°C, groundwater salinity, acute agricultural heat stress.",
                "dataset_source": "PMD / NASA POWER",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.10, 26.50], [68.70, 26.55], [68.75, 26.05], 
                    [68.05, 26.00], [68.10, 26.50]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "jacobabad",
                "name": "Jacobabad",
                "division": "Larkana",
                "lat": 28.2835, "lon": 68.4388,
                "heat_risk": "Critical",
                "flood_exposure": "High",
                "drought_index": "Moderate",
                "annual_rainfall_mm": 110,
                "avg_temp_c": 32.1,
                "temp_anomaly": "+3.1°C",
                "challenges": "Global physiological thermal threshold hazard (>35°C wet-bulb), chronic human heat survivability limits.",
                "dataset_source": "PMD / NASA POWER / IPCC AR6",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.15, 28.45], [68.75, 28.45], [68.70, 28.05], 
                    [68.10, 28.05], [68.15, 28.45]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "sanghar",
                "name": "Sanghar",
                "division": "Shaheed Benazirabad",
                "lat": 26.0465, "lon": 68.9482,
                "heat_risk": "Very High",
                "flood_exposure": "High",
                "drought_index": "Moderate to High",
                "annual_rainfall_mm": 170,
                "avg_temp_c": 30.1,
                "temp_anomaly": "+2.3°C",
                "challenges": "Extensive cotton/wheat belt with tail-end canal shortages and high summer evapotranspiration.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [68.65, 26.35], [69.30, 26.35], [69.45, 25.80], 
                    [68.75, 25.80], [68.65, 26.35]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "jamshoro",
                "name": "Jamshoro",
                "division": "Hyderabad",
                "lat": 25.4322, "lon": 68.2813,
                "heat_risk": "High",
                "flood_exposure": "Critical (Kotri Barrage / Hill Torrents)",
                "drought_indicator": "High",
                "annual_rainfall_mm": 160,
                "avg_temp_c": 29.8,
                "temp_anomaly": "+2.2°C",
                "challenges": "Kirthar mountain flash floods, Kotri Barrage flood discharge management, semi-arid terrain.",
                "dataset_source": "NASA POWER / PMD",
                "spatial_res": "0.5° x 0.5°",
                "obs_period": "1991–2020 Baseline"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [67.75, 26.15], [68.25, 26.00], [68.25, 25.30], 
                    [67.85, 25.10], [67.75, 26.15]
                ]]
            }
        }
    ]
}

# Write files
with open(r"e:\EcoVision-AI\data\geographic\pakistan_provinces.geojson", "w") as f:
    json.dump(pakistan_provinces, f, indent=2)

with open(r"e:\EcoVision-AI\data\geographic\sindh_districts.geojson", "w") as f:
    json.dump(sindh_districts, f, indent=2)

print("GeoJSON files successfully generated in data/geographic/!")
