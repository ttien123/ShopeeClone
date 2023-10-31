import { InputHTMLAttributes } from 'react';
import type { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    errorsMessage?: string;
    classNameInput?: string;
    classNameError?: string;
    register?: UseFormRegister<any>;
    rules?: RegisterOptions;
}

const Input = ({
    register,
    className,
    errorsMessage,
    name,
    rules,
    autoComplete,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
    ...rest
}: Props) => {
    const registerResult = register && name ? register(name, rules) : null;
    return (
        <div className={className}>
            <input className={classNameInput} {...registerResult} {...rest} />
            <div className={classNameError}>{errorsMessage}</div>
        </div>
    );
};

export default Input;
