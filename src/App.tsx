import { Layout } from './components/Layout';
import { RootStore, StoreContext } from './store';

function App() {
    return (
        <StoreContext.Provider value={new RootStore()}>
            <Layout />
        </StoreContext.Provider>
    );
}

export default App;
