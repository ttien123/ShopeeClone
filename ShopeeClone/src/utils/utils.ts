import axios, { AxiosError } from 'axios';
import config from 'src/constants/config';
import userImage from 'src/assets/img/user.svg';
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
export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%';

// đoạn dưới để custom URL
// hàm removeSpecialCharacter để loại bỏ ký tự đặc biệt khỏi chuỗi
const removeSpecialCharacter = (str: string) =>
    str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '');

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
    // /\s/g là dấu cách theo regex => replace(/\s/g, '-') thay dấu cách thành - trong chuỗi
    return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`;
};

export const getIdFromNameId = (nameId: string) => {
    const arr = nameId.split('-i-');

    return arr[arr.length - 1];
};

// dưới này là công thức render công thức đường link avatar kh nhận đc chuỗi avatar từ server trả về
export const getAvatarUrl = (avatarName?: string) => (avatarName ? `${config.baseUrl}images/${avatarName}` : userImage);
