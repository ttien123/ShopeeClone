import classNames from 'classnames';
import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import path from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { getAvatarUrl } from 'src/utils/utils';

const UserSideNav = () => {
    const { profile } = useContext(AppContext);
    return (
        <div>
            <div className="flex items-center border-b border-b-gray-200 py-4 overflow-hidden">
                <Link
                    to={path.profile}
                    className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10"
                >
                    <img src={getAvatarUrl(profile?.avatar)} alt="avatar" className="h-full w-full object-cover" />
                </Link>
                <div className="flex-grow pl-4">
                    <div className="mb-1 truncate font-semibold text-gray-600">{profile?.name}</div>
                    <Link to={path.profile} className="flex items-center capitalize text-gray-500">
                        <svg
                            width={12}
                            height={12}
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: 4 }}
                        >
                            <path
                                d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                                fill="#9B9B9B"
                                fillRule="evenodd"
                            />
                        </svg>
                        sửa hồ sơ
                    </Link>
                </div>
            </div>
            <div className="mt-7">
                <NavLink
                    to={path.profile}
                    className={({ isActive }) =>
                        classNames('flex items-center capitalize  transition-colors', {
                            'text-orange': isActive,
                            'text-gray-600': !isActive,
                        })
                    }
                >
                    <div className="mr-3 h-[22px] w-[22px]">
                        <img
                            src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
                            alt="avatar"
                            className="w-full h-full"
                        />
                    </div>
                    Tài khoản của tôi
                </NavLink>
                <NavLink
                    to={path.changePassword}
                    className={({ isActive }) =>
                        classNames('flex mt-4 items-center capitalize  transition-colors', {
                            'text-orange': isActive,
                            'text-gray-600': !isActive,
                        })
                    }
                >
                    <div className="mr-3 h-[22px] w-[22px]">
                        <img
                            src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
                            alt=""
                            className="w-full h-full"
                        />
                    </div>
                    Đổi mật khẩu
                </NavLink>
                <NavLink
                    to={path.historyPurchase}
                    className={({ isActive }) =>
                        classNames('flex mt-4 items-center capitalize  transition-colors', {
                            'text-orange': isActive,
                            'text-gray-600': !isActive,
                        })
                    }
                >
                    <div className="mr-3 h-[22px] w-[22px]">
                        <img src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078" />
                    </div>
                    Đơn mua
                </NavLink>
            </div>
        </div>
    );
};

export default UserSideNav;
