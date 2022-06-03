import { Token } from "../interface/token";
import csprLogo from "../../assets/images/tokens/3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6.svg";
import swprLogo from "../../assets/images/tokens/fe33392bf4d0ff2edbb5a664256271c03c9ed98da7a902472336a4c67cbb8f85.svg";
import usdtLogo from "../../assets/images/tokens/0xf063b26bBaa7B71B65Ddd954cB0b289bBb7AA95b.png";
import cspdLogo from "../../assets/images/tokens/0xef9481115ff33e94d3e28a52d3a8f642bf3521e5.png";
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
  USDT: {
    name: "Casper Stable Coin",
    symbol: "USDT",
    decimals: 9,
    address: "bc0b1015de95e1f9187436be56faa0018ea708e366a596e2c6358b0f652ae85e",
    isNative: false,
    logo: usdtLogo,
  },
  CSPD: {
    name: "CasperPad Token",
    symbol: "CSPD",
    decimals: 9,
    address: "5de9ff19164622033901df270f865072146f4b3835c944aeb8d3b66fe9b3512c",
    isNative: false,
    logo: cspdLogo,
  },
} as const);
