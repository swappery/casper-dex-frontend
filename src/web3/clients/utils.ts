import { ERC20Client } from "casper-erc20-js-client";
import { constants, helpers, utils } from "casper-js-client-helper";
import {
  decodeBase16,
  Signer,
  RuntimeArgs,
  CLValueBuilder,
  CasperClient,
  DeployUtil,
  CLPublicKey,
  CLValue,
} from "casper-js-sdk";
import { Deploy } from "casper-js-sdk/dist/lib/DeployUtil";
import { BigNumberish } from "@ethersproject/bignumber";

export const signDeploy = async (deploy: Deploy, publicKey: CLPublicKey) => {
  const deployJSON = DeployUtil.deployToJson(deploy);
  const publicKeyHex = publicKey.toHex();
  const signedDeployJSON = await Signer.sign(
    deployJSON,
    publicKeyHex,
    publicKeyHex
  );
  const signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
  return signedDeploy;
};

export interface InstallWasmFilePayload {
  nodeAddress: string;
  publicKey: CLPublicKey;
  chainName: string;
  pathToContract: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: BigNumberish;
}

export const installWasmFile = async ({
  nodeAddress,
  publicKey,
  chainName,
  pathToContract,
  runtimeArgs,
  paymentAmount,
}: InstallWasmFilePayload) => {
  const client = new CasperClient(nodeAddress);

  const file = await fetch(pathToContract);
  const bytes = await file.arrayBuffer();
  const contractContent = new Uint8Array(bytes);

  // Set contract installation deploy (unsigned).
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(publicKey, chainName),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      contractContent,
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );

  // Sign deploy
  deploy = await signDeploy(deploy, publicKey);

  // Dispatch deploy to node
  return await client.putDeploy(deploy);
};

export interface ContractCallPayload {
  nodeAddress: string;
  publicKey: CLPublicKey;
  chainName: string;
  contractHash: string;
  entryPoint: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: BigNumberish;
  ttl: number;
  dependencies: string[];
}

export const contractCallFn = async ({
  nodeAddress,
  publicKey,
  chainName,
  contractHash,
  entryPoint,
  runtimeArgs,
  paymentAmount,
  ttl,
  dependencies = [],
}: ContractCallPayload) => {
  const client = new CasperClient(nodeAddress);
  const contractHashAsByteArray = utils.contractHashToByteArray(contractHash);

  const dependenciesBytes = dependencies.map((d: string) =>
    Uint8Array.from(Buffer.from(d, "hex"))
  );

  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      publicKey,
      chainName,
      1,
      ttl,
      dependenciesBytes
    ),
    DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      contractHashAsByteArray,
      entryPoint,
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );

  // Sign deploy.
  deploy = await signDeploy(deploy, publicKey);

  // Dispatch deploy to node.
  return await client.putDeploy(deploy);
};

export const format = (big: any) => {
  if (big && big.div) {
    return big.div(10 ** 9).toNumber();
  } else {
    return big;
  }
};

export const contractSimpleGetter = async (
  nodeAddress: string,
  contractHash: string,
  key: string[]
) => {
  const stateRootHash = await utils.getStateRootHash(nodeAddress);
  const clValue = await utils.getContractData(
    nodeAddress,
    stateRootHash,
    contractHash,
    key
  );

  if (clValue && clValue.CLValue instanceof CLValue) {
    return clValue.CLValue!.value();
  } else {
    throw Error("Invalid stored value");
  }
};