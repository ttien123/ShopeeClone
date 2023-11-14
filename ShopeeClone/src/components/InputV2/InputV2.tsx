import { InputHTMLAttributes, useState } from 'react';

import { useController, UseControllerProps } from 'react-hook-form';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string;
    classNameError?: string;
}

function InputV2(props: UseControllerProps<any> & InputNumberProps) {
    const {
        type,
        onChange,
        className,
        classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
        classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
        value = '',
        ...rest
    } = props;
    const { field, fieldState } = useController(props);
    const [localValue, setLocalValue] = useState<string>(field.value);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const valueFormInput = event.target.value;
        // (/^\d+$/.test(value) || value === '') là để kiểm tra xem có phải là số hoặc "" không
        const numberCondition = type === 'number' && (/^\d+$/.test(valueFormInput) || valueFormInput === '');
        if (numberCondition || type !== 'number') {
            setLocalValue(valueFormInput);
            field.onChange(event);
            onChange && onChange(event);
        }
    };
    return (
        <div className={className}>
            <input
                className={classNameInput}
                {...rest}
                {...field}
                value={value || localValue}
                onChange={handleChange}
            />
            <div className={classNameError}>{fieldState.error?.message}</div>
        </div>
    );
}

export default InputV2;
