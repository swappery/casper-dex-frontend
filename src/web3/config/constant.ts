import { Keys } from "casper-js-sdk";
const { Ed25519 } = Keys;

export enum RouterEvents {
  AddLiquidity = "add-liquidity",
  RemoveLiquidity = "remove-liquidity",
  Swap = "swap",
}

export const NODE_ADDRESS =
  // "http://localhost:3000/api/cors?url=http://5.9.50.59:7777/rpc";
  "https://picaswap.io/.netlify/functions/cors?url=http://5.9.50.59:7777/rpc";

export const CHAIN_NAME = "casper-test";

export const WCSPR_CONTRACT_HASH =
  "0e7b887ac1c7603d3901cc526cd9753e7f8d3d251c254293a429b780fd195e88";

export const ROUTER_CONTRACT_HASH = 
  "97e7dc9175fe0f038e728a8c3d8a68d417ba51e3353679e965d3f0e73c1e7e8e";

export const ROUTER_CONTRACT_PACKAGE_HASH =
  "b8814448f6e631c19a3a7aa6ebc825cdb9d8647bf5849c41db720ffaf7cb86e4";

export const TRANSFER_FEE = 1 * 10 ** 9;
export const INSTALL_FEE = 3 * 10 ** 9;