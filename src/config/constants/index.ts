import { ChainName } from "./chainName";
import { Token } from "../interface/token";
import { testnetTokens } from "./tokens";

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainName in ChainName]: Token[];
};

// used for display in the default list when adding liquidity
export const SUPPORTED_TOKENS: ChainTokenList = {
  [ChainName.MAINNET]: [],
  [ChainName.TESTNET]: [
    testnetTokens.SWPR,
    testnetTokens.CSPR,
    testnetTokens.USDT,
    testnetTokens.CSPD,
  ],
};

export const TOTAL_SHARE = 10000;