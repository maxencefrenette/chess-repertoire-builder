import { Chess } from 'chess.ts';
import React from 'react';
import { OpeningMove, useOpeningPosition } from '../hooks/api';

export interface SidebarProps {
    position: Chess;
}

export const Sidebar: React.FC<SidebarProps> = ({ position }) => {
    const openingStatsResponse = useOpeningPosition(position.fen());

    if (!openingStatsResponse.data) {
        return <div>Loading...</div>;
    }

    const openingStats = openingStatsResponse.data;

    return (
        <div>
            <table>
                {openingStats.moves.map((move) => (
                    <tr>
                        <td>{move.san}</td>
                        <td>{score(move).toLocaleString(undefined, { style: 'percent' })}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

function score(move: OpeningMove) {
    const totalGames = move.white + move.draws + move.black;
    return ((move.white + move.draws / 2)) / totalGames;
}
