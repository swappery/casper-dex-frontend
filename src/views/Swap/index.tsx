/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, KeyboardEvent, useMemo } from "react";
import IconButton from "../../components/Button/IconButton";
import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
  TokenType,
  TOTAL_SHARE,
} from "../../store/useLiquidityStatus";
import ActionButton from "../../components/Button/actionButton";
import NumberFormat from "react-number-format";
import { amountWithoutDecimals } from "../../utils/utils";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModalOld";

import swapImage from "../../assets/images/swap/swap.svg";
import ChevronIcon from "../../components/Icon/Chevron";
import leftHand from "../../assets/images/hands/left.svg";
import { useSearchParams } from "react-router-dom";

export default function Swap() {
  const {
    sourceToken,
    sourceAmount,
    targetToken,
    targetAmount,
    reserves,
    isExactIn,
    slippageTolerance,
    execType,
    setExecTypeWithCurrency,
    setSourceAmount,
    setTargetAmount,
    setExactIn,
    setMaxAmountIn,
    setMinAmountOut,
  } = useLiquidityStatus();
  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const inputCurrency =
    params["inputCurrency"] || supportedTokens[TokenType.CSPR].contractHash;
  const outputCurrency =
    params["outputCurrency"] || supportedTokens[TokenType.SWPR].contractHash;
  if (execType !== ExecutionType.EXE_SWAP && inputCurrency && outputCurrency)
    setExecTypeWithCurrency(
      ExecutionType.EXE_SWAP,
      inputCurrency,
      outputCurrency
    );

  const getAmountsOut = () => {
    let tempAmount = sourceAmount;
    for (var i = 0; i < reserves.length; i++) {
      tempAmount = tempAmount
        .mul(998)
        .mul(reserves[i][1])
        .div(reserves[i][0].mul(1000).add(tempAmount.mul(998)));
    }
    return amountWithoutDecimals(
      tempAmount,
      supportedTokens[targetToken].decimals
    );
  };

  const getAmountsIn = () => {
    let tempAmount = targetAmount;
    for (var i = 0; i < reserves.length; i++) {
      tempAmount = reserves[i][0]
        .mul(tempAmount)
        .mul(1000)
        .div(reserves[i][1].sub(tempAmount).mul(998))
        .add(1);
    }
    return amountWithoutDecimals(
      tempAmount,
      supportedTokens[sourceToken].decimals
    );
  };

  const withTargetLimit = ({ floatValue }: any) =>
    floatValue <
    amountWithoutDecimals(
      reserves[reserves.length - 1][1],
      supportedTokens[targetToken].decimals
    );

  const sourceValue = !isExactIn
    ? getAmountsIn()
    : amountWithoutDecimals(
        sourceAmount,
        supportedTokens[sourceToken].decimals
      );
  const targetValue = isExactIn
    ? getAmountsOut()
    : amountWithoutDecimals(
        targetAmount,
        supportedTokens[targetToken].decimals
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
            <div className="flex justify-between items-center rounded-[45px] border border-neutral py-4 px-5 md:px-6">
              <NumberFormat
                value={sourceValue}
                className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]"
                thousandSeparator={false}
                onKeyDown={useCallback(
                  (e: KeyboardEvent<HTMLInputElement>) => {
                    setExactIn(true);
                  },
                  [isExactIn]
                )}
                onValueChange={async (values) => {
                  const { value } = values;
                  setSourceAmount(parseFloat(value) || 0);
                  setMaxAmountIn(
                    (parseFloat(value) * (TOTAL_SHARE + slippageTolerance)) /
                      TOTAL_SHARE
                  );
                }}
              />
              <div className="flex items-center md:gap-2">
                <label
                  htmlFor="currentTokenModal"
                  className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]"
                >
                  <span className="text-[14px] md:text-[19px]">
                    {supportedTokens[sourceToken].symbol}
                  </span>
                  <ChevronIcon />
                </label>
                <img
                  src={supportedTokens[sourceToken].tokenSvg}
                  className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                  alt="CSPR Token"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <IconButton />
            </div>
            <div className="flex justify-between items-center border border-neutral px-5 py-4 md:px-6">
              <NumberFormat
                value={targetValue}
                className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]"
                thousandSeparator={false}
                isAllowed={withTargetLimit}
                onKeyDown={useCallback(
                  (e: KeyboardEvent<HTMLInputElement>) => {
                    setExactIn(false);
                  },
                  [isExactIn]
                )}
                onValueChange={async (values) => {
                  const { value } = values;
                  setTargetAmount(parseFloat(value) || 0);
                  setMinAmountOut(
                    (parseFloat(value) * TOTAL_SHARE) /
                      (TOTAL_SHARE + slippageTolerance)
                  );
                }}
              />
              <div className="flex items-center md:gap-2">
                <label
                  htmlFor="targetTokenModal"
                  className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]"
                >
                  <span className="text-[14px] md:text-[19px]">
                    {supportedTokens[targetToken].symbol}
                  </span>
                  <ChevronIcon />
                </label>
                <img
                  src={supportedTokens[targetToken].tokenSvg}
                  className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                  alt="SWPR Token"
                />
              </div>
            </div>
            <p className="text-center mt-3 px-8 text-neutral text-[12px] md:text-[15px]">
              Slippage Tolerance {(slippageTolerance / TOTAL_SHARE) * 100}%
            </p>
            <ActionButton />
          </div>
        </div>
      </div>
      <CurrencySearchModal
        modalId="currentTokenModal"
        selectedCurrency={supportedTokens[sourceToken].contractHash}
        otherSelectedCurrency={supportedTokens[targetToken].contractHash}
        isSourceSelect={true}
      />
      <CurrencySearchModal
        modalId="targetTokenModal"
        selectedCurrency={supportedTokens[targetToken].contractHash}
        otherSelectedCurrency={supportedTokens[sourceToken].contractHash}
        isSourceSelect={false}
      />
    </div>
  );
}
