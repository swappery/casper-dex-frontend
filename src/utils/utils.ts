import { sleep } from "casper-js-client-helper/dist/helpers/utils";
import { CasperClient } from "casper-js-sdk";
import { BigNumber } from "ethers";
import { Token } from "../config/interface/token";

export const shortenAddress = (address: string) => {
    return address.slice(0, 5) + "..." + address.slice(-4);
}
export const amountWithoutDecimals = (amount: BigNumber, decimals: number) => {
    return BigNumber.from(amount).div(10 ** decimals).toNumber() + BigNumber.from(amount).mod(10 ** decimals).toNumber() / 10 ** decimals;
}

export const deserialize = (serializedString: string) => {
    // eslint-disable-next-line no-eval
    return eval('(' + serializedString + ')');
}

export const getAmountsOut = (amount: BigNumber, reserves: BigNumber[][], decimals: number) => {
  let tempAmount = amount;
  reserves.forEach((reserve) => {
    tempAmount = tempAmount
      .mul(998)
      .mul(reserve[1])
      .div(reserve[0].mul(1000).add(tempAmount.mul(998)));
  });
  return amountWithoutDecimals(tempAmount, decimals);
}

export const getAmountsIn = (amount: BigNumber, reserves: BigNumber[][], decimals: number) => {
  let tempAmount = amount;
  reserves.forEach((reserve) => {
    tempAmount = reserve[0]
      .mul(tempAmount)
      .mul(1000)
      .div(reserve[1].sub(tempAmount).mul(998))
      .add(1);
  });
  return amountWithoutDecimals(tempAmount, decimals);
};

export const getTokenFromAddress = (address: string, tokens: Token[]): Token | undefined => {
  for (var i = 0 ; i < tokens.length ; i ++) {
    if(tokens[i].address === address) return tokens[i];
  }
  return;
}

export const reverseDoubleArray = (input: BigNumber[][]): BigNumber[][] => {
  let output: BigNumber[][] = [];
  for (var i = 1 ; i <= input.length ; i ++) {
    output.push([input[input.length - i][1], input[input.length - i][0]]);
  }
  return output;
}

export const getDeploy = async (NODE_URL: string, deployHash: string) => {
  const client = new CasperClient(NODE_URL);
  let i = 300;
  while (i !== 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        return deploy;
      } else {
        // @ts-ignore
        throw Error(
          "Contract execution: " +
            // @ts-ignore
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
};