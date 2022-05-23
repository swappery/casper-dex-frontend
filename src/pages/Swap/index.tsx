import { useCallback, KeyboardEvent } from "react";
import IconButton from "../../components/Button/IconButton";
import useLiquidityStatus, {
  supportedTokens,
} from "../../store/useLiquidityStatus";
import ActionButton from "./actionButton";
import NumberFormat from "react-number-format";
import { amountWithoutDecimals } from "../../utils/stringUtils";

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
    setExactIn,
    setMaxAmountIn,
    setMinAmountOut,
  } = useLiquidityStatus();
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
                    setMaxAmountIn((parseFloat(value) * 10100) / 10000);
                    console.log("source change");
                    console.log(value);
                    console.log(isExactIn);
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
                    setTargetAmount(parseFloat(value) || 0);
                    setMinAmountOut((parseFloat(value) * 10000) / 10100);
                    console.log("target change");
                    console.log(value);
                    console.log(isExactIn);
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
