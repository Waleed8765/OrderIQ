/** @type {import('tailwindcss').Config} */
export default {
  content: [    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        primary: {
          50: '#F3E8FF',
          100: '#E9D5FF',
          200: '#D8B4FE',
          300: '#C084FC',
          400: '#A855F7',
          500: '#9B5DE5', // Electric Purple
          600: '#7E3CC2',
          700: '#6B21A8',
          800: '#581C87',
          900: '#3B0764',
          DEFAULT: '#9B5DE5',
        },
        secondary: {
          50: '#E6F7FF',
          100: '#B3E8FF',
          200: '#80D9FF',
          300: '#4DCAFF',
          400: '#1ABBFF',
          500: '#00BBF9', // Cyan
          600: '#0096CC',
          700: '#007199',
          800: '#004C66',
          900: '#002733',
          DEFAULT: '#00BBF9',
        },
        accent: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#F15BB5', // Hot Pink
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          DEFAULT: '#F15BB5',
        },
        neutral: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529', // Charcoal
          900: '#121416',
        },
        success: '#00C897',
        warning: '#FF9E00',
        error: '#FF6B6B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'content': '1280px',
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'stagger': 'stagger 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'bounce-slow': 'bounceSlow 1.5s ease-in-out infinite',
        'hero-blob': 'heroBlob 14s linear infinite',
        'hero-blob-reverse': 'heroBlobReverse 18s linear infinite',
        'hero-blob-slow': 'heroBlob 22s linear infinite reverse',
        'hero-pulse-glow': 'heroPulseGlowScale 9s ease-in-out infinite',
        'hero-shimmer': 'heroShimmer 5s linear infinite',
        'hero-grid-drift': 'heroGridDrift 16s ease-in-out infinite',
        'hero-aurora': 'heroAurora 22s ease-in-out infinite',
        'hero-spot-purple': 'heroSpotPurple 11s ease-in-out infinite',
        'hero-spot-pink': 'heroSpotPink 13s ease-in-out infinite',
        'hero-card-float-left': 'heroCardFloatLeft 3.2s ease-in-out infinite',
        'hero-card-float-right': 'heroCardFloatRight 3.6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        heroBlob: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(18%, -14%) scale(1.22)' },
          '50%': { transform: 'translate(-14%, 16%) scale(0.8)' },
          '75%': { transform: 'translate(16%, 12%) scale(1.12)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        heroBlobReverse: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '20%': { transform: 'translate(-20%, 14%) scale(1.2)' },
          '45%': { transform: 'translate(16%, -18%) scale(0.82)' },
          '70%': { transform: 'translate(-12%, -12%) scale(1.14)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        heroPulseGlowScale: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.22)', opacity: '1' },
        },
        heroShimmer: {
          '0%': { backgroundPosition: '0% 40%' },
          '100%': { backgroundPosition: '200% 60%' },
        },
        heroGridDrift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(18px, -14px)' },
        },
        heroAurora: {
          '0%, 100%': { transform: 'rotate(-8deg) scale(1)' },
          '50%': { transform: 'rotate(10deg) scale(1.12)' },
        },
        heroSpotPurple: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(5%, 8%)' },
        },
        heroSpotPink: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-6%, -5%)' },
        },
        heroCardFloatLeft: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(-2deg)' },
        },
        heroCardFloatRight: {
          '0%, 100%': { transform: 'translateY(0) rotate(2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}

