import { useContext, useEffect, useState, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import userApi from 'src/apis/user.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { UserSchema, userSchema } from 'src/utils/rules';
import { yupResolver } from '@hookform/resolvers/yup';
import InputNumber from 'src/components/InputNumber';
import DateSelect from '../../Components/DateSelect';
import { toast } from 'react-toastify';
import { AppContext } from 'src/contexts/app.context';
import { setProfileToLS } from 'src/utils/auth';
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import InputFile from 'src/components/InputFile';

function Info() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<FormData>();
    return (
        <>
            <div className="flex flex-wrap flex-col sm:flex-row mt-6">
                <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Tên</div>
                <div className="sm:w-[80%] sm:pl-5">
                    <Input
                        register={register}
                        name="name"
                        placeholder="Tên"
                        errorsMessage={errors.name?.message}
                        classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                    />
                </div>
            </div>
            <div className="flex flex-wrap flex-col sm:flex-row mt-2">
                <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Số điện thoại</div>
                <div className="sm:w-[80%] sm:pl-5">
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <InputNumber
                                placeholder="Số điện thoại"
                                errorsMessage={errors.phone?.message}
                                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                                {...field}
                                name="phone"
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </div>
        </>
    );
}

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>;
type FormDataError = Omit<FormData, 'date_of_birth'> & {
    date_of_birth?: string;
};

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar']);

const Profile = () => {
    const [file, setFile] = useState<File>();
    const previewImage = useMemo(() => {
        // URL.createObjectURL(file) để tạo 1 URL cho ảnh đc tải lên và có thể show nó ra để preview
        return file ? URL.createObjectURL(file) : '';
    }, [file]);
    const { setProfile } = useContext(AppContext);
    const methods = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: '',
            avatar: '',
            address: '',
            date_of_birth: new Date(1990, 0, 1),
        },
        resolver: yupResolver(profileSchema),
    });

    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        setError,
        watch,
    } = methods;

    const { data: profileData, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: userApi.getProfile,
    });

    const avatar = watch('avatar');

    const profile = profileData?.data.data;

    const updateProfileMutation = useMutation(userApi.updateProfile);
    const uploadAvatarMutation = useMutation(userApi.uploadAvatar);

    useEffect(() => {
        if (profile) {
            setValue('name', profile.name);
            setValue('phone', profile.phone);
            setValue('address', profile.address);
            setValue('avatar', profile.avatar);
            setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1));
        }
    }, [profile, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            let avatarName = avatar;
            if (file) {
                const form = new FormData();
                form.append('image', file);
                const uploadRes = await uploadAvatarMutation.mutateAsync(form);
                avatarName = uploadRes.data.data;
                setValue('avatar', avatarName);
            }
            const res = await updateProfileMutation.mutateAsync({
                ...data,
                date_of_birth: data.date_of_birth?.toISOString(),
                avatar: avatarName,
            });
            setProfileToLS(res.data.data);
            setProfile(res.data.data);
            refetch();
            toast.success(res.data.message, {
                autoClose: 1000,
            });
        } catch (error) {
            if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
                const formError = error.response?.data.data;
                if (formError) {
                    Object.keys(formError).forEach((key) => {
                        setError(key as keyof FormDataError, {
                            message: formError[key as keyof FormDataError],
                            type: 'Server',
                        });
                    });
                }
            }
        }
    });

    const handleChangeFile = (file?: File) => {
        setFile(file);
    };

    return (
        <div className="rounded-sm bg-wihte px-2 md:px-7 pb-10 md:pb-20 shadow">
            <div className="border-b border-b-gray-200 py-6">
                <h1 className="text-lg font-medium capitalize text-gray-900">Hồ Sơ Của Tôi</h1>
                <div className="mt-1 text-sm text-gray-700">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>
            <FormProvider {...methods}>
                <form className="mt-8 flex flex-col-reverse md:flex-row md:items-start" onSubmit={onSubmit}>
                    <div className="mt-6 flex-grow md:pr-12 md:mt-0">
                        <div className="flex flex-wrap flex-col sm:flex-row">
                            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Email</div>
                            <div className="sm:w-[80%] sm:pl-5">
                                <div className="pt-3 text-gray-700">{profile?.email}</div>
                            </div>
                        </div>
                        <Info />
                        <div className="flex flex-wrap flex-col sm:flex-row mt-2">
                            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">Địa chỉ</div>
                            <div className="sm:w-[80%] sm:pl-5">
                                <Input
                                    register={register}
                                    name="address"
                                    placeholder="Địa chỉ"
                                    errorsMessage={errors.address?.message}
                                    classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                                />
                            </div>
                        </div>
                        <Controller
                            control={control}
                            name="date_of_birth"
                            render={({ field }) => (
                                <DateSelect
                                    errorMessage={errors.date_of_birth?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

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
                    <div className="flex justify-center md:w-72 md:border-l md:border-l-gray-200">
                        <div className="flex flex-col items-center">
                            <div className="my-5 h-24 w-24">
                                <img
                                    src={previewImage || getAvatarUrl(avatar)}
                                    alt=""
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                            <InputFile onChange={handleChangeFile} />
                            <div className="mt-3 text-gray-400"></div>
                            <div>Dụng lượng file tối đa 1 MB</div>
                            <div>Định dạng:.JPEG, .PNG</div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default Profile;
