import { ChainName } from "../constants/types";
/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly decimals: number
  public readonly chainId: ChainName
  public readonly address: string
  public readonly isNative: boolean
  public readonly symbol?: string
  public readonly name?: string
  public readonly projectLink?: string


  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  public constructor(chainId: ChainName,
    address: string,
    decimals: number,
    isNative: boolean,
    symbol?: string,
    name?: string,
    projectLink?: string) {
      this.chainId = chainId;
      this.address = address;
      this.decimals = decimals;
      this.isNative = isNative;
      this.symbol = symbol;
      this.name = name;
      this.projectLink = projectLink;
    }
    public equals(other: Currency): boolean {
      // short circuit on reference equality
      if (this === other) {
        return true
      }
      return this.chainId === other.chainId && this.address === other.address
    }
}

export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  return currencyA.equals(currencyB);
}