import create from "zustand";
export const Themes = {
  DARK: "dark",
  LIGHT: "light",
};
interface Theme {
  theme: string;
  setTheme: (theme: string) => void;
}
const useTheme = create<Theme>((set) => ({
  theme: Themes.DARK,
  setTheme: (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));

export default useTheme;
