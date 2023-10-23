import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterLayout from './layout/RegisterLayout';
import MainLayout from './layout/MainLayout';
import Profile from './pages/Profile';

const isAuthenticated = false;
function ProtectedRoute() {
    return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />;
}
function RejectedRoute() {
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
                    path: 'profile',
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
                    path: '/login',
                    element: (
                        <RegisterLayout>
                            <Login />
                        </RegisterLayout>
                    ),
                },
                {
                    path: '/register',
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
