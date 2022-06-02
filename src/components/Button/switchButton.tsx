interface SwitchButtonProps {
  handleClick: () => void;
  isDisabled: boolean;
}

export default function SwitchButton({
  handleClick,
  isDisabled,
}: SwitchButtonProps) {
  return (
    <button
      className="hover:opacity-80 disabled:opacity-50"
      onClick={handleClick}
      disabled={isDisabled}
    >
      <svg
        width="38"
        height="39"
        viewBox="0 0 38 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.0544 37.6475C29.082 37.6475 37.2109 29.5159 37.2109 19.485C37.2109 9.45414 29.082 1.32251 19.0544 1.32251C9.0268 1.32251 0.897827 9.45414 0.897827 19.485C0.897827 29.5159 9.0268 37.6475 19.0544 37.6475Z"
          fill="#E1F7D7"
          stroke="black"
          strokeMiterlimit="10"
        />
        <path
          d="M20.0329 23.6179H17.9672L14.7055 15.3523H17.2061L19.0544 20.7902L20.9027 15.3523H23.2946L20.0329 23.6179Z"
          fill="black"
        />
      </svg>
    </button>
  );
}
