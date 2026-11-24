import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Mail, Send, CheckCircle2, Leaf, ArrowUpRight } from 'lucide-react';

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
    <footer className="relative bg-[#06111F] border-t border-white/[0.08] text-eco-muted font-inter pt-8 sm:pt-12 pb-6 sm:pb-8 overflow-hidden z-20 w-full max-w-full box-border">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2D]/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Main Footer Grid: 1-col on mobile header, 2-col links, 4-col on desktop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-6 sm:pb-8 border-b border-white/[0.08]">
          
          {/* Section 1: Brand & Identity (lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#20C5FF] to-[#22D3A0] p-0.5 shadow-lg shadow-[#20C5FF]/20 group-hover:shadow-[#20C5FF]/40 transition-all">
                <div className="w-full h-full bg-[#06111F] rounded-[9px] flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-[#20C5FF] group-hover:text-[#22D3A0] transition-colors" />
                </div>
              </div>
              <div>
                <span className="font-orbitron font-bold text-base sm:text-lg text-white tracking-wide">
                  EcoVision<span className="text-[#20C5FF]">-AI</span>
                </span>
                <span className="block text-[9.5px] sm:text-[10px] text-eco-muted/80 font-grotesk tracking-wider">
                  Climate Intelligence for Pakistan
                </span>
              </div>
            </Link>

            <p className="text-xs text-eco-muted/90 leading-relaxed max-w-md">
              Building a climate-resilient Pakistan through 45-year observational baselines, CMIP6 downscaling, and Deep Learning neural models.
            </p>

            {/* Social Links Row */}
            <div className="flex items-center gap-2 pt-0.5">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#20C5FF] hover:border-[#20C5FF]/40 hover:bg-[#20C5FF]/10 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#20C5FF] hover:border-[#20C5FF]/40 hover:bg-[#20C5FF]/10 transition-all"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a 
                href="https://github.com/salmanshamsi925/EcoVision-AI" 
                target="_blank" 
                rel="noreferrer" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#22D3A0] hover:border-[#22D3A0]/40 hover:bg-[#22D3A0]/10 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
              <a 
                href="mailto:contact@ecovision-ai.org" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-eco-muted hover:text-[#20C5FF] hover:border-[#20C5FF]/40 hover:bg-[#20C5FF]/10 transition-all"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links & Resources (Mobile: 2-column side-by-side, lg: 4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-grotesk font-bold text-xs uppercase tracking-wider text-white mb-2 sm:mb-3">
                Navigation
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li>
                  <Link to="/" className="hover:text-[#20C5FF] transition-colors block py-0.5">
                    Home / Globe
                  </Link>
                </li>
                <li>
                  <Link to="/pakistan" className="hover:text-[#20C5FF] transition-colors block py-0.5">
                    Pakistan GIS
                  </Link>
                </li>
                <li>
                  <Link to="/intelligence" className="hover:text-[#20C5FF] transition-colors block py-0.5">
                    Climate Intel
                  </Link>
                </li>
                <li>
                  <Link to="/change" className="hover:text-[#20C5FF] transition-colors block py-0.5">
                    Policy Lab
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#20C5FF] transition-colors block py-0.5">
                    About Project
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-grotesk font-bold text-xs uppercase tracking-wider text-white mb-2 sm:mb-3">
                Data Sources
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li>
                  <a href="https://www.ipcc.ch/report/ar6/wg1/" target="_blank" rel="noreferrer" className="hover:text-[#22D3A0] transition-colors flex items-center gap-1 py-0.5">
                    <span>IPCC AR6</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://power.larc.nasa.gov/" target="_blank" rel="noreferrer" className="hover:text-[#22D3A0] transition-colors flex items-center gap-1 py-0.5">
                    <span>NASA POWER</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://www.pmd.gov.pk/" target="_blank" rel="noreferrer" className="hover:text-[#22D3A0] transition-colors flex items-center gap-1 py-0.5">
                    <span>PMD Baseline</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="hover:text-[#22D3A0] transition-colors flex items-center gap-1 py-0.5">
                    <span>Open-Meteo</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-slate-500" />
                  </a>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#22D3A0] transition-colors block py-0.5">
                    Methodology
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Stay Updated (Compact Inline Form on Mobile, lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            <h4 className="font-grotesk font-bold text-xs uppercase tracking-wider text-white">
              Climate Bulletins
            </h4>
            <p className="text-[11px] sm:text-xs text-eco-muted leading-relaxed">
              Real-time hazard alerts and provincial forecast modeling.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full bg-[#10243A] border border-white/10 rounded-xl pl-3 pr-10 py-2 sm:py-2.5 text-xs text-white placeholder-eco-muted/60 focus:outline-none focus:border-[#20C5FF] transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe to climate bulletin"
                className="absolute right-1.5 h-7 w-7 rounded-lg bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
              >
                {subscribed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#06111F]" />
                ) : (
                  <Send className="w-3 h-3 text-[#06111F]" />
                )}
              </button>
            </form>
            {subscribed && (
              <span className="text-[10px] text-[#22D3A0] font-mono block animate-in fade-in">
                ✓ Subscribed to real-time bulletins
              </span>
            )}
          </div>

        </div>

        {/* ── Bottom Bar: Sleek, Responsive, Never Bloated ── */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10.5px] sm:text-[11px] text-eco-muted/70 text-center sm:text-left">
          <div>
            &copy; 2026 <strong className="text-white">EcoVision-AI</strong>. All rights reserved. &bull; A Greener Pakistan, A Safer Tomorrow.
          </div>
          <div className="flex items-center gap-2 text-eco-muted/80">
            <span className="flex items-center gap-1 text-[#22D3A0]">
              <Leaf className="w-3 h-3 text-[#22D3A0]" /> Sustainable Computing
            </span>
            <span>&bull;</span>
            <span>Zero-Emission Cloud</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
