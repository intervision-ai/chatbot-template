import config from "config.json";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    applyTheme();
  }, [theme]);

  function applyTheme() {
    if (theme === "light") {
      const root = document.documentElement;

      // Light Theme Colors
      root.style.setProperty(
        "--background",
        config.branding.theme.light.background
      );
      root.style.setProperty(
        "--foreground",
        config.branding.theme.light.foreground
      );
      root.style.setProperty(
        "--primary",
        config.branding.theme.light.primaryBgColor
      );
      root.style.setProperty(
        "--primary-foreground",
        config.branding.theme.light.primaryFgColor
      );
      root.style.setProperty(
        "--secondary",
        config.branding.theme.light.secondaryBgColor
      );
      root.style.setProperty(
        "--secondary-foreground",
        config.branding.theme.light.secondaryFgColor
      );
      root.style.setProperty(
        "--sidebar",
        config.branding.theme.light.sidebarBgColor
      );
      root.style.setProperty(
        "--login-bg-start",
        config.branding.theme.light.loginBgStart
      );
      root.style.setProperty(
        "--login-bg-end",
        config.branding.theme.light.loginBgEnd
      );
    } else {
      // Dark Theme Colors
      document.documentElement.style.setProperty(
        "--background",
        config.branding.theme.dark.background
      );
      document.documentElement.style.setProperty(
        "--foreground",
        config.branding.theme.dark.foreground
      );
      document.documentElement.style.setProperty(
        "--primary",
        config.branding.theme.dark.primaryBgColor
      );
      document.documentElement.style.setProperty(
        "--primary-foreground",
        config.branding.theme.dark.primaryFgColor
      );
      document.documentElement.style.setProperty(
        "--secondary",
        config.branding.theme.dark.secondaryBgColor
      );
      document.documentElement.style.setProperty(
        "--secondary-foreground",
        config.branding.theme.dark.secondaryFgColor
      );
      document.documentElement.style.setProperty(
        "--sidebar",
        config.branding.theme.dark.sidebarBgColor
      );
      document.documentElement.style.setProperty(
        "--login-bg-start",
        config.branding.theme.dark.loginBgStart
      );
      document.documentElement.style.setProperty(
        "--login-bg-end",
        config.branding.theme.dark.loginBgEnd
      );
    }
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
