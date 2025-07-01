import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          light: '#E6F0FF', 
          DEFAULT: '#0066FF',
          dark: '#004ACC',
        },
        'brand-accent': {
          DEFAULT: '#FF6B6B',
          dark: '#E65353',
        },
        'neutral': {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
      },
      boxShadow: {
        'subtle': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'lifted': '0 10px 20px -5px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px 0 rgba(0, 102, 255, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
