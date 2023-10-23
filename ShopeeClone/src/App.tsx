import useRouterElements from './useRouterElements';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const routeElements = useRouterElements();
    return (
        <div>
            {routeElements}
            <ToastContainer />
        </div>
    );
}

export default App;
