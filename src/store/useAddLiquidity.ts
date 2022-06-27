import create, { State } from "zustand";
// import { devtools } from "zustand/middleware";
import { InputField } from "../config/interface/inputField";
import { Pool } from "../config/interface/pool";
import { Token } from "../config/interface/token";
import { TokenAmount } from "../config/interface/tokenAmounts";

interface AddLiquidityStatus extends State {
    currencyA?: Token;
    currencyB?: Token;
    currencyAAmounts?: TokenAmount;
    currencyBAmounts?: TokenAmount;
    currentPool?: Pool;
    inputField: InputField;
    isFetching: boolean;
    initialize: () => void;
    setCurrencyA: (currencyA: Token) => void;
    setCurrencyB: (currencyB: Token) => void;
    setCurrencyAAmounts: (currencyAAmounts: TokenAmount) => void;
    setCurrencyBAmounts: (currencyBAmounts: TokenAmount) => void;
    setCurrentPool: (currentPool: Pool) => void;
    setInputField: (inputField: InputField) => void;
    setFetching: (isFetching: boolean) => void;
}

const useAddLiquidityStatus = create<AddLiquidityStatus>(
    (set) => ({
        inputField: InputField.INPUT_A,
        isFetching: false,
        initialize: () => set(() => {return {currencyA: undefined, currencyB: undefined, currencyAAmounts: undefined, currencyBAmounts:undefined, currentPool: undefined, inputField: InputField.INPUT_A};}),
        setCurrencyA: (currencyA: Token) => set(() => ({currencyA})),
        setCurrencyB: (currencyB: Token) => set(() => ({currencyB})),
        setCurrencyAAmounts: (currencyAAmounts: TokenAmount) => set(() => ({currencyAAmounts})),
        setCurrencyBAmounts: (currencyBAmounts: TokenAmount) => set(() => ({currencyBAmounts})),
        setCurrentPool: (currentPool: Pool) => set(() => ({currentPool})),
        setInputField: (inputField: InputField) => set(() => ({inputField})),
        setFetching: (isFetching: boolean) => set(() => ({isFetching})),
    })
);

export default useAddLiquidityStatus;