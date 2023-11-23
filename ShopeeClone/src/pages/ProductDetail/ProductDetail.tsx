import DOMPurify from 'dompurify';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import productApi from 'src/apis/product.api';
import ProductRating from 'src/components/ProductRating';
import { Product as ProductType, productListConfig } from 'src/types/product.type';
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils';
import Product from '../ProductList/components/Product';
import QuantityController from 'src/components/QuantityController';
import purchaseApi from 'src/apis/purchase.api';
import { purchasesStatus } from 'src/constants/purchase';
import { toast } from 'react-toastify';
import path from 'src/constants/path';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { convert } from 'html-to-text';
import { AppContext } from 'src/contexts/app.context';

const ProductDetail = () => {
    const { isAuthenticated } = useContext(AppContext);
    const { t } = useTranslation(['product']);
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const [buyCount, setBuyCount] = useState(1);
    const { nameId } = useParams();

    const id = getIdFromNameId(nameId as string);
    const { data: productDetailData } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductDetail(id as string),
    });

    const product = productDetailData?.data.data;

    const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
    const imageRef = useRef<HTMLImageElement>(null);
    const [activeImage, setActiveImage] = useState('');
    const currentImages = useMemo(
        () => (product ? product?.images.slice(...currentIndexImages) : []),
        [product, currentIndexImages],
    );

    const queryConfig: productListConfig = { limit: '20', page: '1', category: product?.category._id };

    const { data: productsData } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productApi.getProducts(queryConfig);
        },
        staleTime: 3 * 60 * 1000,
        enabled: Boolean(product),
    });

    const addToCartMutation = useMutation(purchaseApi.addToCart);

    useEffect(() => {
        if (product && product.images.length > 0) {
            setActiveImage(product.images[0]);
        }
    }, [product]);

    const chooseActive = (img: string) => {
        setActiveImage(img);
    };

    const next = () => {
        if (currentIndexImages[1] < (product as ProductType)?.images.length) {
            setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
        }
    };

    const Prev = () => {
        if (currentIndexImages[0] > 0) {
            setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
        }
    };

    const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        /** chú tích
         * pageX,PageY : là vị trí con trỏ chuột trong page (ý là vị trí trong cả web)
         * offsetX,offsetY: là vị trí con trỏ chuột trong element gọi sự kiện
         * rect: để lấy thông tin cơ bản của element gọi sự kiên (e)
         * naturalWidth,naturalHeight: là chiều rộng và cao mặc định của bức ảnh (width,height gốc)
         */

        const rect = e.currentTarget.getBoundingClientRect();

        const image = imageRef.current as HTMLImageElement;
        const { naturalWidth, naturalHeight } = image;

        // const { offsetX, offsetY, pageX, pageY } = e.nativeEvent; đây là cách lấy ra vị trị chuột trong element nhưng bị sự kiện nổi bọt
        const offsetX = e.pageX - (rect.x + window.scrollX); // đây là cách lấy vị trí chuột trong element kh bị sự kiện nổi bọt
        const offsetY = e.pageY - (rect.y + window.scrollY);

        const top = offsetY * (1 - naturalHeight / rect.height);
        const left = offsetX * (1 - naturalWidth / rect.width);

        image.style.width = naturalWidth + 'px';
        image.style.height = naturalHeight + 'px';
        image.style.top = top + 'px';
        image.style.left = left + 'px';
        image.style.maxWidth = 'unset';
    };

    const handleRemoveZoom = () => {
        imageRef.current?.removeAttribute('style');
    };

    const handleBuyCount = (value: number) => {
        setBuyCount(value);
    };

    const addToCart = () => {
        if (isAuthenticated) {
            addToCartMutation.mutate(
                { buy_count: buyCount, product_id: product?._id as string },
                {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries({ queryKey: ['purchase', { status: purchasesStatus.inCart }] });
                        toast.success(data.data.message, {
                            autoClose: 1000,
                        });
                    },
                },
            );
        } else {
            navigate(`${path.login}`);
        }
    };

    const buyNow = async () => {
        if (isAuthenticated) {
            const res = await addToCartMutation.mutateAsync({
                buy_count: buyCount,
                product_id: product?._id as string,
            });
            const purchase = res.data.data;
            navigate(path.cart, {
                state: {
                    purchaseId: purchase._id,
                },
            });
        } else {
            navigate(`${path.login}`);
        }
    };

    if (!product) return null;

    return (
        <div className="bg-gray-200 py-6">
            <Helmet>
                <title>{product.name} | Shopee clone</title>
                <meta
                    name="description"
                    content={convert(product.description, {
                        limits: {
                            maxInputLength: 150,
                        },
                    })}
                />
            </Helmet>
            <div className="container">
                <div className="bg-white p4 shadow">
                    <div className="grid grid-cols-12 gap-9">
                        <div className="col-span-5">
                            <div
                                className="relative w-full pt-[100%] shadow overflow-hidden"
                                onMouseLeave={handleRemoveZoom}
                                onMouseMove={handleZoom}
                            >
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="absolute top-0 left-0 h-full w-full bg-white object-cover "
                                    ref={imageRef}
                                />
                            </div>
                            <div className="relative mt-4 grid grid-cols-5 gap-1">
                                <button
                                    onClick={Prev}
                                    className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
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
                                            d="M15.75 19.5L8.25 12l7.5-7.5"
                                        />
                                    </svg>
                                </button>
                                {currentImages.map((img) => {
                                    const isActive = img === activeImage;
                                    return (
                                        <div
                                            className="relative w-full pt-[100%]"
                                            key={img}
                                            onClick={() => chooseActive(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={product.name}
                                                className="absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover"
                                            />
                                            {isActive && (
                                                <div className="absolute inset-0 border-2 border-orange"></div>
                                            )}
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={next}
                                    className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
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
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="col-span-7">
                            <h1 className="text-xl font-medium uppercase">{product.name}</h1>
                            <div className="mt-8 flex items-center">
                                <div className="flex items-center">
                                    <span className="mr-1 border-b border-b-orange text-orange">{product.rating}</span>
                                    <ProductRating
                                        rating={product.rating}
                                        activeClassName="fill-orange text-orange h-4 w-4"
                                        nonActiveClassName="fill-gray-300 text-gray-300 h-4 w-4"
                                    />
                                </div>
                                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                                <div>
                                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                                    <span className="ml-1 text-gray-500">Đã bán</span>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                                <div className="text-gray-500 line-through">
                                    ₫{formatCurrency(product.price_before_discount)}
                                </div>
                                <div className="ml-3 text-3xl font-medium text-orange">
                                    ₫{formatCurrency(product.price)}
                                </div>
                                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                                    {rateSale(product.price_before_discount, product.price)} giảm
                                </div>
                            </div>
                            <div className="mt-8 flex items-center">
                                <div className="capitalize text-gray-500">Số lượng</div>
                                <QuantityController
                                    onDecrease={handleBuyCount}
                                    onIncrease={handleBuyCount}
                                    onType={handleBuyCount}
                                    value={buyCount}
                                    max={product.quantity}
                                />
                                <div className="ml-6 text-sm text-gray-500">
                                    {product.quantity} {t('available')}
                                </div>
                            </div>
                            <div className="mt-8 flex items-center">
                                <button
                                    onClick={addToCart}
                                    className="flex h-12 items-center justify-center rounded-sm border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5"
                                >
                                    <svg
                                        enableBackground="new 0 0 15 15"
                                        viewBox="0 0 15 15"
                                        x={0}
                                        y={0}
                                        className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange"
                                    >
                                        <g>
                                            <g>
                                                <polyline
                                                    fill="none"
                                                    points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit={10}
                                                />
                                                <circle cx={6} cy="13.5" r={1} stroke="none" />
                                                <circle cx="11.5" cy="13.5" r={1} stroke="none" />
                                            </g>
                                            <line
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeMiterlimit={10}
                                                x1="7.5"
                                                x2="10.5"
                                                y1={7}
                                                y2={7}
                                            />
                                            <line
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeMiterlimit={10}
                                                x1={9}
                                                x2={9}
                                                y1="8.5"
                                                y2="5.5"
                                            />
                                        </g>
                                    </svg>
                                    Thêm vào giỏ hàng
                                </button>
                                <button
                                    onClick={buyNow}
                                    className="ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="container">
                    <div className="bg-white p-4 shadow">
                        <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
                            <div className="mx-4 mt-12 mb-4 text-sm leading-loose">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(`${product.description}`),
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="container">
                    <div className="uppercase text-gray-400">CÓ THỂ BẠN CŨNG THÍCH</div>
                    {productsData && (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {productsData.data.data.products.map((product) => (
                                <div className="col-span-1" key={product._id}>
                                    <Product product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
