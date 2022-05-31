import { Currency } from "../sdk/currency";
import { ChainName } from "./types";

const { MAINNET, TESTNET } = ChainName;

interface TokenList {
  [symbol: string]: Currency;
}

const defineTokens = <T extends TokenList>(t: T) => t;

export const mainnetTokens = defineTokens({
  
} as const);

export const testnetTokens = defineTokens({
  cspr: new Currency(
    TESTNET,
    "3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6",
    9,
    true,
    "CSPR",
    "Casper Native Token",
    "https://www.binance.com/",
  ),
  swpr: new Currency(
    TESTNET,
    "fe33392bf4d0ff2edbb5a664256271c03c9ed98da7a902472336a4c67cbb8f85",
    9,
    false,
    "SWPR",
    "Swappery Token",
    "https://swappery.finance/",
  ),
  
} as const);
