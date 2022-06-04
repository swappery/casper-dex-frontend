import create, { State } from "zustand";
import { configurePersist } from "zustand-persist";
import { Themes } from "../config/constants/themes";

interface UserStatus extends State {
  theme: string;
  slippageTolerance: number;
  ttl: number;
  swprPrice: number;
  setTheme: (theme: string) => void;
  setSwprPrice: (swprPrice: number) => void;
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
      allowlist: ["theme", "slippageTolerance", "swprPrice"],
      denylist: [],
    },
    (set) => ({
      theme: Themes.LIGHT,
      slippageTolerance: 100,
      ttl: 1800,
      swprPrice: 0,
      setTheme: (theme: string) => 
        set(() => {
          document.documentElement.setAttribute("data-theme", theme);
          return {theme: theme};
        }),
      setSwprPrice: (swprPrice: number) => set(() => ({swprPrice})),
    })
));

export default useSetting;
