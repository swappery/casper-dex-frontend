import { Keys } from "casper-js-sdk";
const { Ed25519 } = Keys;

export enum RouterEvents {
  AddLiquidity = "add-liquidity",
  RemoveLiquidity = "remove-liquidity",
  Swap = "swap",
}

export const NODE_ADDRESS =
  "http://localhost:3000/api/cors?url=http://5.9.50.59:7777/rpc";

export const CHAIN_NAME = "casper-test";

export const WCSPR_CONTRACT_HASH =
  "hash-0e7b887ac1c7603d3901cc526cd9753e7f8d3d251c254293a429b780fd195e88";

export const TRANSFER_FEE = 1 * 10 ** 9;