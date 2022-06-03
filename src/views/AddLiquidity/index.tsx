/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useSearchParams } from "react-router-dom";
import { useCallback, KeyboardEvent, useEffect } from "react";

import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
  TokenType,
} from "../../store/useLiquidityStatus";
import ActionButton from "../../components/Button/actionButton";

import NumberFormat from "react-number-format";
import { amountWithoutDecimals, getTokenFromAddress } from "../../utils/utils";
// import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModalOld";

import ChevronIcon from "../../components/Icon/Chevron";
import BackIcon from "../../components/Icon/Back";
import useNetworkStatus from "../../store/useNetworkStatus";
import useSetting from "../../store/useSetting";
import { Themes } from "../../config/constants/themes";
import useAddLiquidityStatus from "../../store/useAddLiquidity";
import { SUPPORTED_TOKENS } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import useAction from "../../store/useAction";
import { ActionType } from "../../config/interface/actionType";
import useCasperWeb3Provider from "../../web3";
import {
  CHAIN_NAME,
  NODE_ADDRESS,
  ROUTER_CONTRACT_HASH,
} from "../../web3/config/constant";
import { SwapperyRouterClient } from "../../web3/clients/swappery-router-client";
import { CasperServiceByJsonRPC } from "casper-js-sdk";
import { SwapperyPairClient } from "../../web3/clients/swappery-pair-client";
import { BigNumber } from "ethers";
import { Pool } from "../../config/interface/pool";
import useWalletStatus from "../../store/useWalletStatus";
import { InputField } from "../../config/interface/inputField";

export default function AddLiquidity() {
  const { theme } = useSetting();
  const { isPairExist, activate, balanceOf, allowanceOf } =
    useCasperWeb3Provider();
  const { setPool } = useWalletStatus();
  const {
    actionType,
    actionStatus,
    isPending,
    isFetching,
    setActionType,
    setActionStatus,
    setPending,
    setFetching,
  } = useAction();
  const [searchParams] = useSearchParams();
  const { isConnected, activeAddress } = useNetworkStatus();
  const {
    currencyA,
    currencyB,
    currencyAAmounts,
    currencyBAmounts,
    currentPool,
    inputField,
    initialize,
    setCurrencyA,
    setCurrencyB,
    setCurrencyAAmounts,
    setCurrencyBAmounts,
    setCurrentPool,
    setInputField,
  } = useAddLiquidityStatus();

  useEffect(() => {
    async function handleUpdatePool() {
      if (!isConnected || !currencyA || !currencyB) return;
      setFetching(true);
      if (await isPairExist(currencyA, currencyB)) {
        let routerContractHash = ROUTER_CONTRACT_HASH;
        let routerClient = new SwapperyRouterClient(
          NODE_ADDRESS,
          CHAIN_NAME,
          undefined
        );
        await routerClient.setContractHash(routerContractHash);
        let pairPackageHash = await routerClient.getPairFor(
          currencyA.address,
          currencyB.address
        );

        const client = new CasperServiceByJsonRPC(NODE_ADDRESS);
        const { block } = await client.getLatestBlockInfo();

        if (block) {
          const stateRootHash = block.header.state_root_hash;
          const blockState = await client.getBlockState(
            stateRootHash,
            `hash-${pairPackageHash}`,
            []
          );
          let pairContractHash =
            blockState.ContractPackage?.versions[
              blockState.ContractPackage.versions.length - 1
            ].contractHash.slice(9)!;
          let pairClient = new SwapperyPairClient(
            NODE_ADDRESS,
            CHAIN_NAME,
            undefined
          );
          await pairClient.setContractHash(pairContractHash);
          let reserves_res = await pairClient.getReserves();
          let reserves;
          if (currencyA.address < currencyB.address)
            reserves = [
              BigNumber.from(reserves_res[0]),
              BigNumber.from(reserves_res[1]),
            ];
          else
            reserves = [
              BigNumber.from(reserves_res[1]),
              BigNumber.from(reserves_res[0]),
            ];

          const pool: Pool = {
            contractPackageHash: pairPackageHash,
            contractHash: pairContractHash,
            tokens: [currencyA, currencyB],
            decimals: await pairClient.decimals(),
            totalSupply: await pairClient.totalSupply(),
            reserves: reserves,
            balance: BigNumber.from(await balanceOf(pairContractHash)),
            allowance: BigNumber.from(await allowanceOf(pairContractHash)),
          };
          setCurrentPool(pool);
          setPool(activeAddress, pool);
        }
      }
      setFetching(false);
    }
    handleUpdatePool();
  }, [isConnected, activeAddress, currencyA, currencyB]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input = params["input"];
    const output = params["output"];

    setCurrencyA(
      getTokenFromAddress(input, SUPPORTED_TOKENS[ChainName.TESTNET])!
    );
    setCurrencyB(
      getTokenFromAddress(output, SUPPORTED_TOKENS[ChainName.TESTNET])!
    );
  }, [searchParams]);

  if (actionType !== ActionType.ADD_LIQUIDITY) {
    setActionType(ActionType.ADD_LIQUIDITY);
    initialize();
  }

  const withSourceLimit = ({ floatValue }: any) =>
    floatValue <
    amountWithoutDecimals(
      reserves[0][0],
      supportedTokens[sourceToken].decimals
    );

  const withTargetLimit = ({ floatValue }: any) =>
    floatValue <
    amountWithoutDecimals(
      reserves[reserves.length - 1][1],
      supportedTokens[targetToken].decimals
    );

  const sourceValue =
    inputField === InputField.INPUT_B
      ? amountWithoutDecimals(
          currencyBAmounts?.amount
            .mul(currentPool?.reserves[0]!)
            .div(currentPool?.reserves[1]!)!,
          currencyA?.decimals!
        )
      : amountWithoutDecimals(currencyAAmounts?.amount!, currencyA?.decimals!);
  const targetValue =
    inputField === InputField.INPUT_A
      ? amountWithoutDecimals(
          sourceAmount.mul(reserves[0][1]).div(reserves[0][0]),
          supportedTokens[targetToken].decimals
        )
      : amountWithoutDecimals(
          targetAmount,
          supportedTokens[targetToken].decimals
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
              ADD LIQUIDITY
            </p>
            <div className="w-[19px]"></div>
          </div>

          <p className="text-[20px] md:text-[22px] text-neutral mt-3 mb-7">
            add liquidity to receive lp tokens
          </p>

          <div className="border bg-success w-full">
            <div className="px-2 py-6 md:p-8 2xl:py-12 font-orator-std text-black">
              <div className="flex justify-between items-center rounded-[45px] border border-neutral py-4 px-5 md:px-6">
                <NumberFormat
                  value={sourceValue}
                  className="md:h-fit max-w-[60%] xl:max-w-[65%] w-full focus:outline-none py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[22px]"
                  thousandSeparator={false}
                  onKeyDown={useCallback(
                    (e: KeyboardEvent<HTMLInputElement>) => {
                      setExactIn(true);
                    },
                    [isExactIn]
                  )}
                  isAllowed={withSourceLimit}
                  onValueChange={async (values) => {
                    const { value } = values;
                    setSourceAmount(parseFloat(value) || 0);
                  }}
                />
                <div className="flex items-center md:gap-2">
                  <label
                    htmlFor="currentTokenModal"
                    className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]"
                  >
                    <span className="text-[14px] md:text-[19px]">
                      {supportedTokens[sourceToken].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  {sourceToken !== TokenType.EMPTY ? (
                    <img
                      src={supportedTokens[sourceToken].tokenSvg}
                      className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                      alt=""
                    />
                  ) : (
                    <></>
                  )}
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
                  onKeyDown={useCallback(
                    (e: KeyboardEvent<HTMLInputElement>) => {
                      setExactIn(false);
                    },
                    [isExactIn]
                  )}
                  isAllowed={withTargetLimit}
                  onValueChange={async (values) => {
                    const { value } = values;
                    setTargetAmount(parseFloat(value) || 0);
                  }}
                />
                <div className="flex items-center md:gap-2">
                  <label
                    htmlFor="targetTokenModal"
                    className="hover:opacity-80 cursor-pointer md:h-fit flex gap-2 items-center py-[6px] px-3 bg-lightblue rounded-[20px]"
                  >
                    <span className="text-[14px] md:text-[19px]">
                      {supportedTokens[targetToken].symbol}
                    </span>
                    <ChevronIcon />
                  </label>
                  {targetToken !== TokenType.EMPTY ? (
                    <img
                      src={supportedTokens[targetToken].tokenSvg}
                      className="w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
                      alt=""
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* <ActionButton /> */}
            </div>
          </div>
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
