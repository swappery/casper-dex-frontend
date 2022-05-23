
export enum RouterEvents {
  AddLiquidity = "add-liquidity",
  RemoveLiquidity = "remove-liquidity",
  Swap = "swap",
}

export const NODE_ADDRESS =
  "https://picaswap.io/.netlify/functions/cors?url=http://95.217.34.115:7777/rpc";

export const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || "casper-test";

export const WCSPR_CONTRACT_HASH =
  "d91883e9ebe885aaa16b16c10652617e1752d40bd90148aa79d971df60d93120";

export const ROUTER_CONTRACT_HASH =
  "b03d2f26752372f2169776465e891a12bcba5c4bfc5dc50ae80a0c1cd34089a0";

export const ROUTER_CONTRACT_PACKAGE_HASH =
  "2ffac3a9aa396218151784d39455aee899b94fc9d916b7294fad145333cbed90";

export const TRANSFER_FEE = 10 * 10 ** 9;
export const INSTALL_FEE = 3 * 10 ** 9;