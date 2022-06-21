import { Themes } from "../../config/constants/themes";
import useSetting from "../../store/useSetting";
import StakingBox from "./components/StakingBox";
import logo from "../../assets/images/farm/farm-logo-huge.png";
import logoWhite from "../../assets/images/farm/farm-logo-white-huge.png";
import useMasterChefStatus from "../../store/useMasterChef";
import useNetworkStatus from "../../store/useNetworkStatus";
import { useEffect } from "react";
import useCasperWeb3Provider from "../../web3";
import { CLPublicKey } from "casper-js-sdk";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SkeletonBox from "../../components/SkeletonBox";

export default function Farm() {
  const { getFarmList, getUserInfo } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();
  const { theme } = useSetting();

  const {
    farmList,
    userData,
    isFetching,
    setFarmList,
    setUserData,
    setFetching,
  } = useMasterChefStatus();

  useEffect(() => {
    async function handleUpdateFarms() {
      if (!isConnected) return;
      setFetching(true);
      let farmList = await getFarmList();
      console.log(farmList);
      setFarmList(farmList);
      let userInfo = await getUserInfo(
        CLPublicKey.fromHex(activeAddress),
        farmList
      );
      setUserData(userInfo);
      setFetching(false);
    }
    handleUpdateFarms();
  }, [activeAddress]);

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
          {isFetching && (
            <>
              <div className={"col-span-12 lg:col-start-2 lg:col-end-6"}>
                <SkeletonBox />
              </div>
              <div className={"col-span-12 lg:col-start-7 lg:col-end-11"}>
                <SkeletonBox />
              </div>
            </>
          )}
          {!isFetching &&
            farmList.map((farm, index) => {
              return (
                <StakingBox
                  farm={farmList[index]}
                  userInfo={userData[index]}
                  index={index}
                  key={index}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
