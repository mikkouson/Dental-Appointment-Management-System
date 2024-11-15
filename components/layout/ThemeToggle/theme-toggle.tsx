import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <div className="flex items-center">
      <Sun
        className={`mr-2 ${theme === "light" ? "opacity-100" : "opacity-50"}`}
        size={15}
      />
      <Switch checked={theme !== "light"} onCheckedChange={handleThemeChange} />
      <Moon
        className={`ml-2 ${theme === "dark" ? "opacity-100" : "opacity-50"}`}
        size={15}
      />
      <Monitor
        className={`ml-2 ${theme === "system" ? "opacity-100" : "opacity-50"}`}
        size={15}
      />
    </div>
  );
}
