import create, { State } from "zustand";
import { ActionStatus } from "../config/interface/actionStatus";
import { ActionType } from "../config/interface/actionType";

interface ActionState extends State {
    actionType?: ActionType;
    actionStatus?: ActionStatus;
    isPending: boolean;
    setActionType: (actionType: ActionType) => void;
    setActionStatus: (actionStatus: ActionStatus) => void;
    setPending: (isPending: boolean) => void;
}

const useAction = create<ActionState>(
    (set) => ({
        isPending: false,
        setActionType: (actionType: ActionType) => set(() => ({actionType})),
        setActionStatus: (actionStatus: ActionStatus) => set(() => ({actionStatus})),
        setPending: (isPending: boolean) => set(() => ({isPending})),
}));

export default useAction;