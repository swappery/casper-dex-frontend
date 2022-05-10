import {
  CasperClient,
  DeployUtil,
  Signer,
  CasperServiceByJsonRPC,
  CLPublicKey,
  CLValueBuilder,
  decodeBase16,
} from "casper-js-sdk";
import { RecipientType } from "casper-js-client-helper/dist/types";
import { WCSPRClient } from "./clients/wcspr-client";
import { ERC20SignerClient } from "./clients/erc20signer-client";
import useNetworkStatus from "../store/useNetworkStatus";
import useLiquidityStatus, { supportedTokens, TxStatus } from "../store/useLiquidityStatus";
import { BigNumberish } from "ethers";
import { CHAIN_NAME, NODE_ADDRESS, ROUTER_CONTRACT_PACKAGE_HASH, TRANSFER_FEE } from "./config/constant";
import { toast } from "react-toastify";

export default function useCasperWeb3Provider() {
  const {setActiveAddress, activeAddress, isConnected} = useNetworkStatus();

  const {
    execType,
    sourceToken,
    sourceBalance,
    sourceApproval,
    sourceAmount,
    targetToken,
    targetBalance,
    targetApproval,
    targetAmount,
    currentStatus,
    updateCurrentStatus,
    setCurrentStatus,
    setSourceBalance,
    setSourceApproval,
    setTargetBalance,
    setTargetApproval,
  } = useLiquidityStatus();

  async function activate(requireConnection = true) {
    try {
      if (!!activeAddress && activeAddress !== "") return;
      let publicKey = await Signer.getActivePublicKey();
      setActiveAddress(publicKey);
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
        setActiveAddress("");
      });
      window.addEventListener("signer:disconnected", () => {
        setActiveAddress("");
      });
      window.addEventListener(
        "signer:connected",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked)
            setActiveAddress(activeKey);
          else setActiveAddress("");
        }
      );
      window.addEventListener(
        "signer:unlocked",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked)
            setActiveAddress(activeKey);
          else setActiveAddress("");
        }
      );
      window.addEventListener(
        "signer:activeKeyChanged",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked)
            setActiveAddress(activeKey);
          else setActiveAddress("");
        }
      );
    } catch (err: any | Error) {
      console.error(err);
    }
  }

  async function allowanceOf(contractHash: string) {
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    return await erc20.allowances(
      CLPublicKey.fromHex(activeAddress),
      CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH))
    );
  }

  async function approveSourceToken(amount: BigNumberish) {
    if (!isConnected) return;
    let txHash;
    setCurrentStatus(TxStatus.PENDING);
    const contractHash = supportedTokens[sourceToken].contractHash;
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    txHash = await erc20.approveWithSigner(
      clPK,
      amount,
      CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH)),
      TRANSFER_FEE
    );
    const casperClient = new CasperClient(NODE_ADDRESS);
    await casperClient.getDeploy(txHash);
    setSourceApproval(await allowanceOf(supportedTokens[sourceToken].contractHash));
    toast.success("Source Approved.");
  }

  async function approveTargetToken(amount: BigNumberish) {
    if (!isConnected) return;
    let txHash;
    setCurrentStatus(TxStatus.PENDING);
    const contractHash = supportedTokens[targetToken].contractHash;
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    txHash = await erc20.approveWithSigner(
      clPK,
      amount,
      CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH)),
      TRANSFER_FEE
    );
    const casperClient = new CasperClient(NODE_ADDRESS);
    await casperClient.getDeploy(txHash);
    setSourceApproval(await allowanceOf(supportedTokens[targetToken].contractHash));
    toast.success("Target Approved.");
  }
}
