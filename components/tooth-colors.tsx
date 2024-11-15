import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const lightModeColors = {
  sound: "#A8E6A1",
  caries: "#FFD1DC",
  partial_erupted: "#FDF5E6",
  unerupted: "#FFEBCD",
  impacted_visible: "#FFE4B5",
  anomaly: "#E0FFFF",
  decayed: "#FFEFD5",
  missing: "#D3D3D3",
  restored: "#B0E0E6",
  root_canal: "#F0E68C",
  gingival_recession: "#FFC0CB",
  implant: "#D3D3D3",
  fluorosis: "#FFFACD",
  crowns: "#87CEEB",
  bridges: "#FFDAB9",
  sealants: "#DAB6FC",
  fissures: "#FAE3D9",
};

const darkModeColors = {
  sound: "#6B8E23",
  caries: "#8B5A65",
  partial_erupted: "#8B8378",
  unerupted: "#8B795E",
  impacted_visible: "#CD853F",
  anomaly: "#4682B4",
  decayed: "#8B4513",
  missing: "#A9A9A9",
  restored: "#5F9EA0",
  root_canal: "#BDB76B",
  gingival_recession: "#FF69B4",
  implant: "#A9A9A9",
  fluorosis: "#FFD700",
  crowns: "#4682B4",
  bridges: "#CD853F",
  sealants: "#9370DB",
  fissures: "#D2691E",
};

export function useConditionColors() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentColors, setCurrentColors] = useState(lightModeColors);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Handle system theme preference
    const effectiveTheme = theme === "system" ? systemTheme : theme;
    setCurrentColors(
      effectiveTheme === "dark" ? darkModeColors : lightModeColors
    );
  }, [theme, systemTheme, mounted]);

  // Return light mode colors during SSR to avoid hydration mismatch
  if (!mounted) {
    return lightModeColors;
  }

  return currentColors;
}
