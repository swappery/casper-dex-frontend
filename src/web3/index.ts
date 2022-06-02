/* eslint-disable react-hooks/exhaustive-deps */
import {
  Signer,
  CLPublicKey,
  CLValueBuilder,
  decodeBase16,
  CasperServiceByJsonRPC,
} from "casper-js-sdk";
import { WCSPRClient } from "./clients/wcspr-client";
import { ERC20SignerClient } from "./clients/erc20signer-client";
import useNetworkStatus from "../store/useNetworkStatus";
import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
  TokenType,
} from "../store/useLiquidityStatus";
import { BigNumber, BigNumberish } from "ethers";
import {
  CHAIN_NAME,
  INSTALL_FEE,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
  ROUTER_CONTRACT_PACKAGE_HASH,
  TRANSFER_FEE,
  WCSPR_CONTRACT_HASH,
} from "./config/constant";
import { useEffect } from "react";
import { SwapperyRouterClient } from "./clients/swappery-router-client";
import { SwapperyPairClient } from "./clients/swappery-pair-client";
import useWalletStatus, { Pool } from "../store/useWalletStatus";
import { deserialize, getDeploy } from "../utils/utils";
import { useSearchParams } from "react-router-dom";

export default function useCasperWeb3Provider() {
  const { setActiveAddress, activeAddress, isConnected } = useNetworkStatus();

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
    hasImported,
    isBusy,
    currentPool,
    liquidityAmount,
    liquidityApproval,
    updateCurrentStatus,
    setSourceBalance,
    setSourceApproval,
    setTargetBalance,
    setTargetApproval,
    setReserves,
    setHasImported,
    setBusy,
    setCurrentPool,
    setExecTypeWithCurrency,
    setLiquidityApproval,
  } = useLiquidityStatus();

  const { addAccount, accountListString } = useWalletStatus();
  const [searchParams] = useSearchParams();

  async function activate(requireConnection = true): Promise<void> {
    try {
      if (!!activeAddress && activeAddress !== "") return;
      let publicKey = await Signer.getActivePublicKey();
      setActiveAddress(publicKey);
      addAccount(publicKey);
    } catch (err: any | Error) {
      if (requireConnection) {
        Signer.sendConnectionRequest();
      }
      // console.error(err);
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
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked) {
            setActiveAddress(activeKey);
            addAccount(activeKey);
          } else setActiveAddress("");
        }
      );
      window.addEventListener(
        "signer:unlocked",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked) {
            setActiveAddress(activeKey);
            addAccount(activeKey);
          } else setActiveAddress("");
        }
      );
      window.addEventListener(
        "signer:activeKeyChanged",
        async (event: any | CustomEvent) => {
          const { activeKey, isConnected, isUnlocked } = event.detail;
          if (!!activeKey && activeKey !== "" && isConnected && isUnlocked) {
            setActiveAddress(activeKey);
            addAccount(activeKey);
          } else setActiveAddress("");
        }
      );
    } catch (err: any | Error) {
      console.error(err);
    }
  }

  async function allowanceOf(contractHash: string) {
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    let allowance;
    try {
      allowance = await erc20.allowances(
        CLPublicKey.fromHex(activeAddress),
        CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH))
      );
    } catch (error) {
      return 0;
    }
    return allowance;
  }

  async function balanceOf(contractHash: string) {
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    let balance;
    try {
      balance = await erc20.balanceOf(CLPublicKey.fromHex(activeAddress));
    } catch (error) {
      return 0;
    }
    return balance;
  }

  async function approveSourceToken(amount: BigNumberish) {
    if (!isConnected) return;
    let txHash = "";
    setBusy(true);
    const contractHash = supportedTokens[sourceToken].contractHash;
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    try {
      txHash = await erc20.approveWithSigner(
        clPK,
        amount,
        CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH)),
        TRANSFER_FEE
      );
    } catch (err) {
      console.log("AAA");
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash);
      setSourceApproval(await allowanceOf(contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  async function approveTargetToken(amount: BigNumberish) {
    if (!isConnected) return;
    let txHash;
    setBusy(true);
    const contractHash = supportedTokens[targetToken].contractHash;
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    try {
      txHash = await erc20.approveWithSigner(
        clPK,
        amount,
        CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH)),
        TRANSFER_FEE
      );
    } catch (err) {
      setBusy(false); return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash);
      setTargetApproval(await allowanceOf(contractHash));
      setBusy(false); return txHash;
    } catch (error) {
      setBusy(false); return txHash;
    }
  }

  async function approveLiquidity(amount: BigNumberish) {
    if (!isConnected) return;
    let txHash = "";
    setBusy(true);
    const contractHash = currentPool.contractHash;
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    try {
      txHash = await erc20.approveWithSigner(
        clPK,
        amount,
        CLValueBuilder.byteArray(decodeBase16(ROUTER_CONTRACT_PACKAGE_HASH)),
        TRANSFER_FEE
      );
    } catch (err) {
      console.log("AAA");
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash);
      setLiquidityApproval(await allowanceOf(contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  async function wrapCspr(amount: BigNumberish) {
    if (!isConnected) return;
    let txHash = "";
    setBusy(true);
    const contractHash = WCSPR_CONTRACT_HASH;
    const wcsprClient = new WCSPRClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await wcsprClient.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    try {
      txHash = await wcsprClient.deposit(clPK, contractHash, amount, INSTALL_FEE);
    } catch (err) {
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash);
      setSourceBalance(await balanceOf(supportedTokens[sourceToken].contractHash));
      setTargetBalance(await balanceOf(supportedTokens[targetToken].contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  async function isPairExist(
    sourceToken: TokenType,
    targetToken: TokenType
  ) {
    let routerContractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(routerContractHash);
    const sourceContractHash = supportedTokens[sourceToken].contractHash;
    const targetContractHash = supportedTokens[targetToken].contractHash;
    return await routerClient.isPairExists(
      sourceContractHash,
      targetContractHash
    );
  }
  async function getPairFor(
    sourceContractHash: string,
    targetContractHash: string
  ) {
    let routerContractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(routerContractHash);
    if (await routerClient.isPairExists(sourceContractHash, targetContractHash)){
      let pairPackageHash = await routerClient.getPairFor(
        sourceContractHash,
        targetContractHash
      );
      return pairPackageHash;
    }
    return;
  }

  async function getReserves(
    sourceToken: TokenType,
    targetToken: TokenType
  ) {
    let routerContractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(routerContractHash);
    const sourceContractHash = supportedTokens[sourceToken].contractHash;
    const targetContractHash = supportedTokens[targetToken].contractHash;
    if (await routerClient.isPairExists(sourceContractHash, targetContractHash)) {
      let pairPackageHash = await routerClient.getPairFor(
        sourceContractHash,
        targetContractHash
      );
      const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
      const { block } = await client.getLatestBlockInfo();

      if (block) {
        const stateRootHash = block.header.state_root_hash;
        const blockState = await client.getBlockState(
          stateRootHash,
          `hash-${pairPackageHash}`,
          []
        );

        let pairContractHash =
          blockState.ContractPackage?.versions[
            blockState.ContractPackage.versions.length - 1
          ].contractHash.slice(9);
        let pairClient = new SwapperyPairClient(
          NODE_ADDRESS,
          CHAIN_NAME,
          undefined
        );
        await pairClient.setContractHash(pairContractHash!);
        let reserves = await pairClient.getReserves();
        if (sourceContractHash < targetContractHash)
          return [BigNumber.from(reserves[0]), BigNumber.from(reserves[1])];
        return [BigNumber.from(reserves[1]), BigNumber.from(reserves[0])];
      }
    }
    return [BigNumber.from(0), BigNumber.from(1)];
  }

  async function addLiquidity(
    publicKey: CLPublicKey,
    sourceToken: TokenType,
    sourceAmount: BigNumberish,
    targetToken: TokenType,
    targetAmount: BigNumberish
  ) {
    if (!isConnected) return;
    setBusy(true);
    let txHash;
    let contractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(contractHash);
    try {
      txHash = await routerClient.addLiquidity(
        publicKey,
        supportedTokens[sourceToken].contractHash,
        supportedTokens[targetToken].contractHash,
        sourceAmount,
        targetAmount,
        0,
        0,
        TRANSFER_FEE
      );
    } catch (err) {
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setSourceBalance(await balanceOf(supportedTokens[sourceToken].contractHash));
      setTargetBalance(await balanceOf(supportedTokens[targetToken].contractHash));
      setSourceApproval(await allowanceOf(supportedTokens[sourceToken].contractHash));
      setTargetApproval(await allowanceOf(supportedTokens[targetToken].contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  async function removeLiquidity(
    publicKey: CLPublicKey,
    sourceTokenAddress: string,
    targetTokenAddress: string,
    liquidityAmount: BigNumberish
  ) {
    if (!isConnected) return;
    setBusy(true);
    let txHash;
    let contractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(contractHash);
    try {
      txHash = await routerClient.removeLiquidity(
        publicKey,
        sourceTokenAddress,
        targetTokenAddress,
        liquidityAmount,
        0,
        0,
        TRANSFER_FEE
      );
    } catch (err) {
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setSourceBalance(await balanceOf(supportedTokens[sourceToken].contractHash));
      setTargetBalance(await balanceOf(supportedTokens[targetToken].contractHash));
      setSourceApproval(await allowanceOf(supportedTokens[sourceToken].contractHash));
      setTargetApproval(await allowanceOf(supportedTokens[targetToken].contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  async function swapExactIn(
    publicKey: CLPublicKey,
    sourceToken: TokenType,
    targetToken: TokenType,
    sourceAmount: BigNumberish,
    targetAmountMin: BigNumberish
  ) {
    if (!isConnected) return;
    setBusy(true);
    let txHash;
    let contractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(contractHash);
    try {
      txHash = await routerClient.swapExactIn(
        publicKey,
        supportedTokens[sourceToken].contractHash,
        supportedTokens[targetToken].contractHash,
        sourceAmount,
        targetAmountMin,
        TRANSFER_FEE
      );
    } catch (err) {
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setSourceBalance(await balanceOf(supportedTokens[sourceToken].contractHash));
      setTargetBalance(await balanceOf(supportedTokens[targetToken].contractHash));
      setSourceApproval(await allowanceOf(supportedTokens[sourceToken].contractHash));
      setTargetApproval(await allowanceOf(supportedTokens[targetToken].contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  async function swapExactOut(
    publicKey: CLPublicKey,
    sourceToken: TokenType,
    targetToken: TokenType,
    sourceAmountMax: BigNumberish,
    targetAmount: BigNumberish
  ) {
    if (!isConnected) return;
    setBusy(true);
    let txHash;
    let contractHash = ROUTER_CONTRACT_HASH;
    let routerClient = new SwapperyRouterClient(
      NODE_ADDRESS,
      CHAIN_NAME,
      undefined
    );
    await routerClient.setContractHash(contractHash);
    try {
      txHash = await routerClient.swapExactOut(
        publicKey,
        supportedTokens[sourceToken].contractHash,
        supportedTokens[targetToken].contractHash,
        targetAmount,
        sourceAmountMax,
        TRANSFER_FEE
      );
    } catch (err) {
      setBusy(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setSourceBalance(await balanceOf(supportedTokens[sourceToken].contractHash));
      setTargetBalance(await balanceOf(supportedTokens[targetToken].contractHash));
      setSourceApproval(await allowanceOf(supportedTokens[sourceToken].contractHash));
      setTargetApproval(await allowanceOf(supportedTokens[targetToken].contractHash));
      setBusy(false);
      return txHash;
    } catch (error) {
      setBusy(false);
      return txHash;
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    async function handleChangeAddress() {
      if (!isConnected || sourceToken === TokenType.EMPTY || targetToken === TokenType.EMPTY) return;
      setSourceBalance(
        await balanceOf(supportedTokens[sourceToken].contractHash)
      );
      setSourceApproval(
        await allowanceOf(supportedTokens[sourceToken].contractHash)
      );
      setTargetBalance(
        await balanceOf(supportedTokens[targetToken].contractHash)
      );
      setTargetApproval(
        await allowanceOf(supportedTokens[targetToken].contractHash)
      );
    }
    handleChangeAddress();
  }, [activeAddress, sourceToken, targetToken]);

  useEffect(() => {
    updateCurrentStatus();
  }, [
    sourceToken,
    sourceBalance,
    sourceApproval,
    sourceAmount,
    targetToken,
    targetBalance,
    targetApproval,
    targetAmount,
    currentPool,
    hasImported,
    isBusy,
    liquidityApproval,
    liquidityAmount,
  ]);

  useEffect(() => {
    async function handleGetReserves() {
      if (!isConnected || sourceToken === TokenType.EMPTY || targetToken === TokenType.EMPTY) return;
      if (execType !== ExecutionType.EXE_FIND_LIQUIDITY) setBusy(true);
      if (await isPairExist(sourceToken, targetToken)) {
        const reserves = await getReserves(sourceToken, targetToken);
        console.log(reserves[0].toNumber(), reserves[1].toNumber());
        let reservesList: BigNumber[][] = [];
        reservesList.push([
          BigNumber.from(reserves[0]),
          BigNumber.from(reserves[1]),
        ]);
        setReserves(reservesList);
        if (execType !== ExecutionType.EXE_FIND_LIQUIDITY) setBusy(false);
      } else if (
        (await isPairExist(sourceToken, TokenType.CSPR)) &&
        (await isPairExist(TokenType.CSPR, targetToken))
      ) {
        let reservesList: BigNumber[][] = [];
        const step1 = await getReserves(sourceToken, TokenType.CSPR);
        console.log(step1[0].toNumber(), step1[1].toNumber());
        reservesList.push([BigNumber.from(step1[0]), BigNumber.from(step1[1])]);
        const step2 = await getReserves(TokenType.CSPR, targetToken);
        reservesList.push([BigNumber.from(step2[0]), BigNumber.from(step2[1])]);
        setReserves(reservesList);
        if (execType !== ExecutionType.EXE_FIND_LIQUIDITY) setBusy(false);
      }
    }
    handleGetReserves();
  }, [sourceToken, targetToken, activeAddress]);

  useEffect(() => {
    async function handleSetCurrentPoolInfo() {
      if (!isConnected || execType !== ExecutionType.EXE_FIND_LIQUIDITY || sourceToken === TokenType.EMPTY || targetToken === TokenType.EMPTY) return;
      setBusy(true);
      if (await isPairExist(sourceToken, targetToken)) {
        let routerContractHash = ROUTER_CONTRACT_HASH;
        let routerClient = new SwapperyRouterClient(
          NODE_ADDRESS,
          CHAIN_NAME,
          undefined
        );
        await routerClient.setContractHash(routerContractHash);
        const sourceContractHash = supportedTokens[sourceToken].contractHash;
        const targetContractHash = supportedTokens[targetToken].contractHash;
        let pairPackageHash = await routerClient.getPairFor(
          sourceContractHash,
          targetContractHash
        );

        const accountList = deserialize(accountListString);
        if (accountList.has(activeAddress)) {
          const poolList = accountList.get(activeAddress).poolList;
          if (poolList.has(pairPackageHash)) {
            setHasImported(true);
            setBusy(false);
            return;
          } else {
            setHasImported(false);
          }
        } else {
          setHasImported(false);
        }
        
        const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
        const { block } = await client.getLatestBlockInfo();

        if (block) {
          const stateRootHash = block.header.state_root_hash;
          const blockState = await client.getBlockState(
            stateRootHash,
            `hash-${pairPackageHash}`,
            []
          );
          let pairContractHash =
            blockState.ContractPackage?.versions[
              blockState.ContractPackage.versions.length - 1
            ].contractHash.slice(9);
          let pairClient = new SwapperyPairClient(
            NODE_ADDRESS,
            CHAIN_NAME,
            undefined
          );
          await pairClient.setContractHash(pairContractHash!);
            let reserves_res = await pairClient.getReserves();
          let reserves;
          if (sourceContractHash < targetContractHash)
            reserves = [
              BigNumber.from(reserves_res[0]),
              BigNumber.from(reserves_res[1]),
            ];
          else
            reserves = [
              BigNumber.from(reserves_res[1]),
              BigNumber.from(reserves_res[0]),
            ];
          let balance;
          try {
            balance = await pairClient.balanceOf(CLPublicKey.fromHex(activeAddress))
          } catch (error) {
            setBusy(false); return;
          }
          if (BigNumber.from(balance).eq(BigNumber.from(0))) {
            setBusy(false); return;
          }
          const pool: Pool = {
            contractPackageHash: pairPackageHash,
            contractHash: pairContractHash!,
            tokens: [
              supportedTokens[sourceToken],
              supportedTokens[targetToken],
            ],
            decimals: await pairClient.decimals(),
            totalSupply: await pairClient.totalSupply(),
            reserves: reserves,
            balance: BigNumber.from(balance),
          };
          setCurrentPool(pool);
        }
      }
      setBusy(false);
    }
    handleSetCurrentPoolInfo();
  }, [sourceToken, targetToken, activeAddress, accountListString]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const inputCurrency = params["inputCurrency"];
    const outputCurrency = params["outputCurrency"];
    setExecTypeWithCurrency(execType, inputCurrency, outputCurrency);
  }, [searchParams]);

  useEffect(() => {
    async function handleChangePool() {
      if (!isConnected || currentPool.contractHash === "") return;
      setLiquidityApproval(
        await allowanceOf(currentPool.contractHash)
      );
    }
    handleChangePool();
  }, [currentPool]);

  return {
    activate,
    balanceOf,
    allowanceOf,
    approveSourceToken,
    approveTargetToken,
    approveLiquidity,
    wrapCspr,
    isPairExist,
    getPairFor,
    getReserves,
    addLiquidity,
    removeLiquidity,
    swapExactIn,
    swapExactOut,
  };
}