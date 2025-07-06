// tailwind.config.js
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Simplified content paths
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
