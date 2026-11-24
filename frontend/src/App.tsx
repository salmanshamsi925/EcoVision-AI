import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { ClimateGPTDrawer } from './components/ClimateGPTDrawer';
import { LocationProvider } from './context/LocationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { ExplorePakistan } from './pages/ExplorePakistan';
import { ClimateIntelligence } from './pages/ClimateIntelligence';
import { ChangeFuture } from './pages/ChangeFuture';
import { ClimateGPT } from './pages/ClimateGPT';
import { AboutProject } from './pages/AboutProject';

function AppLayout() {
  const location = useLocation();
  // Full-screen interactive application views (3D Globe, GIS Map, Chat Assistant)
  // must fit the screen 100% without footer intrusion
  const isFullScreenApp = ['/', '/pakistan', '/assistant', '/gpt'].includes(location.pathname);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#06111F] text-[#F8FAFC] flex flex-col font-inter selection:bg-[#20C5FF] selection:text-[#06111F]">
      {/* Futuristic Command Header */}
      <NavBar />

      {/* Dynamic Route Viewport Protected with ErrorBoundary */}
      <main className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pakistan" element={<ExplorePakistan />} />
            <Route path="/intelligence" element={<ClimateIntelligence />} />
            <Route path="/change" element={<ChangeFuture />} />
            <Route path="/assistant" element={<ClimateGPT />} />
            <Route path="/gpt" element={<ClimateGPT />} />
            <Route path="/about" element={<AboutProject />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* World-Class Footer rendered on analytical and content pages (Tile 7) */}
      {!isFullScreenApp && <Footer />}

      {/* Global Floating AI Assistant Widget */}
      <ClimateGPTDrawer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        <AppLayout />
      </LocationProvider>
    </BrowserRouter>
  );
}
