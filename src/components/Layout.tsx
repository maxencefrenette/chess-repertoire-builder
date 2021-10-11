import React from 'react';
import { Routing } from './Routing';
import { TopBar } from './TopBar';

export const Layout = () => {
    return (
        <>
            <TopBar />
            <Routing />
        </>
    );
};
