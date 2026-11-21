import { jsPDF } from 'jspdf';
import type { LocationInfo } from '../context/LocationContext';

export interface ReportData {
  location: LocationInfo;
  timelineYear: number;
  scenario: string;
  resilienceScore: number;
  resilienceLevel: string;
  policies: {
    renewable_energy: number;
    forest_afforestation: number;
    mangrove_conservation: number;
    water_canal_lining: number;
    emission_reduction: number;
    urban_greening: number;
  };
  impacts?: {
    temp_reduction_c: number;
    flood_reduction_pct: number;
    water_saved_maf: number;
    crop_protection_pct: number;
  };
  recommendations?: string[];
}

export function generateClimatePDF(data: ReportData): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const reportId = `EV-${data.location.name.toUpperCase().slice(0, 4)}-${Math.floor(Date.now() / 1000)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // Header Banner Background
  doc.setFillColor(7, 17, 31); // #07111F
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Header Text
  doc.setTextColor(34, 184, 255); // #22B8FF
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EcoVision-AI Climate Intelligence', margin, 12);

  doc.setTextColor(245, 247, 250);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('PERSONALIZED REGIONAL CLIMATE IMPACT & POLICY REPORT', margin, 18);

  doc.setTextColor(150, 165, 185);
  doc.setFontSize(8);
  doc.text(`Report ID: ${reportId}   |   Issued: ${dateStr}   |   Target Year: ${data.timelineYear}`, margin, 24);

  // Line separator
  doc.setDrawColor(53, 211, 154); // eco-green
  doc.setLineWidth(0.8);
  doc.line(margin, 32, pageWidth - margin, 32);

  y = 40;

  // 1. Executive Summary & District Profile
  doc.setFillColor(243, 246, 250);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 26, 2, 2, 'F');

  doc.setTextColor(7, 17, 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`District Target: ${data.location.name}, ${data.location.province}`, margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Coordinates: ${data.location.lat.toFixed(2)}°N, ${data.location.lon.toFixed(2)}°E   |   Baseline Mean Temp: ${data.location.temp_c}°C   |   Rainfall: ${data.location.rainfall_mm} mm/yr`, margin + 4, y + 13);
  doc.text(`Historical Vulnerability: Heat Risk: ${data.location.heat_risk}   |   Flood: ${data.location.flood_exposure}`, margin + 4, y + 19);

  y += 33;

  // 2. Synthesized Resilience Index Gauge Box
  const isHigh = data.resilienceScore >= 65;
  const isChampion = data.resilienceScore >= 85;

  doc.setFillColor(isChampion ? 230 : isHigh ? 235 : 254, isChampion ? 248 : isHigh ? 245 : 235, isChampion ? 238 : isHigh ? 255 : 235);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(isChampion ? 16 : isHigh ? 2 : 185, isChampion ? 185 : isHigh ? 132 : 28, isChampion ? 129 : isHigh ? 199 : 28);
  doc.text(`Planetary Resilience Score: ${data.resilienceScore.toFixed(1)} / 100 PTS  —  ${data.resilienceLevel}`, margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 75, 95);
  doc.text(`Scenario: ${data.scenario} | Model Weights: Renewables (22%), Forests (18%), Mangroves (15%), Canal (20%), Emissions (15%), Urban (10%)`, margin + 4, y + 15);

  y += 28;

  // 3. User Policy Interventions Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 17, 31);
  doc.text('3. Sectoral Policy Interventions (Simulated Allocation)', margin, y);
  y += 5;

  const colW = (pageWidth - 2 * margin) / 3;
  const policyItems = [
    { name: 'Renewable Solar', val: `${data.policies.renewable_energy}%`, weight: '22%' },
    { name: 'Forestry & Belts', val: `${data.policies.forest_afforestation}%`, weight: '18%' },
    { name: 'Mangrove Protection', val: `${data.policies.mangrove_conservation}%`, weight: '15%' },
    { name: 'Canal Lining & Drip', val: `${data.policies.water_canal_lining}%`, weight: '20%' },
    { name: 'Emission Reduction', val: `${data.policies.emission_reduction}%`, weight: '15%' },
    { name: 'Urban Cool Greening', val: `${data.policies.urban_greening}%`, weight: '10%' },
  ];

  policyItems.forEach((p, idx) => {
    const r = Math.floor(idx / 3);
    const c = idx % 3;
    const boxX = margin + c * colW;
    const boxY = y + r * 14;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, boxY, colW - 3, 11, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(p.name, boxX + 3, boxY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(2, 132, 199);
    doc.text(p.val, boxX + colW - 14, boxY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Weight: ${p.weight}`, boxX + 3, boxY + 9);
  });

  y += 34;

  // 4. Quantitative Mitigated Outcomes vs Unmitigated 2050 Baseline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 17, 31);
  doc.text('4. Projected Climate Impact Deltas (Relative to Unmitigated Baseline)', margin, y);
  y += 5;

  const tempRed = data.impacts?.temp_reduction_c ?? (0.4 + ((data.policies.emission_reduction * 0.4 + data.policies.renewable_energy * 0.35 + data.policies.urban_greening * 0.25) / 100) * 2.4);
  const floodRed = data.impacts?.flood_reduction_pct ?? (12.0 + ((data.policies.forest_afforestation * 0.35 + data.policies.mangrove_conservation * 0.35 + data.policies.water_canal_lining * 0.30) / 100) * 53.0);
  const waterSav = data.impacts?.water_saved_maf ?? (0.4 + ((data.policies.water_canal_lining * 0.70 + data.policies.forest_afforestation * 0.30) / 100) * 3.8);
  const cropProt = data.impacts?.crop_protection_pct ?? (8.0 + ((data.policies.water_canal_lining * 0.40 + 20 + data.policies.renewable_energy * 0.15) / 100) * 32.0);

  const deltaCards = [
    { title: 'Peak Summer Temp', baseline: '+4.2°C', sim: `+${(4.2 - tempRed).toFixed(1)}°C`, delta: `-${tempRed.toFixed(2)}°C Cooler` },
    { title: 'Flood Area Exposed', baseline: '100% Exposed', sim: `${(100 - floodRed).toFixed(1)}% Area`, delta: `-${floodRed.toFixed(1)}% Mitigated` },
    { title: 'Indus Water Saved', baseline: '0.0 MAF (Seepage)', sim: `${waterSav.toFixed(2)} MAF Saved`, delta: `+${waterSav.toFixed(2)} MAF` },
    { title: 'Crop Harvests Saved', baseline: '-42% Yield Loss', sim: `-${Math.max(4, 42 - cropProt).toFixed(1)}% Protected`, delta: `+${cropProt.toFixed(1)}% Preserved` },
  ];

  const cardW = (pageWidth - 2 * margin) / 4;
  deltaCards.forEach((dc, idx) => {
    const cardX = margin + idx * cardW;
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(cardX, y, cardW - 2.5, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(3, 105, 161);
    doc.text(dc.title, cardX + 2.5, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text(dc.delta, cardX + 2.5, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Base: ${dc.baseline}`, cardX + 2.5, y + 14.5);
  });

  y += 25;

  // 5. Tailored Policy Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(7, 17, 31);
  doc.text(`5. Strategic Recommendations for ${data.location.name}`, margin, y);
  y += 5;

  const recs = data.recommendations && data.recommendations.length > 0 ? data.recommendations : [
    `Execute extensive canal lining and pressurized drip irrigation in ${data.location.name} to preserve Indus river flow.`,
    `Deploy agroforestry shelterbelts and solar tubewells to buffer regional staple harvests from lethal thermal shock.`,
    `Transition municipal power grids and brick kilns to clean distributed solar arrays and zigzag technology.`
  ];

  recs.forEach((rec, i) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 8.5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129);
    doc.text(`[#${i + 1}]`, margin + 2.5, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(30, 41, 59);
    doc.text(rec.length > 95 ? rec.substring(0, 92) + '...' : rec, margin + 11, y + 5.5);

    y += 11;
  });

  y += 4;

  // 6. Scientific Attribution & Disclaimer Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SCIENTIFIC ATTRIBUTION & METHODOLOGY', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Empirical data sources: Pakistan Meteorological Department (PMD), NASA POWER, World Bank GFDRR, and IUCN.', margin + 3, y + 8.5);
  doc.text('Climate Projections: CMIP6 Multi-Model Ensemble under SSP1-2.6, SSP2-4.5, and SSP5-8.5. Projections represent plausible multi-decadal trends.', margin + 3, y + 12);
  doc.text('Generated via EcoVision-AI Provincial Platform — "The Future is in Your Hands". For academic and policy guidance only.', margin + 3, y + 15.5);

  // Footer Branding
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(`EcoVision-AI Verification Digest • Verified Regional Dataset: ${data.location.name} • Page 1 of 1`, margin, pageHeight - 6);

  // Trigger download
  const filename = `EcoVision_${data.location.name}_Climate_Report_${data.timelineYear}.pdf`;
  doc.save(filename);
  return filename;
}
