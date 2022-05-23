import { BigNumber } from "ethers";

export function shortenAddress(address: string) {
    return address.slice(0, 5) + "..." + address.slice(-4);
}
export function amountWithoutDecimals(amount: BigNumber, decimals: number) {
    return amount.div(10 ** decimals).toNumber() + amount.mod(10 ** decimals).toNumber() / 10 ** decimals;
}