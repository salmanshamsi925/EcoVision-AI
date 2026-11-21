import React, { useState } from 'react';
import { Cpu, AlertTriangle, Activity, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface MLMetrics {
  linear_regression: {
    slope_c_per_decade: number;
    r2_score: number;
    rmse_c: number;
  };
  polynomial_regression: {
    degree: number;
    r2_score: number;
    rmse_c: number;
    acceleration_detected: boolean;
  };
}

interface MLFutureProj {
  year: number;
  predicted_temp_linear: number;
  predicted_temp_poly: number;
}

interface AnomalyItem {
  year: number;
  mean_temp_c: number;
  annual_rainfall_mm: number;
  anomaly_score: number;
  nature: string;
}

interface KMeansCluster {
  assigned_cluster_id: number;
  cluster_archetype: string;
  total_clusters: number;
  feature_vector_used: string[];
}

interface MachineLearningPanelProps {
  metrics: MLMetrics;
  futureProjections: MLFutureProj[];
  anomalies: AnomalyItem[];
  clustering: KMeansCluster;
  scientificInterpretation: string;
  districtName: string;
}

export const MachineLearningPanel: React.FC<MachineLearningPanelProps> = ({
  metrics,
  futureProjections,
  anomalies,
  clustering,
  scientificInterpretation,
  districtName
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-4">
      {/* ── Top Bar: ML Summary ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-eco-blue/15 border border-eco-blue/30 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-eco-blue" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-white text-sm sm:text-base">
              Machine Learning Model Validation
            </h3>
            <p className="text-[11px] text-eco-muted font-grotesk">
              Scikit-Learn regression & anomaly isolation for {districtName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-eco-green/10 text-eco-green border border-eco-green/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Model Fit R² = {metrics.linear_regression.r2_score}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-grotesk text-eco-blue hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition cursor-pointer"
          >
            <span>{showDetails ? 'Hide Details' : 'View Raw ML Stats'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* ── Executive 3-Card Summary (Clean, Low Cognitive Load) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-eco-bg/50 border border-white/5">
          <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
            Warming Trajectory
          </span>
          <div className="text-lg font-orbitron font-bold text-eco-orange mt-0.5">
            +{metrics.linear_regression.slope_c_per_decade}°C / decade
          </div>
          <span className="text-[10px] text-eco-muted font-grotesk mt-1 block">
            Linear slope across 1980–2025
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-eco-bg/50 border border-white/5">
          <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
            Detected Climate Shocks
          </span>
          <div className="text-lg font-orbitron font-bold text-eco-red mt-0.5">
            {anomalies.length} Critical Events
          </div>
          <span className="text-[10px] text-eco-muted font-grotesk mt-1 block">
            2010 & 2022 super floods isolated
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-eco-bg/50 border border-white/5">
          <span className="text-[10px] text-eco-muted font-grotesk uppercase tracking-wider block">
            K-Means Risk Archetype
          </span>
          <div className="text-xs font-orbitron font-bold text-eco-green mt-1 line-clamp-1" title={clustering.cluster_archetype}>
            {clustering.cluster_archetype}
          </div>
          <span className="text-[10px] text-eco-muted font-grotesk mt-1 block">
            Multi-dimensional risk cluster
          </span>
        </div>
      </div>

      {/* ── Plain-Language Scientific Interpretation ── */}
      <div className="p-3.5 rounded-xl bg-eco-blue/5 border border-eco-blue/20">
        <p className="text-xs font-grotesk text-eco-text leading-relaxed">
          <strong className="text-eco-blue">Executive Summary: </strong>
          {scientificInterpretation}
        </p>
      </div>

      {/* ── Progressive Disclosure: Detailed Tables (Hidden by default to prevent clutter) ── */}
      {showDetails && (
        <div className="pt-3 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Anomaly Table */}
            <div className="p-3.5 rounded-xl bg-eco-bg/70 border border-white/10">
              <h4 className="font-orbitron font-semibold text-white text-xs flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-eco-red" />
                Detected Climate Anomalies (Z-Score &gt; 1.75σ)
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {anomalies.map((anom) => (
                  <div
                    key={anom.year}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="font-bold text-white">{anom.year}</span>
                    <span className="text-eco-muted text-[11px] font-grotesk truncate max-w-[150px]">
                      {anom.nature}
                    </span>
                    <span className="text-eco-blue">{anom.annual_rainfall_mm}mm</span>
                    <span className="px-1.5 py-0.5 rounded bg-eco-red/20 text-eco-red text-[10px] font-bold">
                      {anom.anomaly_score}σ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Near-Term Projections */}
            <div className="p-3.5 rounded-xl bg-eco-bg/70 border border-white/10">
              <h4 className="font-orbitron font-semibold text-white text-xs flex items-center gap-1.5 mb-2">
                <Activity className="w-3.5 h-3.5 text-eco-blue" />
                Statistical Extrapolations (2027 • 2030 • 2035)
              </h4>
              <div className="space-y-1.5">
                {futureProjections.map((proj) => (
                  <div
                    key={proj.year}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="font-bold text-white">{proj.year}</span>
                    <span className="text-eco-muted text-[11px]">
                      Linear: <strong className="text-eco-blue">{proj.predicted_temp_linear}°C</strong>
                    </span>
                    <span className="text-eco-muted text-[11px]">
                      Poly: <strong className="text-eco-orange">{proj.predicted_temp_poly}°C</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

