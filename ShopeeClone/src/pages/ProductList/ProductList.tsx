import { useQuery } from 'react-query';
import AsideFilter from './components/AsideFilter';
import Product from './components/Product';
import SortProductList from './components/SortPRroductList';
import productApi from 'src/apis/product.api';
import Pagination from 'src/components/Pagination';
import { productListConfig } from 'src/types/product.type';
import categoryApi from 'src/apis/category.api';
import useQueryConfig from 'src/hooks/useQueryConfig';
import { Helmet } from 'react-helmet-async';

const ProductList = () => {
    const queryConfig = useQueryConfig();

    const { data: productData } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productApi.getProducts(queryConfig as productListConfig);
        },
        keepPreviousData: true,
        staleTime: 3 * 60 * 1000,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return categoryApi.getCategories();
        },
    });

    return (
        <div className="bg-gray-200 py-6">
            <Helmet>
                <title>Trang chủ | Shopee clone</title>
                <meta name="description" content="Trang chủ dự án Shopee clone" />
            </Helmet>
            <div className="container">
                {productData && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
                        </div>
                        <div className="col-span-9">
                            <SortProductList
                                queryConfig={queryConfig}
                                pageSize={productData.data.data.pagination.page_size}
                            />
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {productData.data.data.products.map((product) => (
                                    <div className="col-span-1" key={product._id}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                queryConfig={queryConfig}
                                pageSize={productData.data.data.pagination.page_size}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
