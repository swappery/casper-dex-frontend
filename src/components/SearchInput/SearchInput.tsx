/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
  KeyboardEvent,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { SUPPORTED_TOKENS } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import { Token } from "../../config/interface/token";
import { filterTokens } from "../SearchModal/filtering";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allTokens = SUPPORTED_TOKENS[ChainName.TESTNET];

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), searchQuery);
  }, [allTokens, searchQuery]);

  const [, setSearchParams] = useSearchParams();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (filteredTokens.length > 0) {
          if (filteredTokens.length === 1) {
            handleCurrencySelect(filteredTokens[0]);
          }
        }
      }
    },
    [filteredTokens]
  );
  const handleCurrencySelect = (item: Token) => {
    if (isSourceSelect) {
      if (otherSelectedCurrency === item.address) {
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
          inputCurrency: item.address,
          outputCurrency: otherSelectedCurrency!,
        });
    } else {
      if (otherSelectedCurrency === item.address) {
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
          outputCurrency: item.address,
          inputCurrency: otherSelectedCurrency!,
        });
    }
  };

  return (
    <>
      <div className="px-6">
        <input
          className="font-orator-std focus:outline-none w-full py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[20px] text-black border border-neutral"
          placeholder="Search name or paste address"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
      </div>
      <div className="grid gap-2 mt-6">
        {filteredTokens?.map((item) => (
          <label
            key={item.symbol}
            className="py-1 px-6 flex items-center gap-1 hover:bg-accent cursor-pointer"
            htmlFor={modalId}
            onClick={() => {
              handleCurrencySelect(item);
            }}
          >
            <img src={item.logo} className="w-9 h-9" alt="Token" />
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
