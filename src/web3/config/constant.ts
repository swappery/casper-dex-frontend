export enum RouterEvents {
  AddLiquidity = "add-liquidity",
  RemoveLiquidity = "remove-liquidity",
  Swap = "swap",
}

export const NODE_ADDRESS =
  process.env.REACT_APP_CASPER_NODE_ADDRESS ||
  "https://picaswap.io/.netlify/functions/cors?url=http://95.217.34.115:7777/rpc";

export const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || "casper-test";

export const WCSPR_CONTRACT_HASH =
  "3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6";

export const ROUTER_CONTRACT_HASH =
  "dc32f60fa3fe420f5e3b4acce68ca8b71f2351bf2b6d65b8ae1fca5f17577815";

export const ROUTER_CONTRACT_PACKAGE_HASH =
  "40e52abd5dc4069be51af7496d5aa2b9a2b7b82e739f0bad9c6ca8c5a570dd8e";

export const TRANSFER_FEE = 10 * 10 ** 9;
export const INSTALL_FEE = 3 * 10 ** 9;
