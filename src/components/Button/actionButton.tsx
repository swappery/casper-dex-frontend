import Spinner from "../../assets/images/spinner/swappery-loading_64px.gif";

interface ActionButtonProps {
  text: string;
  isDisabled: boolean;
  isSpinning: boolean;
  handleClick: () => void;
}

const ActionButton = ({
  text,
  isDisabled,
  isSpinning,
  handleClick,
}: ActionButtonProps) => {
  return (
    <button
      className="hover:opacity-80 mt-4 bg-lightgreen border border-black rounded-3xl px-4 py-[6.5px] w-full text-[14px] md:text-[18px] text-black font-orator-std disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={isDisabled}
    >
      {isSpinning ? (
        <div className="inline-flex items-center">
          <img src={Spinner} className="w-6 h-6" alt="" />
          {text}
        </div>
      ) : (
        <>{text}</>
      )}
    </button>
  );
};
export default ActionButton;
