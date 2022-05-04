import { Keys } from "casper-js-sdk";
const { Ed25519 } = Keys;

export const NODE_ADDRESS =
  "http://localhost:3000/api/cors?url=http://5.9.50.59:7777/rpc";

export const CHAIN_NAME = "casper-test";

export const WCSPR_CONTRACT_HASH =
  "hash-9d15ac8d5692cdc17b2167499cebf707ce339a7f55b551cec7ab8260e8675230";

export const TRANSFER_FEE = 0.2 * 10 ** 9;
export const INSTALL_FEE = 3 * 10 ** 9;