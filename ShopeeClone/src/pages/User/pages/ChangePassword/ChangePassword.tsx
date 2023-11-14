import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import userApi from 'src/apis/user.api';

import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { UserSchema, userSchema } from 'src/utils/rules';
// import { omit } from 'lodash';
import omit from 'lodash/omit';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>;
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password']);

const ChangePassword = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setError,
    } = useForm<FormData>({
        defaultValues: {
            password: '',
            new_password: '',
            confirm_password: '',
        },
        resolver: yupResolver(passwordSchema),
    });

    const updateProfileMutation = useMutation(userApi.updateProfile);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']));
            reset();
            toast.success(res.data.message, {
                autoClose: 1000,
            });
        } catch (error) {
            if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
                const formError = error.response?.data.data;
                if (formError) {
                    console.log(Object.keys(formError));

                    Object.keys(formError).forEach((key) => {
                        setError(key as keyof FormData, {
                            message: formError[key as keyof FormData] as string | undefined,
                            type: 'Server',
                        });
                    });
                }
            }
        }
    });

    return (
        <div className="rounded-sm bg-wihte px-2 md:px-7 pb-10 md:pb-20 shadow">
            <div className="border-b border-b-gray-200 py-6">
                <h1 className="text-lg font-medium capitalize text-gray-900">Đổi mật khẩu</h1>
                <div className="mt-1 text-sm text-gray-700">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>
            <form className="mt-8 mr-auto max-w-2xl" onSubmit={onSubmit}>
                <div className="mt-6 flex-grow md:pr-12 md:mt-0">
                    <div className="flex flex-wrap flex-col sm:flex-row mt-2">
                        <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Mật khẩu cũ</div>
                        <div className="sm:w-[80%] sm:pl-5">
                            <Input
                                register={register}
                                name="password"
                                type="password"
                                placeholder="Mật khẩu cũ"
                                errorsMessage={errors.password?.message}
                                className="relative"
                                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col sm:flex-row mt-2">
                        <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Mật khẩu mới</div>
                        <div className="sm:w-[80%] sm:pl-5">
                            <Input
                                register={register}
                                name="new_password"
                                type="password"
                                placeholder="Mật khẩu mới"
                                errorsMessage={errors.new_password?.message}
                                className="relative"
                                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col sm:flex-row mt-2">
                        <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Nhập lại mật khẩu</div>
                        <div className="sm:w-[80%] sm:pl-5">
                            <Input
                                register={register}
                                name="confirm_password"
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                errorsMessage={errors.confirm_password?.message}
                                className="relative"
                                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
                        <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize" />
                        <div className="sm:w-[80%] sm:pl-5">
                            <Button
                                type="submit"
                                className="flex rounded-sm items-center h-9 bg-orange px-5 text-center text-sm text-white hover:bg-orange/80"
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
