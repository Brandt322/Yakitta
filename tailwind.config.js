/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '375px'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      colors: {
        'primary': '#ea2845',
        'primary-accent': '#ea2868',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-hide": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none" /* Safari and Chrome */,
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin" /* Firefox */,
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
        },
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "10px" /* Safari and Chrome */,
        },
        ".scrollbar-thumb-orange": {
          "scrollbar-color": "#626065 #f1f1f1" /* Firefox */,
        },
        ".scrollbar-thumb-orange::-webkit-scrollbar-thumb": {
          background: "#626065" /* Safari and Chrome */,
        },
      };

      addUtilities(newUtilities);
    },],
}

