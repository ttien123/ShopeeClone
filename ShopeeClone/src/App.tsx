import { useEffect, useContext } from 'react';
import useRouterElements from './useRouterElements';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { localStorageEventTarget } from './utils/auth';
import { AppContext } from './contexts/app.context';

function App() {
    const routeElements = useRouterElements();
    const { reset } = useContext(AppContext);

    // xử lý logout khi token hết hạn
    useEffect(() => {
        localStorageEventTarget.addEventListener('clearLS', reset);
        return () => {
            localStorageEventTarget.removeEventListener('clearLS', reset);
        };
    }, [reset]);
    return (
        <div>
            {routeElements}
            <ToastContainer />
        </div>
    );
}

export default App;
