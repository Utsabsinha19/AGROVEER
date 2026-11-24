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
        // Balwaan Krishi & Agriwow Agricultural Design System Tokens
        primary: {
          DEFAULT: '#245B37', // Forest Green
          dark: '#1C472B',
          light: '#2E7346',
          hover: '#1B472A',
        },
        secondary: {
          DEFAULT: '#6FAF45', // Leaf Green
          light: '#84C45A',
          dark: '#589134',
        },
        accent: {
          DEFAULT: '#E99A32', // Harvest Orange
          hover: '#D68923',
          light: '#F5B052',
        },
        surface: {
          DEFAULT: '#FFFFFF', // White
          card: '#FFFFFF',
          muted: '#F5F7F1',
        },
        charcoal: {
          DEFAULT: '#252B27', // Charcoal Text
          dark: '#181C19',
          muted: '#4E5550',
          subtle: '#767E78',
          border: '#E2E6DF',
        },
        offwhite: {
          DEFAULT: '#F5F7F1', // Warm Off-white Background
          card: '#FFFFFF',
          surface: '#FFFFFF',
        },

        // Backward compatibility mappings
        'header-slate': '#245B37',
        'forest-slate': '#245B37',
        'surface-dark': '#1C472B',
        'surface-light': '#F5F7F1',
        'cta-primary': '#245B37',
        'cta-hover': '#1C472B',
        'cta-secondary': '#6FAF45',
        'whatsapp-green': '#25D366',
        'sawking-gold': '#D4AF37',
        'agroveer-vermilion': '#D64527',
        'tech-border': '#E2E6DF',

        forest: {
          DEFAULT: '#245B37',
          950: '#142C1D',
          900: '#1C472B',
          800: '#245B37',
          700: '#2E7346',
          600: '#3D945B',
        },
        botanical: {
          DEFAULT: '#245B37',
          hover: '#1C472B',
          light: '#2E7346',
        },
        leaf: {
          DEFAULT: '#6FAF45',
          light: '#84C45A',
          dark: '#589134',
        },
        sand: {
          DEFAULT: '#EAEFE6',
          light: '#F5F7F1',
          border: '#E2E6DF',
          dark: '#D5DDD0',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(37, 43, 39, 0.06)',
        'card': '0 4px 20px -2px rgba(37, 43, 39, 0.08)',
        'elevated': '0 12px 32px -4px rgba(36, 91, 55, 0.12)',
        'botanical': '0 8px 24px -4px rgba(36, 91, 55, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
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