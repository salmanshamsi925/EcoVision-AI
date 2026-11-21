import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
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
        <div className="min-h-screen bg-[#06111F] text-[#F8FAFC] flex flex-col font-inter selection:bg-[#20C5FF] selection:text-[#06111F]">
          {/* Futuristic Command Header */}
          <NavBar />

          {/* Dynamic Route Viewport */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pakistan" element={<ExplorePakistan />} />
              <Route path="/intelligence" element={<ClimateIntelligence />} />
              <Route path="/change" element={<ChangeFuture />} />
              <Route path="/assistant" element={<ClimateGPT />} />
              <Route path="/gpt" element={<ClimateGPT />} />
              <Route path="/about" element={<AboutProject />} />
            </Routes>
          </main>

          {/* World-Class Footer */}
          <Footer />

          {/* Global Floating AI Assistant Widget */}
          <ClimateGPTDrawer />
        </div>
      </LocationProvider>
    </BrowserRouter>
  );
}
