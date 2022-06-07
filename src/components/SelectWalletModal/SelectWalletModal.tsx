/* eslint-disable react/jsx-no-target-blank */
import { Themes } from "../../config/constants/themes";
import { testnetTokens } from "../../config/constants/tokens";
import Escape from "../Icon/Escape";

interface ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  handleConnect: () => void;
}

export default function ConnectModal({
  show,
  setShow,
  handleConnect,
}: ModalProps) {
  return (
    <>
      <input
        type="checkbox"
        id={"connect-wallet-modal"}
        className="modal-toggle"
        checked={show}
        readOnly
      />
      <div className="modal">
        <div className="modal-box bg-success rounded-none p-0 relative">
          <div className="flex justify-between items-center text-neutral p-6 border-b border-neutral">
            <p className="font-orator-std text-[24px]">Connect Wallet</p>
            <label
              onClick={() => {
                setShow(false);
              }}
              className="cursor-pointer hover:opacity-70"
            >
              ✕
            </label>
          </div>
          <div className="p-7">
            <div
              className="flex justify-center font-orator-std gap-2 mb-2 hover:opacity-75 hover:cursor-pointer"
              onClick={() => {
                handleConnect();
                setShow(false);
              }}
            >
              <div className="flex flex-col justify-between items-center">
                <img
                  src={testnetTokens.CSPR.logo}
                  className="w-[50px] h-[50px] md:w-[70px] md:h-[70px]"
                  alt="Casper Signer"
                />
                <span className="text-[16px] lg:text-[20px] text-neutral ">
                  Casper Signer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
