/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-background": "#dfe2ee", "outline": "#8c909f", "surface-bright": "#353942",
        "on-primary": "#002e6a", "inverse-surface": "#dfe2ee", "surface-container-lowest": "#0a0e16",
        "on-primary-fixed": "#001a42", "on-tertiary-container": "#00302a", "on-secondary-container": "#00424e",
        "primary": "#adc6ff", "on-surface-variant": "#c2c6d6", "on-tertiary-fixed-variant": "#005048",
        "surface-tint": "#adc6ff", "primary-fixed": "#d8e2ff", "tertiary-fixed": "#71f8e4",
        "error-container": "#93000a", "tertiary-container": "#00a392", "on-tertiary-fixed": "#00201c",
        "surface-container-high": "#262a33", "on-secondary-fixed-variant": "#004e5c", "surface-dim": "#0f131c",
        "inverse-on-surface": "#2c3039", "primary-fixed-dim": "#adc6ff", "secondary-fixed": "#acedff",
        "tertiary": "#4fdbc8", "secondary": "#4cd7f6", "on-primary-fixed-variant": "#004395",
        "surface-container-low": "#181c24", "error": "#ffb4ab", "secondary-container": "#03b5d3",
        "on-primary-container": "#00285d", "inverse-primary": "#005ac2", "on-secondary": "#003640",
        "surface-container-highest": "#31353e", "surface-container": "#1c2028", "primary-container": "#4d8eff",
        "surface-variant": "#31353e", "on-secondary-fixed": "#001f26", "on-surface": "#dfe2ee",
        "secondary-fixed-dim": "#4cd7f6", "outline-variant": "#424754", "on-tertiary": "#003731",
        "on-error": "#690005", "background": "#0f131c", "surface": "#0f131c",
        "tertiary-fixed-dim": "#4fdbc8", "on-error-container": "#ffdad6"
      },
      spacing: {
        "margin-lg": "4rem", "space-2xl": "3rem", "space-xs": "0.25rem", "space-sm": "0.5rem",
        "space-lg": "1.5rem", "margin-xl": "6rem", "gutter-lg": "2rem", "space-3xl": "4.5rem",
        "space-xl": "2rem", "margin-md": "2.5rem", "gutter": "1.5rem", "margin": "1.5rem",
        "space-md": "1rem", "gutter-sm": "1rem"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"], "headline-md": ["Geist", "sans-serif"],
        "code-inline": ["JetBrains Mono", "monospace"], "display-mobile": ["Geist", "sans-serif"],
        "label-md": ["Inter", "sans-serif"], "headline-lg": ["Geist", "sans-serif"],
        "display": ["Geist", "sans-serif"], "headline-sm": ["Geist", "sans-serif"],
        "body-md": ["Inter", "sans-serif"], "headline-xl": ["Geist", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"], "label-sm": ["Inter", "sans-serif"],
        "headline-xl-mobile": ["Geist", "sans-serif"], "label-tech": ["JetBrains Mono", "monospace"],
        "code-block": ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: [],
}