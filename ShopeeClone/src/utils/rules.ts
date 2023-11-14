import type { RegisterOptions, UseFormGetValues } from 'react-hook-form';
import * as yup from 'yup';

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions };
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
    email: {
        required: {
            value: true,
            message: 'Email là bắt buộc',
        },
        pattern: {
            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: 'Email không đúng định dạng',
        },
        minLength: {
            value: 5,
            message: 'Độ dài từ 5 - 160 ký tự',
        },
        maxLength: {
            value: 160,
            message: 'Độ dài từ 5 - 160 ký tự',
        },
    },
    password: {
        required: {
            value: true,
            message: 'Password là bắt buộc',
        },

        minLength: {
            value: 6,
            message: 'Độ dài từ 6 - 160 ký tự',
        },
        maxLength: {
            value: 160,
            message: 'Độ dài từ 6 - 160 ký tự',
        },
    },
    confirm_password: {
        required: {
            value: true,
            message: 'Nhập lại password là bắt buộc',
        },

        minLength: {
            value: 6,
            message: 'Độ dài từ 6 - 160 ký tự',
        },
        maxLength: {
            value: 160,
            message: 'Độ dài từ 6 - 160 ký tự',
        },
        validate:
            typeof getValues === 'function'
                ? (value) => value === getValues('password') || 'Nhập lại mật khẩu không khớp'
                : undefined,
    },
});

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
    const { price_min, price_max } = this.parent as { price_min: string; price_max: string };
    if (price_min !== '' && price_max !== '') {
        return Number(price_max) >= Number(price_min);
    }
    return price_min !== '' || price_max !== '';
}

const handleConfirmPasswordYup = (refString: string) => {
    return yup
        .string()
        .required('Nhập lại password là bắt buộc')
        .min(5, 'Độ dài từ 5 - 160 ký tự')
        .max(160, 'Độ dài từ 5 - 160 ký tự')
        .oneOf([yup.ref(refString)], 'Nhập lại mật khẩu không khớp');
};

export const schema = yup.object({
    email: yup
        .string()
        .required('email là bắt buộc')
        .email('Email không đúng định dạng')
        .min(5, 'Độ dài từ 5 - 160 ký tự')
        .max(160, 'Độ dài từ 5 - 160 ký tự'),
    password: yup
        .string()
        .required('Password là bắt buộc')
        .min(5, 'Độ dài từ 5 - 160 ký tự')
        .max(160, 'Độ dài từ 5 - 160 ký tự'),
    confirm_password: handleConfirmPasswordYup('password'),
    price_min: yup.string().test({
        name: 'price-not-allowed',
        message: 'Giá không phù hợp',
        test: testPriceMinMax,
    }),
    price_max: yup.string().test({
        name: 'price-not-allowed',
        message: 'Giá không phù hợp',
        test: testPriceMinMax,
    }),
    name: yup.string().trim().required('Tên sản phẩm là bắt buộc'),
});

export const userSchema = yup.object({
    name: yup.string().max(160, 'Đọ dài tối da là 160 ký tự'),
    phone: yup.string().max(20, 'Đọ dài tối da là 20 ký tự'),
    avatar: yup.string().max(1000, 'Đọ dài tối da là 1000 ký tự'),
    address: yup.string().max(160, 'Đọ dài tối da là 160 ký tự'),
    date_of_birth: yup.date().max(new Date(), 'Hãy chọn 1 ngày trong quá khứ'),
    password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
    new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
    confirm_password: handleConfirmPasswordYup('new_password'),
});

export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
