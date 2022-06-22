/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { amountWithoutDecimals } from "../../utils/utils";
import ActionButton from "../Button/actionButton";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import useNetworkStatus from "../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../web3";
import { FarmInfo } from "../../store/useMasterChef";
import useAction from "../../store/useAction";
import { MASTER_CHEF_CONTRACT_PACKAGE_HASH } from "../../web3/config/constant";
import { formatFixed } from "@ethersproject/bignumber";

const HIDDEN_LENGTH = 5;

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
  const [actionDisabled, setActionDisabled] = useState<boolean>(true);
  const [actionText, setActionText] = useState<string>("");
  const [amount, setAmount] = useState<BigNumber>(currentAmount);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const { isConnected } = useNetworkStatus();
  const { activate, deposit, withdraw, approve, enterStaking, leaveStaking } =
    useCasperWeb3Provider();
  const { isPending } = useAction();

  useEffect(() => {
    setSliderValue(
      balance.eq(0)
        ? 0
        : amountWithoutDecimals(currentAmount, decimals - HIDDEN_LENGTH)
    );
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseFloat(event.target.value));
  };

  const handleSetValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    console.log("balance  " + formatFixed(balance));
    console.log("allowance  " + formatFixed(allowance));
    console.log("currentAmount  " + formatFixed(currentAmount));
    console.log("liquidity  " + formatFixed(farm.liquidity));

    const button: HTMLButtonElement = event.currentTarget;
    const value = parseInt(button.value, 10);
    setSliderValue(
      Number(
        amountWithoutDecimals(
          balance.mul(value).div(100),
          decimals - HIDDEN_LENGTH
        ).toFixed()
      )
    );
  };

  useEffect(() => {
    setAmount(
      sliderValue === 0
        ? BigNumber.from(0)
        : balance
            .mul(Number(sliderValue.toFixed()))
            .div(
              Number(
                amountWithoutDecimals(
                  balance,
                  decimals - HIDDEN_LENGTH
                ).toFixed()
              )
            )
    );
  }, [sliderValue]);

  useEffect(() => {
    if (!isConnected) {
      setActionText("Connect Wallet");
      setActionDisabled(false);
    } else if (amount.eq(currentAmount)) {
      setActionText("Set Amount");
      setActionDisabled(true);
    } else if (isPending) {
      setActionText("Pending");
      setActionDisabled(false);
    } else if (
      amount.gt(currentAmount) &&
      amount.sub(currentAmount).gt(allowance)
    ) {
      setActionText("Approve");
      setActionDisabled(false);
    } else if (
      amount.gt(currentAmount) &&
      amount.sub(currentAmount).lte(allowance)
    ) {
      setActionText("Deposit");
      setActionDisabled(false);
    } else if (amount.lt(currentAmount)) {
      setActionText("Withdraw");
      setActionDisabled(false);
    }
  }, [isConnected, amount, isPending, allowance]);

  const handleAction = () => {
    if (actionText === "Connect Wallet") activate();
    else if (actionText === "Approve")
      approve(
        amount.sub(currentAmount),
        farm.lpToken.contractHash,
        MASTER_CHEF_CONTRACT_PACKAGE_HASH
      );
    else if (actionText === "Deposit") {
      if (farm.lpToken.tokens.length === 0)
        enterStaking(amount.sub(currentAmount));
      else deposit(farm, amount.sub(currentAmount));
    } else if (actionText === "Withdraw")
      if (farm.lpToken.tokens.length === 0)
        leaveStaking(amount.sub(currentAmount));
      else withdraw(farm, currentAmount.sub(amount));
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
        <div className="modal-box bg-success rounded-none p-0 relative w-5/6 max-w-5xl">
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
                {Number(
                  amountWithoutDecimals(amount, decimals).toFixed(HIDDEN_LENGTH)
                )}
                /
                {Number(
                  amountWithoutDecimals(balance, decimals).toFixed(
                    HIDDEN_LENGTH
                  )
                )}
              </p>
              <input
                type="range"
                min={0}
                max={amountWithoutDecimals(balance, decimals - HIDDEN_LENGTH)}
                value={sliderValue}
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
              isDisabled={actionDisabled}
              isSpinning={isPending}
              handleClick={handleAction}
            />
          </div>
        </div>
      </div>
    </>
  );
}
