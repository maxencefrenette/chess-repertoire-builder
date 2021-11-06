import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { RootStore, StoreContext } from './store';
import './App.css';
import { SupabaseContextProvider } from './hooks/supabase';

function App() {
    return (
        <SupabaseContextProvider>
            <StoreContext.Provider value={new RootStore()}>
                <CssBaseline />
                <Layout />
            </StoreContext.Provider>
        </SupabaseContextProvider>
    );
}

export default App;
