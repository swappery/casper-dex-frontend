import { constants } from "casper-js-client-helper";
import {
  decodeBase16,
  RuntimeArgs,
  CLValueBuilder,
  CLPublicKey,
} from "casper-js-sdk";

import { installWasmFile } from "./utils";
import { ERC20SignerClient } from "./erc20signer-client";
import { BigNumberish } from "@ethersproject/bignumber";
import { Keys } from "casper-js-sdk";

const { DEFAULT_TTL } = constants;

const PRE_DEPOSIT_WASM_PATH = "./wcspr_pre_deposit.wasm";

export class WCSPRClient extends ERC20SignerClient {
  async withdraw(
    recipient: CLPublicKey | Keys.AsymmetricKey,
    withdrawAmount: BigNumberish,
    paymentAmount: BigNumberish,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      amount: CLValueBuilder.u512(withdrawAmount.toString()),
    });
    return await this.contractCallWithSigner({
      entryPoint: "withdraw",
      publicKey: recipient,
      paymentAmount: paymentAmount.toString(),
      runtimeArgs,
      cb: (deployHash: string) =>
        this.addPendingDeploy("withdraw", deployHash),
      ttl,
    } as ERC20SignerClient.ContractCallWithSignerPayload);
  }

  async deposit(
    publicKey: CLPublicKey,
    wcsprContractHash: string,
    depositAmount: BigNumberish,
    paymentAmount: BigNumberish
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      amount: CLValueBuilder.u512(depositAmount),
      wcspr_contract_hash_key: CLValueBuilder.key(
        CLValueBuilder.byteArray(decodeBase16(wcsprContractHash))
      ),
      entry_point_name: CLValueBuilder.string("deposit"),
      deposit_point_name: CLValueBuilder.string("main_purse"),
    });

    const deployHash = await installWasmFile({
      chainName: this.chainName,
      paymentAmount,
      nodeAddress: this.nodeAddress,
      publicKey,
      pathToContract: PRE_DEPOSIT_WASM_PATH,
      runtimeArgs,
    });
    return deployHash;
  }
}
