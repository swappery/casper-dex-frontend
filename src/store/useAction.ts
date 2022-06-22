import create, { State } from "zustand";
import { ActionStatus } from "../config/interface/actionStatus";
import { ActionType } from "../config/interface/actionType";

interface ActionState extends State {
    actionType?: ActionType;
    actionStatus?: ActionStatus;
    setActionType: (actionType: ActionType) => void;
    setActionStatus: (actionStatus: ActionStatus) => void;
}

const useAction = create<ActionState>(
    (set) => ({
        setActionType: (actionType: ActionType) => set(() => ({actionType})),
        setActionStatus: (actionStatus: ActionStatus) => set(() => ({actionStatus})),
}));

export default useAction;