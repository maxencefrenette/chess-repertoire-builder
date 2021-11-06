import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { RootStore, StoreContext } from './store';
import './App.css'

function App() {
    return (
        <StoreContext.Provider value={new RootStore()}>
            <CssBaseline />
            <Layout />
        </StoreContext.Provider>
    );
}

export default App;
