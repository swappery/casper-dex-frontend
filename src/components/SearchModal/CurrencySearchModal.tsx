import { InputField } from "../../config/interface/inputField";
import { Token } from "../../config/interface/token";
import SearchInput from "../SearchInput/SearchInput";

interface CurrencySearchModalProps {
  modalId: string;
  selectedCurrency?: Token;
  otherSelectedCurrency?: Token;
  field: InputField;
  showCommonBases?: boolean;
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function CurrencySearchModal({
  modalId,
  selectedCurrency,
  otherSelectedCurrency,
  field,
  showCommonBases = false,
  show,
  setShow,
}: CurrencySearchModalProps) {
  return (
    <>
      <input
        type="checkbox"
        id={modalId}
        className="modal-toggle"
        checked={show}
        readOnly
      />
      <div className="modal">
        <div className="modal-box bg-success rounded-none p-0 relative">
          <div className="flex justify-between items-center text-neutral p-6 border-b border-neutral">
            <p className="font-orator-std text-[24px]">Select a Token</p>
            <label
              onClick={() => {
                setShow(false);
              }}
              className="cursor-pointer hover:opacity-70"
            >
              ✕
            </label>
          </div>

          <div className="py-7">
            <SearchInput
              selectedCurrency={selectedCurrency}
              otherSelectedCurrency={otherSelectedCurrency}
              field={field}
              handleHideModal={() => {
                setShow(false);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
