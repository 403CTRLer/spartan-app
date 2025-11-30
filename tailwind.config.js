/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryYellow: '#F1C93B',
        lightGreyBorder: '#D9D9D9',
        midGreyBorder: '#A7A8A8',
        purpleCTA: '#5B4FE9',
        unavailableRed: '#FCA19C',
        availableGreen: '#94D7AE',
      },
    },
  },
  plugins: [],
};

