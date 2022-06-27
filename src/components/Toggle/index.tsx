interface ToggleProps {
  checked: boolean;
  setChecked: (show: boolean) => void;
}
export default function StakedToggle({ checked, setChecked }: ToggleProps) {
  return (
    <div className="form-control flex justify-start items-start pt-1">
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          className="toggle bg-darkgreen border-darkgreen"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(!checked);
          }}
        />
        <span className="label-text text-[14px] md:text-[20px] text-neutral">
          Staked Only
        </span>
      </label>
    </div>
  );
}
