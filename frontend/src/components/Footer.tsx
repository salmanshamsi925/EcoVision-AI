import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Mail, Send, CheckCircle2, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="relative bg-[#06111F] border-t border-white/[0.08] text-eco-muted font-inter pt-12 pb-8 overflow-hidden z-20">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2D]/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/[0.08]">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#20C5FF] to-[#22D3A0] p-0.5 shadow-lg shadow-[#20C5FF]/20 group-hover:shadow-[#20C5FF]/40 transition-all">
                <div className="w-full h-full bg-[#06111F] rounded-[9px] flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-[#20C5FF] group-hover:text-[#22D3A0] transition-colors" />
                </div>
              </div>
              <div>
                <span className="font-orbitron font-bold text-lg text-white tracking-wide">
                  EcoVision<span className="text-[#20C5FF]">-AI</span>
                </span>
                <span className="block text-[10px] text-eco-muted/80 font-grotesk tracking-wider">
                  Climate Intelligence for Pakistan
                </span>
              </div>
            </Link>

            <p className="text-xs text-eco-muted leading-relaxed max-w-xs">
              Building a climate-resilient Pakistan through AI, data and innovation. Integrating 45-year observational baselines, CMIP6 ensembles, and deep learning.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#20C5FF] hover:border-[#20C5FF]/40 hover:bg-[#20C5FF]/10 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#20C5FF] hover:border-[#20C5FF]/40 hover:bg-[#20C5FF]/10 transition-all"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a 
                href="https://github.com/salmanshamsi925/EcoVision-AI" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#22D3A0] hover:border-[#22D3A0]/40 hover:bg-[#22D3A0]/10 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
              <a 
                href="mailto:contact@ecovision-ai.org" 
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#20C5FF] hover:border-[#20C5FF]/40 hover:bg-[#20C5FF]/10 transition-all"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-grotesk font-semibold text-xs uppercase tracking-wider text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#20C5FF] transition-colors flex items-center gap-1.5">
                  Home / Globe
                </Link>
              </li>
              <li>
                <Link to="/pakistan" className="hover:text-[#20C5FF] transition-colors flex items-center gap-1.5">
                  Pakistan GIS Map
                </Link>
              </li>
              <li>
                <Link to="/intelligence" className="hover:text-[#20C5FF] transition-colors flex items-center gap-1.5">
                  Climate Intelligence
                </Link>
              </li>
              <li>
                <Link to="/change" className="hover:text-[#20C5FF] transition-colors flex items-center gap-1.5">
                  Policy Lab & Solutions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#20C5FF] transition-colors flex items-center gap-1.5">
                  About Project & Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-grotesk font-semibold text-xs uppercase tracking-wider text-white mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#research" onClick={(e) => { e.preventDefault(); window.open('https://www.ipcc.ch/report/ar6/wg1/', '_blank'); }} className="hover:text-[#22D3A0] transition-colors">
                  IPCC AR6 Working Group I
                </a>
              </li>
              <li>
                <a href="#data" onClick={(e) => { e.preventDefault(); window.open('https://power.larc.nasa.gov/', '_blank'); }} className="hover:text-[#22D3A0] transition-colors">
                  NASA POWER Data Portal
                </a>
              </li>
              <li>
                <a href="#pmd" onClick={(e) => { e.preventDefault(); window.open('https://www.pmd.gov.pk/', '_blank'); }} className="hover:text-[#22D3A0] transition-colors">
                  Pakistan Meteorological Dept
                </a>
              </li>
              <li>
                <a href="#meteo" onClick={(e) => { e.preventDefault(); window.open('https://open-meteo.com/', '_blank'); }} className="hover:text-[#22D3A0] transition-colors">
                  Open-Meteo Satellite Feed
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#22D3A0] transition-colors">
                  Model Methodology & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Updated */}
          <div>
            <h4 className="font-grotesk font-semibold text-xs uppercase tracking-wider text-white mb-2">
              Stay Updated
            </h4>
            <p className="text-xs text-eco-muted mb-3">
              Get the latest climate insights, hazard forecasts and policy modeling updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#10243A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-eco-muted/60 focus:outline-none focus:border-[#20C5FF] transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-grotesk font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#20C5FF]/20 hover:opacity-95 transition-all cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#06111F]" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-eco-muted/70">
          <div>
            &copy; 2026 <strong className="text-white">EcoVision-AI</strong>. All rights reserved. &bull; A Greener Pakistan, A Safer Tomorrow.
          </div>
          <div className="flex items-center gap-2 text-eco-muted">
            <span className="flex items-center gap-1 text-[#22D3A0]">
              <Leaf className="w-3 h-3 text-[#22D3A0]" /> Sustainable Computing
            </span>
            <span>&bull;</span>
            <span>Zero-Emission Cloud Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
