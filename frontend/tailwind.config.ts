import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Suggested UI Application Tokens
        'header-slate': '#102C22', // Deep Forest Slate
        'forest-slate': '#102C22', // Deep Forest Slate
        'surface-dark': '#141A17', // Cast Steel Dark
        'surface-light': '#F7F5F0', // Warm Field Sand
        'cta-primary': '#24583D', // Harvest Botanical Green
        'cta-hover': '#1B4731',
        'cta-secondary': '#A6C96A', // Fresh Leaf Lime
        'whatsapp-green': '#25D366', // WhatsApp Green
        'sawking-gold': '#D4AF37', // Chisel Gold
        'agroveer-vermilion': '#D64527', // Engine Vermilion
        'tech-border': 'rgba(166, 201, 106, 0.15)', // Muted Moss / Steel

        // Semantic brand mappings preserving compatibility
        forest: {
          DEFAULT: '#102C22', // Deep Forest Slate
          950: '#141A17', // Cast Steel Dark
          900: '#102C22', // Deep Forest Slate
          800: '#1A382C',
          700: '#235946',
        },
        botanical: {
          DEFAULT: '#24583D', // Harvest Botanical Green
          hover: '#1B4731',
          light: '#2E6E4C',
        },
        leaf: {
          DEFAULT: '#A6C96A', // Fresh Leaf Lime
          light: '#BDE07D',
          dark: '#8BAF52',
        },
        sand: {
          DEFAULT: '#E9E1CC',
          light: '#F7F5F0', // Warm Field Sand
          border: 'rgba(166, 201, 106, 0.15)', // Muted Moss / Steel border
          dark: '#C8BEA5',
        },
        offwhite: {
          DEFAULT: '#F7F5F0', // Warm Field Sand
          card: '#EFEBE1',
          surface: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#141A17', // Cast Steel Dark Body & Headings
          muted: '#4F5D54',
          subtle: '#78877D',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 26, 23, 0.06)',
        'card': '0 8px 30px -4px rgba(20, 26, 23, 0.08)',
        'elevated': '0 16px 40px -6px rgba(16, 44, 34, 0.16)',
        'botanical': '0 10px 25px -5px rgba(36, 88, 61, 0.28)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
