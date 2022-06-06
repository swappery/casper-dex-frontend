interface HelperProps {
  text: string;
  size?: string;
}

const QuestionHelper = ({ text, size = "16px" }: HelperProps) => {
  return (
    <div className="tooltip px-1" data-tip={text}>
      <button
        className={`w-[16px] h-[16px] border border-neutral text-neutral rounded-[50%] leading-[14px]`}
      >
        ?
      </button>
    </div>
  );
};

export default QuestionHelper;
