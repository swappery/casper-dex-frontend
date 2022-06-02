import { Token } from "../interface/token";
import csprLogo from "../../assets/images/tokens/3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6.svg";
import swprLogo from "../../assets/images/tokens/fe33392bf4d0ff2edbb5a664256271c03c9ed98da7a902472336a4c67cbb8f85.svg";

interface TokenList {
  [symbol: string]: Token;
};

const defineTokens = <T extends TokenList>(t: T) => t;
export const testnetTokens = defineTokens({
  SWPR: {
    name: "Test Swappery Token",
    symbol: "SWPR",
    decimals: 9,
    address: "fe33392bf4d0ff2edbb5a664256271c03c9ed98da7a902472336a4c67cbb8f85",
    isNative: false,
    logo: swprLogo,
  },
  CSPR: {
    name: "Casper Native Token",
    symbol: "CSPR",
    decimals: 9,
    address: "3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6",
    isNative: true,
    logo: csprLogo,
  },
} as const);
