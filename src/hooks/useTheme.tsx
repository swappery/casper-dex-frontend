import create from "zustand";
import { configurePersist } from "zustand-persist";
export const Themes = {
  DARK: "dark",
  LIGHT: "light",
};
interface Theme {
  theme: string;
  setTheme: (theme: string) => void;
}

const { persist, purge } = configurePersist({
  storage: localStorage,
  rootKey: "current_theme",
});

const useTheme = create<Theme>(
  persist(
    {
      key: "theme",
      allowlist: ["theme"],
      denylist: [],
    },
    (set) => ({
      theme: Themes.LIGHT,
      setTheme: (theme: string) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
    })
  )
);

export default useTheme;
