import { ChainName } from "../constants/types";
import { Currency } from "./currency";

export declare class Token extends Currency {
  readonly chainName: ChainName;
  readonly address: string;
  readonly projectLink?: string;
  constructor(
    chainName: ChainName,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    projectLink?: string
  );
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainName and address.
   * @param other other token to compare
   */
  equals(other: Token): boolean;
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  sortsBefore(other: Token): boolean;
}

/**
 * Compares two currencies for equality
 */
export declare function currencyEquals(
  currencyA: Currency,
  currencyB: Currency
): boolean;
