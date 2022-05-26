import create, {State} from "zustand";
import { configurePersist } from "zustand-persist";

const { persist } = configurePersist({
    storage: localStorage,
    rootKey: "casper_address",
});

interface NetworkStatus extends State {
    isConnected: boolean;
    activeAddress: string;
    setConnected: (isConnected: boolean) => void;
    setActiveAddress: (activeAddress: string | undefined) => void;
}

const useNetworkStatus = create<NetworkStatus>(
    persist({
        key: 'address',
        allowlist: ['isConnected', 'activeAddress'],
        denylist: [],
    }, (set) => ({
    isConnected: false,
    activeAddress: "",
    setConnected: (isConnected: boolean) => set(() => ({ isConnected })),
    setActiveAddress: (address: string | undefined) =>
        set(() => {
        const activeAddress = address ? address : "";
        const isConnected = activeAddress === "" ? false : true;
        return {
            activeAddress,
            isConnected,
        };
    }),
}))
);

export default useNetworkStatus;