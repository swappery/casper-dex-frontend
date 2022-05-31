import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Currency } from "../../config/sdk/currency";
import { ChainName } from "../../config/constants/types";
import { Token } from "../../config/sdk/token";
import { Text, Input, Box } from "@swappery/uikit";
import { FixedSizeList } from "react-window";
// import { isAddress } from "../../utils";
import Column, { AutoColumn } from "../Layout/Column";
import Row from "../Layout/Row";
// import CommonBases from './CommonBases'
import { SUGGESTED_BASES } from "../../config/constants";
import CurrencyList from "./CurrencyList";
import { filterTokens } from "./filtering";

interface CurrencySearchProps {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
}

function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
}: CurrencySearchProps) {
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const allTokens = SUGGESTED_BASES[ChainName.TESTNET];

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), searchQuery);
  }, [allTokens, searchQuery]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
    },
    [onCurrencySelect]
  );

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  const handleInput = useCallback((event: any) => {
    const input = event.target.value;
    // const checksummedInput = isAddress(input);
    setSearchQuery(input);
    fixedList.current?.scrollTo(0);
  }, []);

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
    [filteredTokens, handleCurrencySelect]
  );

  return (
    <>
      <div>
        <AutoColumn gap='16px'>
          <Row>
            <Input
              id='token-search-input'
              placeholder={"Search name or paste address"}
              scale='lg'
              autoComplete='off'
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </Row>
          {/* {showCommonBases && (
            <CommonBases
              chainId={chainId}
              onSelect={handleCurrencySelect}
              selectedCurrency={selectedCurrency}
            />
          )} */}
        </AutoColumn>
        {filteredTokens?.length > 0 ? (
          <Box margin='24px -24px'>
            <CurrencyList
              height={390}
              showETH={false}
              currencies={filteredTokens}
              breakIndex={filteredTokens.length || undefined}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          </Box>
        ) : (
          <Column style={{ padding: "20px", height: "100%" }}>
            <Text color='textSubtle' textAlign='center' mb='20px'>
              No results found.
            </Text>
          </Column>
        )}
      </div>
    </>
  );
}

export default CurrencySearch;
