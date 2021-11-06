import React from "react";
import { UiState } from "./ui-state";

export class RootStore {
    ui: UiState;

    constructor() {
        this.ui = new UiState()
    }
}

export const StoreContext = React.createContext(new RootStore());
export const useStore = () => React.useContext(StoreContext);
