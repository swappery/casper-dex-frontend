import React, { useCallback, useMemo, useState, KeyboardEvent } from "react";
import IconButton from "../../components/Button/IconButton";
import useLiquidityStatus, {
  supportedTokens,
} from "../../store/useLiquidityStatus";
import { getReserves } from "../../web3";
import ActionButton from "./actionButton";
import NumberFormat from "react-number-format";

export default function Swap() {
  const {
    sourceToken,
    sourceAmount,
    targetToken,
    targetAmount,
    reserves,
    isExactIn,
    setSourceAmount,
    setTargetAmount,
    setReserves,
    setExactIn,
  } = useLiquidityStatus();

  const sourceValue = !isExactIn
    ? reserves[0]
        .mul(targetAmount)
        .mul(1000)
        .div(reserves[1].sub(targetAmount).mul(998))
        .toNumber() /
      10 ** supportedTokens[sourceToken].decimals
    : sourceAmount.toNumber() / 10 ** supportedTokens[sourceToken].decimals;
  const targetValue = isExactIn
    ? sourceAmount
        .mul(998)
        .mul(reserves[1])
        .div(reserves[0].mul(1000).add(sourceAmount.mul(998)))
        .toNumber() /
      10 ** supportedTokens[targetToken].decimals
    : targetAmount.toNumber() / 10 ** supportedTokens[targetToken].decimals;

  const calculatedReserves = useMemo(async () => {
    return await getReserves(sourceToken, targetToken);
  }, [sourceToken, targetToken]);

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-transparent w-96 mx-auto rounded-2xl border border-slate-300 shadow-lg">
        <div className="p-5 text-center">
          <span className="text-2xl">Swap</span>
          <div>trade tokens in an instant</div>
        </div>
        <hr />
        <div className="relative flex-col justify-between p-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="pb-2">CSPR</div>
              <div>
                <NumberFormat
                  value={sourceValue}
                  className="input w-full border border-slate-500 focus:outline-none"
                  thousandSeparator={true}
                  onKeyDown={useCallback(
                    (e: KeyboardEvent<HTMLInputElement>) => {
                      setExactIn(true);
                    },
                    [isExactIn]
                  )}
                  onValueChange={async (values) => {
                    const { value } = values;
                    setSourceAmount(parseFloat(value) || 0);
                    console.log(sourceAmount.toNumber());
                    const reserves = await calculatedReserves;
                    setReserves(reserves[0], reserves[1]);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <IconButton IconUrl="" />
            </div>
            <div>
              <div className="pb-2">CoA</div>
              <div>
                <NumberFormat
                  value={targetValue}
                  className="input w-full border border-slate-500 focus:outline-none"
                  thousandSeparator={false}
                  onKeyDown={useCallback(
                    (e: KeyboardEvent<HTMLInputElement>) => {
                      setExactIn(false);
                    },
                    [isExactIn]
                  )}
                  onValueChange={async (values) => {
                    const { value } = values;
                    // setTargetAmount(parseFloat(value) || 0);
                    console.log(targetAmount.toNumber());
                    const reserves = await calculatedReserves;
                    setReserves(reserves[0], reserves[1]);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between px-5 place-items-end">
              <span className="font-bold text-xs">Slippage Tolerance</span>
              <span className="font-bold">1%</span>
            </div>
          </div>
          <ActionButton />
        </div>
      </div>
    </div>
  );
}
