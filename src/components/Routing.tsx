import { Router } from '@reach/router'
import React from 'react'
import { ChessBoardPage } from '../pages/chess-board-page'

export const Routing = () => {
    return (
        <Router>
            <ChessBoardPage path="/" />
        </Router>
    )
}
