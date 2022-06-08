/* eslint-disable react-hooks/exhaustive-deps */
import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import ActionButton from "../../components/Button/actionButton";
import LPTokenDetail from "../Pool/components/LPTokenDetail";
import { BigNumber } from "ethers";
import useCasperWeb3Provider from "../../web3";
import useNetworkStatus from "../../store/useNetworkStatus";
import { useEffect, useState } from "react";
import useSetting from "../../store/useSetting";
import { Themes } from "../../config/constants/themes";
import useAction from "../../store/useAction";
import useImportPool from "../../store/useImportPool";
import { deserialize, getTokenFromAddress } from "../../utils/utils";
import { SUPPORTED_TOKENS } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import { ActionType } from "../../config/interface/actionType";
import {
  CHAIN_NAME,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
} from "../../web3/config/constant";
import { SwapperyRouterClient } from "../../web3/clients/swappery-router-client";
import useWalletStatus from "../../store/useWalletStatus";
import { CasperServiceByJsonRPC } from "casper-js-sdk";
import { SwapperyPairClient } from "../../web3/clients/swappery-pair-client";
import { Pool } from "../../config/interface/pool";
import { ActionStatus } from "../../config/interface/actionStatus";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModal";
import { InputField } from "../../config/interface/inputField";
import ConnectModal from "../../components/SelectWalletModal/SelectWalletModal";

export default function PoolFinder() {
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [showOutputModal, setShowOutputModal] = useState<boolean>(false);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [isSpinning, setSpinning] = useState<boolean>(false);
  const { theme } = useSetting();
  const navigate = useNavigate();
  const { activate, isPairExist, allowanceOf, balanceOf } =
    useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();
  const { accountListString, setPool } = useWalletStatus();
  const { actionType, actionStatus, setActionType, setActionStatus } =
    useAction();
  const {
    currencyA,
    currencyB,
    currentPool,
    isFetching,
    setFetching,
    initialize,
    setCurrencyA,
    setCurrencyB,
    setCurrentPool,
  } = useImportPool();
  const [searchParams] = useSearchParams();

  //Get pool info details
  useEffect(() => {
    async function handleUpdatePool() {
      if (!isConnected || !currencyA || !currencyB) return;
      setFetching(true);
      if (await isPairExist(currencyA, currencyB)) {
        let routerContractHash = ROUTER_CONTRACT_HASH;
        let routerClient = new SwapperyRouterClient(
          NODE_ADDRESS,
          CHAIN_NAME,
          undefined
        );
        await routerClient.setContractHash(routerContractHash);
        let pairPackageHash = await routerClient.getPairFor(
          currencyA.address,
          currencyB.address
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
          if (currencyA.address < currencyB.address)
            reserves = [
              BigNumber.from(reserves_res[0]),
              BigNumber.from(reserves_res[1]),
            ];
          else
            reserves = [
              BigNumber.from(reserves_res[1]),
              BigNumber.from(reserves_res[0]),
            ];

          const pool: Pool = {
            contractPackageHash: pairPackageHash,
            contractHash: pairContractHash,
            tokens: [currencyA, currencyB],
            decimals: await pairClient.decimals(),
            totalSupply: await pairClient.totalSupply(),
            reserves: reserves,
            balance: BigNumber.from(await balanceOf(pairContractHash)),
            allowance: BigNumber.from(await allowanceOf(pairContractHash)),
          };
          setCurrentPool(pool);
        }
      }
      setFetching(false);
    }
    handleUpdatePool();
  }, [isConnected, activeAddress, currencyA, currencyB]);

  //Set currencies form search params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input = params["input"];
    const output = params["output"];
    if (input || output) {
      setCurrencyA(
        getTokenFromAddress(input, SUPPORTED_TOKENS[ChainName.TESTNET])!
      );
      setCurrencyB(
        getTokenFromAddress(output, SUPPORTED_TOKENS[ChainName.TESTNET])!
      );
    }
  }, [searchParams]);

  //Set action status
  useEffect(() => {
    async function handleUpdateActionStatus() {
      let newActionStatus;
      if (!isConnected) newActionStatus = ActionStatus.REQ_CONNECT_WALLET;
      else if (!currencyA || !currencyB)
        newActionStatus = ActionStatus.REQ_SELECT_CURRENCY;
      else if (isFetching) newActionStatus = ActionStatus.LOADING;
      else if (!currentPool) newActionStatus = ActionStatus.REQ_CREATE_POOL;
      else if (currentPool.balance.eq(0) || isImportedPool(currentPool))
        newActionStatus = ActionStatus.REQ_ADD_LIQUIDITY;
      else newActionStatus = ActionStatus.REQ_EXECUTE_ACTION;
      setActionStatus(newActionStatus);
    }
    handleUpdateActionStatus();
  }, [
    isConnected,
    isFetching,
    currentPool,
    accountListString,
    currencyA,
    currencyB,
  ]);

  //Set action button properties
  useEffect(() => {
    switch (actionStatus) {
      case ActionStatus.REQ_CONNECT_WALLET:
        setText("Connect Your Wallet");
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.LOADING:
        setText("Loading");
        setSpinning(true);
        setDisabled(false);
        break;
      case ActionStatus.REQ_SELECT_CURRENCY:
        setText("Please Select Currency");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.REQ_CREATE_POOL:
        setText("Pool Does Not Exist");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.REQ_ADD_LIQUIDITY:
        setText("Add Liquidity");
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.REQ_EXECUTE_ACTION:
        setText("Manage This Pool");
        setSpinning(false);
        setDisabled(false);
        break;
      default:
        break;
    }
  }, [actionStatus]);

  const isImportedPool = (pool: Pool): boolean => {
    const accountList = deserialize(accountListString);
    if (accountList.has(activeAddress)) {
      const poolList = accountList.get(activeAddress).poolList;
      if (poolList.has(pool.contractPackageHash)) return true;
    }
    return false;
  };

  const handleClickActionButton = async () => {
    if (actionStatus === ActionStatus.REQ_CONNECT_WALLET)
      setShowConnectModal(true);
    else if (actionStatus === ActionStatus.REQ_ADD_LIQUIDITY) {
      navigate({
        pathname: "/add",
        search: createSearchParams({
          input: currencyA?.address!,
          output: currencyB?.address!,
        }).toString(),
      });
    } else if (actionStatus === ActionStatus.REQ_EXECUTE_ACTION) {
      setPool(activeAddress, currentPool!);
      navigate({ pathname: "/liquidity" });
    }
  };

  //Initialize action
  if (actionType !== ActionType.IMPORT_POOL) {
    setActionType(ActionType.IMPORT_POOL);
    initialize();
  }

  return (
    <div className="flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0">
      <div className="container mx-auto grid grid-cols-12">
        <div className="col-span-12 md:col-start-3 md:col-end-11 xl:col-start-4 xl:col-end-10 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-9">
          <div className="flex items-center justify-between w-full px-1">
            <Link to="/liquidity" className="hover:opacity-80">
              <BackIcon stroke={theme === Themes.LIGHT ? "black" : "#FFF8D4"} />
            </Link>

            <p className="text-[35px] md:text-[43px] leading-[43px] text-neutral">
              IMPORT POOL
            </p>
            <div className="w-[19px]"></div>
          </div>
          <p className="text-[20px] md:text-[22px] text-neutral mt-3 mb-7">
            import an existing pool
          </p>

          <div className="grid justify-items-center w-full">
            <button
              className={`hover:opacity-80 w-full flex justify-between items-center px-8 border border-neutral py-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                currencyA && "bg-lightyellow"
              }`}
              onClick={() => {
                setShowInputModal(true);
              }}
              disabled={isSpinning}
            >
              <p className="flex items-center gap-2">
                {currencyA ? (
                  <>
                    <img
                      src={currencyA.logo}
                      className="w-[30px] h-[30px]"
                      alt=""
                    />
                    <span
                      className={`text-[19px] ${
                        currencyA ? "text-black" : "text-neutral"
                      }`}
                    >
                      {currencyA.symbol}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-[30px] h-[30px] border border-neutral rounded-[50%]"></span>
                    <span className="text-[19px] text-neutral">
                      select a token
                    </span>
                  </>
                )}
              </p>
              {/* <ChevronIcon fill={`${currencyA ? "black" : "success"}`} /> */}
              <ChevronIcon />
            </button>
            <div className="w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral">
              +
            </div>
            <button
              className={`hover:opacity-80 w-full flex justify-between items-center px-8 border border-neutral py-2 rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed ${
                currencyB && "bg-lightyellow"
              }`}
              onClick={() => {
                setShowOutputModal(true);
              }}
              disabled={isSpinning}
            >
              <p className="flex items-center gap-2">
                {currencyB ? (
                  <>
                    <img
                      src={currencyB.logo}
                      className="w-[30px] h-[30px]"
                      alt=""
                    />
                    <span
                      className={`text-[19px] ${
                        currencyB ? "text-black" : "text-neutral"
                      }`}
                    >
                      {currencyB.symbol}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-[30px] h-[30px] border border-neutral rounded-[50%]"></span>{" "}
                    <span className="text-[19px] text-neutral">
                      select a token
                    </span>
                  </>
                )}
              </p>
              <ChevronIcon />
              {/* <ChevronIcon fill={`${currencyB ? "black" : "accent"}`} /> */}
            </button>
          </div>
          {actionStatus === ActionStatus.REQ_EXECUTE_ACTION ? (
            <LPTokenDetail
              isManage={false}
              poolInfo={currentPool!}
              key={currentPool!.contractPackageHash}
            />
          ) : (
            <></>
          )}
          <ActionButton
            text={text}
            isDisabled={isDisabled}
            isSpinning={isSpinning}
            handleClick={handleClickActionButton}
          />
          <p className="text-base md:text-[18px] text-neutral mt-7">
            SELECT A TOKEN TO FIND LIQUIDITY
          </p>
        </div>
      </div>
      <CurrencySearchModal
        modalId="import-currencyA-modal"
        selectedCurrency={currencyA}
        otherSelectedCurrency={currencyB}
        field={InputField.INPUT_A}
        show={showInputModal}
        setShow={setShowInputModal}
      />
      <CurrencySearchModal
        modalId="import-currencyB-modal"
        selectedCurrency={currencyB}
        otherSelectedCurrency={currencyA}
        field={InputField.INPUT_B}
        show={showOutputModal}
        setShow={setShowOutputModal}
      />
      <ConnectModal
        show={showConnectModal}
        setShow={setShowConnectModal}
        handleConnect={activate}
      ></ConnectModal>
    </div>
  );
}
