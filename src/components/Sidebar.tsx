import { Chess } from 'chess.ts'
import React from 'react'
import { useOpeningPosition } from '../hooks/api'

export interface SidebarProps {
    position: Chess;
}


export const Sidebar: React.FC<SidebarProps> = ({ position }) => {
    const openingStats = useOpeningPosition(position.fen())

    return (
        <div>
            {JSON.stringify(openingStats)}
        </div>
    )
}
