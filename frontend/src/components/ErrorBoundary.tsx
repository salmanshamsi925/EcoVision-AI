import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Map } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EcoVision-AI Uncaught Error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#06111F] text-white">
          <div className="max-w-md w-full bg-[#0B1B2D]/95 border border-[#20C5FF]/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-space font-bold text-white">
                View Recovered
              </h2>
              <p className="text-xs text-slate-300 font-inter leading-relaxed">
                EcoVision-AI encountered a temporary rendering condition while transitioning between dynamic GIS views. Your session data is intact.
              </p>
            </div>

            {this.state.error && (
              <div className="p-2.5 rounded-lg bg-[#06111F] border border-white/10 text-left font-mono text-[11px] text-slate-400 overflow-x-auto max-h-24">
                {this.state.error.message || 'Render transition interrupted.'}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  this.handleReset();
                  window.location.reload();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#20C5FF] to-[#22D3A0] text-[#06111F] font-grotesk font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#20C5FF]/25 hover:opacity-95 transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload View</span>
              </button>

              <a
                href="/pakistan"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#10243A] border border-white/10 text-white hover:text-[#20C5FF] hover:border-[#20C5FF]/40 font-grotesk font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Map className="w-3.5 h-3.5 text-[#20C5FF]" />
                <span>Pakistan Map</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
