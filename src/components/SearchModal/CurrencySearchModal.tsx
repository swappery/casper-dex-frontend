import React, { useCallback, useState } from "react";
import { Currency } from "../../config/dist/currency";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
} from "@swappery/uikit";
import styled from "styled-components";
import CurrencySearch from "./CurrencySearch";

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`;

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss();
      onCurrencySelect(currency);
    },
    [onDismiss, onCurrencySelect]
  );

  return (
    <StyledModalContainer minWidth='320px'>
      <ModalHeader>
        <ModalTitle>
          <Heading>Select a Token</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <CurrencySearch
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
        />
      </StyledModalBody>
    </StyledModalContainer>
  );
}
