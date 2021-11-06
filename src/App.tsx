import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { RootStore, StoreContext } from './store';
import './App.css';
import { SupabaseContextProvider } from './hooks/supabase';

function App() {
    return (
        <StoreContext.Provider value={new RootStore()}>
            <SupabaseContextProvider>
                <CssBaseline />
                <Layout />
            </SupabaseContextProvider>
        </StoreContext.Provider>
    );
}

export default App;
