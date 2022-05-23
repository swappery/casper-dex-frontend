import { FC } from "react";
import useNetworkStatus from "../../store/useNetworkStatus";
import useLiquidityStatus, { TxStatus } from "../../store/useLiquidityStatus";
import useCasperWeb3Provider, { swapExactOut } from "../../web3";
import { swapExactIn } from "../../web3";
import { CLPublicKey } from "casper-js-sdk";
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
  } = useLiquidityStatus();
  const handleClick = async () => {
    if (isConnected) {
      if (currentStatus === TxStatus.REQ_WRAP)
        wrapCspr(sourceAmount.sub(sourceBalance));
      else if (currentStatus === TxStatus.REQ_SOURCE_APPROVE)
        approveSourceToken(maxAmountIn);
      else if (currentStatus === TxStatus.REQ_TARGET_APPROVE)
        approveTargetToken(targetAmount);
      else if (currentStatus === TxStatus.REQ_EXECUTE && isExactIn) {
        console.log(minAmountOut.toNumber());
        console.log(targetAmount.toNumber());
        console.log(
          swapExactIn(
            CLPublicKey.fromHex(activeAddress),
            sourceToken,
            targetToken,
            sourceAmount,
            minAmountOut
          )
        );
      } else if (currentStatus === TxStatus.REQ_EXECUTE && !isExactIn) {
        console.log(
          swapExactOut(
            CLPublicKey.fromHex(activeAddress),
            sourceToken,
            targetToken,
            maxAmountIn,
            targetAmount
          )
        );
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
      content = <>Approve 1</>;
    else if (currentStatus === TxStatus.REQ_TARGET_APPROVE)
      content = <>Approve 2</>;
    else if (currentStatus === TxStatus.REQ_EXECUTE) content = <>Swap</>;
    else
      content = (
        <div className='inline-flex items-center'>
          <svg
            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
          Pending
        </div>
      );
  }
  return (
    <button
      className='mt-4 bg-lightgreen border border-black rounded-3xl px-4 py-2 w-full text-[18px] text-black font-orator-std'
      onClick={handleClick}>
      {content}
    </button>
  );
};
export default ActionButton;
