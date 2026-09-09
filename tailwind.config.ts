import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f1f3d',
          blue: '#1d4ed8',
          gold: '#b8860b',
          ink: '#111827'
        }
      }
    }
  },
  plugins: []
};
export default config;
