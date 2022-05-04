import {
  CasperClient,
  DeployUtil,
  Signer,
  CasperServiceByJsonRPC,
} from "casper-js-sdk";
// import useNetworkStatus, { NetworkType } from "store/useNetworkStatus";
import { WCSPRClient } from "./clients/wcspr-client";
import { ERC20SignerClient } from "./clients/erc20signer-client";
import {
  NODE_ADDRESS,
  CHAIN_NAME,
  WCSPR_CONTRACT_HASH,
  INSTALL_FEE,
  TRANSFER_FEE,
} from "./config/constant";
import { CLPublicKey, CLValueBuilder, decodeBase16 } from "casper-js-sdk";
// import { supportedTokens, TokenType } from "store/useTokenStatus";
import { BigNumber, BigNumberish } from "ethers";
import { DEFAULT_TTL } from "casper-js-client-helper/dist/constants";
// import useTokenStatus from "store/useTokenStatus";

import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { AsymmetricKey } from "casper-js-sdk/dist/lib/Keys";

export default function useCasperWeb3Provider() {
  // const { setCasperAddress, casperAddress } = useNetworkStatus();
  // const { tokenType } = useTokenStatus();

  async function activate(requireConnection = true) {
    try {
      if (!!casperAddress && casperAddress !== "") return;
      let publicKey = await Signer.getActivePublicKey();
      setCasperAddress(publicKey);
    } catch (err: any | Error) {
      if (requireConnection) {
        Signer.sendConnectionRequest();
      }
      console.error(err);
    }
  }

  function initialize() {
    interface CustomEvent {
      detail: {
        activeKey: string;
        isConnected: boolean;
        isUnlocked: boolean;
      };
    }
    try {
      window.addEventListener("signer:locked", () => {
        setCasperAddress("");
      });
      window.addEventListener("signer:disconnected", () => {
        setCasperAddress("");
      });
      window.addEventListener(
        "signer:connected",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked)
            setCasperAddress(activeKey);
          else setCasperAddress("");
        }
      );
      window.addEventListener(
        "signer:unlocked",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked)
            setCasperAddress(activeKey);
          else setCasperAddress("");
        }
      );
      window.addEventListener(
        "signer:activeKeyChanged",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked)
            setCasperAddress(activeKey);
          else setCasperAddress("");
        }
      );
    } catch (err: any | Error) {
      console.error(err);
    }
  }

  async function wrapCspr(amount: BigNumberish) {
    const contractHash = WCSPR_CONTRACT_HASH.slice(5);
    const wcsprClient = new WCSPRClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await wcsprClient.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(casperAddress);
    const txHash = await wcsprClient.deposit(
      clPK,
      contractHash,
      amount,
      INSTALL_FEE
    );
    const casperClient = new CasperClient(NODE_ADDRESS);
    await casperClient.getDeploy(txHash);
    return txHash;
  }

  async function approve(amount: BigNumberish) {
    const contractHash = supportedTokens[tokenType].csprAddress.slice(5);
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(casperAddress);
    const txHash = await erc20.approveWithSigner(
      clPK,
      amount,
      MASTER_WALLET_KEYPAIR.publicKey,
      TRANSFER_FEE
    );

    const casperClient = new CasperClient(NODE_ADDRESS);
    await casperClient.getDeploy(txHash);
    return txHash;
  }

  async function balanceOf() {
    const contractHash = supportedTokens[tokenType].csprAddress.slice(5);
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    return await erc20.balanceOf(CLPublicKey.fromHex(casperAddress));
  }

  async function allowanceOf() {
    const contractHash = supportedTokens[tokenType].csprAddress.slice(5);
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    return await erc20.allowances(
      CLPublicKey.fromHex(casperAddress),
      MASTER_WALLET_KEYPAIR.publicKey
    );
  }

  return {
    activate,
    initialize,
    wrapCspr,
    approve,
    balanceOf,
    allowanceOf,
  };
}

export async function sendTransfer({
  to,
  amount,
}: {
  to: CLPublicKey;
  amount: BigNumberish;
}) {
  const casperClient = new CasperClient(NODE_ADDRESS);
  const paymentAmount = TRANSFER_FEE;
  const gasPrice = 1;
  const ttl = DEFAULT_TTL;

  let deployParams = new DeployUtil.DeployParams(
    MASTER_WALLET_KEYPAIR.publicKey,
    CHAIN_NAME,
    gasPrice,
    ttl
  );

  const session =
    DeployUtil.ExecutableDeployItem.newTransferWithOptionalTransferId(
      amount,
      to,
      null
    );

  const payment = DeployUtil.standardPayment(paymentAmount);
  const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
  const signedDeploy = DeployUtil.signDeploy(deploy, MASTER_WALLET_KEYPAIR);

  // Here we are sending the signed deploy
  return await casperClient.putDeploy(signedDeploy);
}

export async function unwrapCspr(amount: BigNumberish) {
  const contractHash = WCSPR_CONTRACT_HASH.slice(5);
  const wcsprClient = new WCSPRClient(NODE_ADDRESS, CHAIN_NAME, undefined);
  await wcsprClient.setContractHash(contractHash);
  const txHash = await wcsprClient.withdraw(
    MASTER_WALLET_KEYPAIR,
    amount,
    TRANSFER_FEE,
    true
  );
  const casperClient = new CasperClient(NODE_ADDRESS);
  await casperClient.getDeploy(txHash);
  return txHash;
}

export async function transfer(
  tokenType: TokenType,
  amount: BigNumberish,
  recipient: CLPublicKey
) {
  const contractHash = supportedTokens[tokenType].csprAddress.slice(5);
  const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
  await erc20.setContractHash(contractHash);
  return await erc20.transfer(
    MASTER_WALLET_KEYPAIR,
    recipient,
    amount.toString(),
    TRANSFER_FEE.toString()
  );
}

export async function transferFrom(
  tokenType: TokenType,
  amount: BigNumberish,
  sender: CLPublicKey,
  recipient: CLPublicKey
) {
  const contractHash = supportedTokens[tokenType].csprAddress.slice(5);
  const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
  await erc20.setContractHash(contractHash);
  return await erc20.transferFrom(
    MASTER_WALLET_KEYPAIR,
    sender,
    recipient,
    amount.toString(),
    TRANSFER_FEE.toString()
  );
}

export async function bridge(
  fromNetwork: NetworkType,
  tokenType: TokenType,
  amount: BigNumberish,
  address: string
) {
  let txHash = "";
  if (supportedTokens[tokenType].network === NetworkType.CASPER) {
    if (fromNetwork === NetworkType.CASPER) {
      txHash = await transferFrom(
        tokenType,
        amount,
        CLPublicKey.fromHex(address),
        MASTER_WALLET_KEYPAIR.publicKey
      );
    } else {
      if (tokenType === TokenType.CSPR) {
        await unwrapCspr(amount);
        txHash = await sendTransfer({
          to: CLPublicKey.fromHex(address),
          amount,
        });
      } else {
        txHash = await transfer(
          tokenType,
          amount,
          CLPublicKey.fromHex(address)
        );
      }
    }
  } else {
    // Update for the extendable part
  }
  const casperClient = new CasperClient(NODE_ADDRESS);
  await casperClient.getDeploy(txHash);
  return txHash;
}
