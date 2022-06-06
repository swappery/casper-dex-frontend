/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ActionButton from "../../components/Button/actionButton";

import NumberFormat from "react-number-format";
import { amountWithoutDecimals, getTokenFromAddress } from "../../utils/utils";

import QuestionHelper from "../../components/QuestionHelper";
import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import useNetworkStatus from "../../store/useNetworkStatus";
import useSetting from "../../store/useSetting";
import { Themes } from "../../config/constants/themes";
import useAddLiquidityStatus from "../../store/useAddLiquidity";
import { SUPPORTED_TOKENS } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import useAction from "../../store/useAction";
import { ActionType } from "../../config/interface/actionType";
import useCasperWeb3Provider from "../../web3";
import {
  CHAIN_NAME,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
} from "../../web3/config/constant";
import { SwapperyRouterClient } from "../../web3/clients/swappery-router-client";
import { CasperServiceByJsonRPC, CLPublicKey } from "casper-js-sdk";
import { SwapperyPairClient } from "../../web3/clients/swappery-pair-client";
import { BigNumber } from "ethers";
import { Pool } from "../../config/interface/pool";
import useWalletStatus from "../../store/useWalletStatus";
import { InputField } from "../../config/interface/inputField";
import { TokenAmount } from "../../config/interface/tokenAmounts";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModal";
import { ActionStatus } from "../../config/interface/actionStatus";

export default function AddLiquidity() {
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [showOutputModal, setShowOutputModal] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [isSpinning, setSpinning] = useState<boolean>(false);
  const { theme } = useSetting();
  const {
    activate,
    balanceOf,
    allowanceOf,
    isPairExist,
    wrapCspr,
    approve,
    addLiquidity,
  } = useCasperWeb3Provider();
  const { setPool } = useWalletStatus();
  const {
    actionType,
    actionStatus,
    isPending,
    setActionType,
    setActionStatus,
  } = useAction();
  const [searchParams] = useSearchParams();
  const { isConnected, activeAddress } = useNetworkStatus();
  const {
    currencyA,
    currencyB,
    currencyAAmounts,
    currencyBAmounts,
    currentPool,
    inputField,
    isFetching,
    initialize,
    setCurrencyA,
    setCurrencyB,
    setCurrencyAAmounts,
    setCurrencyBAmounts,
    setCurrentPool,
    setInputField,
    setFetching,
  } = useAddLiquidityStatus();

  useEffect(() => {
    async function handleChange() {
      if (!isConnected || !currencyA) return;
      const currencyAmount: TokenAmount = {
        balance: await balanceOf(currencyA.address),
        allowance: await allowanceOf(currencyA.address),
        amount: currencyAAmounts ? currencyAAmounts.amount : BigNumber.from(0),
        limit: currencyAAmounts ? currencyAAmounts.limit : BigNumber.from(0),
      };
      setCurrencyAAmounts(currencyAmount);
    }
    handleChange();
  }, [activeAddress, currencyA, isPending]);

  useEffect(() => {
    async function handleChange() {
      if (!isConnected || !currencyB) return;
      const currencyAmount: TokenAmount = {
        balance: await balanceOf(currencyB.address),
        allowance: await allowanceOf(currencyB.address),
        amount: currencyBAmounts ? currencyBAmounts.amount : BigNumber.from(0),
        limit: currencyBAmounts ? currencyBAmounts.limit : BigNumber.from(0),
      };
      setCurrencyBAmounts(currencyAmount);
    }
    handleChange();
  }, [activeAddress, currencyB, isPending]);

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
          setPool(activeAddress, pool);
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
        BigNumber.from(currencyAAmounts ? currencyAAmounts.amount : 0).eq(0) ||
        BigNumber.from(currencyBAmounts ? currencyBAmounts.amount : 0).eq(0)
      )
        newActionStatus = ActionStatus.REQ_INPUT_AMOUNT;
      else if (
        currencyA?.isNative &&
        BigNumber.from(currencyAAmounts?.balance).lt(currencyAAmounts?.amount!)
      )
        newActionStatus = ActionStatus.REQ_WRAP_INPUT_CURRENCY;
      else if (
        BigNumber.from(currencyAAmounts?.balance).lt(currencyAAmounts?.amount!)
      )
        newActionStatus = ActionStatus.INSUFFICIENT_INPUT_CURRENCY_AMOUNT;
      else if (
        BigNumber.from(currencyAAmounts?.allowance).lt(
          currencyAAmounts?.amount!
        )
      )
        newActionStatus = ActionStatus.REQ_APPROVE_INPUT_CURRENCY;
      else if (
        currencyB?.isNative &&
        BigNumber.from(currencyBAmounts?.balance).lt(currencyBAmounts?.amount!)
      )
        newActionStatus = ActionStatus.REQ_WRAP_OUTPUT_CURRENCY;
      else if (
        BigNumber.from(currencyBAmounts?.balance).lt(currencyBAmounts?.amount!)
      )
        newActionStatus = ActionStatus.INSUFFICIENT_OUTPUT_CURRENCY_AMOUNT;
      else if (
        BigNumber.from(currencyBAmounts?.allowance).lt(
          currencyBAmounts?.amount!
        )
      )
        newActionStatus = ActionStatus.REQ_APPROVE_OUTPUT_CURRENCY;
      else newActionStatus = ActionStatus.REQ_EXECUTE_ACTION;
      setActionStatus(newActionStatus);
    }
    updateActionStatus();
  }, [
    isConnected,
    currencyAAmounts,
    currencyBAmounts,
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
      case ActionStatus.REQ_INPUT_AMOUNT:
        setText("Please Input Amount");
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
      case ActionStatus.REQ_WRAP_INPUT_CURRENCY:
        setText("Wrap");
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.INSUFFICIENT_INPUT_CURRENCY_AMOUNT:
        setText("Insufficient " + currencyA?.symbol + " Amount");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.REQ_APPROVE_INPUT_CURRENCY:
        setText("Approve " + currencyA?.symbol);
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.REQ_WRAP_OUTPUT_CURRENCY:
        setText("Wrap");
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.INSUFFICIENT_OUTPUT_CURRENCY_AMOUNT:
        setText("Insufficient " + currencyB?.symbol + " Amount");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.REQ_APPROVE_OUTPUT_CURRENCY:
        setText("Approve " + currencyB?.symbol);
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.REQ_EXECUTE_ACTION:
        setText("Add Liquidity");
        setSpinning(false);
        setDisabled(false);
        break;
      default:
        break;
    }
  }, [actionStatus]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input = params["input"];
    const output = params["output"];

    setCurrencyA(
      getTokenFromAddress(input, SUPPORTED_TOKENS[ChainName.TESTNET])!
    );
    setCurrencyB(
      getTokenFromAddress(output, SUPPORTED_TOKENS[ChainName.TESTNET])!
    );
  }, [searchParams]);

  const handleClickActionButton = async () => {
    if (actionStatus === ActionStatus.REQ_CONNECT_WALLET) activate();
    else if (currencyA && currencyB && currencyAAmounts && currencyBAmounts)
      if (actionStatus === ActionStatus.REQ_WRAP_INPUT_CURRENCY) {
        await wrapCspr(currencyAAmounts.amount.sub(currencyAAmounts.balance));
      } else if (actionStatus === ActionStatus.REQ_APPROVE_INPUT_CURRENCY) {
        await approve(currencyAAmounts.amount, currencyA.address);
      } else if (actionStatus === ActionStatus.REQ_WRAP_OUTPUT_CURRENCY) {
        await wrapCspr(currencyBAmounts.amount.sub(currencyBAmounts.balance));
      } else if (actionStatus === ActionStatus.REQ_APPROVE_OUTPUT_CURRENCY) {
        await approve(currencyBAmounts.amount, currencyB.address);
      } else if (actionStatus === ActionStatus.REQ_EXECUTE_ACTION) {
        await addLiquidity(
          CLPublicKey.fromHex(activeAddress),
          currencyA,
          currencyAAmounts.amount,
          currencyB,
          currencyBAmounts.amount
        );
      }
  };

  if (actionType !== ActionType.ADD_LIQUIDITY) {
    setActionType(ActionType.ADD_LIQUIDITY);
    initialize();
  }

  const withALimit = ({ floatValue }: any) =>
    !currencyA || !currentPool
      ? false
      : currentPool.totalSupply.eq(0)
      ? true
      : floatValue <
        amountWithoutDecimals(currentPool.reserves[0], currencyA.decimals);

  const withBLimit = ({ floatValue }: any) =>
    !currencyB || !currentPool
      ? false
      : currentPool.totalSupply.eq(0)
      ? true
      : floatValue <
        amountWithoutDecimals(currentPool.reserves[1], currencyB.decimals);

  const valueA = useMemo(() => {
    if (
      inputField === InputField.INPUT_B &&
      currentPool &&
      currentPool.totalSupply.gt(0)
    ) {
      return currencyA && currentPool && currencyBAmounts
        ? amountWithoutDecimals(
            currencyBAmounts.amount
              .mul(currentPool.reserves[0])
              .div(currentPool.reserves[1]),
            currencyA.decimals
          )
        : 0;
    } else {
      return currencyA && currencyAAmounts
        ? amountWithoutDecimals(currencyAAmounts?.amount!, currencyA?.decimals!)
        : 0;
    }
  }, [inputField, currencyA, currencyAAmounts, currencyBAmounts, currentPool]);

  const valueB = useMemo(() => {
    if (
      inputField === InputField.INPUT_A &&
      currentPool &&
      currentPool.totalSupply.gt(0)
    ) {
      return currencyAAmounts && currencyB && currentPool
        ? amountWithoutDecimals(
            currencyAAmounts.amount
              .mul(currentPool.reserves[1])
              .div(currentPool.reserves[0]!),
            currencyB.decimals
          )
        : 0;
    } else {
      return currencyB && currencyBAmounts
        ? amountWithoutDecimals(currencyBAmounts.amount, currencyB.decimals)
        : 0;
    }
  }, [inputField, currencyAAmounts, currencyB, currencyBAmounts, currentPool]);

  return (
    <div className="flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0">
      <div className="container mx-auto grid grid-cols-12">
        <div className="col-span-12 lg:col-start-2 lg:col-end-12 xl:col-start-3 xl:col-end-11 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-9">
          <div className="flex items-center justify-between w-full px-1">
            <Link to="/liquidity" className="hover:opacity-80">
              <BackIcon stroke={theme === Themes.LIGHT ? "black" : "#FFF8D4"} />
            </Link>

            <p className="text-[25px] sm:text-[35px] md:text-[43px] leading-[43px] text-neutral">
              ADD LIQUIDITY
            </p>
            <div className="w-[19px]"></div>
          </div>

          <div className="mt-3 mb-7 flex gap-1 items-center">
            <QuestionHelper text="Liquidity providers earn a 0.15% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool" />
            <p className="text-[16px] md:text-[20px] text-neutral">
              add liquidity to receive lp tokens
            </p>
          </div>

          <div className="sm:border bg-success w-full">
            <div className="sm:px-2 sm:py-6 md:p-8 2xl:py-12 font-orator-std text-black">
              <div className="flex justify-between items-center rounded-[25px] md:rounded-[45px] border border-neutral px-1.5 py-2 sm:py-4 sm:px-5 md:px-6">
                <NumberFormat
                  value={valueA}
                  className="md:h-fit max-w-[50%] sm:max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSpinning}
                  thousandSeparator={false}
                  onKeyDown={() => {
                    setInputField(InputField.INPUT_A);
                  }}
                  isAllowed={withALimit}
                  onValueChange={async (values) => {
                    const { value } = values;
                    const amount = parseFloat(value) || 0;
                    if (currencyAAmounts && currencyA) {
                      const newAmounts: TokenAmount = {
                        balance: currencyAAmounts.balance,
                        allowance: currencyAAmounts.allowance,
                        amount: BigNumber.from(
                          (amount * 10 ** currencyA.decimals).toFixed()
                        ),
                        limit: BigNumber.from(
                          (amount * 10 ** currencyA.decimals).toFixed()
                        ),
                      };
                      setCurrencyAAmounts(newAmounts);
                    }
                  }}
                />
                <div className="flex items-center md:gap-2">
                  <button
                    className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setShowInputModal(true);
                    }}
                    disabled={isSpinning}
                  >
                    <span className="text-[12px] sm:text-[14px] md:text-[19px]">
                      {currencyA ? currencyA.symbol : "Select Currency"}
                    </span>
                    <ChevronIcon />
                  </button>
                  {currencyA ? (
                    <img
                      src={currencyA.logo}
                      className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
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
              <div className="flex justify-between items-center border border-neutral px-1.5 py-2 sm:py-4 sm:px-5 md:px-6">
                <NumberFormat
                  value={valueB}
                  className="md:h-fit max-w-[50%] sm:max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSpinning}
                  thousandSeparator={false}
                  onKeyDown={() => {
                    setInputField(InputField.INPUT_B);
                  }}
                  isAllowed={withBLimit}
                  onValueChange={async (values) => {
                    const { value } = values;
                    const amount = parseFloat(value) || 0;
                    if (currencyB && currencyBAmounts) {
                      const newAmounts: TokenAmount = {
                        balance: currencyBAmounts.balance,
                        allowance: currencyBAmounts.allowance,
                        amount: BigNumber.from(
                          (amount * 10 ** currencyB.decimals).toFixed()
                        ),
                        limit: BigNumber.from(
                          (amount * 10 ** currencyB.decimals).toFixed()
                        ),
                      };
                      setCurrencyBAmounts(newAmounts);
                    }
                  }}
                />
                <div className="flex items-center md:gap-2">
                  <button
                    className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setShowOutputModal(true);
                    }}
                    disabled={isSpinning}
                  >
                    <span className="text-[12px] sm:text-[14px] md:text-[19px]">
                      {currencyB ? currencyB.symbol : "Select Currency"}
                    </span>
                    <ChevronIcon />
                  </button>
                  {currencyB ? (
                    <img
                      src={currencyB.logo}
                      className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                      alt=""
                    />
                  ) : (
                    <></>
                  )}
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
            SELECT A TOKEN TO FIND LIQUIDITY
          </p>
        </div>
      </div>
      <CurrencySearchModal
        modalId="add-currencyA-modal"
        selectedCurrency={currencyA}
        otherSelectedCurrency={currencyB}
        field={InputField.INPUT_A}
        show={showInputModal}
        setShow={setShowInputModal}
      />
      <CurrencySearchModal
        modalId="add-currencyB-modal"
        selectedCurrency={currencyB}
        otherSelectedCurrency={currencyA}
        field={InputField.INPUT_B}
        show={showOutputModal}
        setShow={setShowOutputModal}
      />
    </div>
  );
}
