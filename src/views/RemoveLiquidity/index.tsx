/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

import ActionButton from "../../components/Button/actionButton";

import NumberFormat from "react-number-format";

import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import useNetworkStatus from "../../store/useNetworkStatus";
import { amountWithoutDecimals, getTokenFromAddress } from "../../utils/utils";
import { BigNumber } from "ethers";
import { useMemo, useState, useEffect } from "react";
import useCasperWeb3Provider from "../../web3";
import { CasperServiceByJsonRPC, CLPublicKey } from "casper-js-sdk";
import useSetting from "../../store/useSetting";
import { Themes } from "../../config/constants/themes";
import useAction from "../../store/useAction";
import { ActionType } from "../../config/interface/actionType";
import useRemoveLiquidityStatus from "../../store/useRemoveLiquidity";
import { InputField } from "../../config/interface/inputField";
import { SUPPORTED_TOKENS } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import {
  CHAIN_NAME,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
} from "../../web3/config/constant";
import { SwapperyRouterClient } from "../../web3/clients/swappery-router-client";
import { SwapperyPairClient } from "../../web3/clients/swappery-pair-client";
import { Pool } from "../../config/interface/pool";
import useWalletStatus from "../../store/useWalletStatus";
import { ActionStatus } from "../../config/interface/actionStatus";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModal";

export default function RemoveLiquidity() {
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [showOutputModal, setShowOutputModal] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [isSpinning, setSpinning] = useState<boolean>(false);
  const [layout, setLayout] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);

  const [liquidityAmount, setLiquidityAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [currencyAAmount, setCurrencyAAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [currencyBAmount, setCurrencyBAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [searchParams] = useSearchParams();
  const { theme } = useSetting();
  const {
    activate,
    balanceOf,
    allowanceOf,
    isPairExist,
    approve,
    removeLiquidity,
  } = useCasperWeb3Provider();
  const { setPool } = useWalletStatus();
  const { isConnected, activeAddress } = useNetworkStatus();
  const {
    actionType,
    actionStatus,
    isPending,
    setActionType,
    setActionStatus,
  } = useAction();
  const {
    currencyA,
    currencyB,
    currentPool,
    inputField,
    isFetching,
    setCurrencyA,
    setCurrencyB,
    setCurrentPool,
    setInputField,
    setFetching,
  } = useRemoveLiquidityStatus();

  useEffect(() => {
    if (currentPool) {
      setCurrencyA(currentPool.tokens[0]);
      setCurrencyB(currentPool.tokens[1]);
    }
  }, [currentPool]);

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
          if (
            currentPool &&
            currentPool.tokens[0] === currencyA &&
            currentPool.tokens[1] === currencyB
          )
            setPool(activeAddress, pool);
          setCurrentPool(pool);
        }
      }
      setFetching(false);
    }
    handleUpdatePool();
  }, [isConnected, activeAddress, currencyA, currencyB, isPending]);

  useEffect(() => {
    async function updateActionStatus() {
      let newActionStatus;
      if (!isConnected) newActionStatus = ActionStatus.REQ_CONNECT_WALLET;
      else if (!currencyA || !currencyB)
        newActionStatus = ActionStatus.REQ_SELECT_CURRENCY;
      else if (isPending) newActionStatus = ActionStatus.PENDING;
      else if (isFetching) newActionStatus = ActionStatus.LOADING;
      else if (
        currencyAAmount.eq(0) ||
        currencyBAmount.eq(0) ||
        liquidityAmount.eq(0)
      )
        newActionStatus = ActionStatus.REQ_INPUT_AMOUNT;
      else if (BigNumber.from(currentPool?.balance).lt(liquidityAmount))
        newActionStatus = ActionStatus.INSUFFICIENT_LIQUIDITY_AMOUNT;
      else if (BigNumber.from(currentPool?.allowance).lt(liquidityAmount))
        newActionStatus = ActionStatus.REQ_APPROVE_LIQUIDITY;
      else newActionStatus = ActionStatus.REQ_EXECUTE_ACTION;
      setActionStatus(newActionStatus);
    }
    updateActionStatus();
  }, [
    isConnected,
    currencyAAmount,
    currencyBAmount,
    liquidityAmount,
    currentPool,
    currencyA,
    currencyB,
    isPending,
    isFetching,
  ]);

  useEffect(() => {
    switch (actionStatus) {
      case ActionStatus.REQ_CONNECT_WALLET:
        setText("Connect Your Wallet");
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.REQ_SELECT_CURRENCY:
        setText("Please Select Currency");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.PENDING:
        setText("Pending");
        setSpinning(true);
        setDisabled(false);
        break;
      case ActionStatus.LOADING:
        setText("Loading");
        setSpinning(true);
        setDisabled(false);
        break;
      case ActionStatus.REQ_INPUT_AMOUNT:
        setText("Please Input Amount");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.INSUFFICIENT_LIQUIDITY_AMOUNT:
        setText("Insufficient Liquidity Amount");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.REQ_APPROVE_LIQUIDITY:
        setText("Approve");
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.REQ_EXECUTE_ACTION:
        setText("Remove Liquidity");
        setSpinning(false);
        setDisabled(false);
        break;
      default:
        break;
    }
  }, [actionStatus]);

  const handleClickActionButton = async () => {
    if (actionStatus === ActionStatus.REQ_CONNECT_WALLET) activate();
    else if (currentPool && currencyA && currencyB)
      if (actionStatus === ActionStatus.REQ_APPROVE_LIQUIDITY) {
        await approve(liquidityAmount, currentPool.contractHash);
      } else if (actionStatus === ActionStatus.REQ_EXECUTE_ACTION) {
        await removeLiquidity(
          CLPublicKey.fromHex(activeAddress),
          currencyA.address,
          currencyB.address,
          liquidityAmount
        );
      }
  };

  if (actionType !== ActionType.REMOVE_LIQUIDITY)
    setActionType(ActionType.REMOVE_LIQUIDITY);

  const withLiquidityLimit = ({ floatValue }: any) =>
    currentPool
      ? floatValue <
        amountWithoutDecimals(
          BigNumber.from(currentPool.balance),
          BigNumber.from(currentPool.decimals).toNumber()
        )
      : false;

  const priceAasB = useMemo(() => {
    if (currentPool)
      return (
        BigNumber.from(currentPool.reserves[1]).toNumber() /
        BigNumber.from(currentPool.reserves[0]).toNumber()
      );
  }, [currentPool]);

  const priceBasA = useMemo(() => {
    if (currentPool)
      return (
        BigNumber.from(currentPool.reserves[0]).toNumber() /
        BigNumber.from(currentPool.reserves[1]).toNumber()
      );
  }, [currentPool]);

  const liquidityValue = useMemo(() => {
    if (inputField === InputField.INPUT_LIQUIDITY)
      return currentPool
        ? amountWithoutDecimals(
            liquidityAmount,
            BigNumber.from(currentPool.decimals).toNumber()
          )
        : 0;
    else if (inputField === InputField.INPUT_A)
      return currentPool
        ? amountWithoutDecimals(
            currencyAAmount
              .mul(BigNumber.from(currentPool.totalSupply))
              .div(BigNumber.from(currentPool.reserves[0])),
            BigNumber.from(currentPool.decimals).toNumber()
          )
        : 0;
    else if (inputField === InputField.INPUT_B)
      return currentPool
        ? amountWithoutDecimals(
            currencyBAmount
              .mul(BigNumber.from(currentPool.totalSupply))
              .div(BigNumber.from(currentPool.reserves[1])),
            BigNumber.from(currentPool.decimals).toNumber()
          )
        : 0;
  }, [
    inputField,
    currentPool,
    liquidityAmount,
    currencyA,
    currencyAAmount,
    currencyB,
    currencyBAmount,
  ]);

  const currencyAValue = useMemo(() => {
    if (inputField === InputField.INPUT_LIQUIDITY)
      return currencyA && currentPool
        ? amountWithoutDecimals(
            liquidityAmount
              .mul(currentPool.reserves[0])
              .div(currentPool.totalSupply),
            currencyA.decimals
          )
        : 0;
    else if (inputField === InputField.INPUT_A)
      return currencyA
        ? amountWithoutDecimals(currencyAAmount, currencyA.decimals)
        : 0;
    else if (inputField === InputField.INPUT_B)
      return currencyA && currentPool
        ? amountWithoutDecimals(
            currencyBAmount
              .mul(BigNumber.from(currentPool.reserves[0]))
              .div(BigNumber.from(currentPool.reserves[1])),
            currencyA.decimals
          )
        : 0;
  }, [
    inputField,
    currentPool,
    liquidityAmount,
    currencyA,
    currencyAAmount,
    currencyB,
    currencyBAmount,
  ]);

  const currencyBValue = useMemo(() => {
    if (inputField === InputField.INPUT_LIQUIDITY)
      return currencyB && currentPool
        ? amountWithoutDecimals(
            liquidityAmount
              .mul(currentPool.reserves[1])
              .div(currentPool.totalSupply),
            currencyB.decimals
          )
        : 0;
    else if (inputField === InputField.INPUT_A)
      return currencyB && currentPool
        ? amountWithoutDecimals(
            currencyAAmount
              .mul(BigNumber.from(currentPool.reserves[1]))
              .div(BigNumber.from(currentPool.reserves[0])),
            currencyB.decimals
          )
        : 0;
    else if (inputField === InputField.INPUT_B)
      return currencyB
        ? amountWithoutDecimals(currencyBAmount, currencyB.decimals)
        : 0;
  }, [
    inputField,
    currentPool,
    liquidityAmount,
    currencyA,
    currencyAAmount,
    currencyB,
    currencyBAmount,
  ]);

  const handleClick = () => {
    setLayout((prev) => !prev);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(event.target.value, 10));
  };

  const handleSetValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setSliderValue(parseInt(button.value, 10));
  };

  useEffect(() => {
    setLiquidityAmount(
      currentPool
        ? BigNumber.from(currentPool.balance).mul(sliderValue).div(100)
        : BigNumber.from(0)
    );
    setCurrencyAAmount(
      currentPool
        ? BigNumber.from(currentPool.reserves[0])
            .mul(BigNumber.from(currentPool.balance).mul(sliderValue).div(100))
            .div(BigNumber.from(currentPool.totalSupply))
        : BigNumber.from(0)
    );
    setCurrencyBAmount(
      currentPool
        ? BigNumber.from(currentPool.reserves[1])
            .mul(BigNumber.from(currentPool.balance).mul(sliderValue).div(100))
            .div(BigNumber.from(currentPool.totalSupply))
        : BigNumber.from(0)
    );
  }, [sliderValue]);

  return (
    <div className="flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0">
      <div className="container mx-auto grid grid-cols-12">
        <div className="col-span-12 lg:col-start-2 lg:col-end-12 xl:col-start-3 xl:col-end-11 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-9">
          <div className="flex items-center justify-between w-full px-1">
            <Link to="/liquidity" className="hover:opacity-80">
              <BackIcon stroke={theme === Themes.LIGHT ? "black" : "#FFF8D4"} />
            </Link>

            <p className="text-[25px] sm:text-[35px] md:text-[43px] leading-[43px] text-neutral">
              REMOVE LIQUIDITY
            </p>
            <div className="w-[19px]"></div>
          </div>

          <p className="text-[16px] md:text-[20px] text-neutral mt-3 mb-7">
            remove liquidity to receive tokens back
          </p>

          <div className="sm:border sm:bg-success w-full">
            <div className="sm:px-2 py-6 md:p-8 2xl:py-12 font-orator-std text-black">
              <div className="flex justify-between text-[14px] lg:text-[18px] mb-5 text-neutral">
                <span className="">AMOUNT</span>
                <button
                  onClick={handleClick}
                  className="font-bold outline-none"
                >
                  {layout ? "SIMPLE" : "DETAILED"}
                </button>
              </div>
              {layout ? (
                <>
                  <div className="flex justify-between items-center rounded-[45px] border border-neutral py-2 sm:py-4 px-1.5 sm:px-5">
                    <NumberFormat
                      value={liquidityValue}
                      disabled={isSpinning}
                      className="md:h-fit max-w-[50%] sm:max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[12px] sm:text-[14px] lg:text-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                      thousandSeparator={false}
                      isAllowed={withLiquidityLimit}
                      onKeyDown={() => {
                        setInputField(InputField.INPUT_LIQUIDITY);
                      }}
                      onValueChange={async (values) => {
                        const { value } = values;
                        const amount = parseFloat(value) || 0;
                        setLiquidityAmount(
                          BigNumber.from(
                            (currentPool
                              ? amount *
                                10 **
                                  BigNumber.from(
                                    currentPool.decimals
                                  ).toNumber()
                              : 0
                            ).toFixed()
                          )
                        );
                      }}
                    />
                    <div className="flex items-center">
                      <button
                        className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSpinning}
                      >
                        <span className="text-[12px] sm:text-[14px] lg:text-[18px]">
                          {currentPool ? (
                            <>
                              {currentPool.tokens[0].symbol}:
                              {currentPool.tokens[1].symbol}
                            </>
                          ) : (
                            "Invalid Pool"
                          )}
                        </span>
                      </button>
                      {currentPool ? (
                        <>
                          <img
                            src={currentPool.tokens[0].logo}
                            className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
                            alt=""
                          />
                          <div className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral"></div>
                          <img
                            src={currentPool.tokens[1].logo}
                            className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
                            alt=""
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral"></div>
                  </div>
                  <div className="flex justify-between items-center border border-neutral py-2 sm:py-4 px-1.5 sm:px-5">
                    <NumberFormat
                      value={currencyAValue}
                      className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[12px] sm:text-[14px] lg:text-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSpinning}
                      thousandSeparator={false}
                      onKeyDown={() => {
                        setInputField(InputField.INPUT_A);
                      }}
                      onValueChange={async (values) => {
                        const { value } = values;
                        const amount = parseFloat(value) || 0;
                        setCurrencyAAmount(
                          BigNumber.from(
                            (currencyA
                              ? amount * 10 ** currencyA.decimals
                              : 0
                            ).toFixed()
                          )
                        );
                      }}
                    />
                    <div className="flex items-center md:gap-1">
                      <button
                        className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setShowInputModal(true);
                        }}
                        disabled={isSpinning}
                      >
                        <span className="text-[12px] sm:text-[14px] lg:text-[18px]">
                          {currentPool
                            ? currentPool.tokens[0].symbol
                            : "Select a Currency"}
                        </span>
                        <ChevronIcon />
                      </button>
                      {currentPool ? (
                        <img
                          src={currentPool.tokens[0].logo}
                          className="w-[30px] h-[30px] md:w-[45px] md:h-[45px]"
                          alt=""
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral">
                      +
                    </div>
                  </div>
                  <div className="flex justify-between items-center border border-neutral py-2 sm:py-4 px-1.5 sm:px-5">
                    <NumberFormat
                      value={currencyBValue}
                      className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[12px] sm:text-[14px] lg:text-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSpinning}
                      thousandSeparator={false}
                      onKeyDown={() => {
                        setInputField(InputField.INPUT_B);
                      }}
                      onValueChange={async (values) => {
                        const { value } = values;
                        const amount = parseFloat(value) || 0;
                        setCurrencyBAmount(
                          BigNumber.from(
                            (currencyB
                              ? amount * 10 ** currencyB.decimals
                              : 0
                            ).toFixed()
                          )
                        );
                      }}
                    />
                    <div className="flex items-center md:gap-1">
                      <button
                        className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setShowOutputModal(true);
                        }}
                        disabled={isSpinning}
                      >
                        <span className="text-[12px] sm:text-[14px] lg:text-[18px]">
                          {currentPool
                            ? currentPool.tokens[1].symbol
                            : "Select a Currency"}
                        </span>
                        <ChevronIcon />
                      </button>
                      {currentPool ? (
                        <img
                          src={currentPool.tokens[1].logo}
                          className="w-[30px] h-[30px] md:w-[45px] md:h-[45px]"
                          alt=""
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border border-neutral px-3 sm:px-6 py-5">
                    <p className="text-[32px] md:text-[40px] text-left text-neutral mb-3">
                      {sliderValue}%
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={handleChange}
                      className="range range-xs"
                    />
                    <div className="flex justify-between sm:w-[75%] mx-auto text-[14px] sm:text-[16px] mt-7">
                      <button
                        onClick={handleSetValue}
                        value="25"
                        className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                      >
                        25%
                      </button>
                      <button
                        onClick={handleSetValue}
                        value="50"
                        className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                      >
                        50%
                      </button>
                      <button
                        onClick={handleSetValue}
                        value="75"
                        className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                      >
                        75%
                      </button>
                      <button
                        onClick={handleSetValue}
                        value="100"
                        className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <div className="w-full text-neutral mt-6 text-[14px] lg:text-[18px]">
                    <p className="text-left mb-3">YOU WILL RECEIVE</p>
                    <div className="border border-neutral px-4 md:px-12 py-5">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {currentPool && (
                            <img
                              src={currentPool?.tokens[0].logo}
                              className="w-[30px] h-[30px]"
                              alt=""
                            />
                          )}
                          <span className="text-[14px] lg:text-[18px]">
                            {currentPool?.tokens[0].symbol}
                          </span>
                        </div>
                        <span>
                          {currentPool
                            ? Number(
                                amountWithoutDecimals(
                                  currencyAAmount,
                                  currentPool.tokens[0].decimals
                                ).toFixed(5)
                              )
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          {currentPool && (
                            <img
                              src={currentPool?.tokens[1].logo}
                              className="w-[30px] h-[30px]"
                              alt=""
                            />
                          )}
                          <span className="text-[14px] lg:text-[18px]">
                            {currentPool?.tokens[1].symbol}
                          </span>
                        </div>
                        <span>
                          {currentPool
                            ? Number(
                                amountWithoutDecimals(
                                  currencyBAmount,
                                  currentPool.tokens[1].decimals
                                ).toFixed(5)
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="w-full text-neutral mt-6 text-[14px] lg:text-[18px]">
                <p className="text-left mb-3">PRICES</p>
                <div className="border border-neutral px-4 md:px-12 py-5">
                  <p className="flex justify-between">
                    <span>1 {currentPool?.tokens[0].symbol} -</span>
                    <span>
                      {Number(priceAasB?.toFixed(5))}{" "}
                      {currentPool?.tokens[1].symbol}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>1 {currentPool?.tokens[1].symbol} -</span>
                    <span>
                      {Number(priceBasA?.toFixed(5))}{" "}
                      {currentPool?.tokens[0].symbol}
                    </span>
                  </p>
                </div>
              </div>

              <ActionButton
                text={text}
                isDisabled={isDisabled}
                isSpinning={isSpinning}
                handleClick={handleClickActionButton}
              />
            </div>
          </div>

          <p className="text-[14px] md:text-[18px] text-neutral mt-7">
            SELECT A TOKEN TO REMOVE LIQUIDITY
          </p>
        </div>
      </div>
      <CurrencySearchModal
        modalId="remove-currencyA-modal"
        selectedCurrency={currencyA}
        otherSelectedCurrency={currencyB}
        field={InputField.INPUT_A}
        show={showInputModal}
        setShow={setShowInputModal}
      />
      <CurrencySearchModal
        modalId="remove-currencyB-modal"
        selectedCurrency={currencyB}
        otherSelectedCurrency={currencyA}
        field={InputField.INPUT_B}
        show={showOutputModal}
        setShow={setShowOutputModal}
      />
    </div>
  );
}
