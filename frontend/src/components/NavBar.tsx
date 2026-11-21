import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Globe2, 
  MapPin, 
  BarChart3, 
  Sliders, 
  Info,
  Menu,
  X,
  FileDown
} from 'lucide-react';
import { ActiveLocationPill } from './GuidedWorkflow';
import { useActiveLocation } from '../context/LocationContext';
import { generateClimatePDF } from '../reports/reportGenerator';

const navItems = [
  { name: 'Globe', path: '/', icon: Globe2 },
  { name: 'Pakistan GIS', path: '/pakistan', icon: MapPin },
  { name: 'Climate Intel', path: '/intelligence', icon: BarChart3 },
  { name: 'Policy Lab', path: '/change', icon: Sliders },
  { name: 'About', path: '/about', icon: Info },
];

export const NavBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeLocation } = useActiveLocation();

  const handleQuickPDFDownload = () => {
    generateClimatePDF({
      location: activeLocation,
      timelineYear: 2035,
      scenario: 'CMIP6 Synthesis (SSP2-4.5)',
      resilienceScore: 68.0,
      resilienceLevel: 'High Climate Resilience',
      policies: {
        renewable_energy: 55,
        forest_afforestation: 50,
        mangrove_conservation: 60,
        water_canal_lining: 65,
        emission_reduction: 45,
        urban_greening: 50,
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#07111F]/95 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* ── Brand Logo ────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-blue to-eco-green p-0.5 shadow-sm group-hover:shadow-neon-blue transition-all duration-300 shrink-0">
              <div className="w-full h-full bg-[#07111F] rounded-[9px] flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-eco-blue group-hover:text-eco-green transition-colors" />
              </div>
            </div>
            <div className="whitespace-nowrap">
              <span className="font-orbitron font-bold text-base tracking-wide text-white">
                EcoVision<span className="text-eco-blue">-AI</span>
              </span>
              <span className="hidden sm:block text-[9px] font-grotesk tracking-widest text-eco-muted/80 uppercase">
                Climate Command
              </span>
            </div>
          </Link>

          {/* ── Unified Modern Navigation Bar (HCI Clean Segmented Group) ── */}
          <nav className="hidden lg:flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] shadow-inner shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-xs font-grotesk font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-eco-blue/15 text-eco-blue font-semibold border border-eco-blue/30 shadow-sm shadow-eco-blue/10'
                        : 'text-eco-muted hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* ── Right-Side Controls (Synchronized, Compact, Professional) ── */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Active Region Dropdown Pill */}
            <ActiveLocationPill />

            {/* Quick 1-Click PDF Report Download */}
            <button
              onClick={handleQuickPDFDownload}
              title="Download Climate PDF Impact Report"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-eco-green/10 hover:bg-eco-green/20 border border-eco-green/30 text-eco-green text-xs font-grotesk font-semibold whitespace-nowrap transition-all shadow-sm shrink-0"
            >
              <FileDown className="w-3.5 h-3.5 shrink-0" />
              <span>PDF Report</span>
            </button>

            {/* Minimal Live Status Badge */}
            <div 
              title="NASA POWER & PMD Telemetry Synchronized"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1A2C] border border-white/[0.08] text-[10px] font-mono text-eco-green shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-eco-green animate-pulse" />
              <span>LIVE</span>
            </div>

            {/* Responsive Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0B1A2C] border border-white/10 text-eco-muted hover:text-white transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07111F]/98 border-b border-white/10 px-4 pt-2 pb-4 space-y-1 backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-xl text-sm font-grotesk font-medium flex items-center gap-3 transition ${
                    isActive
                      ? 'bg-eco-blue/20 text-eco-blue border border-eco-blue/40 font-semibold'
                      : 'text-eco-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-eco-blue shrink-0" />
                <span className="whitespace-nowrap">{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-white/10 sm:hidden">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleQuickPDFDownload();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-eco-green/20 border border-eco-green/40 text-eco-green text-xs font-grotesk font-bold"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF Impact Report</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
