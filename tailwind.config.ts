import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#FFFFFF",
        gray1: "#D9D9D9",
        gray2: "#6A6767",
        gray3: "#302D2D",
        blue1: "#0085FF",
        blue2: "#0C1241",
        blue3: "#0A0D21",
      },
      fontSize: {
        xlg: "30px",
        lg: "24px",
        md: "20px",
        sm:"16px",
        xsm:"14px"
      },
    },
    screens: {
      sm: "300px",
      md: "768px",
      lg: "1300px",
      xl: "1440px",
    },
  },
  plugins: [],
};
export default config