/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ActionButton from "../../components/Button/actionButton";
import NumberFormat from "react-number-format";
import {
  amountWithoutDecimals,
  getAmountsIn,
  getAmountsOut,
  getTokenFromAddress,
  reverseDoubleArray,
} from "../../utils/utils";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModal";

import swapImage from "../../assets/images/swap/swap.svg";
import ChevronIcon from "../../components/Icon/Chevron";
import leftHand from "../../assets/images/hands/left.svg";
import { useSearchParams } from "react-router-dom";
import useSwap from "../../store/useSwap";
import useNetworkStatus from "../../store/useNetworkStatus";
import useAction from "../../store/useAction";
import useSetting from "../../store/useSetting";
import { ActionType } from "../../config/interface/actionType";
import { TokenAmount } from "../../config/interface/tokenAmounts";
import useCasperWeb3Provider from "../../web3";
import { ActionStatus } from "../../config/interface/actionStatus";
import { BigNumber } from "ethers";
import { InputField } from "../../config/interface/inputField";
import { testnetTokens } from "../../config/constants/tokens";
import { SUPPORTED_TOKENS, TOTAL_SHARE } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import { CLPublicKey } from "casper-js-sdk";
import SwitchButton from "../../components/Button/switchButton";

export default function Swap() {
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [showOutputModal, setShowOutputModal] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [isSpinning, setSpinning] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    inputCurrency,
    outputCurrency,
    inputCurrencyAmounts,
    outputCurrencyAmounts,
    reserves,
    inputField,
    initialize,
    setInputField,
    setInputCurrency,
    setOutputCurrency,
    setInputCurrencyAmounts,
    setOutputCurrencyAmounts,
    setReserves,
  } = useSwap();
  const { isConnected, activeAddress } = useNetworkStatus();
  const {
    actionType,
    actionStatus,
    isPending,
    isFetching,
    setActionType,
    setActionStatus,
    setFetching,
  } = useAction();
  const { slippageTolerance } = useSetting();
  const {
    activate,
    balanceOf,
    allowanceOf,
    isPairExist,
    getReserves,
    wrapCspr,
    approve,
    swapExactIn,
    swapExactOut,
  } = useCasperWeb3Provider();

  //Set user balance & allowance of input currency
  useEffect(() => {
    async function handleChange() {
      if (!isConnected || !inputCurrency) return;
      const currencyAmount: TokenAmount = {
        balance: await balanceOf(inputCurrency.address),
        allowance: await allowanceOf(inputCurrency.address),
        amount: inputCurrencyAmounts.amount,
        limit: inputCurrencyAmounts.limit,
      };
      setInputCurrencyAmounts(currencyAmount);
    }
    handleChange();
  }, [activeAddress, inputCurrency, isPending]);

  //Set user balance & allowance of output currency
  useEffect(() => {
    async function handleChange() {
      if (!isConnected || !outputCurrency) return;
      const currencyAmount: TokenAmount = {
        balance: await balanceOf(outputCurrency.address),
        allowance: await allowanceOf(outputCurrency.address),
        amount: outputCurrencyAmounts.amount,
        limit: outputCurrencyAmounts.limit,
      };
      setOutputCurrencyAmounts(currencyAmount);
    }
    handleChange();
  }, [activeAddress, outputCurrency, isPending]);

  //Update path to swap input currency to output
  useEffect(() => {
    async function handleUpdateReserves() {
      if (!inputCurrency || !outputCurrency) return;
      setFetching(true);
      if (await isPairExist(inputCurrency, outputCurrency)) {
        setReserves([await getReserves(inputCurrency, outputCurrency)]);
      } else if (
        (await isPairExist(inputCurrency, testnetTokens.CSPR)) &&
        (await isPairExist(testnetTokens.CSPR, outputCurrency))
      ) {
        setReserves([
          await getReserves(inputCurrency, testnetTokens.CSPR),
          await getReserves(testnetTokens.CSPR, outputCurrency),
        ]);
      }
      setFetching(false);
    }
    handleUpdateReserves();
  }, [inputCurrency, outputCurrency, isPending]);

  //Set current action status
  useEffect(() => {
    async function updateActionStatus() {
      let newActionStatus;
      if (!isConnected) newActionStatus = ActionStatus.REQ_CONNECT_WALLET;
      else if (isPending) newActionStatus = ActionStatus.PENDING;
      else if (isFetching) newActionStatus = ActionStatus.LOADING;
      else if (
        BigNumber.from(inputCurrencyAmounts.amount).eq(0) ||
        BigNumber.from(outputCurrencyAmounts.amount).eq(0)
      )
        newActionStatus = ActionStatus.REQ_INPUT_AMOUNT;
      else if (
        inputCurrency.isNative &&
        BigNumber.from(inputCurrencyAmounts.balance).lt(
          inputCurrencyAmounts.amount
        )
      )
        newActionStatus = ActionStatus.REQ_WRAP_INPUT_CURRENCY;
      else if (
        BigNumber.from(inputCurrencyAmounts.balance).lt(
          inputCurrencyAmounts.amount
        )
      )
        newActionStatus = ActionStatus.INSUFFICIENT_INPUT_CURRENCY_AMOUNT;
      else if (
        BigNumber.from(inputCurrencyAmounts.allowance).lt(
          inputCurrencyAmounts.amount
        )
      )
        newActionStatus = ActionStatus.REQ_APPROVE_INPUT_CURRENCY;
      else newActionStatus = ActionStatus.REQ_EXECUTE_ACTION;
      setActionStatus(newActionStatus);
    }
    updateActionStatus();
  }, [
    isConnected,
    inputCurrencyAmounts,
    outputCurrencyAmounts,
    isPending,
    isFetching,
  ]);

  //Set action button properties
  useEffect(() => {
    switch (actionStatus) {
      case ActionStatus.REQ_CONNECT_WALLET:
        setText("Connect Your Wallet");
        setSpinning(false);
        setDisabled(false);
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
        setText("Insufficient " + inputCurrency.symbol + " Amount");
        setSpinning(false);
        setDisabled(true);
        break;
      case ActionStatus.REQ_APPROVE_INPUT_CURRENCY:
        setText("Approve " + inputCurrency.symbol);
        setSpinning(false);
        setDisabled(false);
        break;
      case ActionStatus.REQ_EXECUTE_ACTION:
        setText("Swap");
        setSpinning(false);
        setDisabled(false);
        break;
      default:
        break;
    }
  }, [actionStatus]);

  //Set currencies form search params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input = params["input"] || inputCurrency.address;
    const output = params["output"] || outputCurrency.address;
    setInputCurrency(
      getTokenFromAddress(input, SUPPORTED_TOKENS[ChainName.TESTNET])!
    );
    setOutputCurrency(
      getTokenFromAddress(output, SUPPORTED_TOKENS[ChainName.TESTNET])!
    );
  }, [searchParams]);

  const handleClickActionButton = async () => {
    if (actionStatus === ActionStatus.REQ_CONNECT_WALLET) activate();
    else if (actionStatus === ActionStatus.REQ_WRAP_INPUT_CURRENCY) {
      await wrapCspr(
        inputCurrencyAmounts.amount.sub(inputCurrencyAmounts.balance)
      );
    } else if (actionStatus === ActionStatus.REQ_APPROVE_INPUT_CURRENCY) {
      await approve(inputCurrencyAmounts.amount, inputCurrency.address);
    } else if (
      actionStatus === ActionStatus.REQ_EXECUTE_ACTION &&
      inputField === InputField.INPUT_A
    ) {
      await swapExactIn(
        CLPublicKey.fromHex(activeAddress),
        inputCurrency,
        outputCurrency,
        inputCurrencyAmounts.amount,
        outputCurrencyAmounts.limit
      );
    } else if (
      actionStatus === ActionStatus.REQ_EXECUTE_ACTION &&
      inputField === InputField.INPUT_B
    ) {
      await swapExactOut(
        CLPublicKey.fromHex(activeAddress),
        inputCurrency,
        outputCurrency,
        inputCurrencyAmounts.limit,
        outputCurrencyAmounts.amount
      );
    }
  };
  const handleClickSwithButton = () => {
    setSearchParams({
      input: outputCurrency.address,
      output: inputCurrency.address,
    });
    if (inputField === InputField.INPUT_A) setInputField(InputField.INPUT_B);
    else setInputField(InputField.INPUT_A);
    const tempAmount = inputCurrencyAmounts;
    setInputCurrencyAmounts(outputCurrencyAmounts);
    setOutputCurrencyAmounts(tempAmount);
    setReserves(reverseDoubleArray(reserves));
  };

  if (actionType !== ActionType.SWAP) {
    setActionType(ActionType.SWAP);
    initialize();
  }

  const withTargetLimit = ({ floatValue }: any) =>
    floatValue <
    amountWithoutDecimals(
      reserves[reserves.length - 1][1],
      outputCurrency.decimals
    );

  const inputValue =
    inputField === InputField.INPUT_B
      ? getAmountsIn(
          outputCurrencyAmounts.amount,
          reserves,
          inputCurrency.decimals
        )
      : amountWithoutDecimals(
          inputCurrencyAmounts.amount,
          inputCurrency.decimals
        );
  const outputValue =
    inputField === InputField.INPUT_A
      ? getAmountsOut(
          inputCurrencyAmounts.amount,
          reserves,
          outputCurrency.decimals
        )
      : amountWithoutDecimals(
          outputCurrencyAmounts.amount,
          outputCurrency.decimals
        );

  return (
    <div className="flex items-center bg-accent relative page-wrapper px-2 md:px-0">
      <div className="container mx-auto py-0 md:py-[90px] grid grid-cols-12 gap-2 md:gap-6">
        <div className="col-span-12 md:col-span-4 lg:col-start-2 lg:col-end-5 border relative bg-success py-1 md:py-0">
          <img
            src={leftHand}
            className="hidden md:block absolute top-[112px] -left-[130px] xl:top-[50px] xl:-left-[145px] z-20"
            alt="Left Hand"
          />
          <div className="hidden lg:block absolute w-[500px] top-[132px] -left-[462px] h-[46px] xl:w-[2000px] xl:h-[57px] xl:-left-[1933px] xl:top-[76px] border-t border-b border-black bg-white z-20]"></div>
          <img
            src={swapImage}
            className="max-w-[94px] md:max-w-none mx-auto md:absolute md:px-6 xl:px-8 w-full md:bottom-[60px]"
            alt="Swap Button"
          />
        </div>
        <div className="col-span-12 md:col-span-8 lg:col-start-5 lg:col-end-12 border bg-success">
          <div className="px-2 py-6 md:p-8 2xl:py-12 font-orator-std text-black">
            <div className="flex justify-center">
              <ul className="steps">
                <li className="step step-info text-neutral">Register</li>
                <li className="step step-info text-neutral">Choose plan</li>
                <li className="step">Purchase</li>
                <li className="step">Receive Product</li>
              </ul>
            </div>
            <div className="flex justify-between items-center rounded-[45px] border border-neutral py-4 px-5 md:px-6">
              <NumberFormat
                value={inputValue}
                className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSpinning}
                thousandSeparator={false}
                onKeyDown={() => {
                  setInputField(InputField.INPUT_A);
                }}
                onValueChange={async (values) => {
                  const { value } = values;
                  const amount = parseFloat(value) || 0;
                  const percentage =
                    (TOTAL_SHARE + slippageTolerance) / TOTAL_SHARE;
                  const newAmounts: TokenAmount = {
                    balance: inputCurrencyAmounts.balance,
                    allowance: inputCurrencyAmounts.allowance,
                    amount: BigNumber.from(
                      (amount * 10 ** inputCurrency.decimals).toFixed()
                    ),
                    limit: BigNumber.from(
                      (
                        amount *
                        percentage ** reserves.length *
                        10 ** inputCurrency.decimals
                      ).toFixed()
                    ),
                  };
                  setInputCurrencyAmounts(newAmounts);
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
                  <span className="text-[14px] md:text-[19px]">
                    {inputCurrency.symbol}
                  </span>
                  <ChevronIcon />
                </button>
                <img
                  src={inputCurrency.logo}
                  className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                  alt="CSPR Token"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <SwitchButton
                handleClick={handleClickSwithButton}
                isDisabled={isSpinning}
              />
            </div>
            <div className="flex justify-between items-center border border-neutral px-5 py-4 md:px-6">
              <NumberFormat
                value={outputValue}
                className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSpinning}
                thousandSeparator={false}
                isAllowed={withTargetLimit}
                onKeyDown={() => {
                  setInputField(InputField.INPUT_B);
                }}
                onValueChange={async (values) => {
                  const { value } = values;
                  const amount = parseFloat(value) || 0;
                  const percentage =
                    TOTAL_SHARE / (TOTAL_SHARE + slippageTolerance);
                  const newAmounts: TokenAmount = {
                    balance: outputCurrencyAmounts.balance,
                    allowance: outputCurrencyAmounts.allowance,
                    amount: BigNumber.from(
                      (amount * 10 ** outputCurrency.decimals).toFixed()
                    ),
                    limit: BigNumber.from(
                      (
                        amount *
                        percentage ** reserves.length *
                        10 ** outputCurrency.decimals
                      ).toFixed()
                    ),
                  };
                  setOutputCurrencyAmounts(newAmounts);
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
                  <span className="text-[14px] md:text-[19px]">
                    {outputCurrency.symbol}
                  </span>
                  <ChevronIcon />
                </button>
                <img
                  src={outputCurrency.logo}
                  className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                  alt="SWPR Token"
                />
              </div>
            </div>
            <p className="text-center mt-3 px-8 text-neutral text-[12px] md:text-[15px]">
              Slippage Tolerance {(slippageTolerance / TOTAL_SHARE) * 100}%
            </p>
            <ActionButton
              text={text}
              isDisabled={isDisabled}
              isSpinning={isSpinning}
              handleClick={handleClickActionButton}
            />
          </div>
        </div>
      </div>
      <CurrencySearchModal
        modalId="swap-input-currency-modal"
        selectedCurrency={inputCurrency}
        otherSelectedCurrency={outputCurrency}
        field={InputField.INPUT_A}
        show={showInputModal}
        setShow={setShowInputModal}
      />
      <CurrencySearchModal
        modalId="swap-output-currency-modal"
        selectedCurrency={outputCurrency}
        otherSelectedCurrency={inputCurrency}
        field={InputField.INPUT_B}
        show={showOutputModal}
        setShow={setShowOutputModal}
      />
    </div>
  );
}
