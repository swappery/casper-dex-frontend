import create, { State } from "zustand";
import { devtools } from "zustand/middleware";
import { InputField } from "../config/interface/inputField";
import { Pool } from "../config/interface/pool";
import { Token } from "../config/interface/token";

interface RemoveLiquidityStatus extends State {
    currencyA?: Token;
    currencyB?: Token;
    currentPool?: Pool;
    inputField: InputField;
    isFetching: boolean;
    setCurrencyA: (currencyA: Token) => void;
    setCurrencyB: (currencyB: Token) => void;
    setCurrentPool: (currentPool: Pool) => void;
    setInputField: (inputField: InputField) => void;
    setFetching: (isFetching: boolean) => void;
}

const useRemoveLiquidityStatus = create<RemoveLiquidityStatus>(devtools(
    (set) => ({
        inputField: InputField.INPUT_A,
        isFetching: false,
        setCurrencyA: (currencyA: Token) => set(() => ({currencyA})),
        setCurrencyB: (currencyB: Token) => set(() => ({currencyB})),
        setCurrentPool: (currentPool: Pool) => set(() => ({currentPool})),
        setInputField: (inputField: InputField) => set(() => ({inputField})),
        setFetching: (isFetching: boolean) => set(() => ({isFetching})),
    })
));

export default useRemoveLiquidityStatus;