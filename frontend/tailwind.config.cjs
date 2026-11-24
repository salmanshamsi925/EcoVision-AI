/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'eco-bg': '#07111F',
        'eco-surface': '#0D1B2A',
        'eco-blue': '#22B8FF',
        'eco-green': '#35D39A',
        'eco-orange': '#FF9F43',
        'eco-red': '#FF5555',
        'eco-text': '#F5F7FA',
        'eco-muted': '#A8B4C5',
        'primary-cyan': '#20C5FF',
        'emerald-green': '#22D3A0',
        'warning-orange': '#FFAA45',
        'danger-red': '#FF5D63',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(34, 184, 255, 0.4)',
        'neon-green': '0 0 15px rgba(53, 211, 154, 0.4)',
      }
    },
  },
  plugins: [],
};
