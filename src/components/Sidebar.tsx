import { observer } from 'mobx-react-lite';
import React from 'react';
import { OpeningMove, useOpeningPosition } from '../hooks/api';
import { useStore } from '../store';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();
    const openingStatsResponse = useOpeningPosition(store.ui.position.fen());

    if (!openingStatsResponse.data) {
        return <div>Loading...</div>;
    }

    const openingStats = openingStatsResponse.data;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Move</td>
                        <td>Score</td>
                        <td>Games</td>
                    </tr>
                </thead>
                <tbody>
                    {openingStats.moves.map((move) => (
                        <tr
                            key={move.san}
                            onClick={() => store.ui.makeMove(move.san)}
                        >
                            <td>{move.san}</td>
                            <td>
                                {score(move).toLocaleString(undefined, {
                                    style: 'percent',
                                })}
                            </td>
                            <td>{move.white + move.draws + move.black}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

function score(move: OpeningMove) {
    const totalGames = move.white + move.draws + move.black;
    return (move.white + move.draws / 2) / totalGames;
}
