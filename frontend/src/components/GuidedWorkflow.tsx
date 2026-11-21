import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Globe2, MapPin, BarChart3, Eye, Sliders, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';

export const WORKFLOW_STEPS = [
  { step: 1, name: '1. Globe', path: '/', icon: Globe2 },
  { step: 2, name: '2. Sindh Map', path: '/pakistan', icon: MapPin },
  { step: 3, name: '3. Climate Intel', path: '/intelligence', icon: BarChart3 },
  { step: 4, name: '4. Policy Lab', path: '/change', icon: Sliders },
];

/**
 * Top Workflow Stepper bar showing current journey progress
 */
export const GuidedWorkflowStepper: React.FC = () => {
  const location = useLocation();

  const getCurrentStepIndex = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/pakistan')) return 1;
    if (path.startsWith('/intelligence')) return 2;
    if (path.startsWith('/change')) return 3;
    return -1;
  };

  const currentIndex = getCurrentStepIndex();
  if (currentIndex === -1) return null;

  return (
    <div className="bg-[#07111F]/90 border-b border-white/5 py-1 px-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="text-[10px] font-mono uppercase text-eco-muted/70 tracking-wider hidden md:inline">
            Workflow:
          </span>
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = idx === currentIndex;
            const isCompleted = idx < currentIndex;

            return (
              <React.Fragment key={step.path}>
                <NavLink
                  to={step.path}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-grotesk transition-all duration-200 shrink-0 ${
                    isCurrent
                      ? 'bg-eco-blue/20 text-eco-blue border border-eco-blue/40 font-semibold shadow-sm shadow-eco-blue/20'
                      : isCompleted
                      ? 'text-eco-green/90 hover:text-white hover:bg-white/5'
                      : 'text-eco-muted/60 hover:text-eco-muted hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{step.name}</span>
                  {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 text-eco-green ml-0.5" />}
                </NavLink>

                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ChevronRight className="w-2.5 h-2.5 text-white/20 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* System mode indicator */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-eco-blue/80 bg-eco-blue/10 px-2 py-0.5 rounded border border-eco-blue/20">
            Step {currentIndex + 1} of {WORKFLOW_STEPS.length} Active
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Top-bar persistent location context pill with sleek quick switcher dropdown
 */
export const ActiveLocationPill: React.FC = () => {
  const { activeLocation, setActiveLocationId, allLocations } = useActiveLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1A2C] border border-white/10 hover:border-eco-blue/40 text-xs font-grotesk text-white transition-all shadow-sm group shrink-0 whitespace-nowrap"
        title="Change Active District"
      >
        <MapPin className="w-3.5 h-3.5 text-eco-blue shrink-0" />
        <span className="font-semibold text-white group-hover:text-eco-blue transition-colors">
          {activeLocation.name}
        </span>
        <span className="text-[10px] text-eco-muted font-mono bg-white/5 px-1.5 py-0.5 rounded hidden md:inline">
          {activeLocation.province}
        </span>
        <ChevronRight className={`w-3 h-3 text-eco-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-90 text-eco-blue' : ''} shrink-0`} />
      </button>

      {/* Dropdown for quick change */}
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl z-50 p-2 border border-eco-blue/30 overflow-hidden"
          style={{ background: 'rgba(13,27,42,0.96)', backdropFilter: 'blur(16px)' }}
        >
          <div className="px-2 py-1.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-grotesk uppercase text-eco-muted tracking-wider">
              Select Regional Context
            </span>
            <span className="text-[9px] font-mono text-eco-green">14 Sindh Districts</span>
          </div>
          <div className="max-h-56 overflow-y-auto space-y-1 mt-1">
            {Object.values(allLocations).map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocationId(loc.id);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-grotesk flex items-center justify-between transition ${
                  activeLocation.id === loc.id
                    ? 'bg-eco-blue/20 text-eco-blue border border-eco-blue/30 font-bold'
                    : 'text-eco-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{loc.name}</span>
                <span className="text-[10px] font-mono text-eco-muted">{loc.temp_c}°C</span>
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 mt-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate('/pakistan');
              }}
              className="w-full py-1 text-center text-[11px] font-grotesk text-eco-blue hover:underline"
            >
              Open Full GIS Map →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Sleek Next Step Call-To-Action banner positioned cleanly at the end of page content (no floating overlap)
 */
export const WorkflowNextBanner: React.FC<{
  nextStepName: string;
  nextStepPath: string;
  currentStepLabel?: string;
  subtext?: string;
}> = ({ nextStepName, nextStepPath, currentStepLabel, subtext }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-8">
      <div className="hud-card p-4 sm:p-5 rounded-2xl border border-eco-blue/30 bg-gradient-to-r from-eco-blue/10 via-[#0B1A2C] to-eco-green/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-eco-blue to-eco-green p-0.5 shrink-0 shadow-lg shadow-eco-blue/20">
            <div className="w-full h-full bg-[#07111F] rounded-[9px] flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-eco-blue" />
            </div>
          </div>
          <div>
            {currentStepLabel && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-eco-green font-semibold block">
                ✓ {currentStepLabel}
              </span>
            )}
            <h4 className="text-sm sm:text-base font-orbitron font-bold text-white">
              Next Step: {nextStepName}
            </h4>
            {subtext && <p className="text-xs text-eco-muted mt-0.5">{subtext}</p>}
          </div>
        </div>

        <button
          onClick={() => navigate(nextStepPath)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-eco-blue hover:bg-eco-blue/90 text-eco-bg font-grotesk font-bold text-xs shrink-0 shadow-lg shadow-eco-blue/25 flex items-center justify-center gap-2 transition hover:scale-105 cursor-pointer"
        >
          <span>Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
