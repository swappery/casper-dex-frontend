import { Currency } from "../../config/dist/currency";
import { Token } from "../../config/dist/token";
import React, { useMemo } from "react";
import styled from "styled-components";
import getTokenLogoURL from "../../utils/getTokenLogoURL";
import Logo from "./Logo";

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const getTestTokenLogoURL = (address: string) =>
  `/images/tokens/${address}.png`;

export default function CurrencyLogo({
  currency,
  size = "24px",
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const srcs: string[] = useMemo(() => {
    if (currency instanceof Token) {
      return [
        getTestTokenLogoURL(currency.address),
        getTokenLogoURL(currency.address),
      ];
    }
    return [];
  }, [currency]);

  return (
    <StyledLogo
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
    />
  );
}
