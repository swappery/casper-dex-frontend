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
        contractHash: "08751d44484b9d528bb89c27c328dff934bad47376ee0086d059602364d6d986",
        isNative: false,
    },
    {
        name: "Coin_B",
        symbol: "CoB",
        decimals: 18,
        contractHash: "662071d2d2d64c07c91da1dbde8a0945ddb0b3d2f7eaa56f725db7007968d4e1",
        isNative: false,
    },
    {
        name: "Coin_C",
        symbol: "CoC",
        decimals: 12,
        contractHash: "400689fb2c42b38e39c2299c0c8c8cde729771a9e0161a433d2a308124eb79aa",
        isNative: false,
    },
    {
        name: "Casper",
        symbol: "CSPR",
        decimals: 9,
        contractHash: "d91883e9ebe885aaa16b16c10652617e1752d40bd90148aa79d971df60d93120",
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
    reserves: BigNumber[][];
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
    setReserves: (reserves: BigNumber[][]) => void;
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
    reserves: [[BigNumber.from(1), BigNumber.from(1)]],
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
            sourceAmount: BigNumber.from((sourceAmount * 10 ** supportedTokens[state.sourceToken].decimals).toFixed())
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
            targetAmount: BigNumber.from((targetAmount * 10 ** supportedTokens[state.targetToken].decimals).toFixed())
        })),
    setReserves: (reserves: BigNumber[][]) =>
        set(() => ({
            reserves
        })),
    setExactIn: (isExactIn: boolean) => set(() => ({ isExactIn })),
    setMinAmountOut: (minAmountOut: number) => 
        set((state) => ({ minAmountOut: BigNumber.from((minAmountOut * 10 ** supportedTokens[state.targetToken].decimals).toFixed()), })),
    setMaxAmountIn: (maxAmountIn: number) => 
        set((state) => ({ maxAmountIn: BigNumber.from((maxAmountIn * 10 ** supportedTokens[state.sourceToken].decimals).toFixed()), })),
    setCurrentStatus: (currentStatus: TxStatus) => set(() => ({ currentStatus })),
    updateCurrentStatus: () =>
        set((state) => {
            if (
                state.sourceBalance.lt(state.sourceAmount) &&
                supportedTokens[state.sourceToken].isNative
            )
                return {
                    currentStatus: TxStatus.REQ_WRAP,
                };
            else if (state.sourceApproval.lt(state.maxAmountIn))
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