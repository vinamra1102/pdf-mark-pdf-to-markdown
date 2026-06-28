import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#171717',
          orange: '#F25623',
          'dark-gray': '#4D4D4D',
          'light-gray': '#DEDEDE',
          white: '#FFFFFF',
          'orange-hover': '#D94115',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
