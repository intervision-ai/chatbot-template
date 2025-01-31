import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import config from "../../config.json";
import { Button } from "../ui/button";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync the theme with localStorage and document class
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (isDarkMode) {
      // document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");

      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    applyTheme();
  }, [isDarkMode]);

  function applyTheme() {
    if (!isDarkMode) {
      const root = document.documentElement;

      // Light Theme Colors
      root.style.setProperty(
        "--background",
        config.branding.theme.light.background
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
        config.branding.theme.light.loginBgStart
      );
      document.documentElement.style.setProperty(
        "--login-bg-end",
        config.branding.theme.light.loginBgEnd
      );
    }
  }
  return (
    <Button
      variant={"link"}
      size={"icon"}
      className="ml-3 hover:bg-none h-8 w-8 border-0"
    >
      {!isDarkMode ? (
        <Sun
          className="text-primary cursor-pointer"
          onClick={toggleTheme}
          size={20}
        />
      ) : (
        <Moon
          className="text-primary cursor-pointer"
          onClick={toggleTheme}
          size={20}
        />
      )}
    </Button>
  );
};

export { ThemeToggle };
