import { Link } from "react-router-dom";
import useTheme, { Themes } from "../../hooks/useTheme";
import { useCallback, KeyboardEvent } from "react";

import useLiquidityStatus, {
  supportedTokens,
} from "../../store/useLiquidityStatus";
import ActionButton from "../../components/Button/actionButton";

import NumberFormat from "react-number-format";
import { amountWithoutDecimals, deserialize } from "../../utils/utils";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModalOld";

import useWalletStatus from "../../store/useWalletStatus";

import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";

export default function AddLiquidity() {
  const { theme } = useTheme();
  const {
    sourceToken,
    sourceAmount,
    targetToken,
    targetAmount,
    reserves,
    isExactIn,
    setSourceAmount,
    setTargetAmount,
    setExactIn,
    setMaxAmountIn,
    setMinAmountOut,
  } = useLiquidityStatus();

  const { accountListString } = useWalletStatus();
  console.log(deserialize(accountListString));
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
        .div(reserves[i][1].sub(tempAmount).mul(998));
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
    <div className='flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0'>
      <div className='container mx-auto grid grid-cols-12'>
        <div className='col-span-12 md:col-start-2 md:col-end-12 xl:col-start-3 xl:col-end-11 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-9'>
          <div className='flex items-center justify-between w-full px-1'>
            <Link to='/liquidity' className='hover:opacity-80'>
              <BackIcon stroke={theme === Themes.LIGHT ? "black" : "#FFF8D4"} />
            </Link>

            <p className='text-[35px] md:text-[43px] leading-[43px] text-neutral'>
              ADD LIQUIDITY
            </p>
            <div className='w-[19px]'></div>
          </div>

          <p className='text-[20px] md:text-[22px] text-neutral mt-3 mb-7'>
            add liquidity to receive lp tokens
          </p>

          <div className='border bg-success w-full'>
            <div className='px-2 py-6 md:p-8 2xl:py-12 font-orator-std text-black'>
              <div className='flex justify-between items-center rounded-[45px] border border-neutral py-4 px-5 md:px-6'>
                <NumberFormat
                  value={sourceValue}
                  className='md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]'
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
                    setMaxAmountIn((parseFloat(value) * 10100) / 10000);
                    console.log("source change");
                    console.log(value);
                    console.log(isExactIn);
                  }}
                />
                <div className='flex items-center md:gap-2'>
                  <label
                    htmlFor='currentTokenModal'
                    className='hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]'>
                    <span className='text-[14px] md:text-[19px]'>
                      {supportedTokens[sourceToken].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  <img
                    src={supportedTokens[sourceToken].tokenSvg}
                    className='w-[30px] h-[30px] md:w-[50px] md:h-[50px]'
                    alt='CSPR Token'
                  />
                </div>
              </div>
              <div className='flex justify-center'>
                <div className='w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral'>
                  +
                </div>
              </div>
              <div className='flex justify-between items-center border border-neutral px-5 py-4 md:px-6'>
                <NumberFormat
                  value={targetValue}
                  className='md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]'
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
                    setMinAmountOut((parseFloat(value) * 10000) / 10100);
                    console.log("target change");
                    console.log(value);
                    console.log(isExactIn);
                  }}
                />
                <div className='flex items-center md:gap-2'>
                  <label
                    htmlFor='targetTokenModal'
                    className='hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]'>
                    <span className='text-[14px] md:text-[19px]'>
                      {supportedTokens[targetToken].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  <img
                    src={supportedTokens[targetToken].tokenSvg}
                    className='w-[30px] h-[30px] md:w-[50px] md:h-[50px]'
                    alt='SWPR Token'
                  />
                </div>
              </div>
              <ActionButton />
            </div>
          </div>
          <p className='text-base md:text-[18px] text-neutral mt-7'>
            SELECT A TOKEN TO FIND LIQUIDITY
          </p>
        </div>
      </div>
      <CurrencySearchModal modalId='currentTokenModal' />
      <CurrencySearchModal modalId='targetTokenModal' />
    </div>
  );
}
