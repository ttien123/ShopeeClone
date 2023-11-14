import Popover from '../Popover';
import { AppContext } from 'src/contexts/app.context';
import { Link } from 'react-router-dom';
import path from 'src/constants/path';
import { useMutation, useQueryClient } from 'react-query';
import authApi from 'src/apis/auth.api';
import { purchasesStatus } from 'src/constants/purchase';
import { useContext } from 'react';
import { getAvatarUrl } from 'src/utils/utils';

const NavHeader = () => {
    const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext);
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setIsAuthenticated(false);
            setProfile(null);
            queryClient.removeQueries({ queryKey: ['purchase', { status: purchasesStatus.inCart }] });
        },
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="flex justify-end">
            <Popover
                renderPopover={
                    <div className="bg-white relative shadow-md rounded-sm border border-gray-200">
                        <div className="flex flex-col py-2 pr-28 pl-3">
                            <button className="py-2 px-3 hover:text-orange text-left">Tiếng việt</button>
                            <button className="py-2 px-3 hover:text-orange text-left">English</button>
                        </div>
                    </div>
                }
                className="flex items-center py-1 hover:text-white/70 cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                </svg>
                <span className="mx-1">Tiếng việt</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </Popover>

            {isAuthenticated && (
                <Popover
                    className="ml-2 flex items-center py-1 hover:text-white/70 cursor-pointer"
                    renderPopover={
                        <div className="bg-white relative shadow-md rounded-sm border border-gray-200">
                            <Link
                                to={path.profile}
                                className="block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left"
                            >
                                Tài khoản của tôi
                            </Link>
                            <Link
                                to={path.historyPurchase}
                                className="block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left"
                            >
                                Đơn mua
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    }
                >
                    <div className="w-6 h-6 mr-2 flex-shrink-0">
                        <img
                            src={getAvatarUrl(profile?.avatar)}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div>{profile?.email}</div>
                </Popover>
            )}

            {!isAuthenticated && (
                <div className="flex items-center">
                    <Link to={path.register} className="mx-3 capitalize hover:text-white/70">
                        Đăng ký
                    </Link>
                    <div className="border-r-[1px] border-r-white/40 h-4"></div>
                    <Link to={path.login} className="mx-3 capitalize hover:text-white/70">
                        Đăng Nhập
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavHeader;
