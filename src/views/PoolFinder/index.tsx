import { Link } from "react-router-dom";
import useTheme, { Themes } from "../../hooks/useTheme";
import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
} from "../../store/useLiquidityStatus";
import ActionButton from "../../components/Button/actionButton";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModalOld";
import LPTokenDetail from "../Pool/components/LPTokenDetail";
import { BigNumber } from "ethers";

export default function PoolFinder() {
  const { theme } = useTheme();
  const { currentPool } = useLiquidityStatus();
  const { execType, sourceToken, targetToken, setExecType } =
    useLiquidityStatus();

  if (execType !== ExecutionType.EXE_FIND_LIQUIDITY)
    setExecType(ExecutionType.EXE_FIND_LIQUIDITY);

  return (
    <div className="flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0">
      <div className="container mx-auto grid grid-cols-12">
        <div className="col-span-12 md:col-start-3 md:col-end-11 xl:col-start-4 xl:col-end-10 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-9">
          <div className="flex items-center justify-between w-full px-1">
            <Link to="/liquidity" className="hover:opacity-80">
              <BackIcon stroke={theme === Themes.LIGHT ? "black" : "#FFF8D4"} />
            </Link>

            <p className="text-[35px] md:text-[43px] leading-[43px] text-neutral">
              IMPORT POOL
            </p>
            <div className="w-[19px]"></div>
          </div>
          <p className="text-[20px] md:text-[22px] text-neutral mt-3 mb-7">
            import an existing pool
          </p>

          <div className="grid justify-items-center w-full">
            <label
              htmlFor="currentTokenModal"
              className="hover:opacity-80 w-full flex justify-between items-center px-8 border border-black bg-lightyellow py-2"
            >
              <p className="flex items-center gap-2">
                <img
                  src={supportedTokens[sourceToken].tokenSvg}
                  className="w-[28px] h-[28px]"
                  alt=""
                />
                <span className="text-[19px] text-black">
                  {supportedTokens[sourceToken].symbol}
                </span>
              </p>
              <ChevronIcon />
            </label>
            <div className="w-[30px] h-[30px] border border-neutral rounded-[50%] text-[18px] text-neutral">
              +
            </div>
            <label
              htmlFor="targetTokenModal"
              className="hover:opacity-80 w-full flex justify-between items-center px-8 border border-neutral rounded-3xl text-neutral py-2"
            >
              <p className="flex items-center gap-2">
                {/* <img src={swprToken} className='w-[28px] h-[28px]' alt='' /> */}
                {/* <div className="w-[28px] h-[28px] border border-neutral rounded-[50%]"></div>
                <span className="text-[19px]">select a token</span> */}
                <img
                  src={supportedTokens[targetToken].tokenSvg}
                  className="w-[28px] h-[28px]"
                  alt=""
                />
                <span className="text-[19px] text-black">
                  {supportedTokens[targetToken].symbol}
                </span>
              </p>
              <ChevronIcon
                fill={theme === Themes.LIGHT ? "black" : "#FFF8D4"}
              />
            </label>
          </div>
          {currentPool.balance &&
          !BigNumber.from(currentPool.balance).eq(BigNumber.from(0)) ? (
            <LPTokenDetail
              isManage={false}
              poolInfo={currentPool}
              key={currentPool.contractPackageHash}
            />
          ) : (
            <></>
          )}
          <ActionButton />
          <p className="text-base md:text-[18px] text-neutral mt-7">
            SELECT A TOKEN TO FIND LIQUIDITY
          </p>
        </div>
      </div>
      <CurrencySearchModal modalId="currentTokenModal" />
      <CurrencySearchModal modalId="targetTokenModal" />
    </div>
  );
}
