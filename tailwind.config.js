/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    container: {
      center: "true",
      padding: "2rem",
      screens: {
        sm: "500px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "2560px",
      },
    },
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        firaSans: ["Fira Sans", "sans-serif"],
      },
      fontSize: {
        h1: ["65px", "62px"],
        h2: ["46px", "42px"],
        h3: ["24px", "20px"],
        h4: ["24px", "16px"],
        h5: ["24px", "18px"],
        h6: ["22px", "16px"],
        "body-large": ["24px", "16px"],
        body: ["22px", "16px"],
      },
      colors: {
        espresso: "#261F19",
        chestnut: "#594431",
        goldenBrown: "#8B7040",
        sandstone: "#D0C3AB",
        ivory: "#EFECDF",
        white: "#FFFFFF",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--background)",
        foreground: "var(--foreground)",
        info: "hsl(var(--info))",
        sidebar: "var(--sidebar)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        keyframes: {
          scrollLeft: {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-100%)" },
          },
        },
        animation: {
          scrollLeft: "scrollLeft 3s linear forwards",
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    {
      pattern:
        /bg-(red|blue|green|purple|pink|yellow|indigo)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
};
