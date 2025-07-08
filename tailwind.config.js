/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Corresponds to Tailwind's blue-600
        'primary-dark': '#1d4ed8', // Corresponds to Tailwind's blue-700
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}