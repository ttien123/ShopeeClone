import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import config from 'src/constants/config';

interface Props {
    onChange?: (file?: File) => void;
}

const InputFile = ({ onChange }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileFromLocal = e.target.files?.[0];
        if (
            fileFromLocal &&
            (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))
        ) {
            toast.error('Dụng lượng file tối đa 1 MB Định dạng: .JPEG, .PNG', {
                position: 'top-center',
                autoClose: 1000,
            });
        } else {
            onChange && onChange(fileFromLocal);
        }
    };
    return (
        <>
            <input
                className="hidden"
                type="file"
                accept=".jpg,.jpeg,.png"
                ref={fileInputRef}
                onChange={onFileChange}
                onClick={(e) => ((e.target as any).value = null)}
            />
            <button
                type="button"
                onClick={handleUpload}
                className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
            >
                Chọn ảnh
            </button>
        </>
    );
};

export default InputFile;
