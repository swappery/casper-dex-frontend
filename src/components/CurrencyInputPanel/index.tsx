import React from "react";
import { Currency } from "../../config/sdk/currency";
import { Button, ChevronDownIcon, useModal, Flex, Box } from "@swappery/uikit";
import styled from "styled-components";
import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
import CurrencyLogo from "../Logo/CurrencyLogo";

import { Input as NumericalInput } from "./NumericalInput";

const CurrencySelectButton = styled(Button).attrs({
  variant: "text",
  scale: "sm",
})`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`;
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 40px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1;
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row nowrap;
  gap: 16px;
  padding: 0.5rem 1rem;
  background: transparent;
  ${({ theme }) => theme.mediaQueries.md} {
    gap: 48px;
  }
`;

const TokenSymbolContainer = styled(Flex)`
  flex-direction: row;
  gap: 12px;
  background: ${({ theme }) => theme.colors.cyan};
  border-radius: 2rem;
  padding: 4px 8px 4px 8px;
  margin: 4px 2px 4px 2px;
  font-family: "Orator-Std";
  font-weight: 400;
  font-size: 19px;
`;

const TokenSymbol = styled.div`
  font-family: "Orator-Std";
  font-size: 19px;
  color: black;
`;

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) =>
    selected ? "0.75rem 0.5rem 0.75rem 1rem" : "0.75rem 0.75rem 0.75rem 1rem"};
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onCurrencySelect: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />
  );
  return (
    <Box id={id}>
      <InputPanel>
        <Container>
          <NumericalInput
            className='token-amount-input'
            value={value}
            onUserInput={(val) => {
              onUserInput(val);
            }}
          />

          <Flex alignItems='center'>
            <CurrencySelectButton
              className='open-currency-select-button'
              selected={!!currency}
              onClick={() => {
                if (!disableCurrencySelect) {
                  onPresentCurrencyModal();
                }
              }}>
              <Flex alignItems='center'>
                <TokenSymbolContainer>
                  <TokenSymbol id='pair'>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(
                          0,
                          4
                        )}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )}`
                      : currency?.symbol) || "Select a currency"}
                  </TokenSymbol>
                  {!disableCurrencySelect && <ChevronDownIcon color='black' />}
                </TokenSymbolContainer>

                {currency ? (
                  <CurrencyLogo
                    currency={currency}
                    size='24px'
                    style={{ marginRight: "8px" }}
                  />
                ) : null}
              </Flex>
            </CurrencySelectButton>
          </Flex>
        </Container>
      </InputPanel>
    </Box>
  );
}
