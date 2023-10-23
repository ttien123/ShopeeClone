import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';

import { schema, Schema } from 'src/utils/rules';
import { login } from 'src/apis/auth.api';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import Input from 'src/components/Input';

type FormData = Omit<Schema, 'confirm_password'>;
const loginSchema = schema.omit(['confirm_password']);
const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => login(body),
    });

    const onSubmit = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
                    const formError = error.response?.data.data;

                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            console.log(formError);

                            setError(key as keyof FormData, {
                                message: formError[key as keyof FormData],
                                type: 'Server',
                            });
                        });
                    }
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
                            <div className="text-2xl">Đăng nhập</div>
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
                            <button className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600">
                                Đăng nhập
                            </button>
                            <div className="flex items-center justify-center mt-8">
                                <span className="text-slate-400">bạn chưa có tài khoản?</span>
                                <Link className="text-red-400 ml-1" to={'/register'}>
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
