import { Router } from '@reach/router'
import React from 'react'
import { ChessBoardPage } from '../pages/chess-board-page'
import { LoginPage } from '../pages/login-page'
import { RepertoirePage } from '../pages/repertoire-page'

export const Routing = () => {
    return (
        <Router>
            <ChessBoardPage path="/" default />
            <RepertoirePage path="/repertoires" />
            <LoginPage path="/login" />
        </Router>
    )
}
