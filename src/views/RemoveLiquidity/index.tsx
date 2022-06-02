/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useSearchParams } from "react-router-dom";

import ActionButton from "../../components/Button/actionButton";

import NumberFormat from "react-number-format";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModalOld";

import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import useNetworkStatus from "../../store/useNetworkStatus";
import csprToken from "../../assets/images/tokens/0x80dB3a8014872a1E6C3667926ABD7d3cE61eD0C4.svg";
import swprToken from "../../assets/images/tokens/0x6FA23529476a1337EB5da8238b778e7122d79666.svg";
import useLiquidityStatus, {
  ExecutionType,
} from "../../store/useLiquidityStatus";
import { amountWithoutDecimals } from "../../utils/utils";
import { BigNumber } from "ethers";
import { useState } from "react";
import useCasperWeb3Provider from "../../web3";
import { CLPublicKey } from "casper-js-sdk";
import useSetting from "../../store/useSetting";
import { Themes } from "../../config/constants/themes";

export default function RemoveLiquidity() {
  const { theme } = useSetting();
  const { isConnected, activeAddress } = useNetworkStatus();
  const {
    execType,
    currentPool,
    liquidityAmount,
    setLiquidityAmount,
    setExecType,
  } = useLiquidityStatus();

  if (execType !== ExecutionType.EXE_REMOVE_LIQUIDITY)
    setExecType(ExecutionType.EXE_REMOVE_LIQUIDITY);

  const withLiquidityLimit = ({ floatValue }: any) =>
    floatValue <
    amountWithoutDecimals(
      BigNumber.from(currentPool.balance),
      BigNumber.from(currentPool.decimals).toNumber()
    );
  const sourceValue = amountWithoutDecimals(
    liquidityAmount
      .mul(BigNumber.from(currentPool.reserves[0]))
      .div(BigNumber.from(currentPool.totalSupply)),
    BigNumber.from(currentPool.tokens[0].decimals).toNumber()
  );
  const targetValue = amountWithoutDecimals(
    liquidityAmount
      .mul(BigNumber.from(currentPool.reserves[1]))
      .div(BigNumber.from(currentPool.totalSupply)),
    BigNumber.from(currentPool.tokens[1].decimals).toNumber()
  );
  const liquidityValue = amountWithoutDecimals(
    liquidityAmount,
    BigNumber.from(currentPool.decimals).toNumber()
  );
  return (
    <div className="flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0">
      <div className="container mx-auto grid grid-cols-12">
        <div className="col-span-12 md:col-start-2 md:col-end-12 xl:col-start-3 xl:col-end-11 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-9">
          <div className="flex items-center justify-between w-full px-1">
            <Link to="/liquidity" className="hover:opacity-80">
              <BackIcon stroke={theme === Themes.LIGHT ? "black" : "#FFF8D4"} />
            </Link>

            <p className="text-[35px] md:text-[43px] leading-[43px] text-neutral">
              REMOVE LIQUIDITY
            </p>
            <div className="w-[19px]"></div>
          </div>

          <p className="text-[20px] md:text-[22px] text-neutral mt-3 mb-7">
            remove liquidity to receive tokens back
          </p>

          <div className="border bg-success w-full">
            <div className="px-2 py-6 md:p-8 2xl:py-12 font-orator-std text-black">
              <div className="flex justify-between items-center rounded-[45px] border border-neutral py-4 px-5 md:px-6">
                <NumberFormat
                  value={liquidityValue}
                  className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]"
                  thousandSeparator={false}
                  isAllowed={withLiquidityLimit}
                  onValueChange={async (values) => {
                    const { value } = values;
                    setLiquidityAmount(parseFloat(value) || 0);
                  }}
                />
                <div className="flex items-center">
                  <label className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]">
                    <span className="text-[14px] md:text-[19px]">
                      {currentPool.tokens[0].symbol}:
                      {currentPool.tokens[1].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  <img
                    src={currentPool.tokens[0].tokenSvg}
                    className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
                    alt=""
                  />
                  <div className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral"></div>
                  <img
                    src={currentPool.tokens[1].tokenSvg}
                    className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
                    alt=""
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral"></div>
              </div>
              <div className="flex justify-between items-center border border-neutral py-4 px-5 md:px-6">
                <NumberFormat
                  value={sourceValue}
                  className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]"
                  thousandSeparator={false}
                />
                <div className="flex items-center md:gap-2">
                  <label
                    htmlFor="currentTokenModal"
                    className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]"
                  >
                    <span className="text-[14px] md:text-[19px]">
                      {currentPool.tokens[0].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  <img
                    src={currentPool.tokens[0].tokenSvg}
                    className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                    alt=""
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral">
                  +
                </div>
              </div>
              <div className="flex justify-between items-center border border-neutral px-5 py-4 md:px-6">
                <NumberFormat
                  value={targetValue}
                  className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]"
                  thousandSeparator={false}
                />
                <div className="flex items-center md:gap-2">
                  <label
                    htmlFor="targetTokenModal"
                    className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]"
                  >
                    <span className="text-[14px] md:text-[19px]">
                      {currentPool.tokens[1].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  <img
                    src={currentPool.tokens[1].tokenSvg}
                    className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                    alt=""
                  />
                </div>
              </div>
              <ActionButton />
            </div>
          </div>
          <p className="text-base md:text-[18px] text-neutral mt-7">
            SELECT A TOKEN TO REMOVE LIQUIDITY
          </p>
        </div>
      </div>
      <CurrencySearchModal modalId="currentTokenModal" isSourceSelect={true} />
      <CurrencySearchModal modalId="targetTokenModal" isSourceSelect={false} />
    </div>
  );
}
