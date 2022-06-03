import { BigNumber } from "ethers";
import create, { State } from "zustand";
import { InputField } from "../config/interface/inputField";
import { Token } from "../config/interface/token";
import { TokenAmount } from "../config/interface/tokenAmounts";
import { devtools } from "zustand/middleware";
import { testnetTokens } from "../config/constants/tokens";

interface SwapStatus extends State {
    inputCurrency: Token;
    outputCurrency: Token;
    inputCurrencyAmounts: TokenAmount;
    outputCurrencyAmounts: TokenAmount;
    reserves: BigNumber[][];
    inputField: InputField;
    initialize: () => void;
    setInputCurrency: (currency: Token) => void;
    setOutputCurrency: (currency: Token) => void;
    setInputCurrencyAmounts: (currencyAmount: TokenAmount) => void;
    setOutputCurrencyAmounts: (currencyAmount: TokenAmount) => void;
    setReserves: (reserves: BigNumber[][]) => void;
    setInputField: (field: InputField) => void;
}

const useSwap = create<SwapStatus>(devtools((set) => ({
    inputCurrency: testnetTokens.CSPR,
    outputCurrency: testnetTokens.SWPR,
    inputCurrencyAmounts: {balance: BigNumber.from(0), allowance: BigNumber.from(0), amount: BigNumber.from(0), limit: BigNumber.from(0)},
    outputCurrencyAmounts: {balance: BigNumber.from(0), allowance: BigNumber.from(0), amount: BigNumber.from(0), limit: BigNumber.from(0)},
    reserves: [[BigNumber.from(1), BigNumber.from(1)]],
    inputField: InputField.INPUT_A,
    initialize: () => set(() => {
        return {
            inputCurrency: testnetTokens.CSPR,
            outputCurrency: testnetTokens.SWPR,
            inputCurrencyAmounts: {balance: BigNumber.from(0), allowance: BigNumber.from(0), amount: BigNumber.from(0), limit: BigNumber.from(0)},
            outputCurrencyAmounts: {balance: BigNumber.from(0), allowance: BigNumber.from(0), amount: BigNumber.from(0), limit: BigNumber.from(0)},
            reserves: [[BigNumber.from(1), BigNumber.from(1)]],
            inputField: InputField.INPUT_A,
        };
    }),
    setInputCurrency: (currency: Token) => set(() => {
        return {inputCurrency: currency};
    }),
    setOutputCurrency: (currency: Token) => set(() => {
        return {outputCurrency: currency};
    }),
    setInputCurrencyAmounts: (currencyAmount: TokenAmount) => set(() => {
        return {inputCurrencyAmounts: currencyAmount};
    }),
    setOutputCurrencyAmounts: (currencyAmount: TokenAmount) => set(() => {
        return {outputCurrencyAmounts: currencyAmount};
    }),
    setReserves: (reserves: BigNumber[][]) => set(() => ({
    reserves,
    })),
    setInputField: (field: InputField) => set(() => {
        return {inputField: field};
    }),
})));

export default useSwap;