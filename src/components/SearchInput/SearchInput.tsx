/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  ChangeEvent,
  useMemo,
  KeyboardEvent,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { SUPPORTED_TOKENS } from "../../config/constants";
import { ChainName } from "../../config/constants/chainName";
import { InputField } from "../../config/interface/inputField";
import { Token } from "../../config/interface/token";
import { filterTokens } from "../SearchModal/filtering";

interface SearchInputProps {
  modalId: string;
  selectedCurrency?: Token;
  otherSelectedCurrency?: Token;
  field: InputField;
}

const SearchInput = ({
  modalId,
  selectedCurrency,
  otherSelectedCurrency,
  field,
}: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allTokens = SUPPORTED_TOKENS[ChainName.TESTNET];

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(allTokens, searchQuery);
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
            // handleCurrencySelect(filteredTokens[0]);
          }
        }
      }
    },
    [filteredTokens]
  );
  const handleCurrencySelect = (item: Token) => {
    if (field === InputField.INPUT_A) {
      if (otherSelectedCurrency === item) {
        if (selectedCurrency)
          setSearchParams({
            input: otherSelectedCurrency.address,
            output: selectedCurrency.address,
          });
        else
          setSearchParams({
            input: otherSelectedCurrency.address,
          });
      } else {
        if (otherSelectedCurrency)
          setSearchParams({
            input: item.address,
            output: otherSelectedCurrency.address,
          });
        else
          setSearchParams({
            input: item.address,
          });
      }
    } else {
      if (otherSelectedCurrency === item) {
        if (selectedCurrency)
          setSearchParams({
            input: selectedCurrency.address,
            output: otherSelectedCurrency.address,
          });
        else
          setSearchParams({
            output: otherSelectedCurrency.address,
          });
      } else {
        if (otherSelectedCurrency)
          setSearchParams({
            input: otherSelectedCurrency.address,
            output: item.address,
          });
        else
          setSearchParams({
            output: item.address,
          });
      }
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
