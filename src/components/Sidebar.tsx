import { Chess } from 'chess.ts';
import React from 'react';
import { OpeningMove, useOpeningPosition } from '../hooks/api';

export interface SidebarProps {
    position: Chess;
    onMove: (move: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ position, onMove }) => {
    const openingStatsResponse = useOpeningPosition(position.fen());

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
                    </tr>
                </thead>
                <tbody>
                    {openingStats.moves.map((move) => (
                        <tr key={move.san} onClick={() => onMove(move.san)}>
                            <td>{move.san}</td>
                            <td>
                                {score(move).toLocaleString(undefined, {
                                    style: 'percent',
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function score(move: OpeningMove) {
    const totalGames = move.white + move.draws + move.black;
    return (move.white + move.draws / 2) / totalGames;
}
