/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glass-blackest': '0 0 0 1px rgba(19, 18, 18, 0.325), 0 2px 4px 0 rgba(19, 18, 18, 0.65)',
      },
    },
  },
  plugins: [],
};
