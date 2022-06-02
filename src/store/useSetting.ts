import create, { State } from "zustand";
import { configurePersist } from "zustand-persist";
import { Themes } from "../config/constants/themes";

interface UserStatus extends State {
  theme: string;
  slippageTolerance: number;
  ttl: number;
  setTheme: (theme: string) => void;
  // setSlippageTolerance: (slippageTolerance: number) => void;
  // setTTL: (ttl: number) => void;
}

const { persist } = configurePersist({
  storage: localStorage,
});

const useSetting = create<UserStatus>(
  persist (
    {
      key: "theme",
      allowlist: ["theme"],
      denylist: [],
    },
    (set) => ({
      theme: Themes.LIGHT,
      slippageTolerance: 100,
      ttl: 1800,
      setTheme: (theme: string) => 
        set(() => {
          document.documentElement.setAttribute("data-theme", theme);
          return {theme: theme};
        }),
    })
));

export default useSetting;
