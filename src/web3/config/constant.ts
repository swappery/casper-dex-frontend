export enum RouterEvents {
  AddLiquidity = "add-liquidity",
  RemoveLiquidity = "remove-liquidity",
  Swap = "swap",
}

export const NODE_ADDRESS =
  process.env.REACT_APP_NODE_ADDRESS ||
  "https://picaswap.io/.netlify/functions/cors?url=http://95.217.34.115:7777/rpc";

export const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || "casper-test";

export const WCSPR_CONTRACT_HASH =
  "3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6";

export const ROUTER_CONTRACT_HASH =
  "5685f784e267c268e0cf62b8a2959c2ebd9a70507c2da5388b6bd12860a3d101";

export const ROUTER_CONTRACT_PACKAGE_HASH =
  "603951a86a2d185624145a81acfcf41777434ae679555c10b293641f4be53b3f";

export const TRANSFER_FEE = 10 * 10 ** 9;
export const INSTALL_FEE = 3 * 10 ** 9;
