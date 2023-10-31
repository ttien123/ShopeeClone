import http from 'src/utils/http';
import { Product, ProductList, productListConfig } from '../types/product.type';
import { SuccessResponse } from 'src/types/utils.type';

const URL = 'products';

const productApi = {
    getProducts(params: productListConfig) {
        return http.get<SuccessResponse<ProductList>>(URL, {
            params,
        });
    },
    getProductDetail(id: string) {
        return http.get<SuccessResponse<Product>>(`${URL}/${id}`);
    },
};

export default productApi;
