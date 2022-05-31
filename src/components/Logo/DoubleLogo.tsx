import { Currency } from "../../config/dist/currency";
import React from "react";
import styled from "styled-components";
import Circle from "../Circle";
import CurrencyLogo from "./CurrencyLogo";

const Wrapper = styled.div<{ margin: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-right: ${({ margin }) => margin && "4px"};
`;

interface DoubleCurrencyLogoProps {
  margin?: boolean;
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 20,
  margin = false,
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper margin={margin}>
      {currency0 && (
        <CurrencyLogo currency={currency0} size={`${size.toString()}px`} />
      )}
      <Circle size='20px' />
      {currency1 && (
        <CurrencyLogo currency={currency1} size={`${size.toString()}px`} />
      )}
    </Wrapper>
  );
}
