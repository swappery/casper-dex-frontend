import { BigNumberish } from "ethers";
import { getTokenSourceMapRange } from "typescript";
import create, {State} from "zustand";

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
        name: "Coin A",
        symbol: "CoA",
        decimals: 9,
        contractHash: "94336dc55269c2fbf05aa44d395c5684297eeb7e801056c9c9fe4ef93b651fb1",
        isNative: false,
    },
    {
        name: "Coin B",
        symbol: "CoB",
        decimals: 9,
        contractHash: "ce05047ad3bd89e3febdb54f9a61018ce0697488d26cb59cb1fc31f4a2753e2c",
        isNative: false,
    },
    {
        name: "Coin C",
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
    REQ_FIRST_APPROVE = "REQ_FIRST_APPROVE",
    REQ_LAST_APPROVE = "REQ_LAST_APPROVE",
    REQ_EXECUTE = "REQ_EXECUTE",
    PENDING = "PENDING",
}

interface LiquidityStatus extends State {
    execType: ExecutionType;
    sourceToken: TokenType;
    sourceBalance: BigNumberish;
    sourceApproval: BigNumberish;
    sourceAmount: BigNumberish;
    targetToken: TokenType;
    targetBalance: BigNumberish;
    targetApproval: BigNumberish;
    targetAmount: BigNumberish;
    currentStatus: TxStatus;
    setExecType: (execType: ExecutionType) => void;
    
}