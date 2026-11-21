// Centralized API Base configuration
// Defaults to empty string (relative URL) so frontend automatically talks to backend
// on the same origin (Render production or Vite dev server proxy).
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
