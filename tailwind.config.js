
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'floral': '#fbfbf2',
        'lavender-blush': '#EEE5E9',
        'platinum': '#E5E6E4',
        'timber-wolf': '#CFD2CD',
        'silver': '#A6A2A2',
        'light': '#b7b7b7',
        'mute': '#282828',
        'soft': '#222222',
        'beb': '#3498db',
        'turquoise': '#4CE0D2',
        'overtime': '#B97B28FF',

        'primary': '#222222',
        'secondary': '#2e2e31',
        'third': '#3a3a3d',
        'dark-green': '#556067',
        'green': '#6d8389',
        'light-green': '#87a8a8',
        'lime': '#a9cec2',

        'font-secondary': '#575757',

        'modal-back': "rgba(64, 64, 64, 0.84)",
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