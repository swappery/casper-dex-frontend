export enum RouterEvents {
  CreatePair = "create_pair",
  AddLiquidity = "add_liquidity",
  RemoveLiquidity = "remove_liquidity",
  SwapExactIn = "swap_exact_in",
  SwapExactOut = "swap_exact_out",
}

export const NODE_ADDRESS =
  process.env.REACT_APP_CASPER_NODE_ADDRESS ||
  "https://picaswap.io/.netlify/functions/cors?url=http://95.217.34.115:7777/rpc";

export const EVENT_STREAM_ADDRESS = process.env.REACT_APP_EVENT_STREAM_ADDRESS;

export const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || "casper-test";

export const WCSPR_CONTRACT_HASH =
  "3d3d5301e1a1deb700fb018bc8a0d52514ff7e169bd3fe75c3f9b72440ec21f6";

export const ROUTER_CONTRACT_HASH =
  "dc32f60fa3fe420f5e3b4acce68ca8b71f2351bf2b6d65b8ae1fca5f17577815";

export const ROUTER_CONTRACT_PACKAGE_HASH =
  "40e52abd5dc4069be51af7496d5aa2b9a2b7b82e739f0bad9c6ca8c5a570dd8e";

export const MASTER_CHEF_CONTRACT_HASH = "d5ce08556247a0025379fddf4cf8f0c67ad656390d2817967c6b3cf356b86bab";

export const MASTER_CHEF_CONTRACT_PACKAGE_HASH = "e91a2ffaec3cd825857e48fad248918f1a8f8461a60711adf26c7a892c41857a";

export const SYRUP_TOKEN_CONTRACT_HASH = "e52a1b3d9619ddd6529e21bdec7689b4b568cb1b256932f9e47161b4bd990265";

export const TRANSFER_FEE = 10 * 10 ** 9;
export const INSTALL_FEE = 3 * 10 ** 9;

export const CONTRACT_PACKAGE_PREFIX = "contract-package-wasm";