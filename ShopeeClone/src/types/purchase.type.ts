import { Product } from './product.type';

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5;

export type PurchaseListStatus = PurchaseStatus | 0;

export interface Purchase {
    buy_count: number;
    price: number;
    price_before_discount: number;
    status: PurchaseStatus;
    _id: string;
    user: string;
    product: Product;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ExtendedPurchase extends Purchase {
    disabled: boolean;
    checked: boolean;
}
