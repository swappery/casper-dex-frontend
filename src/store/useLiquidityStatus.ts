import { BigNumber, BigNumberish } from "ethers";
import create, { State } from "zustand";
import csprToken from "../assets/images/tokens/0x80dB3a8014872a1E6C3667926ABD7d3cE61eD0C4.svg";
import swprToken from "../assets/images/tokens/0x6FA23529476a1337EB5da8238b778e7122d79666.svg";
import { devtools } from "zustand/middleware";
import { Pool } from "./useWalletStatus";

export const TOTAL_SHARE = 10000;

export interface TokenContext {
  name: string;
  symbol: string;
  decimals: number;
  contractHash: string;
  isNative: boolean;
  tokenSvg: string;
}

export enum TokenType {
  SWPR,
  CSPR,
}

export const supportedTokens: TokenContext[] = [
  {
    name: "Test Swappery Token",
    symbol: "SWPR",
    decimals: 9,
    contractHash:
      "fe33392bf4d0ff2edbb5a664256271c03c9ed98da7a902472336a4c67cbb8f85",
    isNative: false,
    tokenSvg: swprToken,
  },
  {
    name: "Casper Native Token",
    symbol: "CSPR",
    decimals: 9,
    contractHash:
      "3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6",
    isNative: true,
    tokenSvg: csprToken,
  },
];

export enum ExecutionType {
  EXE_ADD_LIQUIDITY = "ADD_LIQUIDITY",
  EXE_REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY",
  EXE_FIND_LIQUIDITY = "FIND_LIQUIDITY",
  EXE_SWAP = "SWAP",
}

export enum TxStatus {
  REQ_WRAP = "REQ_WRAP",
  REQ_SOURCE_APPROVE = "REQ_SOURCE_APPROVE",
  REQ_TARGET_APPROVE = "REQ_TARGET_APPROVE",
  REQ_EXECUTE = "REQ_EXECUTE",
  REQ_ADD_LIQUIDITY = "REQ_ADD_LIQUIDITY",
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
  slippageTolerance: number;
  hasImported: boolean;
  isBusy: boolean;
  currentPool: Pool;
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
  switchToken: () => void;
  setHasImported: (hasImported: boolean) => void;
  setBusy: (isBusy: boolean) => void;
  setCurrentPool: (currentPool: Pool) => void;
}

const useLiquidityStatus = create<LiquidityStatus>(
  devtools((set) => ({
    execType: ExecutionType.EXE_SWAP,
    sourceToken: TokenType.CSPR,
    sourceBalance: BigNumber.from(0),
    sourceApproval: BigNumber.from(0),
    sourceAmount: BigNumber.from(0),
    targetToken: TokenType.SWPR,
    targetBalance: BigNumber.from(0),
    targetApproval: BigNumber.from(0),
    targetAmount: BigNumber.from(0),
    reserves: [[BigNumber.from(1), BigNumber.from(1)]],
    isExactIn: true,
    minAmountOut: BigNumber.from(0),
    maxAmountIn: BigNumber.from(0),
    currentStatus: TxStatus.REQ_SOURCE_APPROVE,
    slippageTolerance: 100,
    hasImported: false,
    isBusy: false,
    currentPool: {
      contractPackageHash: "",
      contractHash: "",
      tokens: [],
      decimals: BigNumber.from(0),
      totalSupply: BigNumber.from(0),
      reserves: [],
      balance: BigNumber.from(0),
    },
    setExecType: (execType: ExecutionType) =>
      set(() => {
        return {
          execType: execType,
          sourceToken: TokenType.CSPR,
          sourceBalance: BigNumber.from(0),
          sourceApproval: BigNumber.from(0),
          sourceAmount: BigNumber.from(0),
          targetToken: TokenType.SWPR,
          targetBalance: BigNumber.from(0),
          targetApproval: BigNumber.from(0),
          targetAmount: BigNumber.from(0),
          reserves: [[BigNumber.from(1), BigNumber.from(1)]],
          isExactIn: true,
          minAmountOut: BigNumber.from(0),
          maxAmountIn: BigNumber.from(0),
          currentStatus: TxStatus.REQ_SOURCE_APPROVE,
          slippageTolerance: 100,
        };
      }),
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
        sourceAmount: BigNumber.from(
          (
            sourceAmount *
            10 ** supportedTokens[state.sourceToken].decimals
          ).toFixed()
        ),
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
        targetAmount: BigNumber.from(
          (
            targetAmount *
            10 ** supportedTokens[state.targetToken].decimals
          ).toFixed()
        ),
      })),
    setReserves: (reserves: BigNumber[][]) =>
      set(() => ({
        reserves,
      })),
    setExactIn: (isExactIn: boolean) => set(() => ({ isExactIn })),
    setMinAmountOut: (minAmountOut: number) =>
      set((state) => ({
        minAmountOut: BigNumber.from(
          (
            minAmountOut *
            10 ** supportedTokens[state.targetToken].decimals
          ).toFixed()
        ),
      })),
    setMaxAmountIn: (maxAmountIn: number) =>
      set((state) => ({
        maxAmountIn: BigNumber.from(
          (
            maxAmountIn *
            10 ** supportedTokens[state.sourceToken].decimals
          ).toFixed()
        ),
      })),
    setCurrentStatus: (currentStatus: TxStatus) =>
      set(() => ({ currentStatus })),
    updateCurrentStatus: () =>
      set((state) => {
        if (state.isBusy) return {currentStatus: TxStatus.PENDING,};
        else if (
          state.sourceBalance.lt(state.sourceAmount) &&
          supportedTokens[state.sourceToken].isNative
        )
          return {
            currentStatus: TxStatus.REQ_WRAP,
          };
        else if (
          (state.sourceApproval.lt(state.maxAmountIn) && !state.isExactIn) ||
          (state.sourceApproval.lt(state.sourceAmount) && state.isExactIn)
        )
          return {
            currentStatus: TxStatus.REQ_SOURCE_APPROVE,
          };
        else if (
          state.targetApproval.lt(state.targetAmount) &&
          state.execType === ExecutionType.EXE_ADD_LIQUIDITY
        )
          return {
            currentStatus: TxStatus.REQ_TARGET_APPROVE,
          };
        else if (
          state.execType === ExecutionType.EXE_FIND_LIQUIDITY && 
          (state.currentPool.balance.eq(0) || state.hasImported )
        )
          return {
            currentStatus: TxStatus.REQ_ADD_LIQUIDITY,
          };
        return {
          currentStatus: TxStatus.REQ_EXECUTE,
        };
      }),
    switchToken: () =>
      set((state) => {
        if (state.isExactIn)
          return {
            sourceToken: state.targetToken,
            targetToken: state.sourceToken,
            isExactIn: !state.isExactIn,
            sourceAmount: state.targetAmount,
            targetAmount: state.sourceAmount,
          };
        return {
          sourceToken: state.targetToken,
          targetToken: state.sourceToken,
          isExactIn: !state.isExactIn,
          sourceAmount: state.targetAmount,
          targetAmount: state.sourceAmount,
        };
      }),
    setHasImported: (hasImported: boolean) => set(() => ({ hasImported })),
    setBusy: (isBusy: boolean) => set(() => ({ isBusy })),
    setCurrentPool: (currentPool: Pool) => set(() => ({ currentPool })),
  }))
);

export default useLiquidityStatus;
