import React, { useContext, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';
import purchaseApi from 'src/apis/purchase.api';
import Button from 'src/components/Button';
import QuantityController from 'src/components/QuantityController';
import path from 'src/constants/path';
import { purchasesStatus } from 'src/constants/purchase';
import { Purchase } from 'src/types/purchase.type';
import { formatCurrency, generateNameId } from 'src/utils/utils';
import { produce } from 'immer';
// import { keyBy } from 'lodash';
import keyBy from 'lodash/keyBy';
import { toast } from 'react-toastify';
import { AppContext } from 'src/contexts/app.context';
import noProduct from 'src/assets/img/9bdd8040b334d31946f49e36beaf32db.png';

const Cart = () => {
    const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
    const location = useLocation();
    const choosePurchaseFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId;
    const { data: purchaseInCartData, refetch } = useQuery({
        queryKey: ['purchase', { status: purchasesStatus.inCart }],
        queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    });

    const updatePurchaseMutation = useMutation({
        mutationFn: purchaseApi.updatePurchase,
        onSuccess: () => {
            refetch();
        },
    });

    const buyProductsMutation = useMutation({
        mutationFn: purchaseApi.buyProducts,
        onSuccess: (data) => {
            refetch();
            toast.success(data.data.message, {
                autoClose: 1000,
            });
        },
    });

    const deletePurchasesMutation = useMutation({
        mutationFn: purchaseApi.deletePurchase,
        onSuccess: () => {
            refetch();
        },
    });

    const purchasesInCart = purchaseInCartData?.data.data;
    const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases]);
    const checkedPurchases = useMemo(
        () => extendedPurchases.filter((purchase) => purchase.checked),
        [extendedPurchases],
    );
    const checkedPurchasesCount = checkedPurchases.length;
    const totalCheckedPurchasePrice = useMemo(
        () =>
            checkedPurchases.reduce((result, current) => {
                return result + current.buy_count * current.product.price;
            }, 0),
        [checkedPurchases],
    );
    const totalCheckedPurchaseSavingPrice = useMemo(
        () =>
            checkedPurchases.reduce((result, current) => {
                return result + (current.product.price_before_discount - current.product.price) * current.buy_count;
            }, 0),
        [checkedPurchases],
    );
    useEffect(() => {
        setExtendedPurchases((prev) => {
            const extendedPurchasesObject = keyBy(prev, '_id');
            return (
                purchasesInCart?.map((purchase) => {
                    const isChoosePurchaseFromLocation = choosePurchaseFromLocation === purchase._id;
                    return {
                        ...purchase,
                        disabled: false,
                        checked:
                            isChoosePurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked),
                    };
                }) || []
            );
        });
    }, [purchasesInCart, choosePurchaseFromLocation]);

    useEffect(() => {
        return () => {
            history.replaceState(null, '');
        };
    }, []);

    const handleCheck = (purchaseIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtendedPurchases(
            produce((draft) => {
                draft[purchaseIndex].checked = e.target.checked;
            }),
        );
    };

    const handleCheckAll = () => {
        setExtendedPurchases((prev) =>
            prev.map((purchase) => ({
                ...purchase,
                checked: !isAllChecked,
            })),
        );
    };

    const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
        setExtendedPurchases(
            produce((draft) => {
                draft[purchaseIndex].buy_count = value;
            }),
        );
    };

    const handleDelete = (purchaseIndex: number) => () => {
        const purchaseId = extendedPurchases[purchaseIndex]._id;
        deletePurchasesMutation.mutate([purchaseId]);
    };

    const handleDeleteManyPurchase = () => {
        const purchaseIds = checkedPurchases.map((purchase) => purchase._id);
        deletePurchasesMutation.mutate(purchaseIds);
    };

    const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
        if (enable) {
            const purchase = extendedPurchases[purchaseIndex];
            setExtendedPurchases(
                produce((draft) => {
                    draft[purchaseIndex].disabled = true;
                }),
            );
            updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value });
        }
    };

    const handleBuyPurchases = () => {
        if (checkedPurchases.length > 0) {
            const body = checkedPurchases.map((purchase) => ({
                product_id: purchase.product._id,
                buy_count: purchase.buy_count,
            }));
            buyProductsMutation.mutate(body);
        }
    };
    return (
        <div className="bg-neutral-100 px-16 ">
            <div className="container">
                {extendedPurchases.length > 0 ? (
                    <>
                        <div className="overflow-auto">
                            <div className="min-w-[1000px] mt-8">
                                <div className="grid grid-cols-12 bg-white rounded-sm py-5 px-9 text-sm capitalize text-gray-500 shadow">
                                    <div className="col-span-6">
                                        <div className="flex items-center">
                                            <div className="flex flex-shrink items-center justify-center pr-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 accent-orange"
                                                    checked={isAllChecked}
                                                    onChange={handleCheckAll}
                                                />
                                            </div>
                                            <div className="flex-grow text-black">Sản phẩm</div>
                                        </div>
                                    </div>
                                    <div className="col-span-6">
                                        <div className="grid grid-cols-5 text-center">
                                            <div className="col-span-2">Đơn giá</div>
                                            <div className="col-span-1">Số lượng</div>
                                            <div className="col-span-1">Số tiền</div>
                                            <div className="col-span-1">Thao tác</div>
                                        </div>
                                    </div>
                                </div>
                                {extendedPurchases.length > 0 && (
                                    <div className="my-3 rounded-sm bg-white p-5 shadow">
                                        {extendedPurchases?.map((purchase, index) => (
                                            <div
                                                key={purchase._id}
                                                className="first:mt-0 mb-5 items-center grid grid-cols-12 text-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-gray-500"
                                            >
                                                <div className="col-span-6">
                                                    <div className="flex">
                                                        <div className="flex flex-shrink items-center justify-center pr-3">
                                                            <input
                                                                type="checkbox"
                                                                className="h-5 w-5 accent-orange"
                                                                checked={purchase.checked}
                                                                onChange={handleCheck(index)}
                                                            />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex">
                                                                <Link
                                                                    to={`${path.home}${generateNameId({
                                                                        name: purchase.product.name,
                                                                        id: purchase.product._id,
                                                                    })}`}
                                                                    className="h-20 w-20 flex-shrink-0 "
                                                                >
                                                                    <img
                                                                        src={purchase.product.image}
                                                                        alt={purchase.product.name}
                                                                    />
                                                                </Link>
                                                                <div className="flex-grow px-5 pt-1 pb-2">
                                                                    <Link
                                                                        to={`${path.home}${generateNameId({
                                                                            name: purchase.product.name,
                                                                            id: purchase.product._id,
                                                                        })}`}
                                                                        className="line-clamp-2 text-left"
                                                                    >
                                                                        {purchase.product.name}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-6">
                                                    <div className="grid grid-cols-5 items-center">
                                                        <div className="col-span-2">
                                                            <div className="flex items-center justify-center">
                                                                <span className="text-gray-300 line-through">
                                                                    ₫
                                                                    {formatCurrency(
                                                                        purchase.product.price_before_discount,
                                                                    )}
                                                                </span>
                                                                <span className="ml-3">
                                                                    ₫{formatCurrency(purchase.product.price)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1">
                                                            <QuantityController
                                                                max={purchase.product.quantity}
                                                                value={purchase.buy_count}
                                                                classNameWrapper="flex items-center"
                                                                onIncrease={(value) =>
                                                                    handleQuantity(
                                                                        index,
                                                                        value,
                                                                        value <= purchase.product.quantity,
                                                                    )
                                                                }
                                                                onDecrease={(value) =>
                                                                    handleQuantity(index, value, value >= 1)
                                                                }
                                                                disabled={purchase.disabled}
                                                                onType={handleTypeQuantity(index)}
                                                                onFocusOut={(value) => {
                                                                    handleQuantity(
                                                                        index,
                                                                        value,
                                                                        value <= purchase.product.quantity &&
                                                                            value >= 1 &&
                                                                            value !==
                                                                                (purchasesInCart as Purchase[])[index]
                                                                                    .buy_count,
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <span className="text-orange">
                                                                ₫
                                                                {formatCurrency(
                                                                    purchase.product.price * purchase.buy_count,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-1">
                                                            <button
                                                                className="bg-none text-black transition-colors hover:text-orange"
                                                                onClick={handleDelete(index)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="sticky bottom-0 z-10 mt-8 flex flex-col sm:flex-row sm:items-center rounded-sm bg-white p-5 shadow border border-gray-100">
                            <div className="flex items-center">
                                <div className="flex flex-shrink-0 items-center justify-center pr-3">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 accent-orange"
                                        checked={isAllChecked}
                                        onChange={handleCheckAll}
                                    />
                                </div>
                                <button className="mx-3 border-none bg-none" onClick={handleCheckAll}>
                                    Chọn tất cả ({extendedPurchases.length})
                                </button>
                                <button className="mx-3 border-none bg-none" onClick={handleDeleteManyPurchase}>
                                    Xóa
                                </button>
                            </div>
                            <div className="sm:ml-auto flex items-center flex-col sm:flex-row mt-5 sm:mt-0">
                                <div>
                                    <div className="flex items-center sm:justify-end">
                                        <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                                        <div className="ml-2 text-2xl text-orange">
                                            ₫{formatCurrency(totalCheckedPurchasePrice)}
                                        </div>
                                    </div>
                                    <div className="flex items-center sm:justify-end text-sm">
                                        <div className="text-gray-500">Tiết kiệm</div>
                                        <div className="ml-6 text-orange">
                                            ₫{formatCurrency(totalCheckedPurchaseSavingPrice)}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleBuyPurchases}
                                    disabled={buyProductsMutation.isLoading}
                                    className="mt-5 sm:mt-0 ml-4 flex h-10 w-52 justify-center items-center uppercase bg-red-500 text-white text-sm hover:bg-red-600"
                                >
                                    Mua hàng
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center pt-16">
                        <img src={noProduct} alt="No purchase" className="w-24 h-24 mx-auto" />
                        <div className="font-bold text-gray-500 mt-5">Giỏ hàng của bạn còn trống</div>
                        <div className="mt-5">
                            <Link
                                to={path.home}
                                className=" bg-orange px-8 rounded-sm hover:bg-orange/80 py-2 uppercase text-white"
                            >
                                Mua ngay
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
