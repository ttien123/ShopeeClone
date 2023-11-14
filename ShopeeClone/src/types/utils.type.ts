export interface SuccessResponse<Data> {
    message: string;
    data: Data;
}
export interface ErrorResponse<Data> {
    message: string;
    data: Data;
}

// NoUndefinedField dùng để loại bỏ những trường undefined
export type NoUndefinedField<T> = {
    [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
