import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { ClimateGPTDrawer } from './components/ClimateGPTDrawer';
import { LocationProvider } from './context/LocationContext';
import { Home } from './pages/Home';
import { ExplorePakistan } from './pages/ExplorePakistan';
import { ClimateIntelligence } from './pages/ClimateIntelligence';
import { ChangeFuture } from './pages/ChangeFuture';
import { ClimateGPT } from './pages/ClimateGPT';
import { AboutProject } from './pages/AboutProject';

export default function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        <div className="min-h-screen bg-[#07111F] text-[#F5F7FA] flex flex-col font-inter selection:bg-[#22B8FF] selection:text-[#07111F]">
          {/* Futuristic Command Header */}
          <NavBar />

          {/* Dynamic Route Viewport */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pakistan" element={<ExplorePakistan />} />
              <Route path="/intelligence" element={<ClimateIntelligence />} />
              <Route path="/change" element={<ChangeFuture />} />
              <Route path="/gpt" element={<ClimateGPT />} />
              <Route path="/about" element={<AboutProject />} />
            </Routes>
          </main>

          {/* Command Center Footer */}
          <footer className="border-t border-white/10 py-6 px-4 bg-[#07111F]/80 backdrop-blur-sm text-center text-xs text-eco-muted font-grotesk">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <strong className="text-white font-orbitron">EcoVision-AI</strong> — THE FUTURE IS IN YOUR HANDS
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-eco-blue">Near-Term Timelines: 2027 • 2030 • 2035</span>
                <span>•</span>
                <span className="text-eco-green">CMIP6 Scenarios: SSP1-2.6 / 2-4.5 / 5-8.5</span>
              </div>
            </div>
          </footer>

          {/* Global Floating AI Assistant Widget */}
          <ClimateGPTDrawer />
        </div>
      </LocationProvider>
    </BrowserRouter>
  );
}
