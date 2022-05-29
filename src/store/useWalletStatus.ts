import { BigNumber } from "ethers";
import create, { State } from "zustand";
import { configurePersist } from "zustand-persist";
import { devtools } from "zustand/middleware";
import { TokenContext } from "./useLiquidityStatus";
import { deserialize } from "../utils/utils";
import serialize from "serialize-javascript";

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
export type AccountList = Map<string, AccountContext>;

interface WalletStatus extends State {
  accountListString: string;
  addAccount: (publicKey: string) => void;
  setPool: (publicKey: string, pool: Pool) => void;
}

const { persist } = configurePersist({
  storage: localStorage,
});

const useWalletStatus = create<WalletStatus>(
  devtools(
    persist(
      {
        key: "wallets",
        allowlist: ["accountListString"],
      },
      (set) => ({
        accountListString: serialize(new Map<string, AccountContext>()),

        addAccount: (publicKey: string) =>
          set((state) => {
            let accountList = deserialize(state.accountListString);

            if (accountList.has(publicKey))
              return {
                accountListString: state.accountListString,
              };
            else
              return {
                accountListString: serialize(
                  accountList.set(publicKey, {
                    poolList: new Map<string, Pool>(),
                  })
                ),
              };
          }),
        setPool: (publicKey: string, pool: Pool) =>
          set((state) => {
            let accountList = deserialize(state.accountListString);

            if (!accountList.has(publicKey))
              return {
                accountListString: serialize(
                  accountList.set(publicKey, {
                    poolList: new Map<string, Pool>().set(
                      pool.contractPackageHash,
                      pool
                    ),
                  })
                ),
              };
            else
              return {
                accountListString: serialize(
                  accountList.set(publicKey, {
                    poolList: accountList
                      .get(publicKey)
                      ?.poolList.set(pool.contractPackageHash, pool)!,
                  })
                ),
              };
          }),
      })
    )
  )
);

export default useWalletStatus;
