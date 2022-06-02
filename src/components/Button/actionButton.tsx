import { FC } from "react";
import useNetworkStatus from "../../store/useNetworkStatus";
import useLiquidityStatus, {
  ExecutionType,
  supportedTokens,
  TxStatus,
} from "../../store/useLiquidityStatus";
import useCasperWeb3Provider from "../../web3";
// import { swapExactIn } from "../../web3";
import { CLPublicKey } from "casper-js-sdk";
import Spinner from "../../assets/images/spinner/swappery-loading_64px.gif";
import useWalletStatus from "../../store/useWalletStatus";
import { createSearchParams, useNavigate } from "react-router-dom";

const ActionButton: FC = () => {
  const { isConnected, activeAddress } = useNetworkStatus();
  const {
    activate,
    wrapCspr,
    approveSourceToken,
    approveTargetToken,
    approveLiquidity,
    addLiquidity,
    removeLiquidity,
    swapExactIn,
    swapExactOut,
  } = useCasperWeb3Provider();

  const {
    sourceToken,
    sourceBalance,
    sourceAmount,
    targetToken,
    targetAmount,
    targetBalance,
    isExactIn,
    minAmountOut,
    maxAmountIn,
    currentStatus,
    execType,
    currentPool,
    liquidityAmount,
  } = useLiquidityStatus();

  const { setPool } = useWalletStatus();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isConnected) {
      if (
        execType === ExecutionType.EXE_SWAP &&
        currentStatus === TxStatus.REQ_WRAP &&
        !isExactIn
      )
        wrapCspr(maxAmountIn.sub(sourceBalance));
      else if (
        execType === ExecutionType.EXE_SWAP &&
        currentStatus === TxStatus.REQ_WRAP &&
        isExactIn
      )
        wrapCspr(sourceAmount.sub(sourceBalance));
      else if (
        execType === ExecutionType.EXE_ADD_LIQUIDITY &&
        currentStatus === TxStatus.REQ_WRAP &&
        supportedTokens[sourceToken].isNative
      )
        wrapCspr(sourceAmount.sub(sourceBalance));
      else if (
        execType === ExecutionType.EXE_ADD_LIQUIDITY &&
        currentStatus === TxStatus.REQ_WRAP &&
        supportedTokens[targetToken].isNative
      )
        wrapCspr(targetAmount.sub(targetBalance));
      else if (
        execType === ExecutionType.EXE_SWAP &&
        currentStatus === TxStatus.REQ_SOURCE_APPROVE &&
        !isExactIn
      )
        approveSourceToken(maxAmountIn);
      else if (
        execType === ExecutionType.EXE_SWAP &&
        currentStatus === TxStatus.REQ_SOURCE_APPROVE &&
        isExactIn
      )
        approveSourceToken(sourceAmount);
      else if (
        execType === ExecutionType.EXE_ADD_LIQUIDITY &&
        currentStatus === TxStatus.REQ_SOURCE_APPROVE
      )
        approveSourceToken(sourceAmount);
      else if (currentStatus === TxStatus.REQ_TARGET_APPROVE)
        approveTargetToken(targetAmount);
      else if (currentStatus === TxStatus.REQ_LIQUIDITY_APPROVE)
        approveLiquidity(liquidityAmount);
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
        setPool(activeAddress, currentPool);
      } else if (
        currentStatus === TxStatus.REQ_ADD_LIQUIDITY &&
        execType === ExecutionType.EXE_FIND_LIQUIDITY
      ) {
        navigate({
          pathname: "/add",
          search: createSearchParams({
            inputCurrency: supportedTokens[sourceToken].contractHash,
            outputCurrency: supportedTokens[targetToken].contractHash,
          }).toString(),
        });
      } else if (
        currentStatus === TxStatus.REQ_EXECUTE &&
        execType === ExecutionType.EXE_REMOVE_LIQUIDITY
      ) {
        removeLiquidity(
          CLPublicKey.fromHex(activeAddress),
          currentPool.tokens[0].contractHash,
          currentPool.tokens[1].contractHash,
          liquidityAmount
        );
      }
    } else {
      activate();
    }
  };

  let content;
  let disableButton = false;
  if (!isConnected) {
    content = <>Connect Your Wallet</>;
  } else {
    if (currentStatus === TxStatus.REQ_SELECT_CURRENCY) {
      content = <>Please Select Currency</>;
      disableButton = true;
    } else if (currentStatus === TxStatus.REQ_WRAP) content = <>Wrap</>;
    else if (currentStatus === TxStatus.REQ_SOURCE_APPROVE)
      content = <>Approve {supportedTokens[sourceToken].symbol} Token</>;
    else if (currentStatus === TxStatus.REQ_TARGET_APPROVE)
      content = <>Approve {supportedTokens[targetToken].symbol} Token</>;
    else if (currentStatus === TxStatus.REQ_LIQUIDITY_APPROVE)
      content = <>Approve Liquidity</>;
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
      execType === ExecutionType.EXE_REMOVE_LIQUIDITY
    )
      content = <>Remove Liquidity</>;
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
    else if (currentStatus === TxStatus.PENDING)
      content = (
        <div className="inline-flex items-center">
          <img src={Spinner} className="w-6 h-6" alt="" />
          Pending
        </div>
      );
  }
  return (
    <>
      {disableButton ? (
        <button
          className="hover:opacity-80 mt-4 bg-lightgreen border border-black rounded-3xl px-4 py-2 w-full text-[14px] md:text-[18px] text-black font-orator-std disabled:opacity-50"
          disabled
          onClick={handleClick}
        >
          {content}
        </button>
      ) : (
        <button
          className="hover:opacity-80 mt-4 bg-lightgreen border border-black rounded-3xl px-4 py-2 w-full text-[14px] md:text-[18px] text-black font-orator-std"
          onClick={handleClick}
        >
          {content}
        </button>
      )}
    </>
  );
};
export default ActionButton;
