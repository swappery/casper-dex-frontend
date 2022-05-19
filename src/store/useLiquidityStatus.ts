import { BigNumber, BigNumberish } from "ethers";
import create, { State } from "zustand";

export interface TokenContext {
    name: string;
    symbol: string;
    decimals: number;
    contractHash: string;
    isNative: boolean;
}

export enum TokenType {
    COIN_A,
    COIN_B,
    COIN_C,
    CSPR,
}

export const supportedTokens: TokenContext[] = [
    {
        name: "Coin_A",
        symbol: "CoA",
        decimals: 9,
        contractHash: "94336dc55269c2fbf05aa44d395c5684297eeb7e801056c9c9fe4ef93b651fb1",
        isNative: false,
    },
    {
        name: "Coin_B",
        symbol: "CoB",
        decimals: 9,
        contractHash: "ce05047ad3bd89e3febdb54f9a61018ce0697488d26cb59cb1fc31f4a2753e2c",
        isNative: false,
    },
    {
        name: "Coin_C",
        symbol: "CoC",
        decimals: 9,
        contractHash: "45546f58480f6fe3163736c6ca09c40bf9aa5d63c09a16601e50716343bade4d",
        isNative: false,
    },
    {
        name: "Casper",
        symbol: "CSPR",
        decimals: 9,
        contractHash: "0e7b887ac1c7603d3901cc526cd9753e7f8d3d251c254293a429b780fd195e88",
        isNative: true,
    },
]

export enum ExecutionType {
    EXE_ADD_LIQUIDITY = "ADD_LIQUIDITY",
    EXE_REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY",
    EXE_SWAP = "SWAP",
}

export enum TxStatus {
    REQ_WRAP = "REQ_WRAP",
    REQ_SOURCE_APPROVE = "REQ_SOURCE_APPROVE",
    REQ_TARGET_APPROVE = "REQ_TARGET_APPROVE",
    REQ_EXECUTE = "REQ_EXECUTE",
    REQ_UNWRAP = "REQ_UNWRAP",
    PENDING = "PENDING",
}

interface LiquidityStatus extends State {
    execType: ExecutionType;
    sourceToken: TokenType;
    sourceBalance: BigNumber;
    sourceApproval: BigNumber;
    sourceAmount: BigNumber;
    targetToken: TokenType;
    targetBalance: BigNumber;
    targetApproval: BigNumber;
    targetAmount: BigNumber;
    reserves: BigNumber[];
    isExactIn: boolean;
    minAmountOut: BigNumber;
    maxAmountIn: BigNumber;
    currentStatus: TxStatus;
    setExecType: (execType: ExecutionType) => void;
    setSourceToken: (sourceToken: TokenType) => void;
    setSourceBalance: (sourceBalance: BigNumberish) => void;
    setSourceApproval: (sourceApproval: BigNumberish) => void;
    setSourceAmount: (sourceAmount: number) => void;
    setTargetToken: (targetToken: TokenType) => void;
    setTargetBalance: (targetBalance: BigNumberish) => void;
    setTargetApproval: (targetApproval: BigNumberish) => void;
    setTargetAmount: (targetAmount: number) => void;
    setReserves: (reserve0: BigNumberish, reserve1: BigNumberish) => void;
    setCurrentStatus: (currentStatus: TxStatus) => void;
    setExactIn: (isExactIn: boolean) => void;
    setMinAmountOut: (minAmountOut: number) => void;
    setMaxAmountIn: (maxAmountIn: number) => void;
    updateCurrentStatus: () => void;
}

const useLiquidityStatus = create<LiquidityStatus>((set) => ({
    execType: ExecutionType.EXE_SWAP,
    sourceToken: TokenType.CSPR,
    sourceBalance: BigNumber.from(0),
    sourceApproval: BigNumber.from(0),
    sourceAmount: BigNumber.from(0),
    targetToken: TokenType.COIN_A,
    targetBalance: BigNumber.from(0),
    targetApproval: BigNumber.from(0),
    targetAmount: BigNumber.from(0),
    reserves: [BigNumber.from(1), BigNumber.from(1)],
    isExactIn: true,
    minAmountOut: BigNumber.from(0),
    maxAmountIn: BigNumber.from(0),
    currentStatus: TxStatus.REQ_SOURCE_APPROVE,
    setExecType: (execType: ExecutionType) =>
        set(() => ({
            execType,
        })),
    setSourceToken: (sourceToken: TokenType) =>
        set(() => ({
            sourceToken,
        })),
    setSourceBalance: (sourceBalance: BigNumberish) =>
        set(() => ({
            sourceBalance: BigNumber.from(sourceBalance),
        })),
    setSourceApproval: (sourceApproval: BigNumberish) =>
        set(() => ({
            sourceApproval: BigNumber.from(sourceApproval),
        })),
    setSourceAmount: (sourceAmount: number) =>
        set((state) => ({
            sourceAmount: BigNumber.from(sourceAmount * (10 ** supportedTokens[state.sourceToken].decimals))
        })),
    setTargetToken: (targetToken: TokenType) =>
        set(() => ({
            targetToken,
        })),
    setTargetBalance: (targetBalance: BigNumberish) =>
        set(() => ({
            targetBalance: BigNumber.from(targetBalance),
        })),
    setTargetApproval: (targetApproval: BigNumberish) =>
        set(() => ({
            targetApproval: BigNumber.from(targetApproval),
        })),
    setTargetAmount: (targetAmount: number) =>
        set((state) => ({
            targetAmount: BigNumber.from(targetAmount * (10 ** supportedTokens[state.targetToken].decimals))
        })),
    setReserves: (reserve0: BigNumberish, reserve1: BigNumberish) =>
        set(() => {
            return { reserves: [BigNumber.from(reserve0), BigNumber.from(reserve1)] }
        }),
    setExactIn: (isExactIn: boolean) => set(() => ({ isExactIn })),
    setMinAmountOut: (minAmountOut: number) => 
        set((state) => ({ minAmountOut: BigNumber.from((minAmountOut * 10 ** supportedTokens[state.targetToken].decimals) | 0), })),
    setMaxAmountIn: (maxAmountIn: number) => 
        set((state) => ({ maxAmountIn: BigNumber.from((maxAmountIn * 10 ** supportedTokens[state.sourceToken].decimals) | 0), })),
    setCurrentStatus: (currentStatus: TxStatus) => set(() => ({ currentStatus })),
    updateCurrentStatus: () =>
        set((state) => {
            if (
                state.execType === ExecutionType.EXE_SWAP &&
                supportedTokens[state.targetToken].isNative &&
                state.targetBalance.gte(state.targetAmount))
                return {
                    currentStatus: TxStatus.REQ_UNWRAP,
                }
            else if (
                state.sourceBalance.lt(state.sourceAmount) &&
                supportedTokens[state.sourceToken].isNative
            )
                return {
                    currentStatus: TxStatus.REQ_WRAP,
                };
            else if (state.sourceApproval.lt(state.sourceAmount))
                return {
                    currentStatus: TxStatus.REQ_SOURCE_APPROVE,
                };
            else if (state.targetApproval.lt(state.targetAmount) &&
                state.execType === ExecutionType.EXE_ADD_LIQUIDITY)
                return {
                    currentStatus: TxStatus.REQ_TARGET_APPROVE,
                };
            return {
                currentStatus: TxStatus.REQ_EXECUTE,
            };
        }),
}));

export default useLiquidityStatus;