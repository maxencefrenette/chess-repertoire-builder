import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { RootStore, StoreContext } from './store';
import './App.css';
import { SupabaseContextProvider } from './api/supabase';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <StoreContext.Provider value={new RootStore()}>
            <SupabaseContextProvider>
                <QueryClientProvider client={queryClient}>
                    <CssBaseline />
                    <Layout />
                </QueryClientProvider>
            </SupabaseContextProvider>
        </StoreContext.Provider>
    );
}

export default App;
