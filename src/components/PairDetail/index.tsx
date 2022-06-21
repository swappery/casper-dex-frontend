import { testnetTokens } from "../../config/constants/tokens";
import { Token } from "../../config/interface/token";

interface PairProps {
  tokens: Token[];
  balance?: number;
  checkIcon?: string;
}

const PairDetail = ({ tokens, balance, checkIcon }: PairProps) => {
  return (
    <div className="rounded-3xl border border-neutral px-4 md:px-9 flex justify-between items-center text-[15px] text-neutral">
      <div className="flex items-center">
        {tokens.length === 2 ? (
          <>
            <div className="flex mr-2 md:mr-4">
              <img
                src={tokens[0].logo}
                alt="Casper Token"
                className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
              />
              <div className="w-[30px] h-[30px] md:w-[37px] md:h-[37px] border border-neutral rounded-[50%]"></div>
              <img
                src={tokens[1].logo}
                alt="SWPR Token"
                className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
              />
            </div>
            <p>
              {tokens[0].symbol}-{tokens[1].symbol}
            </p>
          </>
        ) : (
          <>
            {" "}
            <div className="flex mr-2 md:mr-4">
              <img
                src={testnetTokens.SWPR.logo}
                alt="Casper Token"
                className="w-[30px] h-[30px] md:w-[37px] md:h-[37px]"
              />
            </div>
            <p>{testnetTokens.SWPR.symbol}</p>
          </>
        )}
      </div>
      <p>APR {balance}%</p>
      {checkIcon && <img src={checkIcon} alt="Check Icon" />}
    </div>
  );
};

export default PairDetail;
