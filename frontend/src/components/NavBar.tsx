import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Globe2, 
  MapPin, 
  BarChart3, 
  Sliders, 
  Info,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useActiveLocation } from '../context/LocationContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Pakistan GIS', path: '/pakistan' },
  { name: 'Climate Intel', path: '/intelligence' },
  { name: 'Policy Lab', path: '/change' },
  { name: 'About', path: '/about' },
];

export const NavBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const { activeLocation, setActiveLocationId, allLocations } = useActiveLocation();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#06111F]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* ── Brand Logo & Tagline ───────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#20C5FF] to-[#22D3A0] p-0.5 shadow-lg shadow-[#20C5FF]/20 group-hover:shadow-[#20C5FF]/40 transition-all duration-300 shrink-0">
              <div className="w-full h-full bg-[#06111F] rounded-[9px] flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-[#20C5FF] group-hover:text-[#22D3A0] transition-colors" />
              </div>
            </div>
            <div className="whitespace-nowrap">
              <span className="font-orbitron font-bold text-base tracking-wide text-white">
                EcoVision<span className="text-[#20C5FF]">-AI</span>
              </span>
              <span className="hidden sm:block text-[9.5px] font-grotesk tracking-wide text-eco-muted/80">
                Climate Intelligence for a Sustainable Pakistan
              </span>
            </div>
          </Link>

          {/* ── Pill-Shaped Center Navigation (Reference Image Style) ── */}
          <nav className="hidden lg:flex items-center bg-[#10243A]/80 p-1 rounded-full border border-white/[0.08] shadow-inner shrink-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-grotesk font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#20C5FF] text-[#06111F] font-bold shadow-md shadow-[#20C5FF]/25'
                      : 'text-eco-muted hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* ── Right-Side Controls (Live Badge & Location Dropdown) ── */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Indicator Pill */}
            <div 
              title="Real-Time Open-Meteo Satellite Feed Synchronized"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22D3A0]/10 border border-[#22D3A0]/25 text-[11px] font-mono text-[#22D3A0] shrink-0 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#22D3A0] animate-pulse" />
              <span className="font-bold">Live</span>
            </div>

            {/* Country / Location Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10243A] border border-white/10 text-xs font-grotesk text-white hover:border-[#20C5FF]/40 transition-all cursor-pointer shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-[#20C5FF]" />
                <span className="font-medium">{activeLocation?.name || 'Pakistan'}</span>
                <ChevronDown className="w-3 h-3 text-eco-muted" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B1B2D]/95 border border-[#20C5FF]/30 rounded-xl shadow-2xl backdrop-blur-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-mono text-eco-muted uppercase tracking-wider border-b border-white/5 mb-1">
                    Select Focus District
                  </div>
                  {allLocations.slice(0, 8).map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setActiveLocationId(loc.id);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-grotesk transition flex items-center justify-between ${
                        activeLocation?.id === loc.id
                          ? 'bg-[#20C5FF]/20 text-[#20C5FF] font-bold'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{loc.name}</span>
                      <span className="text-[10px] font-mono text-eco-muted">{loc.province || 'Sindh'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Responsive Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#10243A] border border-white/10 text-eco-muted hover:text-white transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#06111F]/98 border-b border-white/10 px-4 pt-2 pb-4 space-y-1 backdrop-blur-2xl">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-grotesk font-medium flex items-center justify-between transition ${
                  isActive
                    ? 'bg-[#20C5FF] text-[#06111F] font-bold shadow-md'
                    : 'text-eco-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
