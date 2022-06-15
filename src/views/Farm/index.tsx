import { Themes } from "../../config/constants/themes";
import useSetting from "../../store/useSetting";
import StakingBox from "./components/StakingBox";
import logo from "../../assets/images/farm/farm-logo-huge.png";
import logoWhite from "../../assets/images/farm/farm-logo-white-huge.png";

export default function Farm() {
  const { theme } = useSetting();

  return (
    <div className="bg-accent overflow-hidden page-wrapper font-orator-std">
      <div className="relative pt-[80px] xl:pt-[143px]">
        <img
          src={theme === Themes.LIGHT ? logo : logoWhite}
          className="animate-slide absolute h-[65px] top-0 xl:h-[147px] mt-[27px]"
          alt="Swappery Logo"
        />
        <p className="text-center bg-lightblue text-[18px] xl:text-[48px] font-medium py-[40px] xl:py-[75px] text-black">
          Stake LP Tokens To Earn
        </p>
      </div>
      <div className="2xl:container 2xl:mx-auto py-[30px] xl:py-[80px] px-[20px] md:px-[80px] lg:px-0">
        <div className="grid grid-cols-11">
          <div className="col-span-12 lg:col-start-2 lg:col-end-6">
            <StakingBox />
          </div>

          <div className="col-span-12 lg:col-start-7 lg:col-end-11">
            <StakingBox />
          </div>

          <div className="col-span-12 lg:col-start-2 lg:col-end-6">
            <StakingBox />
          </div>

          <div className="col-span-12 lg:col-start-7 lg:col-end-11">
            <StakingBox />
          </div>
        </div>
      </div>
    </div>
  );
}
