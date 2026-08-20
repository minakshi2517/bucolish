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
        brand: {
          purple: '#5E17EB',
          'purple-hover': '#4C0ED0',
          'purple-light': '#EDE9FE',
          'purple-ultralight': '#F5F3FF',
          onyx: '#12111A',
          'onyx-card': '#1A1824',
          slate: '#27272A',
          green: '#10B981',
          'green-light': '#D1FAE5',
          amber: '#F59E0B',
          coral: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
