import { Chess } from 'chess.ts';
import { action, makeObservable, observable } from 'mobx';
import { Square } from '../../helpers/chess';

export class UiState {
    position: Chess;

    constructor() {
        makeObservable(this, {
            position: observable,
            makeMove: action,
            makeMoveFromTo: action,
        });
        this.position = new Chess();
    }

    makeMove(move: string) {
        const newPosition = this.position.clone();
        newPosition.move(move);
        this.position = newPosition;
    }

    makeMoveFromTo(from: Square, to: Square) {
        const newPosition = this.position.clone();
        newPosition.move({ from, to });
        this.position = newPosition;
    }
}
