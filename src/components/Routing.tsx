import { Router } from '@reach/router'
import React from 'react'
import { ChessBoardPage } from '../pages/chess-board-page'
import { RepertoirePage } from '../pages/repertoire-page'

export const Routing = () => {
    return (
        <Router>
            <ChessBoardPage path="/" />
            <RepertoirePage path="/repertoire" />
        </Router>
    )
}
