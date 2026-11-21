# EcoVision-AI: Project Technical & Scientific Documentation

**Project Title:** EcoVision-AI — Climate Intelligence, Machine Learning & Future Simulation Platform for Pakistan & Sindh  
**Live Deployment URL:** [https://ecovision-ai-en0d.onrender.com](https://ecovision-ai-en0d.onrender.com)  
**Source Code Repository:** [https://github.com/salmanshamsi925/EcoVision-AI](https://github.com/salmanshamsi925/EcoVision-AI)  
**Domain Focus:** Human-Computer Interaction (HCI), Climate Informatics, Applied Machine Learning, GIS Spatial Modeling  

---

## 1. Executive Summary

Pakistan ranks among the top 10 most climate-vulnerable countries globally (Global Climate Risk Index), experiencing catastrophic super-floods (2010, 2022), deadly urban and agricultural heatwaves exceeding 52°C, and severe aridity in desert belts such as Tharparkar. Despite abundant global climate models, policymakers and local researchers in Pakistan have lacked an intuitive, interactive, and empirically grounded decision platform.

**EcoVision-AI** is an end-to-end climate command and policy simulation ecosystem designed following rigorous **Human-Computer Interaction (HCI)** design principles. It synthesizes 45 years of satellite observations (NASA POWER, PMD 1980–2025), Scikit-Learn machine learning trend regression, downscaled CMIP6 multi-scenario projections (SSP1-2.6, SSP2-4.5, SSP5-8.5), and interactive policy levers into a cohesive, zero-friction web platform.

---

## 2. Key Problem Statement & Motivation

1. **Information Overload & Cognitive Friction:** Climate data is often locked in raw CSVs, NetCDF files, and heavy mathematical tables that cause severe cognitive fatigue for decision-makers.
2. **Lack of Localized Resolution:** Generic global models treat South Asia as a single polygon, missing hyper-local microclimates across Sindh's 14 priority districts (e.g., coastal surge in Badin vs. extreme hyper-thermal heat in Jacobabad and Larkana).
3. **Absence of Actionable Policy Levers:** Traditional tools display past damages but fail to answer: *"If Sindh invests 55% in canal lining and 60% in mangrove afforestation, how much does regional climate resilience improve by 2035?"*

---

## 3. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Data Layer
        D1[NASA POWER Satellite API]
        D2[Pakistan Meteorological Dept PMD]
        D3[World Bank GFDRR & NDMA]
        D4[IPCC CMIP6 AR6 Scenarios]
    end

    subgraph Backend Engine (FastAPI & ML)
        B1[FastAPI High-Performance Async Server]
        B2[Scikit-Learn Regression & Anomaly Engine]
        B3[K-Means Climate Vulnerability Clustering]
        B4[Policy Simulation & Resilience Scoring Engine]
        B5[ClimateGPT Deterministic Knowledge Core]
    end

    subgraph Frontend UX & HCI Layer (React + Three.js)
        F1[Interactive 3D Earth Digital Twin Three.js]
        F2[Leaflet GIS Vector Map with Sindh GeoJSON]
        F3[Historical Trend & CMIP6 Analytics Dashboard]
        F4[Environmental Decision Simulator Policy Lab]
        F5[1-Click Client-Side PDF Report Generator]
    end

    D1 & D2 & D3 & D4 --> B1
    B1 --> B2 & B3 & B4 & B5
    B2 & B3 & B4 & B5 --> F1 & F2 & F3 & F4 & F5
```

---

## 4. Empirical Datasets & Technical Specifications

| Data Component | Source Observatories | Temporal Coverage | Spatial Resolution |
| :--- | :--- | :--- | :--- |
| **Surface Temperature** | NASA POWER Agroclimatology / PMD | 1980 – 2025 (45 Years) | 0.5° × 0.5° Grid (~55 km) |
| **Annual & Monsoon Rainfall** | PMD Regional Stations / World Bank | 1980 – 2025 (Annual Totals) | District-level Station Anchors |
| **Future Projections** | IPCC CMIP6 Multi-Model Ensemble | 2027, 2030, 2035, 2050 | Downscaled to Sindh Baseline |
| **Vector GIS Boundaries** | OpenStreetMap / Humanitarian Data | Verified GeoJSON Polygons | Pakistan Provinces & 14 Sindh Districts |

---

## 5. Machine Learning & Analytical Modeling

### A. Linear & Polynomial Climate Regression
- **Linear Trend:** Fits multi-decadal temperature anomaly against time:
  $$\Delta T(t) = \alpha \cdot t + \beta$$
  Yields a statistically robust observed warming rate of **$+0.351^\circ\text{C}$ per decade** for Upper Sindh ($R^2 = 0.784$, $\text{RMSE} = \pm 0.31^\circ\text{C}$).
- **Polynomial Acceleration:** Evaluates second-order thermal curvature to detect non-linear acceleration in post-2000 summer heat extremes.

### B. Statistical Anomaly Isolation ($Z\text{-Score} > 1.75\sigma$)
Automatically isolates extreme hydrological and thermal shocks:
- **2010 Megafloods:** Indus River breach inundating 20% of Pakistan.
- **2015 Karachi/Sindh Heatwave:** Wet-bulb temperature peak ($52.7^\circ\text{C}$).
- **2022 Super Monsoon Floods:** $+480\%$ precipitation surge above normal baseline.

### C. K-Means Vulnerability Clustering ($k = 3$)
Clusters 14 Sindh districts into multidimensional archetypes across 6 vulnerability axes (Heat, Flood, Drought, Coastal, Water, Agriculture):
1. **Hyper-Thermal & Drought Prone** (Khairpur, Jacobabad, Sukkur, Larkana)
2. **Deltaic & Coastal Surge Vulnerable** (Karachi, Thatta, Badin)
3. **Arid Agro-Pastoral Belts** (Tharparkar, Sanghar, Mirpur Khas)

---

## 6. Human-Computer Interaction (HCI) Design Philosophy

The system was refined through rigorous HCI heuristics:
1. **Hick's Law & Cognitive Load Reduction:** Streamlined the workflow into 4 unambiguous steps: **Globe → Pakistan GIS → Climate Intel → Policy Lab**. Removed confusing 3D simulators and gaming modules.
2. **Progressive Disclosure:** Executive-level climate metrics ($R^2$, warming rate, flood anomalies) are highlighted upfront in clean KPI cards, while detailed mathematical tables are accessible on-demand via collapsible drawers.
3. **Elimination of Visual Occlusion (Fitts's Law):** Converted floating banners into full-width inline action triggers at the natural termination of content scrolls, preventing any obstruction of data charts.
4. **Color Semantics & Dark Theme Aesthetics:** Utilized an ergonomic dark palette (`#07111F`) with high-contrast functional accents:
   - `#22B8FF` (Electric Blue: Hydrology & Primary Actions)
   - `#35D39A` (Emerald Green: Resilience & Validated Status)
   - `#FF9F43` / `#FF5555` (Amber/Coral: Severe Heat & Drought Warnings)

---

## 7. Technology Stack Summary

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Three.js (WebGL 3D Earth Globe), Leaflet.js (Keyless Esri Dark Gray GIS), Lucide Icons, jsPDF.
- **Backend:** Python 3.11, FastAPI (Asynchronous REST API), Pydantic v2, Scikit-Learn 1.9, Pandas, NumPy, Uvicorn ASGI Server.
- **DevOps & Cloud:** Multi-stage Docker container build, Render Cloud Web Service, GitHub Version Control.
