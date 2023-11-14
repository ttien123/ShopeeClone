import classNames from 'classnames';
import { sortBy, order as orderConstant } from 'src/constants/product';
import { productListConfig } from 'src/types/product.type';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import path from 'src/constants/path';
import omit from 'lodash/omit';
// import { omit } from 'lodash';
import { QueryConfig } from 'src/hooks/useQueryConfig';
interface Props {
    queryConfig: QueryConfig;
    pageSize: number;
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
    const { sort_by = sortBy.createdAt, order } = queryConfig;
    const page = Number(queryConfig.page);
    const navigate = useNavigate();
    const isActiveSortBy = (sortByValue: Exclude<productListConfig['sort_by'], undefined>) => {
        return sort_by === sortByValue;
    };

    const handleSort = (sortByValue: Exclude<productListConfig['sort_by'], undefined>) => {
        navigate({
            pathname: path.home,
            search: createSearchParams(
                omit(
                    {
                        ...queryConfig,
                        sort_by: sortByValue,
                    },
                    ['order'],
                ),
            ).toString(),
        });
    };

    const handlePriceOrder = (orderValue: Exclude<productListConfig['order'], undefined>) => {
        navigate({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                sort_by: sortBy.price,
                order: orderValue,
            }).toString(),
        });
    };
    return (
        <div className="bg-gray-300/40 py-4 px-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center flex-wrap gap-2">
                    <div>Sắp xếp theo</div>
                    <button
                        className={classNames('h-8 px-4 capitalize text-sm ', {
                            'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
                            'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view),
                        })}
                        onClick={() => handleSort(sortBy.view)}
                    >
                        Phổ biến
                    </button>

                    <button
                        className={classNames('h-8 px-4 capitalize text-sm ', {
                            'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
                            'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt),
                        })}
                        onClick={() => handleSort(sortBy.createdAt)}
                    >
                        Mới nhất
                    </button>
                    <button
                        className={classNames('h-8 px-4 capitalize text-sm ', {
                            'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
                            'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold),
                        })}
                        onClick={() => handleSort(sortBy.sold)}
                    >
                        Bán chạy
                    </button>
                    <select
                        className={classNames('h-8 px-4 text-sm text-left outline-none', {
                            'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
                            'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price),
                        })}
                        value={order || ''}
                        onChange={(e) =>
                            handlePriceOrder(e.target.value as Exclude<productListConfig['order'], undefined>)
                        }
                    >
                        <option disabled value={''} className="bg-white text-black">
                            Giá
                        </option>
                        <option value={orderConstant.asc} className="bg-white text-black">
                            Giá: Thấp đến cao
                        </option>
                        <option value={orderConstant.desc} className="bg-white text-black">
                            Giá: Cao đến thấp
                        </option>
                    </select>
                </div>
                <div className="flex items-center">
                    <div>
                        <span className="text-orange">{page}</span>
                        <span className="">/{pageSize}</span>
                    </div>
                    <div className="ml-2 flex">
                        {page === 1 ? (
                            <span className="flex items-center justify-center h-8 w-9 rounded-tl-sm rounded-bl-sm cursor-not-allowed bg-white/60 hover:bg-slate-100 shadow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                            </span>
                        ) : (
                            <Link
                                to={{
                                    pathname: path.home,
                                    search: createSearchParams({
                                        ...queryConfig,
                                        page: (page - 1).toString(),
                                    }).toString(),
                                }}
                                className="flex items-center justify-center h-8 w-9 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                            </Link>
                        )}

                        {page === pageSize ? (
                            <span className="flex items-center justify-center h-8 w-9 rounded-tl-sm rounded-bl-sm cursor-not-allowed bg-white/60 hover:bg-slate-100 shadow">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        ) : (
                            <Link
                                to={{
                                    pathname: path.home,
                                    search: createSearchParams({
                                        ...queryConfig,
                                        page: (page + 1).toString(),
                                    }).toString(),
                                }}
                                className="flex items-center justify-center h-8 w-9 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortProductList;
