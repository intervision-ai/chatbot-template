import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { useTheme } from "../../store/theme";
import { Button } from "../ui/button";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Sync the theme with localStorage and document class
  useEffect(() => {
    // const savedTheme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, [theme]);

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
