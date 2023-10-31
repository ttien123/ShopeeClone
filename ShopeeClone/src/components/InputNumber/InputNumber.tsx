import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    errorsMessage?: string;
    classNameInput?: string;
    classNameError?: string;
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
    {
        className,
        errorsMessage,
        autoComplete,
        classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
        classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
        onChange,
        ...rest
    },
    ref,
) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if ((/^\d+$/.test(value) || value === '') && onChange) {
            onChange(event);
        }
    };
    return (
        <div className={className}>
            <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} />
            <div className={classNameError}>{errorsMessage}</div>
        </div>
    );
});

export default InputNumber;
