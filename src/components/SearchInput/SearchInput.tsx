import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { supportedTokens, TokenContext } from "../../store/useLiquidityStatus";

interface SearchInputProps {
  modalId: string;
  selectedCurrency?: string | null;
  otherSelectedCurrency?: string | null;
  isSourceSelect: boolean;
}

const SearchInput = ({
  modalId,
  selectedCurrency,
  otherSelectedCurrency,
  isSourceSelect,
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    TokenContext[] | undefined
  >();
  const [, setSearchParams] = useSearchParams();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleSelect = (item: TokenContext) => {
    if (isSourceSelect) {
      if (otherSelectedCurrency === item.contractHash) {
        if (selectedCurrency)
          setSearchParams({
            inputCurrency: otherSelectedCurrency,
            outputCurrency: selectedCurrency,
          });
        else
          setSearchParams({
            inputCurrency: otherSelectedCurrency,
          });
      } else
        setSearchParams({
          inputCurrency: item.contractHash,
          outputCurrency: otherSelectedCurrency!,
        });
    } else {
      if (otherSelectedCurrency === item.contractHash) {
        if (selectedCurrency)
          setSearchParams({
            inputCurrency: selectedCurrency,
            outputCurrency: otherSelectedCurrency,
          });
        else
          setSearchParams({
            outputCurrency: otherSelectedCurrency,
          });
      } else
        setSearchParams({
          outputCurrency: item.contractHash,
          inputCurrency: otherSelectedCurrency!,
        });
    }
  };

  useEffect(() => {
    const results = supportedTokens
      .slice(0, supportedTokens.length - 1)
      .filter((token) =>
        (token.symbol + token.name + token.contractHash)
          .toLowerCase()
          .includes(searchTerm)
      );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <>
      <div className="px-6">
        <input
          className="font-orator-std focus:outline-none w-full py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[20px] text-black border border-neutral"
          placeholder="Search name or paste address"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2 mt-6">
        {searchResults?.map((item) => (
          <label
            key={item.symbol}
            className="py-1 px-6 flex items-center gap-1 hover:bg-accent cursor-pointer"
            htmlFor={modalId}
            onClick={() => {
              handleSelect(item);
            }}
          >
            <img src={item.tokenSvg} className="w-9 h-9" alt="Token" />
            <div className="font-orator-std">
              <p className="text-[18px] text-neutral">{item.symbol}</p>
              <p className="text-[14px]">{item.name}</p>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};

export default SearchInput;
