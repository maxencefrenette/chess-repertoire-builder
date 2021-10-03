import React from "react";
import { Repertoire } from "./repertoire/Repertoire"
import { UiState } from "./ui-state";

export class RootStore {
    repertoire: Repertoire;
    ui: UiState;

    constructor() {
        this.repertoire = new Repertoire()
        this.ui = new UiState()
    }
}

export const StoreContext = React.createContext(new RootStore());
export const useStore = () => React.useContext(StoreContext);
