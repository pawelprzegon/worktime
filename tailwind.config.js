
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft': '#222222',
        'mute': '#282828',
        'light': '#b7b7b7'
      }
    },

    screens: {
      'portrait-xs': '400px',
      'portrait-small': '480px',
      'portrait-medium': '768px',
      'portrait-large': '1024px',
      'portrait-xl': '1300px',
    }
  },
  plugins: [],
}