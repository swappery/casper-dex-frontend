import React, { ReactElement } from "react";
import styled from "styled-components";

const StyledCircle = styled.div<{ size: string | undefined }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: ${(props) => props.size};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Circle({
  size,
  children,
}: {
  size?: string;
  children?: ReactElement;
}) {
  return <StyledCircle size={size}>{children}</StyledCircle>;
}

Circle.defaultProps = {
  size: "30px",
};

export default Circle;
