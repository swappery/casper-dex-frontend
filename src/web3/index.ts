/* eslint-disable react-hooks/exhaustive-deps */
import {
  Signer,
  CLPublicKey,
  CLValueBuilder,
  decodeBase16,
  CasperServiceByJsonRPC,
  CLValueParsers,
  CLMap,
  encodeBase16,
  CLKey,
} from "casper-js-sdk";
import { WCSPRClient } from "./clients/wcspr-client";
import { ERC20SignerClient } from "./clients/erc20signer-client";
import useNetworkStatus from "../store/useNetworkStatus";
import { BigNumber, BigNumberish } from "ethers";
import {
  CHAIN_NAME,
  INSTALL_FEE,
  MASTER_CHEF_CONTRACT_HASH,
  MASTER_CHEF_CONTRACT_PACKAGE_HASH,
  NODE_ADDRESS,
  RouterEvents,
  ROUTER_CONTRACT_HASH,
  SYRUP_TOKEN_CONTRACT_HASH,
  TRANSFER_FEE,
  WCSPR_CONTRACT_HASH,
} from "./config/constant";
import { useEffect } from "react";
import { SwapperyRouterClient } from "./clients/swappery-router-client";
import { SwapperyPairClient } from "./clients/swappery-pair-client";
import useWalletStatus from "../store/useWalletStatus";
import { amountWithoutDecimals, getDeploy, getTokenFromAddress } from "../utils/utils";
import { Token } from "../config/interface/token";
import { toast } from "react-toastify";
import { testnetTokens } from "../config/constants/tokens";
import { MasterChefClient } from "./clients/master-chef-client";
import { SUPPORTED_TOKENS } from "../config/constants";
import { ChainName } from "../config/constants/chainName";
import { FarmInfo, FarmUserInfo, LpToken } from "../store/useMasterChef";

export default function useCasperWeb3Provider() {
  const { setActiveAddress, activeAddress, isConnected } = useNetworkStatus();

  const { addAccount } = useWalletStatus();

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

  async function disconnect() {
    if(!!activeAddress && activeAddress !== "") {
      Signer.disconnectFromSite();
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

  async function allowanceOf(contractHash: string, spender: string) {
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(contractHash);
    let allowance;
    try {
      allowance = await erc20.allowances(
        CLPublicKey.fromHex(activeAddress),
        CLValueBuilder.byteArray(decodeBase16(spender))
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

  async function approve(amount: BigNumberish, address: string, spender: string, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    let txHash = "";
    setPending(true);
    const erc20 = new ERC20SignerClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await erc20.setContractHash(address);
    const clPK = CLPublicKey.fromHex(activeAddress);
    try {
      txHash = await erc20.approveWithSigner(
        clPK,
        amount,
        CLValueBuilder.byteArray(decodeBase16(spender)),
        TRANSFER_FEE
      );
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash);
      setPending(false);
      toast.success("Approved");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function wrapCspr(amount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    let txHash = "";
    setPending(true);
    const contractHash = WCSPR_CONTRACT_HASH;
    const wcsprClient = new WCSPRClient(NODE_ADDRESS, CHAIN_NAME, undefined);
    await wcsprClient.setContractHash(contractHash);
    const clPK = CLPublicKey.fromHex(activeAddress);
    try {
      txHash = await wcsprClient.deposit(clPK, contractHash, amount, INSTALL_FEE);
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash);
      setPending(false);
      toast.success("Wrapped");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function isPairExist(inputCurrency: Token, outputCurrency: Token): Promise<boolean> {
    let routerClient = new SwapperyRouterClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
    return await routerClient.isPairExists(
      inputCurrency.address,
      outputCurrency.address,
    );
  }

  async function getReserves(inputCurrency: Token, outputCurrency: Token): Promise<BigNumber[]> {
    let routerClient = new SwapperyRouterClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
    if (await routerClient.isPairExists(inputCurrency.address, outputCurrency.address)) {
      let pairPackageHash = await routerClient.getPairFor(
        inputCurrency.address,
        outputCurrency.address
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
        if (inputCurrency.address < outputCurrency.address)
          return [BigNumber.from(reserves[0]), BigNumber.from(reserves[1])];
        return [BigNumber.from(reserves[1]), BigNumber.from(reserves[0])];
      }
    }
    return [BigNumber.from(1), BigNumber.from(1)];
  }

  async function addLiquidity(
    publicKey: CLPublicKey,
    inputCurrency: Token,
    inputCurrencyAmount: BigNumberish,
    outputCurrency: Token,
    outputCurrencyAmount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let routerClient = new SwapperyRouterClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
    try {
      txHash = await routerClient.addLiquidity(
        publicKey,
        inputCurrency.address,
        outputCurrency.address,
        inputCurrencyAmount,
        outputCurrencyAmount,
        0,
        0,
        TRANSFER_FEE
      );
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Liquidity Added");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function removeLiquidity(
    publicKey: CLPublicKey,
    inputCurrencyAddress: string,
    outputCurrencyAddress: string,
    liquidityAmount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let routerClient = new SwapperyRouterClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
    try {
      txHash = await routerClient.removeLiquidity(
        publicKey,
        inputCurrencyAddress,
        outputCurrencyAddress,
        liquidityAmount,
        0,
        0,
        TRANSFER_FEE
      );
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Liquidity Removed");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function swapExactIn(
    publicKey: CLPublicKey,
    inputCurrency: Token,
    outputCurrency: Token,
    inputCurrencyAmount: BigNumberish,
    outputCurrencyLimit: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let routerClient = new SwapperyRouterClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
    try {
      txHash = await routerClient.swapExactIn(
        publicKey,
        inputCurrency.address,
        outputCurrency.address,
        inputCurrencyAmount,
        outputCurrencyLimit,
        TRANSFER_FEE
      );
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Swapped");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function swapExactOut(
    publicKey: CLPublicKey,
    inputCurrency: Token,
    outputCurrency: Token,
    inputCurrencyLimit: BigNumberish,
    outputCurrencyAmount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let routerClient = new SwapperyRouterClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
    try {
      txHash = await routerClient.swapExactOut(
        publicKey,
        inputCurrency.address,
        outputCurrency.address,
        outputCurrencyAmount,
        inputCurrencyLimit,
        TRANSFER_FEE
      );
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Swapped");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function getSwapperyPrice() {
    const swprToken = testnetTokens.SWPR;
    const usdtToken = testnetTokens.USDT;

    if (await isPairExist(swprToken, usdtToken)) {
      let routerClient = new SwapperyRouterClient(
          NODE_ADDRESS,
          CHAIN_NAME,
          undefined
        );
      await routerClient.setContractHash(ROUTER_CONTRACT_HASH);
        let pairPackageHash = await routerClient.getPairFor(
          swprToken.address,
          usdtToken.address
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
            ].contractHash.slice(9)!;
          let pairClient = new SwapperyPairClient(
            NODE_ADDRESS,
            CHAIN_NAME,
            undefined
          );
          await pairClient.setContractHash(pairContractHash);
          let reserves_res = await pairClient.getReserves();
          let reserves;
          if (swprToken.address < usdtToken.address)
            reserves = [
              BigNumber.from(reserves_res[0]),
              BigNumber.from(reserves_res[1]),
            ];
          else
            reserves = [
              BigNumber.from(reserves_res[1]),
              BigNumber.from(reserves_res[0]),
            ];

          return Number((reserves[1].toNumber() / reserves[0].toNumber()).toFixed(3));
        }
      }
    return Number("0");
  }

  async function getCSPRBalance() {
    const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
    let stateRootHash = await client.getStateRootHash();
    let accountBalance = BigNumber.from(0);
    if (!isConnected) return 0;
    try {
      let accountBalanceUref = await client.getAccountBalanceUrefByPublicKey(stateRootHash, CLPublicKey.fromHex(activeAddress));
      accountBalance = await client.getAccountBalance(stateRootHash, accountBalanceUref);
    } catch(error) {
    }
    return amountWithoutDecimals(BigNumber.from(accountBalance), 9);
  }

  async function getFarmList() {
    let farmList = [];
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    let poolList = await masterChef.poolList();
    for (let i = 0; i < poolList.length; i++) {
      let pairPackageHash = encodeBase16(poolList[i].lpToken.value().data);
      let pairContractHash = await getContractHashFromPackage(pairPackageHash);
      let pairClient = new SwapperyPairClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
      await pairClient.setContractHash(pairContractHash!);
      let tokens: Token[] = [];
      try {
        let tokensAddress = await pairClient.getTokens();
        for (let j = 0; j < tokensAddress.length; j++) {
          tokens.push(getTokenFromAddress(encodeBase16(tokensAddress[j]), SUPPORTED_TOKENS[ChainName.TESTNET])!);
        }
      } catch (error) {
      }
      let lpToken: LpToken = {
        contractHash: pairContractHash!,
        contractPackageHash: pairPackageHash,
        tokens: tokens,
        decimals: await pairClient.decimals(),
      }
      let syrupClient = new ERC20SignerClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
      await syrupClient.setContractHash(SYRUP_TOKEN_CONTRACT_HASH);
      let farm: FarmInfo = {
        lpToken: lpToken,
        allocPoint: poolList[i].allocPoint,
        lastRewardBlockTime: poolList[i].lastRewardBlockTime,
        accCakePerShare: poolList[i].accCakePerShare,
        liquidity: tokens.length===0?BigNumber.from(await syrupClient.totalSupply()): await pairClient.getBallanceOfContract(new CLKey(CLValueBuilder.byteArray(decodeBase16(MASTER_CHEF_CONTRACT_PACKAGE_HASH))))
      }
      farmList.push(farm);
    }
    return farmList;
  }

  async function getContractHashFromPackage(packageHash: string) {
    const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
        const { block } = await client.getLatestBlockInfo();

    if (block) {
      const stateRootHash = block.header.state_root_hash;
      const blockState = await client.getBlockState(
        stateRootHash,
        `hash-${packageHash}`,
        []
      );
      let contractHash =
        blockState.ContractPackage?.versions[
          blockState.ContractPackage.versions.length - 1
        ].contractHash.slice(9)!;
      return contractHash;
    }
  }
  
  async function getUserInfo(publicKey: CLPublicKey, farms: FarmInfo[]) {
    let userData = [];
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    for (let i = 0; i < farms.length; i++) {
      let currentTime = Number((new Date().getTime() / 1000).toFixed());
      let userInfo = await masterChef.getUserInfo(CLValueBuilder.key(CLValueBuilder.byteArray(decodeBase16(farms[i].lpToken.contractPackageHash))), publicKey);
      let acc = BigNumber.from(farms[i].accCakePerShare);
      if (currentTime > farms[i].lastRewardBlockTime && !BigNumber.from(farms[i].liquidity).eq(0)) {
        let cakePerBlock = BigNumber.from(await masterChef.cakePerBlock());
        let totalAllocPoint = BigNumber.from(await masterChef.totalAllocPoint());
        let multiplier = BigNumber.from(await masterChef.bonusMultiplier());
        multiplier = multiplier.mul(currentTime - Number(farms[i].lastRewardBlockTime));
        
        let cakeReward = multiplier.mul(cakePerBlock).mul(farms[i].allocPoint).div(totalAllocPoint);
        acc = acc.add(cakeReward.mul(1e12).div(farms[i].liquidity));
      }
      let pendingCake: BigNumberish = BigNumber.from(userInfo.amount).mul(acc).div(10 ** 12).sub(userInfo.rewardDebt);
      let data: FarmUserInfo = { amount: userInfo.amount, rewardDebt: userInfo.rewardDebt, pendingCake: pendingCake };
      userData.push(data);
    }
    return userData;
  }

  async function deposit(farm: FarmInfo, amount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    try {
      txHash = await masterChef.deposit(CLPublicKey.fromHex(activeAddress), farm, amount, TRANSFER_FEE);
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Deposit");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function withdraw(farm: FarmInfo, amount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    try {
      txHash = await masterChef.withdraw(CLPublicKey.fromHex(activeAddress), farm, amount, TRANSFER_FEE);
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Withdraw");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function enterStaking(amount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    try {
      txHash = await masterChef.enterStaking(CLPublicKey.fromHex(activeAddress), amount, TRANSFER_FEE);
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Deposit");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function leaveStaking(amount: BigNumberish, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    try {
      txHash = await masterChef.leaveStaking(CLPublicKey.fromHex(activeAddress), amount, TRANSFER_FEE);
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Withdraw");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  async function harvest(farm: FarmInfo, setPending: React.Dispatch<React.SetStateAction<boolean>>) {
    if (!isConnected) return;
    setPending(true);
    let txHash;
    let masterChef = new MasterChefClient(
        NODE_ADDRESS,
        CHAIN_NAME,
        undefined
      );
    await masterChef.setContractHash(MASTER_CHEF_CONTRACT_HASH);
    try {
      txHash = await masterChef.harvest(CLPublicKey.fromHex(activeAddress), farm, TRANSFER_FEE);
    } catch (err) {
      setPending(false);
      return;
    }
    try {
      await getDeploy(NODE_ADDRESS, txHash!);
      setPending(false);
      toast.success("Harvest");
      return txHash;
    } catch (error) {
      setPending(false);
      return txHash;
    }
  }

  useEffect(() => {
    initialize();
    activate(false);
  }, []);

  return {
    activate,
    disconnect,
    balanceOf,
    allowanceOf,
    approve,
    wrapCspr,
    isPairExist,
    getReserves,
    addLiquidity,
    removeLiquidity,
    swapExactIn,
    swapExactOut,
    getSwapperyPrice,
    getCSPRBalance,
    getFarmList,
    getUserInfo,
    deposit,
    withdraw,
    enterStaking,
    leaveStaking,
    harvest,
  };
}

export const RouterEventParser = (
  {
    eventNames,
  }: { eventNames: RouterEvents[] },
  value: any
) => {
  if (value.body.DeployProcessed.execution_result.Success) {
    const { transforms } =
      value.body.DeployProcessed.execution_result.Success.effect;

        const routerEvents = transforms.reduce((acc: any, val: any) => {
          if (
            val.transform.hasOwnProperty("WriteCLValue") &&
            typeof val.transform.WriteCLValue.parsed === "object" &&
            val.transform.WriteCLValue.parsed !== null
          ) {
            const maybeCLValue = CLValueParsers.fromJSON(
              val.transform.WriteCLValue
            );
            const clValue = maybeCLValue.unwrap();
            if (clValue && clValue instanceof CLMap) {
              const event = clValue.get(CLValueBuilder.string("event_type"));
              if (
                event &&
                eventNames.includes(event.value())
              ) {
                acc = [...acc, { name: event.value(), clValue }];
              }
            }
          }
          return acc;
        }, []);

    return { error: null, success: !!routerEvents.length, data: routerEvents };
  }

  return null;
};
