import { ReactNode } from "react";
import casperToken from "../../../assets/images/tokens/0x80dB3a8014872a1E6C3667926ABD7d3cE61eD0C4.svg";
import swprToken from "../../../assets/images/tokens/0x6FA23529476a1337EB5da8238b778e7122d79666.svg";
import { Pool } from "../../../store/useWalletStatus";
import { amountWithoutDecimals } from "../../../utils/utils";
import { BigNumber } from "ethers";

type LPTokenProps = {
  poolInfo: Pool;
};

const LPTokenDetail = ({ poolInfo }: LPTokenProps) => {
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
      poolInfo.tokens[0].decimals
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
    <div className="font-orator-std w-full py-4 md:py-7 px-2 md:px-14 border border-neutral mt-8 mb-3 md:mt-14 md:mb-8">
      <p className="text-[18px] text-neutral mb-5">lp tokens in your wallet</p>
      <div className="rounded-3xl border border-neutral px-4 md:px-9 flex justify-between items-center text-[15px] text-neutral">
        <div className="flex items-center">
          <div className="flex mr-2 md:mr-4">
            <img
              src={poolInfo.tokens[0].tokenSvg}
              alt="Casper Token"
              className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
            />
            <div className="w-[30px] h-[30px] md:w-[37px] md:h-[37px] border border-neutral rounded-[50%]"></div>
            <img
              src={poolInfo.tokens[1].tokenSvg}
              alt="SWPR Token"
              className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
            />
          </div>
          <p>
            {poolInfo.tokens[0].symbol}-{poolInfo.tokens[1].symbol} LP
          </p>
        </div>
        <p>{balance}</p>
      </div>
      <div className="text-[15px] text-neutral mt-6">
        <p className="flex justify-between">
          <span>share of pool</span>
          <span>{shareOfPool}%</span>
        </p>
        <p className="flex justify-between my-1">
          <span>pooled {poolInfo.tokens[0].symbol}</span>
          <span>{pooledToken0}</span>
        </p>
        <p className="flex justify-between">
          <span>pooled {poolInfo.tokens[1].symbol}</span>
          <span>{pooledToken1}</span>
        </p>
      </div>
      <div className="font-orator-std grid gap-4 text-black mt-7">
        <button className="hover:opacity-80 p-[7px] text-[18px] leading-[22px] bg-lightgreen border border-black rounded-3xl">
          Remove
        </button>
        <button className="hover:opacity-80 p-[9px] text-[15px] leading-[18px] bg-lightgreen border border-black rounded-3xl">
          + ADD LIQUIDITY INSTEAD
        </button>
      </div>
    </div>
  );
};

export default LPTokenDetail;
