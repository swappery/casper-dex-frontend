/* eslint-disable react/jsx-no-target-blank */
import { Themes } from "../../config/constants/themes";
import ExternalIcon from "../Icon/External";
import useClipboard from "react-use-clipboard";
import Copy from "../Icon/Copy";
import {
  amountWithoutDecimals,
  ExplorerDataType,
  getCsprExplorerLink,
} from "../../utils/utils";
import ActionButton from "../Button/actionButton";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import useNetworkStatus from "../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../web3";
import { FarmInfo } from "../../store/useMasterChef";

interface StakingModalProps {
  balance: BigNumber;
  allowance: BigNumber;
  currentAmount: BigNumber;
  decimals: number;
  farm: FarmInfo;
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function StakingModal({
  balance,
  allowance,
  currentAmount,
  decimals,
  farm,
  show,
  setShow,
}: StakingModalProps) {
  const [actionText, setActionText] = useState<string>("");
  const [amount, setAmount] = useState<BigNumber>(currentAmount);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const { isConnected, activeAddress } = useNetworkStatus();
  const { activate, deposit, withdraw } = useCasperWeb3Provider();

  const defaultSliderValue = useMemo(() => {
    return balance.eq(0) ? 0 : currentAmount.mul(100).div(balance).toNumber();
  }, [currentAmount, balance]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(event.target.value, 10));
  };

  const handleSetValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setSliderValue(parseInt(button.value, 10));
  };

  useEffect(() => {
    if (sliderValue !== defaultSliderValue)
      setAmount(balance.mul(sliderValue).div(100));
  }, [sliderValue]);

  useEffect(() => {
    if (!isConnected) setActionText("Connect Wallet");
    else if (amount.gt(currentAmount)) setActionText("Deposit");
    else if (amount.lt(currentAmount)) setActionText("Withdraw");
  }, [isConnected, amount]);

  const handleAction = () => {
    if (actionText === "Connect Wallet") activate();
    else if (actionText === "Deposit") deposit(farm, amount.sub(currentAmount));
    else if (actionText === "Withdraw")
      withdraw(farm, currentAmount.sub(amount));
  };

  return (
    <>
      <input
        type="checkbox"
        id={"user-wallet-modal"}
        className="modal-toggle"
        checked={show}
        readOnly
      />
      <div className="modal">
        <div className="modal-box bg-success rounded-none p-0 relative w-11/12 max-w-5xl">
          <div className="flex justify-between items-center text-neutral p-6 border-b border-neutral font-bold">
            <p className="font-orator-std text-[24px]">Staking</p>
            <label
              onClick={() => {
                setShow(false);
              }}
              className="cursor-pointer hover:opacity-70"
            >
              ✕
            </label>
          </div>
          <div className="p-7 font-orator-std">
            <div className="border border-neutral px-3 sm:px-6 py-5">
              <p className="text-[32px] md:text-[40px] text-left text-neutral mb-3">
                {amountWithoutDecimals(amount, decimals)}/
                {amountWithoutDecimals(balance, decimals)}
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                defaultValue={defaultSliderValue}
                onChange={handleChange}
                className="range range-xs"
              />
              <div className="flex justify-between sm:w-[75%] mx-auto text-[14px] sm:text-[16px] mt-7">
                <button
                  onClick={handleSetValue}
                  value="25"
                  className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                >
                  25%
                </button>
                <button
                  onClick={handleSetValue}
                  value="50"
                  className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                >
                  50%
                </button>
                <button
                  onClick={handleSetValue}
                  value="75"
                  className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                >
                  75%
                </button>
                <button
                  onClick={handleSetValue}
                  value="100"
                  className="hover:opacity-80 outline-none bg-lightblue rounded-2xl px-5 py-1"
                >
                  MAX
                </button>
              </div>
            </div>
            <ActionButton
              text={actionText}
              isDisabled={false}
              isSpinning={false}
              handleClick={handleAction}
            />
          </div>
        </div>
      </div>
    </>
  );
}
