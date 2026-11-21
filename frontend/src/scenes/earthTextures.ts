import * as THREE from 'three';

/**
 * Creates high-detail procedural earth textures using HTML5 Canvas.
 * Generates natural satellite-style continents, terrain elevation gradients,
 * realistic desert belts, snow caps, river corridors, and atmospheric clouds.
 * 100% offline exhibition operation without external texture downloads.
 */

export interface EarthTextures {
  dayTexture: THREE.CanvasTexture;
  nightTexture: THREE.CanvasTexture;
  cloudsTexture: THREE.CanvasTexture;
  specularMap: THREE.CanvasTexture;
}

export function generateProceduralEarthTextures(): EarthTextures {
  const width = 2048;
  const height = 1024;

  // 1. DAY TEXTURE
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = width;
  dayCanvas.height = height;
  const dayCtx = dayCanvas.getContext('2d')!;

  // Equirectangular projection mapping helpers
  function toX(lon: number) { return ((lon + 180) / 360) * width; }
  function toY(lat: number) { return ((90 - lat) / 180) * height; }

  // Deep Ocean gradient (rich bathymetric depths)
  const oceanGrad = dayCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#030d1a'); // Arctic deep blue
  oceanGrad.addColorStop(0.3, '#071d36');
  oceanGrad.addColorStop(0.5, '#0a294d'); // Tropical ocean
  oceanGrad.addColorStop(0.7, '#071d36');
  oceanGrad.addColorStop(1, '#030d1a'); // Antarctic deep blue
  dayCtx.fillStyle = oceanGrad;
  dayCtx.fillRect(0, 0, width, height);

  // Ocean coastal shelf turquoise fringe glow
  dayCtx.strokeStyle = 'rgba(28, 160, 220, 0.28)';
  dayCtx.lineWidth = 10;
  dayCtx.lineJoin = 'round';
  dayCtx.lineCap = 'round';

  // ── Helper to draw and style landmass ───────────────────────────────────────
  function drawPolygon(points: [number, number][], fillColor: string, strokeColor?: string) {
    if (points.length === 0) return;
    dayCtx.beginPath();
    dayCtx.moveTo(toX(points[0][0]), toY(points[0][1]));
    for (let i = 1; i < points.length; i++) {
      dayCtx.lineTo(toX(points[i][0]), toY(points[i][1]));
    }
    dayCtx.closePath();
    dayCtx.fillStyle = fillColor;
    dayCtx.fill();
    if (strokeColor) {
      dayCtx.strokeStyle = strokeColor;
      dayCtx.stroke();
    }
  }

  // ── Continent 1: Africa (Realistic Multi-Vertex Landmass) ───────────────────
  // A. Southern/Central Africa (Lush Green / Savanna)
  drawPolygon([
    [-17, 15], [-12, 5], [9, 4], [12, -5], [14, -18], [18, -34],
    [26, -34], [33, -26], [40, -12], [42, -2], [51, 10], [43, 12],
    [32, 2], [20, 5], [10, 5], [-5, 5], [-17, 15]
  ], '#1e4620', 'rgba(28, 160, 220, 0.25)');

  // B. Sahara Desert & Northern Africa (Sandy Ochre / Arid)
  drawPolygon([
    [-17, 15], [-17, 22], [-13, 28], [-5, 36], [10, 37], [25, 32],
    [32, 31], [36, 22], [43, 12], [51, 10], [42, -2], [32, 2],
    [10, 5], [-5, 5], [-17, 15]
  ], '#b89358', 'rgba(28, 160, 220, 0.25)');

  // Nile River Green Ribbon
  dayCtx.strokeStyle = '#2d8a4e';
  dayCtx.lineWidth = 3;
  dayCtx.beginPath();
  dayCtx.moveTo(toX(31), toY(2));
  dayCtx.quadraticCurveTo(toX(32), toY(18), toX(31), toY(31));
  dayCtx.stroke();

  // ── Continent 2: Eurasia (Europe, Russia, Central & East Asia) ──────────────
  // Europe & Western Asia
  drawPolygon([
    [-9, 36], [-9, 43], [-2, 48], [-5, 58], [5, 62], [15, 55],
    [28, 70], [40, 68], [60, 68], [80, 72], [110, 73], [140, 72],
    [170, 66], [165, 58], [142, 50], [130, 42], [122, 30], [105, 20],
    [100, 10], [92, 16], [88, 22], [76, 28], [60, 30], [48, 30],
    [36, 36], [28, 41], [14, 45], [0, 42], [-9, 36]
  ], '#1f432b', 'rgba(28, 160, 220, 0.25)');

  // Arabian Peninsula (Warm Arid Desert Ochre)
  drawPolygon([
    [35, 30], [40, 22], [43, 13], [51, 12], [55, 17], [60, 22],
    [56, 26], [48, 30], [35, 30]
  ], '#c49a5b', 'rgba(28, 160, 220, 0.3)');

  // Central Asian / Iranian Steppe (Semi-Arid)
  drawPolygon([
    [48, 30], [56, 26], [60, 25], [60.8, 32], [66, 37], [74, 38],
    [76, 34], [60, 30], [48, 30]
  ], '#7a6f44');

  // ── Continent 3: Pakistan & South Asia (High-Detail Geographic Center) ──────
  // Pakistan Administrative & Topographical Polygon
  drawPolygon([
    [60.9, 25.2], [63.5, 25.0], [66.8, 24.8], [68.2, 23.8], [68.9, 24.4],
    [70.0, 24.8], [71.5, 27.2], [74.2, 30.5], [75.5, 32.8], [74.5, 34.8],
    [73.0, 36.8], [71.2, 36.2], [69.2, 37.0], [66.0, 37.2], [62.2, 35.8],
    [60.8, 32.2], [60.9, 25.2]
  ], '#6e673c', 'rgba(34, 184, 255, 0.6)');

  // Thar Desert Sandy Overlay
  dayCtx.fillStyle = 'rgba(212, 163, 89, 0.6)';
  dayCtx.beginPath();
  dayCtx.ellipse(toX(70.5), toY(26.2), width * 0.02, height * 0.035, 0.15, 0, Math.PI * 2);
  dayCtx.fill();

  // Fertile Indus River Basin (Vibrant Green agricultural belt through Pakistan)
  dayCtx.strokeStyle = '#35D39A';
  dayCtx.lineWidth = 4;
  dayCtx.lineCap = 'round';
  dayCtx.lineJoin = 'round';
  dayCtx.beginPath();
  dayCtx.moveTo(toX(75.5), toY(35.5)); // Glacial source
  dayCtx.quadraticCurveTo(toX(72.0), toY(32.0), toX(70.5), toY(29.5));
  dayCtx.quadraticCurveTo(toX(69.0), toY(27.0), toX(68.2), toY(24.8)); // Kotri / Hyderabad
  dayCtx.lineTo(toX(67.8), toY(23.8)); // Indus Delta
  dayCtx.stroke();

  // Indus Delta Mangrove Zone
  dayCtx.fillStyle = 'rgba(53, 211, 154, 0.55)';
  dayCtx.beginPath();
  dayCtx.ellipse(toX(67.8), toY(24.0), 22, 12, 0.2, 0, Math.PI * 2);
  dayCtx.fill();

  // Indian Subcontinent (Tropical Green Peninsula)
  drawPolygon([
    [70.0, 24.8], [72.8, 21.0], [76.0, 15.0], [77.5, 8.2], [80.2, 13.0],
    [85.0, 20.0], [88.5, 22.0], [90.0, 26.0], [77.0, 32.0], [74.2, 30.5],
    [71.5, 27.2], [70.0, 24.8]
  ], '#255228', 'rgba(28, 160, 220, 0.25)');

  // Himalayas & Karakoram Snow-Capped Mountain Arc
  dayCtx.fillStyle = '#eaf2f8'; // Bright snow white
  dayCtx.beginPath();
  dayCtx.moveTo(toX(71.0), toY(36.5));
  dayCtx.bezierCurveTo(toX(76.0), toY(34.0), toX(82.0), toY(31.0), toX(90.0), toY(28.0));
  dayCtx.bezierCurveTo(toX(88.0), toY(26.5), toX(80.0), toY(29.0), toX(73.0), toY(34.0));
  dayCtx.closePath();
  dayCtx.fill();

  // Tibetan High Plateau (Cold High Steppe)
  drawPolygon([
    [78, 35], [92, 35], [95, 30], [88, 28], [80, 31], [78, 35]
  ], '#7a7050');

  // ── Continent 4: East Asia & Southeast Asia ─────────────────────────────────
  drawPolygon([
    [105, 20], [108, 12], [104, 1], [100, 5], [98, 15], [105, 20]
  ], '#1d4d29'); // Indochina & Malaysia

  // Indonesian Archipelago / Philippines
  const seaIslands = [
    { x: 102, y: -2, rx: 16, ry: 5, rot: -0.4 }, // Sumatra
    { x: 112, y: -7, rx: 14, ry: 4, rot: 0 },    // Java
    { x: 114, y: 1, rx: 12, ry: 12, rot: 0.2 },  // Borneo
    { x: 122, y: 13, rx: 6, ry: 14, rot: 0.1 },  // Philippines
  ];
  seaIslands.forEach(isl => {
    dayCtx.beginPath();
    dayCtx.ellipse(toX(isl.x), toY(isl.y), isl.rx, isl.ry, isl.rot, 0, Math.PI * 2);
    dayCtx.fillStyle = '#1e5229';
    dayCtx.fill();
  });

  // ── Continent 5: Australia (Realistic Coastline & Red Outback) ──────────────
  drawPolygon([
    [114, -22], [115, -34], [122, -34], [130, -32], [138, -35],
    [148, -38], [152, -28], [145, -15], [136, -12], [130, -14],
    [124, -16], [114, -22]
  ], '#a85832', 'rgba(28, 160, 220, 0.3)'); // Red iron outback

  // Australian Eastern Green Forest Fringe
  dayCtx.fillStyle = '#2d633a';
  dayCtx.beginPath();
  dayCtx.moveTo(toX(146), toY(-37));
  dayCtx.lineTo(toX(152), toY(-28));
  dayCtx.lineTo(toX(145), toY(-15));
  dayCtx.lineTo(toX(140), toY(-25));
  dayCtx.closePath();
  dayCtx.fill();

  // ── Continent 6: The Americas ──────────────────────────────────────────────
  // North America (Alaska, Canada, US, Mexico)
  drawPolygon([
    [-168, 65], [-140, 68], [-125, 70], [-95, 70], [-80, 62], [-65, 48],
    [-75, 35], [-81, 25], [-90, 30], [-97, 26], [-105, 20], [-95, 16],
    [-105, 22], [-115, 32], [-124, 40], [-130, 52], [-140, 60], [-168, 65]
  ], '#1f482d', 'rgba(28, 160, 220, 0.25)');

  // Western US Arid Great Basin
  dayCtx.fillStyle = '#9e814a';
  dayCtx.beginPath();
  dayCtx.ellipse(toX(-112), toY(36), 18, 25, 0.1, 0, Math.PI * 2);
  dayCtx.fill();

  // South America (Amazon Rainforest & Andes Ridge)
  drawPolygon([
    [-77, 8], [-60, 5], [-50, -2], [-35, -5], [-37, -12], [-42, -22],
    [-52, -34], [-65, -54], [-73, -48], [-75, -30], [-80, -10],
    [-80, 0], [-77, 8]
  ], '#194522', 'rgba(28, 160, 220, 0.25)');

  // Andes Mountain Snowline
  dayCtx.strokeStyle = 'rgba(230, 240, 250, 0.4)';
  dayCtx.lineWidth = 3;
  dayCtx.beginPath();
  dayCtx.moveTo(toX(-77), toY(8));
  dayCtx.lineTo(toX(-78), toY(-15));
  dayCtx.lineTo(toX(-70), toY(-42));
  dayCtx.stroke();

  // 2. NIGHT LIGHTS TEXTURE
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = width;
  nightCanvas.height = height;
  const nightCtx = nightCanvas.getContext('2d')!;

  nightCtx.fillStyle = '#01050a';
  nightCtx.fillRect(0, 0, width, height);

  // Urban light clusters with glowing halos
  const urbanClusters = [
    { lon: 67.0, lat: 24.86, r: 8, intensity: 1.0 }, // Karachi (Sindh)
    { lon: 68.35, lat: 25.39, r: 5, intensity: 0.8 }, // Hyderabad
    { lon: 68.85, lat: 27.70, r: 4, intensity: 0.75 }, // Sukkur
    { lon: 68.21, lat: 27.55, r: 4, intensity: 0.75 }, // Larkana
    { lon: 68.75, lat: 27.52, r: 3, intensity: 0.7 }, // Khairpur
    { lon: 74.35, lat: 31.52, r: 7, intensity: 0.95 }, // Lahore
    { lon: 73.04, lat: 33.68, r: 6, intensity: 0.9 }, // Islamabad
    { lon: 71.52, lat: 34.01, r: 5, intensity: 0.8 }, // Peshawar
    { lon: 66.97, lat: 30.17, r: 4, intensity: 0.7 }, // Quetta
    { lon: 72.87, lat: 19.07, r: 9, intensity: 0.95 }, // Mumbai
    { lon: 77.20, lat: 28.61, r: 9, intensity: 0.95 }, // Delhi
    { lon: 55.27, lat: 25.20, r: 8, intensity: 1.0 }, // Dubai
    { lon: 2.35, lat: 48.85, r: 8, intensity: 0.9 }, // Paris
    { lon: -0.12, lat: 51.50, r: 8, intensity: 0.9 }, // London
    { lon: -74.00, lat: 40.71, r: 10, intensity: 1.0 }, // NYC
    { lon: 139.69, lat: 35.68, r: 10, intensity: 1.0 }, // Tokyo
  ];

  urbanClusters.forEach(city => {
    const x = toX(city.lon);
    const y = toY(city.lat);
    const rad = city.r * 2.5;

    const g = nightCtx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, `rgba(255, 235, 160, ${city.intensity})`);
    g.addColorStop(0.35, `rgba(255, 160, 60, ${city.intensity * 0.6})`);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');

    nightCtx.fillStyle = g;
    nightCtx.beginPath();
    nightCtx.arc(x, y, rad, 0, Math.PI * 2);
    nightCtx.fill();
  });

  // 3. CLOUDS TEXTURE (Natural Soft Wispy Atmospheric Weather Bands)
  const cloudsCanvas = document.createElement('canvas');
  cloudsCanvas.width = width;
  cloudsCanvas.height = height;
  const cloudsCtx = cloudsCanvas.getContext('2d')!;

  cloudsCtx.fillStyle = '#000000';
  cloudsCtx.fillRect(0, 0, width, height);

  // A. Equatorial ITCZ Cloud Band (Tropical convective storms)
  cloudsCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 45; i++) {
    const cx = (i / 45) * width + (Math.random() - 0.5) * 60;
    const cy = toY(0) + (Math.sin(i * 0.4) * 25) + (Math.random() - 0.5) * 40;
    const rx = Math.random() * 80 + 40;
    const ry = Math.random() * 20 + 8;
    cloudsCtx.beginPath();
    cloudsCtx.ellipse(cx, cy, rx, ry, 0.1, 0, Math.PI * 2);
    cloudsCtx.fill();
  }

  // B. Mid-Latitude Weather Swirls & Fronts
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * width;
    const lat = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 40 + 20);
    const cy = toY(lat);
    const rx = Math.random() * 140 + 50;
    const ry = Math.random() * 35 + 12;
    const rot = (Math.random() - 0.5) * 0.6;

    cloudsCtx.beginPath();
    cloudsCtx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    cloudsCtx.fill();
  }

  // C. Monsoon Swirl over Arabian Sea / South Asia
  cloudsCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  cloudsCtx.beginPath();
  cloudsCtx.ellipse(toX(68), toY(20), 75, 45, -0.4, 0, Math.PI * 2);
  cloudsCtx.fill();

  // 4. SPECULAR MAP (Oceans reflective, land matte)
  const specCanvas = document.createElement('canvas');
  specCanvas.width = width;
  specCanvas.height = height;
  const specCtx = specCanvas.getContext('2d')!;

  specCtx.fillStyle = '#ffffff';
  specCtx.fillRect(0, 0, width, height);

  // Land absorbed (dark gray / black)
  specCtx.fillStyle = '#111111';
  specCtx.drawImage(dayCanvas, 0, 0);

  const dayTexture = new THREE.CanvasTexture(dayCanvas);
  const nightTexture = new THREE.CanvasTexture(nightCanvas);
  const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
  const specularMap = new THREE.CanvasTexture(specCanvas);

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  return { dayTexture, nightTexture, cloudsTexture, specularMap };
}

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates on a sphere of radius R.
 * Calibrated specifically for equirectangular projection mapping in Three.js.
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
}
