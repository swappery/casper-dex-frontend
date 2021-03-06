import { amountWithoutDecimals } from "../../../utils/utils";
import { BigNumber } from "ethers";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Pool } from "../../../config/interface/pool";
import useRemoveLiquidityStatus from "../../../store/useRemoveLiquidity";

type LPTokenProps = {
  isManage: boolean;
  poolInfo: Pool;
};

const LPTokenDetail = ({ isManage, poolInfo }: LPTokenProps) => {
  const navigate = useNavigate();
  const { setCurrentPool } = useRemoveLiquidityStatus();
  const balance = amountWithoutDecimals(
    BigNumber.from(poolInfo.balance),
    poolInfo.decimals
  );
  const shareOfPool =
    (amountWithoutDecimals(
      BigNumber.from(poolInfo.balance),
      poolInfo.decimals
    ) /
      amountWithoutDecimals(
        BigNumber.from(poolInfo.totalSupply),
        poolInfo.decimals
      )) *
    100;
  const pooledToken0 =
    (amountWithoutDecimals(
      BigNumber.from(poolInfo.reserves[0]),
      poolInfo.decimals
    ) *
      shareOfPool) /
    100;
  const pooledToken1 =
    (amountWithoutDecimals(
      BigNumber.from(poolInfo.reserves[1]),
      poolInfo.tokens[1].decimals
    ) *
      shareOfPool) /
    100;
  return (
    <div className="font-orator-std w-full py-4 md:py-7 sm:px-2 md:px-14 sm:border sm:border-neutral mt-3 mb-1 sm:mt-8 sm:mb-3 md:mt-14 md:mb-8">
      <p className="text-[18px] text-neutral mb-5">lp tokens in your wallet</p>
      <div className="rounded-3xl border border-neutral px-4 md:px-9 flex justify-between items-center text-[15px] text-neutral">
        <div className="flex items-center">
          <div className="flex mr-2 md:mr-4">
            <img
              src={poolInfo.tokens[0].logo}
              alt="Casper Token"
              className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
            />
            <div className="w-[30px] h-[30px] md:w-[37px] md:h-[37px] border border-neutral rounded-[50%]"></div>
            <img
              src={poolInfo.tokens[1].logo}
              alt="SWPR Token"
              className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
            />
          </div>
          <p>
            {poolInfo.tokens[0].symbol}-{poolInfo.tokens[1].symbol} LP
          </p>
        </div>
        <p>{Number(balance.toFixed(5))}</p>
      </div>
      <div className="text-[15px] text-neutral mt-6">
        <p className="flex justify-between">
          <span>share of pool</span>
          <span>{Number(shareOfPool.toFixed(5))}%</span>
        </p>
        <p className="flex justify-between my-1">
          <span>pooled {poolInfo.tokens[0].symbol}</span>
          <span>{Number(pooledToken0.toFixed(5))}</span>
        </p>
        <p className="flex justify-between">
          <span>pooled {poolInfo.tokens[1].symbol}</span>
          <span>{Number(pooledToken1.toFixed(5))}</span>
        </p>
      </div>
      {isManage ? (
        <div className="font-orator-std grid gap-4 text-black mt-7">
          <button
            className="hover:opacity-80 p-[7px] text-[18px] leading-[22px] bg-lightgreen border border-black rounded-3xl"
            onClick={() => {
              setCurrentPool(poolInfo);
              navigate({
                pathname: "/remove",
                search: createSearchParams({
                  input: poolInfo.tokens[0].address,
                  output: poolInfo.tokens[1].address,
                }).toString(),
              });
            }}
          >
            Remove
          </button>
          <button
            className="hover:opacity-80 p-[9px] text-[15px] leading-[18px] bg-lightgreen border border-black rounded-3xl"
            onClick={() => {
              navigate({
                pathname: "/add",
                search: createSearchParams({
                  input: poolInfo.tokens[0].address,
                  output: poolInfo.tokens[1].address,
                }).toString(),
              });
            }}
          >
            + ADD LIQUIDITY INSTEAD
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LPTokenDetail;
