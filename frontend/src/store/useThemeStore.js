import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    // Apply theme to html element for DaisyUI
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));