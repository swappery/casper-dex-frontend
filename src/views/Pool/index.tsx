import { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import ConnectModal from "../../components/SelectWalletModal/SelectWalletModal";
import { ActionType } from "../../config/interface/actionType";
import useAction from "../../store/useAction";
import useNetworkStatus from "../../store/useNetworkStatus";
import useWalletStatus, { AccountList } from "../../store/useWalletStatus";
import { deserialize } from "../../utils/utils";
import useCasperWeb3Provider from "../../web3";
import LPTokenDetail from "./components/LPTokenDetail";

export default function Liquidity() {
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const { activate } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();
  const { accountListString } = useWalletStatus();
  const navigate = useNavigate();
  const { actionType, setActionType } = useAction();

  const accountList: AccountList = deserialize(accountListString);
  const poolMap = accountList.get(activeAddress)?.poolList;
  if (actionType !== ActionType.VIEW_LIQUIDITY)
    setActionType(ActionType.VIEW_LIQUIDITY);

  return (
    <div className="flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0">
      <div className="container mx-auto grid grid-cols-12">
        <div className="col-span-12 md:col-start-2 md:col-end-12 lg:col-start-3 lg:col-end-11 xl:col-start-4 xl:col-end-10 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-6 md:pb-7">
          <p className="text-[35px] md:text-[43px] leading-[43px] text-neutral">
            your liquidity
          </p>
          <p className="text-[16px] sm:text-[20px] md:text-[22px] text-neutral mt-3">
            remove liquidity to receive tokens back
          </p>

          {isConnected ? (
            <>
              {poolMap &&
                Array.from(poolMap.values()!).map((pool) => {
                  return (
                    <LPTokenDetail
                      isManage={true}
                      poolInfo={pool}
                      key={pool.contractPackageHash}
                    />
                  );
                })}

              <div className="grid justify-items-center w-full">
                <p className="w-full bg-lightred px-2 py-2 text-[18px] leading-[24px] md:leading-[30px] text-black border border-black mt-4 md:mt-6">
                  {poolMap && Array.from(poolMap.values()!).length > 0 ? (
                    <>Don’t see a Pool You Joined?</>
                  ) : (
                    <>No Liquidity Found! Don’t see a Pool You Joined?</>
                  )}
                </p>
                <div className="border border-neutral rounded-[50%] w-9 h-9"></div>
                <button
                  className="hover:opacity-80 w-full text-black text-[18px] md:text-[22px] leading-[34px] rounded-3xl bg-lightgreen border border-black py-1.5 px-2 md:px-5 mb-4 md:mb-6"
                  onClick={(
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    event.preventDefault();
                    navigate({
                      pathname: "/find",
                      search: createSearchParams({}).toString(),
                    });
                  }}
                >
                  Find Other LP Tokens
                </button>
              </div>
            </>
          ) : (
            <button
              className="hover:opacity-80 mt-20 mb-4 md:my-16 text-black text-[14px] md:text-[15px] leading-[34px] rounded-3xl bg-lightgreen border border-black py-1.5 px-2 md:px-5"
              onClick={() => setShowConnectModal(true)}
            >
              CONNECT WALLET TO VIEW LIQUIDITY
            </button>
          )}
          <button
            className="hover:opacity-80 w-full text-black text-[18px] md:text-[22px] leading-[34px] rounded-3xl bg-lightgreen border border-black py-1.5 px-2 md:px-5 mb-4 md:mb-6"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              navigate({
                pathname: "/add",
                search: createSearchParams({}).toString(),
              });
            }}
          >
            + ADD LIQUIDITY
          </button>
        </div>
      </div>
      <ConnectModal
        show={showConnectModal}
        setShow={setShowConnectModal}
        handleConnect={activate}
      ></ConnectModal>
    </div>
  );
}
