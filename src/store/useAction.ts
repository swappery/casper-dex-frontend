import create, { State } from "zustand";
import { ActionStatus } from "../config/interface/actionStatus";
import { ActionType } from "../config/interface/actionType";

interface ActionState extends State {
    actionType?: ActionType;
    actionStatus?: ActionStatus;
    isFetching: boolean;
    isPending: boolean;
    setActionType: (actionType: ActionType) => void;
    setActionStatus: (actionStatus: ActionStatus) => void;
    setFetching: (isFetching: boolean) => void;
    setPending: (isPending: boolean) => void;
}

const useAction = create<ActionState>(
    (set) => ({
        isFetching: false,
        isPending: false,
        setActionType: (actionType: ActionType) => set(() => ({actionType})),
        setActionStatus: (actionStatus: ActionStatus) => set(() => ({actionStatus})),
        setFetching: (isFetching: boolean) => set(() => ({isFetching})),
        setPending: (isPending: boolean) => set(() => ({isPending})),
}));

export default useAction;