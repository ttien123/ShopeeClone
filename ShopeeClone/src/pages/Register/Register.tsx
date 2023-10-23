import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { omit } from 'lodash';

import { schema, Schema } from 'src/utils/rules';
import Input from 'src/components/Input';
import { registerAccount } from 'src/apis/auth.api';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';

type FormData = Schema;
const Register = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body),
    });

    const onSubmit = handleSubmit((data) => {
        const body = omit(data, ['confirm_password']);
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
                    const formError = error.response?.data.data;

                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof Omit<FormData, 'confirm_password'>, {
                                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                                type: 'Server',
                            });
                        });
                    }

                    // if (formError?.email) {
                    //     setError('email', {
                    //         message: formError.email,
                    //         type: 'Server',
                    //     });
                    // }
                    // if (formError?.password) {
                    //     setError('password', {
                    //         message: formError.password,
                    //         type: 'Server',
                    //     });
                    // }
                }
            },
        });
    });
    return (
        <div className="bg-orange">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
                    <div className="lg:col-span-2 lg:col-start-4">
                        <form className="p-10 rounded bg-white shadow-sm" onSubmit={onSubmit} noValidate>
                            <div className="text-2xl">Đăng ký</div>
                            <Input
                                name="email"
                                register={register}
                                type="email"
                                className="mt-8"
                                errorsMessage={errors.email?.message}
                                placeholder="Email"
                            />
                            <Input
                                name="password"
                                register={register}
                                type="password"
                                className="mt-2"
                                errorsMessage={errors.password?.message}
                                placeholder="Password"
                                autoComplete="on"
                            />
                            <Input
                                name="confirm_password"
                                register={register}
                                type="password"
                                className="mt-2"
                                errorsMessage={errors.confirm_password?.message}
                                placeholder="Confirm password"
                                autoComplete="on"
                            />

                            <div className="mt-2">
                                <button className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600">
                                    Đăng ký
                                </button>
                            </div>
                            <div className="flex items-center justify-center mt-8">
                                <span className="text-slate-400">bạn đã có tài khoản?</span>
                                <Link className="text-red-400 ml-1" to={'/login'}>
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
