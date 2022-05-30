import { FC } from "react";
import useNetworkStatus from "../../store/useNetworkStatus";
import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
  TxStatus,
} from "../../store/useLiquidityStatus";
import useCasperWeb3Provider, { addLiquidity, swapExactOut } from "../../web3";
import { swapExactIn } from "../../web3";
import { CLPublicKey } from "casper-js-sdk";
import { BigNumber } from "ethers";
import useWalletStatus, { Pool } from "../../store/useWalletStatus";
const ActionButton: FC = () => {
  const { isConnected, activeAddress } = useNetworkStatus();
  const { activate, wrapCspr, approveSourceToken, approveTargetToken } =
    useCasperWeb3Provider();

  const {
    sourceToken,
    sourceBalance,
    sourceAmount,
    targetToken,
    targetAmount,
    isExactIn,
    minAmountOut,
    maxAmountIn,
    currentStatus,
    execType,
  } = useLiquidityStatus();

  const { setPool } = useWalletStatus();
  const handleClick = async () => {
    if (isConnected) {
      if (currentStatus === TxStatus.REQ_WRAP)
        wrapCspr(sourceAmount.sub(sourceBalance));
      else if (currentStatus === TxStatus.REQ_SOURCE_APPROVE && !isExactIn)
        approveSourceToken(maxAmountIn);
      else if (currentStatus === TxStatus.REQ_SOURCE_APPROVE && isExactIn)
        approveSourceToken(sourceAmount);
      else if (currentStatus === TxStatus.REQ_TARGET_APPROVE)
        approveTargetToken(targetAmount);
      else if (
        currentStatus === TxStatus.REQ_EXECUTE &&
        execType === ExecutionType.EXE_ADD_LIQUIDITY
      )
        console.log(
          addLiquidity(
            CLPublicKey.fromHex(activeAddress),
            sourceToken,
            sourceAmount,
            targetToken,
            targetAmount
          )
        );
      else if (
        currentStatus === TxStatus.REQ_EXECUTE &&
        isExactIn &&
        execType === ExecutionType.EXE_SWAP
      ) {
        console.log(
          swapExactIn(
            CLPublicKey.fromHex(activeAddress),
            sourceToken,
            targetToken,
            sourceAmount,
            minAmountOut
          )
        );
      } else if (
        currentStatus === TxStatus.REQ_EXECUTE &&
        !isExactIn &&
        execType === ExecutionType.EXE_SWAP
      ) {
        console.log(
          swapExactOut(
            CLPublicKey.fromHex(activeAddress),
            sourceToken,
            targetToken,
            maxAmountIn,
            targetAmount
          )
        );
      } else if (
        currentStatus === TxStatus.REQ_EXECUTE &&
        execType === ExecutionType.EXE_FIND_LIQUIDITY
      ) {
        // const pool: Pool = {
        //   contractPackageHash:
        //     "b668ea36f96d191f3f79a4295c78c372f15797900cab4bed031cf79e0151c094",
        //   contractHash:
        //     "5500b88f980d28c101a6dc87030c5fa3cf3fb7c1651976b154047fd0a64050ae",
        //   tokens: [supportedTokens[sourceToken], supportedTokens[targetToken]],
        //   decimals: 9,
        //   totalSupply: BigNumber.from(223642944977),
        //   reserves: reservesList[0],
        //   balance: BigNumber.from(223642944977),
        // };
        // setPool(
        //   "01d29b3abef3b25d4f43519bfaef6b6ec71cd9f115fcdb005bb287f54f67c57071",
        //   pool
        // );
      }
    } else {
      activate();
    }
  };

  let content;
  if (!isConnected) {
    content = <>Connect Your Wallet</>;
  } else {
    if (currentStatus === TxStatus.REQ_WRAP) content = <>Wrap</>;
    else if (currentStatus === TxStatus.REQ_SOURCE_APPROVE)
      content = <>Approve {supportedTokens[sourceToken].symbol} Token</>;
    else if (currentStatus === TxStatus.REQ_TARGET_APPROVE)
      content = <>Approve {supportedTokens[targetToken].symbol} Token</>;
    else if (
      currentStatus === TxStatus.REQ_EXECUTE &&
      execType === ExecutionType.EXE_SWAP
    )
      content = <>Swap</>;
    else if (
      currentStatus === TxStatus.REQ_EXECUTE &&
      execType === ExecutionType.EXE_ADD_LIQUIDITY
    )
      content = <>Add Liquidity</>;
    else if (
      currentStatus === TxStatus.REQ_EXECUTE &&
      execType === ExecutionType.EXE_FIND_LIQUIDITY
    )
      content = <>Manage This Pool</>;
    else if (
      currentStatus === TxStatus.REQ_ADD_LIQUIDITY &&
      execType === ExecutionType.EXE_FIND_LIQUIDITY
    )
      content = <>+ Add Liquidity</>;
    else
      content = (
        <div className="inline-flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Pending
        </div>
      );
  }
  return (
    <button
      className="hover:opacity-80 mt-4 bg-lightgreen border border-black rounded-3xl px-4 py-2 w-full text-[14px] md:text-[18px] text-black font-orator-std"
      onClick={handleClick}
    >
      {content}
    </button>
  );
};
export default ActionButton;
