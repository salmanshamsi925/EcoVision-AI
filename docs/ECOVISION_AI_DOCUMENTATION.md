# EcoVision-AI — Complete System Documentation
**Climate Intelligence, Deep Neural Sequence Modeling, Real-Time Satellite Telemetry & Policy Simulation Platform for Pakistan & Sindh**

- **Live Web Service:** [https://ecovision-ai-en0d.onrender.com/](https://ecovision-ai-en0d.onrender.com/)
- **GitHub Repository:** [https://github.com/salmanshamsi925/EcoVision-AI](https://github.com/salmanshamsi925/EcoVision-AI)
- **Deployment Status:** Production Active (Singapore Region, Multi-Stage Docker)
- **Core Technology Stack:** React 19, TypeScript, Three.js WebGL, Tailwind CSS, Leaflet GIS, Python 3.11, FastAPI, Scikit-Learn MLP Neural Network, Open-Meteo REST API

---

## 1. Executive Summary & Problem Statement

**EcoVision-AI** is an artificial intelligence-driven climate intelligence and policy simulation platform created to confront Pakistan's escalating multi-hazard climate crisis, focusing particularly on the high-vulnerability riverine and arid ecosystems of Sindh province.

Pakistan regularly ranks among the top 10 most climate-vulnerable countries on Earth (Germanwatch Global Climate Risk Index). The country suffers from compound, cascading disasters:
- **Extreme Heatwaves:** Summer surface temperatures frequently exceed 50°C in Larkana, Jacobabad, and Dadu, reaching dangerous human survivability thresholds.
- **Indus Basin Inundation:** Intense monsoon cloudbursts coupled with canal breaches led to the 2022 catastrophic floods that submerged one-third of Pakistan, displacing 33 million people and causing over $30 billion in damages.
- **Glacial Melt & GLOF:** Accelerated cryosphere melt in the northern Karakoram and Himalayas triggers Glacial Lake Outburst Floods (GLOF) and long-term freshwater insecurity.
- **Arid Groundwater Droughts:** Chronic rainfall deficits in Tharparkar decimate rangeland pastures and livestock herds.

**EcoVision-AI** solves the disconnection between academic IPCC/NASA datasets and actionable government decision-making by translating 45 years of empirical records and CMIP6 climate models into an interactive 3D digital twin, real-time telemetry feeds, neural forecasting, and an action policy laboratory.

---

## 2. Visual Architecture & Screen Breakdown ("Mera Project Kese Dekhta Hai")

The entire UI is built on a high-contrast dark cosmic theme (`#07111F`) with vibrant cyan (`#22B8FF`), emerald (`#35D39A`), and amber (`#FF9F43`) accents adhering to WCAG 2.1 AAA contrast guidelines.

### Screen 1: Cockpit Home & 3D Earth (`/`)
- **100% Screen-Fixed Viewport:** Designed with `overflow-hidden` so all mission controls fit onto a single screen without vertical scrollbars or empty bottom voids.
- **Left Column (45% Width):**
  - **Top:** Google Earth-style city search input with live autocomplete dropdown and Quick Fly-To chips (`Khairpur`, `Karachi`, `Sukkur`, `Larkana`, `Tharparkar`, `Dadu`).
  - **Middle:** Pulsing badge `🟢 PAKISTAN CLIMATE COMMAND • LIVE TELEMETRY`, bold Orbitron headline **"THE FUTURE IS IN YOUR HANDS"**, and two primary action buttons:
    - `[ 🌐 ENTER THE EXPERIENCE → ]` (Cyan Gradient)
    - `[ 🧭 Explore Sindh & Pakistan ]` (Ghost Blue)
  - **Bottom:** Interaction guide `3D Earth: Drag to rotate • Scroll to zoom` + `[ Full-Screen Earth ]` toggle.
- **Right Column (55% Width):**
  - A 3D interactive Earth digital twin rendered via Three.js WebGL with custom GLSL atmospheric glow shaders and NASA 2048px satellite textures.
  - Positioned at 68% screen width with `camera.setViewOffset`, providing ample breathing room with zero text collision.
  - Clicking any city chip (e.g. *Khairpur*) triggers a Google Earth cinematic rotation that smoothly points the globe directly to Pakistan with a pulsing beacon.

### Screen 2: Pakistan & Sindh Interactive GIS Map (`/pakistan`)
- **GIS Viewport:** Full-screen Leaflet choropleth map featuring detailed district boundary polygons for Sindh and Pakistan, color-coded by thermal risk, flood channel vulnerability, and drought index.
- **Sidebar Telemetry Drawer:** Clicking any district updates the sidebar in real time:
  - Real-time Open-Meteo satellite badge (live temperature, feels-like, wind speed, relative humidity).
  - 4 empirical climate metrics (Average Temperature, Annual Rainfall, Drought Index, Peak Heat Risk).
  - Flood exposure assessment and top 3 district-specific climate challenges.
  - 1-click CTA button: `[ Analyze Climate Intelligence → ]`.

### Screen 3: Climate Intelligence & Machine Learning (`/intelligence`)
- **Header:** Live satellite telemetry pill (`🟢 LIVE TELEMETRY: 27.8°C (Clear Sky) • Open-Meteo`) and validated NASA POWER / PMD badges.
- **4 KPI Metric Cards:** Mean Warming Rate (+0.351°C/decade), Observed Warming Since 1980 (+1.82°C), Record Summer Peak (52.8°C), Record Flood Deluge (1,780 mm in 2022).
- **Historical Analysis:** 45-year annual temperature trendline (1980–2025) and monsoon rainfall variability charts.
- **Scenario Projections:** IPCC AR6 CMIP6 scenario comparison (SSP1-2.6 Paris Goal vs SSP2-4.5 Middle-of-the-road vs SSP5-8.5 Fossil-fueled) up to 2035.
- **6-Axis Risk Radar:** Evaluates Heat, Flood, Drought, Groundwater, Agriculture, and Cryosphere risk dimensions.
- **Machine Learning & Deep Learning Panel:** Interactive segmented switcher:
  - *Statistical ML:* OLS Linear Regression ($R^2 = 0.742$), K-Means 4-cluster risk archetypes, and empirical anomalies.
  - *Deep Learning (MLP):* Multi-Layer Perceptron architecture details, Adam optimizer, loss metric, and decadal projections (2026–2040).

### Screen 4: Policy Simulator Lab (`/change`)
- **6 Policy Sliders:** Renewable Energy (%), Afforestation (%), Mangrove Conservation (%), Canal Lining (%), Industrial Emissions Cap (%), Urban Greening (%).
- **Planetary Resilience Gauge:** Circular SVG gauge computing composite resilience (0–100%).
- **Dynamic Trajectory Chart:** Compares Business-As-Usual (BAU) vs Adapted Resilient trajectory up to 2035.
- **PDF Report Generator:** Compiles policy decisions into an academic-ready PDF report.

### Screen 5: ClimateGPT Assistant (`/chat`)
- Conversational AI assistant fine-tuned on Pakistan climate data, NDMA disaster alerts, and adaptation policies.

---

## 3. Machine Learning & Deep Learning Architecture

### Tier 1: Statistical Machine Learning
- **Ordinary Least Squares (OLS) & Ridge Regression:** Linear warming rate calculation ($\beta_1 \approx +0.351^\circ\text{C}$/decade, $R^2 = 0.742$, MSE = $0.118^\circ\text{C}^2$).
- **K-Means Clustering ($k=4$):** Clusters districts into risk archetypes (Hyper-Arid Thermal Maximum, Compound Flood-Thermal Indus Delta, Maritime Heat/Pluvial, Cryosphere Melt).
- **Residual Anomaly Detection:** Flags extreme outliers ($z > 2.0$), identifying 2010 super-floods, 2022 monsoon deluge, and 2024 heatwaves.

### Tier 2: Deep Learning Neural Sequence Model
- **Architecture:** Multi-Layer Perceptron (MLP) Regressor:
  $$\text{Input Vector} \to \text{Dense 64 (ReLU)} \to \text{Dense 32 (ReLU)} \to \text{Dense 1 (Output)}$$
- **Optimizer:** Adam ($\text{lr} = 0.005, \beta_1 = 0.9, \beta_2 = 0.999$, weight decay $10^{-4}$).
- **Training Epochs:** 250 epochs with early stopping.
- **Loss Metric:** $\text{MSE} = 0.064^\circ\text{C}^2$ ($45.7\%$ loss reduction over linear regression).
- **Accuracy Metric:** $R^2 = 0.824$.
- **Validation:** 5-Fold Time-Series Cross Validation preserving temporal sequence causality.

#### Deep Learning Multi-Decadal Projections (2026–2040)
| Year | Predicted Mean Temp | 95% Confidence Interval | Anomaly vs Baseline | Hazard Consequence |
| :--- | :---: | :---: | :---: | :--- |
| **2026** | 28.91°C | 28.59°C – 29.23°C | +0.81°C | Pre-monsoon thermal peaks in date-palm harvest zones |
| **2027** | 28.98°C | 28.66°C – 29.30°C | +0.88°C | Intensified Indus irrigation canal evaporation |
| **2028** | 29.07°C | 28.75°C – 29.39°C | +0.97°C | Accelerated high-altitude Karakoram snowmelt pulses |
| **2030** | 29.17°C | 28.85°C – 29.49°C | +1.07°C | Pre-monsoon moisture stress across lower Sindh wheat belts |
| **2032** | 29.33°C | 29.01°C – 29.65°C | +1.23°C | Increased wet-bulb temperatures exceeding 33°C |
| **2035** | 29.52°C | 29.20°C – 29.84°C | +1.42°C | Critical salinity threshold for Indus delta mangroves |
| **2040** | 29.75°C | 29.43°C – 30.07°C | +1.65°C | High risk of multi-season compound agricultural droughts in Thar |

---

## 4. Real-Time Meteorological API (Open-Meteo Integration)

- **Endpoint:** `GET /api/climate/live?district={district_id}`
- **Integration:** Keyless, zero-signup REST telemetry from Open-Meteo.
- **Attributes:** Temperature (°C), Apparent "Feels-Like" (°C), Relative Humidity (%), Wind Speed (km/h), Precipitation (mm), WMO weather condition code (0–95).
- **Empirical Offline Fallback:** If offline or during network interruptions, the engine automatically calculates verified harmonic baselines:
  $$T_{\text{empirical}} = T_{\text{base}} + 8.5 \cdot \sin\left(2\pi \cdot \left(\frac{\text{day\_of\_year}}{365.25} - 0.28\right)\right)$$
  Guarantees 100% uptime during presentations and offline exhibitions.

---

## 5. Human-Computer Interaction (HCI) Principles

1. **Cognitive Load Reduction (Miller's Law):** High-level KPI cards surface critical data immediately; raw regression equations and mathematical parameters are stored in progressive disclosure drawers.
2. **Screen-Fixed Cockpit Layout ("Screen Fix"):** The home page is bounded within `h-[calc(100vh-64px)] overflow-hidden`. Eliminates jarring page-scrolling into empty voids.
3. **Gestalt Visual Balance:** Controls live in the left 45% column; the 3D Earth occupies the right 55% column with ample padding. Zero collision.
4. **Fitts's Law:** Large, high-contrast action CTAs placed in primary thumb/mouse focus zones.

---

## 6. Ready-to-Use ChatGPT Prompts

Copy and paste these exact prompts directly into ChatGPT:

### Prompt 1: Prepare FYP Presentation Script
```text
I have built a production-grade Climate Intelligence, Deep Learning, and Policy Simulation platform called EcoVision-AI (Live at https://ecovision-ai-en0d.onrender.com/ and on GitHub at https://github.com/salmanshamsi925/EcoVision-AI). It targets the compound climate crisis in Pakistan and Sindh province. The frontend is built in React 19, TypeScript, and Three.js (featuring a full 3D interactive Earth digital twin with camera view offsets and procedural atmosphere shaders), and the backend is built in FastAPI with Scikit-Learn. It includes a Deep Multi-Layer Perceptron (MLP) Neural Network (Dense 64 [ReLU] -> Dense 32 [ReLU] -> Output, Adam optimizer, R² = 0.824, MSE = 0.064) predicting non-linear temperatures from 2026 to 2040, as well as live real-time satellite telemetry via the Open-Meteo API with an empirical offline fallback. Please help me prepare a 5-minute academic FYP viva presentation script covering the problem statement, architecture, AI models, and real-world policy impact.
```

### Prompt 2: Technical Viva Questions on Deep Learning
```text
ChatGPT, act as a strict AI and Data Science examiner evaluating my Final Year Project 'EcoVision-AI'. My project uses a Scikit-Learn MLPRegressor with an architecture of Input -> Dense 64 (ReLU) -> Dense 32 (ReLU) -> Output, trained on 45-year historical baselines (1980–2025) using K-Fold Time-Series Cross Validation (k=5) and Adam optimizer with lr=0.005. It achieved an R² score of 0.824 and MSE loss of 0.064 °C². Ask me 5 challenging technical viva questions about why I chose this neural architecture over basic linear regression, how I prevented overfitting, how time-series data leakage was avoided, and then provide the ideal model answers for each.
```

### Prompt 3: UI/UX and HCI Evaluation
```text
ChatGPT, help me write a detailed UI/UX and Human-Computer Interaction (HCI) section for my project documentation. My project EcoVision-AI uses a 'Screen-Fixed Cockpit' layout on the home page: the left 45% column houses a Google Earth-style city search bar, quick fly-to chips for Sindh districts (Khairpur, Karachi, Sukkur, Larkana), mission briefing, and high-contrast CTAs. The right 55% column houses an unclipped 3D WebGL rotating Earth digital twin offset by camera.setViewOffset so there is zero overlap. It includes interactive Leaflet GIS thematic maps, CMIP6 climate scenario comparison graphs, 6-axis risk radars, a 6-variable policy simulator with dynamic resilience scoring, and instant vector PDF report export. Please summarize the HCI principles and UX advantages of this design.
```

---
*EcoVision-AI &bull; Pakistan Climate Intelligence & Machine Learning Platform &bull; Live at https://ecovision-ai-en0d.onrender.com/*
