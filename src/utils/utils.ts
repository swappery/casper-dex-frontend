import { sleep } from "casper-js-client-helper/dist/helpers/utils";
import { CasperClient } from "casper-js-sdk";
import { BigNumber } from "ethers";

export function shortenAddress(address: string) {
    return address.slice(0, 5) + "..." + address.slice(-4);
}
export function amountWithoutDecimals(amount: BigNumber, decimals: number) {
    return amount.div(10 ** decimals).toNumber() + amount.mod(10 ** decimals).toNumber() / 10 ** decimals;
}

export function deserialize(serializedString: string) {
    return eval('(' + serializedString + ')');
}

export const getDeploy = async (NODE_URL: string, deployHash: string) => {
  const client = new CasperClient(NODE_URL);
  let i = 300;
  while (i !== 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        console.log(deploy);
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