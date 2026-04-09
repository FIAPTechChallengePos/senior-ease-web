import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "a11y-1": "var(--a11y-spacing-1)",
        "a11y-2": "var(--a11y-spacing-2)",
        "a11y-3": "var(--a11y-spacing-3)",
      },
      fontSize: {
        "a11y-base": "var(--a11y-font-base)",
        "a11y-lg": "var(--a11y-font-lg)",
        "a11y-xl": "var(--a11y-font-xl)",
      },
    },
  },
  plugins: [],
};

export default config;
