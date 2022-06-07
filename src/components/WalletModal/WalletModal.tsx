/* eslint-disable react/jsx-no-target-blank */
import { Themes } from "../../config/constants/themes";
import Escape from "../Icon/Escape";

interface WalletModalProps {
  theme: string;
  activeAddress: string;
  show: boolean;
  csprBalance: number;
  swprBalance: number;
  setShow: (show: boolean) => void;
  handleDisconnect: () => void;
}

export default function WalletModal({
  theme = Themes.LIGHT,
  activeAddress,
  show,
  csprBalance,
  swprBalance,
  setShow,
  handleDisconnect,
}: WalletModalProps) {
  setShow(!!activeAddress && activeAddress !== "" && show);
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
        <div className="modal-box bg-success rounded-none p-0 relative">
          <div className="flex justify-between items-center text-neutral p-6 border-b border-neutral">
            <p className="font-orator-std text-[24px]">Your Wallet</p>
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
            <div className="flex justify-start font-orator-std gap-2 mb-2">
              <span className="text-[14px] lg:text-[18px] text-neutral ">
                your address
              </span>
            </div>
            <input
              className="font-orator-std focus:outline-none w-full py-[6px] px-3 md:py-2 md:px-5 bg-primary rounded-[15px] text-[14px] md:text-[20px] text-neutral mb-2"
              value={activeAddress}
            />
            <div className="flex justify-between font-orator-std gap-2">
              <span className="text-[16px] lg:text-[20px] text-neutral ">
                CSPR Balance
              </span>
              <span className="text-[16px] lg:text-[20px] text-neutral ">
                {csprBalance.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between font-orator-std gap-2 mb-2">
              <span className="text-[16px] lg:text-[20px] text-neutral ">
                SWPR Balance
              </span>
              <span className="text-[16px] lg:text-[20px] text-neutral ">
                {swprBalance.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-end text-[16px] lg:text-[20px] mb-2 text-neutral font-orator-std gap-2">
              <a
                href={`https://testnet.cspr.live/account/${activeAddress}`}
                target="_blank"
              >
                <span> View on CsprLive</span>
              </a>
              <Escape fill={theme === Themes.DARK ? "lightyellow" : "black"} />
            </div>
            <div className="flex justify-center">
              <button
                className="hover:opacity-80 mt-4 bg-success border border-neutral rounded-3xl px-4 py-[6.5px] w-full text-[14px] md:text-[18px] text-neutral font-orator-std"
                onClick={() => {
                  handleDisconnect();
                  setShow(false);
                }}
              >
                Disonnect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
