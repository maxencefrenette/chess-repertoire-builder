import { Chess } from "chess.ts";
import { makeObservable, observable } from "mobx";

export class UiState {
    position: Chess;

    constructor() {
        makeObservable(this, { position: observable })
        this.position = new Chess();
    }

    makeMove(move: string) {
        const newPosition = this.position.clone();
        newPosition.move(move);
        this.position = newPosition;
    }
}
