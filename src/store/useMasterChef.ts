import { BigNumberish } from "ethers";
import create, { State } from "zustand";
import { devtools } from "zustand/middleware";
import { Token } from "../config/interface/token";
export interface LpToken {
    contractPackageHash: string;
    contractHash: string;
    tokens: Token[];
    decimals: number;
}
export interface FarmInfo {
    lpToken: LpToken;
    allocPoint: BigNumberish;
    lastRewardBlockTime: BigNumberish;
    accCakePerShare: BigNumberish;
    liquidity: BigNumberish;
}
export interface FarmUserInfo {
    amount: BigNumberish;
    pendingCake: BigNumberish;
    rewardDebt: BigNumberish;
}
interface MasterChefStatus extends State {
    farmList: FarmInfo[];
    userData: FarmUserInfo[];
    isFetching: boolean;
    setFarmList: (farmList: FarmInfo[]) => void;
    setUserData: (userData: FarmUserInfo[]) => void;
    setFetching: (isFetching: boolean) => void;
}

const useMasterChefStatus = create<MasterChefStatus>(devtools(
    (set) => ({
        farmList: [],
        userData: [],
        isFetching: false,
        setFarmList: (farmList: FarmInfo[]) => set(() => ({farmList})),
        setUserData: (userData: FarmUserInfo[]) => set(() => ({userData})),
        setFetching: (isFetching: boolean) => set(() => ({isFetching})),
    })
));

export default useMasterChefStatus;