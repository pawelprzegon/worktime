
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mute': '#282828',
        'soft': '#b7b7b7',
      }
    },

    screens: {
      'landscape': '360px',
      'portrait-small': '480px',
      'portrait-medium': '768px',
      'portrait-large': '1024px',
      'portrait-xl': '1300px',
    }
  },
  plugins: [],
}