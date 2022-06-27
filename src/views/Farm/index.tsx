/* eslint-disable react-hooks/exhaustive-deps */
import { Themes } from "../../config/constants/themes";
import useSetting from "../../store/useSetting";
import StakingBox from "./components/StakingBox";
import logo from "../../assets/images/farm/farm-logo-huge.png";
import logoWhite from "../../assets/images/farm/farm-logo-white-huge.png";
import useMasterChefStatus, { FarmUserInfo } from "../../store/useMasterChef";
import useNetworkStatus from "../../store/useNetworkStatus";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import useCasperWeb3Provider from "../../web3";
import { CLPublicKey } from "casper-js-sdk";
import SkeletonBox from "../../components/SkeletonBox";
import { BigNumber } from "ethers";
import { filterFarms } from "./filtering";

export default function Farm() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, setPending] = useState<boolean>(false);
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

  const handleUpdateFarms = useCallback(async () => {
    let farmList = await getFarmList();
    setFarmList(farmList);
    if (isConnected) {
      let userInfo = await getUserInfo(
        CLPublicKey.fromHex(activeAddress),
        farmList
      );
      setUserData(userInfo);
    } else {
      let userData: FarmUserInfo[] = [];
      farmList.forEach((element) => {
        userData.push({
          amount: BigNumber.from(0),
          pendingCake: BigNumber.from(0),
          rewardDebt: BigNumber.from(0),
        });
      });
      setUserData(userData);
    }
  }, [activeAddress, isConnected]);

  useEffect(() => {
    async function handleFetch() {
      if (farmList.length === 0) setFetching(true);
      await handleUpdateFarms();
      setFetching(false);
    }
    handleFetch();
  }, [activeAddress]);

  useEffect(() => {
    async function handleFetch() {
      if (!isConnected) return;
      await handleUpdateFarms();
    }
    handleFetch();
  }, [isPending]);

  const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const { filteredFarms, filteredUsers } = useMemo(() => {
    return filterFarms(farmList, userData, searchQuery);
  }, [farmList, userData, searchQuery]);

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
          <div className="col-span-12 lg:col-start-8 lg:col-end-11">
            <input
              className="font-orator-std focus:outline-none w-full py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[20px] text-black border border-neutral"
              placeholder="Search Farm"
              value={searchQuery}
              onChange={handleChangeQuery}
            />
          </div>
        </div>
        <div className="grid grid-cols-11">
          {isFetching ? (
            <>
              <div className={"col-span-12 lg:col-start-2 lg:col-end-6"}>
                <SkeletonBox />
              </div>
              <div className={"col-span-12 lg:col-start-7 lg:col-end-11"}>
                <SkeletonBox />
              </div>
              <div className={"col-span-12 lg:col-start-2 lg:col-end-6"}>
                <SkeletonBox />
              </div>
              <div className={"col-span-12 lg:col-start-7 lg:col-end-11"}>
                <SkeletonBox />
              </div>
            </>
          ) : filteredUsers.length === 0 ? (
            <div className={"col-span-12 lg:col-start-2 lg:col-end-11"}>
              <p className="text-center text-[24px] xl:text-[60px] font-bold py-[40px] xl:py-[75px] text-neutral">
                Not Found
              </p>
            </div>
          ) : (
            filteredUsers.map((user, index) => {
              return (
                <StakingBox
                  farm={filteredFarms[index]}
                  userInfo={user}
                  index={index}
                  count={filteredFarms.length}
                  key={filteredFarms[index].lpToken.contractHash}
                  setState={setPending}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
