import create, { State } from "zustand";
import { testnetTokens } from "../config/constants/tokens";
import { Pool } from "../config/interface/pool";
import { Token } from "../config/interface/token";
import { devtools } from "zustand/middleware";

interface FindPoolStatus extends State {
    currencyA?: Token;
    currencyB?: Token;
    currentPool?: Pool;
    isFetching: boolean;
    initialize: () => void;
    setCurrencyA: (currencyA: Token) => void;
    setCurrencyB: (currencyA: Token) => void;
    setCurrentPool: (currentPool: Pool) => void;
    setFetching: (isFetching: boolean) => void;
}

const useImportPool = create<FindPoolStatus> (devtools(
    (set) => ({
        isFetching: false,
        setFetching: (isFetching: boolean) => set(() => ({isFetching})),
        initialize: () => set(() => { return { currencyA: testnetTokens.SWPR, currencyB: undefined, currentPool: undefined }; }),
        setCurrencyA: (currencyA: Token) => set(() => ({currencyA})),
        setCurrencyB: (currencyB: Token) => set(() => ({currencyB})),
        setCurrentPool: (currentPool: Pool) => set(() => ({currentPool})),
    }))
);
export default useImportPool;