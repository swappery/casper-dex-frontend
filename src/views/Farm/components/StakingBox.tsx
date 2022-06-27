/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import ActionButton from "../../../components/Button/actionButton";
import PairDetail from "../../../components/PairDetail";
import ConnectModal from "../../../components/SelectWalletModal/SelectWalletModal";
import StakingModal from "../../../components/StakingModal/StakingModal";
import { testnetTokens } from "../../../config/constants/tokens";
import { ActionStatus } from "../../../config/interface/actionStatus";
import { FarmInfo, FarmUserInfo } from "../../../store/useMasterChef";
import useNetworkStatus from "../../../store/useNetworkStatus";
import { amountWithoutDecimals } from "../../../utils/utils";
import useCasperWeb3Provider from "../../../web3";
import { MASTER_CHEF_CONTRACT_PACKAGE_HASH } from "../../../web3/config/constant";

interface StakingBoxProps {
  farm: FarmInfo;
  userInfo: FarmUserInfo;
  index: number;
  count: number;
  setState: (state: boolean) => void;
}
export default function StakingBox({
  farm,
  userInfo,
  index,
  count,
  setState,
}: StakingBoxProps) {
  const [isPending, setPending] = useState<boolean>(false);
  const [isChildPending, setChildPending] = useState<boolean>(false);
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const { isConnected, activeAddress } = useNetworkStatus();
  const [isFetching, setFetching] = useState<boolean>(false);
  const [harvestDisabled, setHarvestDisabled] = useState<boolean>(true);
  const [actionText, setActionText] = useState<string>("");
  const [actionDisabled, setActionDisabled] = useState<boolean>(false);
  const [actionSpinning, setActionSpinning] = useState<boolean>(false);
  const [showStakingModal, setShowStakingModal] = useState<boolean>(false);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const { activate, balanceOf, allowanceOf, harvest } = useCasperWeb3Provider();
  const [currentStatus, setCurrentStatus] = useState<ActionStatus>(
    ActionStatus.REQ_CONNECT_WALLET
  );

  const handleFetchBalance = useCallback(async () => {
    if (!isConnected) {
      setBalance(BigNumber.from(0));
      setAllowance(BigNumber.from(0));
      return;
    }
    setBalance(BigNumber.from(await balanceOf(farm.lpToken.contractHash)));
    setAllowance(
      BigNumber.from(
        await allowanceOf(
          farm.lpToken.contractHash,
          MASTER_CHEF_CONTRACT_PACKAGE_HASH
        )
      )
    );
  }, [activeAddress, farm]);

  useEffect(() => {
    setFetching(true);
    handleFetchBalance();
    setFetching(false);
  }, [activeAddress]);

  useEffect(() => {
    handleFetchBalance();
  }, [isPending, isChildPending]);

  useEffect(() => {
    setState(isPending);
  }, [isPending]);

  useEffect(() => {
    setState(isChildPending);
  }, [isChildPending]);

  useEffect(() => {
    if (!isConnected) setCurrentStatus(ActionStatus.REQ_CONNECT_WALLET);
    else if (isFetching) setCurrentStatus(ActionStatus.LOADING);
    // else if (isPending) setCurrentStatus(ActionStatus.PENDING);
    else if (balance.add(userInfo.amount).eq(0)) {
      setCurrentStatus(ActionStatus.INSUFFICIENT_LIQUIDITY_AMOUNT);
    } else setCurrentStatus(ActionStatus.REQ_EXECUTE_ACTION);
  }, [isConnected, balance, isFetching, allowance, isPending]);

  useEffect(() => {
    if (BigNumber.from(userInfo.pendingCake).eq(0) || !isConnected)
      setHarvestDisabled(true);
    else setHarvestDisabled(false);
  }, [userInfo]);

  useEffect(() => {
    switch (currentStatus) {
      case ActionStatus.REQ_CONNECT_WALLET:
        setActionText("Connect Wallet");
        setActionDisabled(false);
        setActionSpinning(false);
        break;
      case ActionStatus.LOADING:
        setActionText("Loading");
        setActionDisabled(false);
        setActionSpinning(true);
        break;
      case ActionStatus.PENDING:
        setActionText("Pending");
        setActionDisabled(false);
        setActionSpinning(true);
        break;
      case ActionStatus.INSUFFICIENT_LIQUIDITY_AMOUNT:
        setActionText("Insufficient Balance");
        setActionDisabled(true);
        setActionSpinning(false);
        break;
      case ActionStatus.REQ_EXECUTE_ACTION:
        setActionText("Stake");
        setActionDisabled(false);
        setActionSpinning(false);
    }
  }, [currentStatus]);

  const handleHarvest = () => {
    if (!harvestDisabled && !isPending) {
      harvest(farm, setPending);
    }
  };

  const handleAction = () => {
    if (currentStatus === ActionStatus.REQ_CONNECT_WALLET)
      setShowConnectModal(true);
    else if (currentStatus === ActionStatus.REQ_EXECUTE_ACTION)
      setShowStakingModal(true);
  };
  return (
    <div
      className={`col-span-12 justify-center items-center ${
        index === count - 1 && index % 2 === 0
          ? "lg:col-start-4 lg:col-end-9 lg:px-10"
          : index % 2 === 0
          ? "lg:col-start-2 lg:col-end-6"
          : "lg:col-start-7 lg:col-end-11"
      }`}
    >
      <div className="border border-neutral bg-success py-[20px] md:py-[25px] px-[15px] md:px-[35px] my-[15px] lg:my-[30px]">
        <div className="mb-5">
          <PairDetail tokens={farm.lpToken.tokens} balance={200} />
        </div>
        <div className="mb-5">
          <p className="flex justify-between text-neutral text-[15px]">
            <span>LIQUIDITY</span>
            <span>
              {Number(
                amountWithoutDecimals(
                  BigNumber.from(farm.liquidity),
                  farm.lpToken.decimals
                ).toFixed(5)
              )}
            </span>
          </p>
          <p className="flex justify-between text-neutral text-[15px]">
            <span>SWPR EARNED</span>
            <span>
              {Number(
                amountWithoutDecimals(
                  BigNumber.from(userInfo.pendingCake),
                  testnetTokens.SWPR.decimals
                ).toFixed(5)
              )}
            </span>
          </p>
          <p className="flex justify-between text-neutral text-[15px]">
            <span>
              {farm.lpToken.tokens.length === 2
                ? farm.lpToken.tokens[0].symbol +
                  "-" +
                  farm.lpToken.tokens[1].symbol +
                  " LP"
                : "SWPR"}{" "}
              STAKED
            </span>
            <span>
              {Number(
                amountWithoutDecimals(
                  BigNumber.from(userInfo.amount),
                  farm.lpToken.decimals
                ).toFixed(5)
              )}
            </span>
          </p>
        </div>
        <ActionButton
          text={isPending ? "Pending" : "Harvest"}
          isDisabled={harvestDisabled}
          isSpinning={isPending}
          handleClick={handleHarvest}
        />
        <ActionButton
          text={actionText}
          isDisabled={actionDisabled}
          isSpinning={actionSpinning}
          handleClick={handleAction}
        />
      </div>
      <StakingModal
        show={showStakingModal}
        setShow={setShowStakingModal}
        balance={balance.add(userInfo.amount)}
        allowance={allowance}
        currentAmount={BigNumber.from(userInfo.amount)}
        decimals={farm.lpToken.decimals}
        farm={farm}
        setState={setChildPending}
      ></StakingModal>
      <ConnectModal
        show={showConnectModal}
        setShow={setShowConnectModal}
        handleConnect={activate}
      ></ConnectModal>
    </div>
  );
}
