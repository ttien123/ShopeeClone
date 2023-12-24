import { InputHTMLAttributes, forwardRef, useState } from 'react';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
    errorsMessage?: string;
    classNameInput?: string;
    classNameError?: string;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
    {
        className,
        errorsMessage,
        autoComplete,
        classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
        classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
        onChange,
        value = '',
        ...rest
    },
    ref,
) {
    const [localValue, setLocalValue] = useState<string>(value as string);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        // (/^\d+$/.test(value) || value === '') là để kiểm tra xem có phải là số hoặc "" không
        if (/^\d+$/.test(value) || value === '') {
            onChange && onChange(event);
            setLocalValue(value);
        }
    };
    return (
        <div className={className}>
            <input
                className={classNameInput}
                {...rest}
                value={value === undefined ? localValue : value}
                onChange={handleChange}
                ref={ref}
            />
            <div className={classNameError}>{errorsMessage}</div>
        </div>
    );
});

export default InputNumber;
