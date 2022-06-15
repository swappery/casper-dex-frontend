import { Pool } from "../../config/interface/pool";

interface PairProps {
  poolInfo: Pool;
  balance?: number;
  checkIcon?: string;
}

const PairDetail = ({ poolInfo, balance, checkIcon }: PairProps) => {
  return (
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
          {poolInfo.tokens[0].symbol}-{poolInfo.tokens[1].symbol}
        </p>
      </div>
      <p>APR {balance}%</p>
      {checkIcon && <img src={checkIcon} alt="Check Icon" />}
    </div>
  );
};

export default PairDetail;
