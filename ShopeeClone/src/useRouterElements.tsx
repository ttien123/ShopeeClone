import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { useContext, lazy, Suspense } from 'react';
import path from './constants/path';
// import ProductList from './pages/ProductList';
// import Login from './pages/Login';
// import Register from './pages/Register';
import RegisterLayout from './layout/RegisterLayout';
import MainLayout from './layout/MainLayout';
import { AppContext } from './contexts/app.context';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
import CartLayout from './layout/CartLayout';
import UserLayout from './pages/User/Layouts/UserLayout';
// import ChangePassword from './pages/User/pages/ChangePassword';
// import Profile from './pages/User/pages/Profile';
// import HistoryPurchase from './pages/User/pages/HistoryPurchase';
// import NotFound from './pages/NotFound';

const Login = lazy(() => import('./pages/Login'));
const ProductList = lazy(() => import('./pages/ProductList'));
const Profile = lazy(() => import('./pages/User/pages/Profile'));
const Register = lazy(() => import('./pages/Register'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'));
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
        // Suspense có 1 thuộc tính là fallback dùng khi cpn đang đc render thì lm gì
        {
            path: '/',
            index: true,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductList />
                    </Suspense>
                </MainLayout>
            ),
        },
        {
            path: path.productDetail,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductDetail />
                    </Suspense>
                </MainLayout>
            ),
        },
        {
            path: '*',
            element: (
                <MainLayout>
                    <Suspense>
                        <NotFound />
                    </Suspense>
                </MainLayout>
            ),
        },
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.cart,
                    element: (
                        <CartLayout>
                            <Suspense>
                                <Cart />
                            </Suspense>
                        </CartLayout>
                    ),
                },
                {
                    path: path.user,
                    element: (
                        <MainLayout>
                            <UserLayout />
                        </MainLayout>
                    ),
                    children: [
                        {
                            path: path.profile,
                            element: (
                                <Suspense>
                                    <Profile />,
                                </Suspense>
                            ),
                        },
                        {
                            path: path.changePassword,
                            element: (
                                <Suspense>
                                    <ChangePassword />,
                                </Suspense>
                            ),
                        },
                        {
                            path: path.historyPurchase,
                            element: (
                                <Suspense>
                                    <HistoryPurchase />,
                                </Suspense>
                            ),
                        },
                    ],
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
                            <Suspense>
                                <Login />
                            </Suspense>
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
