import create, { State } from "zustand";
import { testnetTokens } from "../config/constants/tokens";
import { Pool } from "../config/interface/pool";
import { Token } from "../config/interface/token";
import { devtools } from "zustand/middleware";

interface FindPoolStatus extends State {
    currencyA?: Token;
    currencyB?: Token;
    currentPool?: Pool;
    initialize: () => void;
    setCurrencyA: (currencyA: Token) => void;
    setCurrencyB: (currencyA: Token) => void;
    setCurrentPool: (currentPool: Pool) => void;
}

const useImportPool = create<FindPoolStatus> (devtools(
    (set) => ({
        initialize: () => set(() => { return { currencyA: testnetTokens.SWPR }; }),
        setCurrencyA: (currencyA: Token) => set(() => ({currencyA})),
        setCurrencyB: (currencyB: Token) => set(() => ({currencyB})),
        setCurrentPool: (currentPool: Pool) => set(() => ({currentPool})),
    }))
);
export default useImportPool;