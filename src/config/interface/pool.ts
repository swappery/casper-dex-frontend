import { BigNumber } from "ethers";
import { Token } from "./token";

export interface Pool {
  contractPackageHash: string;
  contractHash: string;
  tokens: Token[];
  decimals: number;
  totalSupply: BigNumber;
  reserves: BigNumber[];
  balance: BigNumber;
  allowance: BigNumber;
}