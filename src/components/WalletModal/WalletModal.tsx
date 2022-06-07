interface WalletModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function WalletModal({ show, setShow }: WalletModalProps) {
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
          <div className="py-7"></div>
        </div>
      </div>
    </>
  );
}
