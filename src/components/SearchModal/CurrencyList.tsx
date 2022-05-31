import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from "react";
import { Currency } from "../../config/sdk/currency";
import { Token, currencyEquals } from "../../config/sdk/token";
import { Text } from "@swappery/uikit";
import styled from "styled-components";
import { FixedSizeList } from "react-window";
import Column from "../Layout/Column";
import { RowBetween } from "../Layout/Row";
import CurrencyLogo from "../Logo/CurrencyLogo";

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : "";
}

const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 8px;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  :hover {
    background-color: ${({ theme, disabled }) =>
      !disabled && theme.colors.background};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const key = currencyKey(currency);

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}>
      <CurrencyLogo currency={currency} size='24px' />
      <Column>
        <Text bold>{currency.symbol}</Text>
        <Text color='textSubtle' small ellipsis maxWidth='200px'>
          {currency.name}
        </Text>
      </Column>
    </MenuItem>
  );
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  breakIndex,
}: {
  height: number;
  currencies: Currency[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showETH: boolean;
  breakIndex: number | undefined;
}) {
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH
      ? [Currency.ETHER, ...currencies]
      : currencies;
    if (breakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, breakIndex),
        undefined,
        ...formatted.slice(breakIndex, formatted.length),
      ];
    }
    return formatted;
  }, [breakIndex, currencies, showETH]);

  const Row = useCallback(
    ({
      data,
      index,
      style,
    }: {
      data: (Currency | undefined)[];
      index: number;
      style: React.CSSProperties;
    }) => {
      const currency: Currency = data[index]!;
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      );
      const handleSelect = () => onCurrencySelect(currency);

      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      );
    },
    [onCurrencySelect, otherCurrency, selectedCurrency, breakIndex]
  );

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data[index]),
    []
  );

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width='100%'
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}>
      {Row}
    </FixedSizeList>
  );
}
