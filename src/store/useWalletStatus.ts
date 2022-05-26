import { CLPublicKey } from "casper-js-sdk";
import { BigNumber } from "ethers";
import create, { State } from "zustand";
import { Map } from "immutable";
import { configurePersist } from "zustand-persist";
import { devtools } from 'zustand/middleware'
import { supportedTokens, TokenContext } from "./useLiquidityStatus";

export interface Pool {
    contractPackageHash: string;
    contractHash: string;
    tokens: TokenContext[];
    decimals: number;
    totalSupply: BigNumber;
    reserves: BigNumber[];
    balance: BigNumber;
}

interface AccountContext {
    poolList: Map<string, Pool>;
}

interface WalletStatus extends State {
    accountList: Map<string, AccountContext>;
    addAccount: (publicKey: string) => void;
    setPool: (publicKey: string, pool: Pool) => void;
}

const { persist } = configurePersist({
    storage: localStorage,
});

const useWalletStatus = create<WalletStatus>(devtools(
    persist({
        key: 'wallets',
        allowlist: ["accountList"],
    }, (set) => ({
    accountList: Map<string, AccountContext>(),
    
    addAccount: (publicKey: string) =>
        set((state) => {
            if (state.accountList.has(publicKey)) 
                return {
                    accountList: state.accountList,
                };
            else
                return {
                    accountList: state.accountList.set(publicKey, {poolList: Map<string, Pool>()}),
                };
        }),
    setPool: (publicKey: string, pool: Pool) =>
        set((state) => {
            if (!state.accountList.has(publicKey))
                return {
                    accountList: state.accountList.set(publicKey, {poolList: Map<string, Pool>().set(pool.contractPackageHash, pool)}),
                };
            else return {
                accountList: state.accountList.set(publicKey, {poolList: state.accountList.get(publicKey)?.poolList.set(pool.contractPackageHash, pool)!}),
            };
        }),
})))
);

export default useWalletStatus;