import { ChainName } from "./types";
import { Currency } from "../sdk/currency";
import { mainnetTokens, testnetTokens } from "./tokens";

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainName in ChainName]: Currency[];
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainName.MAINNET]: [
  ],
  [ChainName.TESTNET]: [
    testnetTokens.swpr,
    testnetTokens.cspr,
  ],
};
