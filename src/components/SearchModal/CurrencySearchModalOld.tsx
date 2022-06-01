import SearchInput from "../SearchInput/SearchInput";

interface CurrencySearchModalProps {
  modalId: string;
  selectedCurrency?: string | null;
  otherSelectedCurrency?: string | null;
  isSourceSelect: boolean;
  showCommonBases?: boolean;
}

export default function CurrencySearchModal({
  modalId,
  selectedCurrency,
  otherSelectedCurrency,
  isSourceSelect,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-success rounded-none p-0 relative">
          <div className="flex justify-between items-center text-neutral p-6 border-b border-neutral">
            <p className="font-orator-std text-[24px]">Select a Token</p>
            <label
              htmlFor={modalId}
              className="cursor-pointer hover:opacity-70"
            >
              ✕
            </label>
          </div>

          <div className="py-7">
            <SearchInput
              modalId={modalId}
              selectedCurrency={selectedCurrency}
              otherSelectedCurrency={otherSelectedCurrency}
              isSourceSelect={isSourceSelect}
            />
          </div>
        </div>
      </div>
    </>
  );
}
