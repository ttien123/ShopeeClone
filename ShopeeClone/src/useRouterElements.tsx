import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { useContext } from 'react';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterLayout from './layout/RegisterLayout';
import MainLayout from './layout/MainLayout';
import Profile from './pages/Profile';
import { AppContext } from './contexts/app.context';
import path from './constants/path';

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />;
}
function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext);

    return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />;
}

const useRouterElements = () => {
    const routeElements = useRoutes([
        {
            path: '/',
            index: true,
            element: (
                <MainLayout>
                    <ProductList />
                </MainLayout>
            ),
        },
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.profile,
                    element: (
                        <MainLayout>
                            <Profile />
                        </MainLayout>
                    ),
                },
            ],
        },
        {
            path: '',
            element: <RejectedRoute />,
            children: [
                {
                    path: path.login,
                    element: (
                        <RegisterLayout>
                            <Login />
                        </RegisterLayout>
                    ),
                },
                {
                    path: path.register,
                    element: (
                        <RegisterLayout>
                            <Register />
                        </RegisterLayout>
                    ),
                },
            ],
        },
    ]);

    return routeElements;
};

export default useRouterElements;
