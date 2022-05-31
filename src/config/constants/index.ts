import { ChainName } from "./types";
import { Token } from "../sdk/token";
import { mainnetTokens, testnetTokens } from "./tokens";

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainName in ChainName]: Token[];
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainName.MAINNET]: [
    mainnetTokens.swpr,
    mainnetTokens.wcspr,
    mainnetTokens.usdt,
  ],
  [ChainName.TESTNET]: [
    testnetTokens.swpr,
    testnetTokens.wcspr,
    testnetTokens.usdt,
  ],
};
