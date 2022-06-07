export default function Chevron({ fill = "black" }: { fill?: string }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.47057 8.29389H3.40486L0.143188 0.0283203H2.64379L4.49208 5.4662L6.34034 0.0283203H8.73224L5.47057 8.29389Z"
        fill={fill}
      />
    </svg>
  );
}
