/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useSearchParams } from "react-router-dom";
import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
  TokenType,
} from "../../store/useLiquidityStatus";
import ActionButton from "../../components/Button/actionButton";
// import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModalOld";
import LPTokenDetail from "../Pool/components/LPTokenDetail";
import { BigNumber } from "ethers";
import useCasperWeb3Provider from "../../web3";
import useNetworkStatus from "../../store/useNetworkStatus";
import { useMemo } from "react";
import useSetting from "../../store/useSetting";
import { Themes } from "../../config/constants/themes";

export default function PoolFinder() {
  const { theme } = useSetting();
  const { activate } = useCasperWeb3Provider();
  const { isConnected } = useNetworkStatus();
  const {
    execType,
    sourceToken,
    targetToken,
    currentPool,
    setExecTypeWithCurrency,
  } = useLiquidityStatus();
  const [searchParams] = useSearchParams();

  // if (!isConnected) activate();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const inputCurrency =
    params["inputCurrency"] || supportedTokens[TokenType.SWPR].contractHash;
  const outputCurrency = params["outputCurrency"];

  if (execType !== ExecutionType.EXE_FIND_LIQUIDITY)
    setExecTypeWithCurrency(
      ExecutionType.EXE_FIND_LIQUIDITY,
      inputCurrency,
      outputCurrency
    );

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
                {sourceToken !== TokenType.EMPTY ? (
                  <img
                    src={supportedTokens[sourceToken].tokenSvg}
                    className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                    alt=""
                  />
                ) : (
                  <span className="w-[30px] h-[30px] md:w-[37px] md:h-[37px] border border-neutral rounded-[50%]"></span>
                )}
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
                {targetToken !== TokenType.EMPTY ? (
                  <img
                    src={supportedTokens[targetToken].tokenSvg}
                    className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                    alt=""
                  />
                ) : (
                  <span className="w-[30px] h-[30px] md:w-[37px] md:h-[37px] border border-neutral rounded-[50%]"></span>
                )}
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
          {/* <ActionButton /> */}
          <p className="text-base md:text-[18px] text-neutral mt-7">
            SELECT A TOKEN TO FIND LIQUIDITY
          </p>
        </div>
      </div>
      {/* <CurrencySearchModal
        modalId="currentTokenModal"
        selectedCurrency={
          sourceToken !== TokenType.EMPTY
            ? supportedTokens[sourceToken].contractHash
            : null
        }
        otherSelectedCurrency={
          targetToken !== TokenType.EMPTY
            ? supportedTokens[targetToken].contractHash
            : null
        }
        isSourceSelect={true}
      />
      <CurrencySearchModal
        modalId="targetTokenModal"
        selectedCurrency={
          targetToken !== TokenType.EMPTY
            ? supportedTokens[targetToken].contractHash
            : null
        }
        otherSelectedCurrency={
          sourceToken !== TokenType.EMPTY
            ? supportedTokens[sourceToken].contractHash
            : null
        }
        isSourceSelect={false}
      /> */}
    </div>
  );
}
