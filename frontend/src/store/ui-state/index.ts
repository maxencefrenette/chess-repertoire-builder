import { Chess } from 'chess.ts';
import { action, makeObservable, observable } from 'mobx';
import { Square } from '../../helpers/chess';
import { Repertoire } from '../../api/supabase';

export class UiState {
    isLoggedIn: boolean | undefined = undefined;
    position: Chess;
    hoveredMove: string | undefined;
    repertoire: Repertoire | undefined;

    constructor() {
        makeObservable(this, {
            isLoggedIn: observable,
            position: observable,
            hoveredMove: observable,
            repertoire: observable,
            makeMove: action,
            makeMoveFromTo: action,
            navigateToMove: action,
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

    navigateToMove(moveIndex: number) {
        const numUndos = this.position.history().length - moveIndex - 1;
        const newPosition = this.position.clone();

        for (let i = 0; i < numUndos; i++) {
            newPosition.undo();
        }

        this.position = newPosition;
    }
}