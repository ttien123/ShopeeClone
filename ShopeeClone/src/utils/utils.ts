import axios, { AxiosError } from 'axios';
import HttpStatusCode from 'src/constants/httpStatusCode.enum';

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
    return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

// chuyển đổi số từ 10000 => 10.000

export function formatCurrency(currency: number) {
    return new Intl.NumberFormat('de-DE').format(currency);
}

// chuyển đổi số từ 10000 => 10K

export function formatNumberToSocialStyle(value: number) {
    return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    })
        .format(value)
        .replace('.', ',')
        .toLocaleLowerCase();
}
