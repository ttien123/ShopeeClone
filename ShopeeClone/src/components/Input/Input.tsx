import type { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface Props {
    type: React.HTMLInputTypeAttribute;
    errorsMessage?: string;
    placeholder?: string;
    className?: string;
    name: string;
    register: UseFormRegister<any>;
    rules?: RegisterOptions;
    autoComplete?: string;
}

const Input = ({ register, type, className, errorsMessage, name, placeholder, rules, autoComplete }: Props) => {
    return (
        <div className={className}>
            <input
                type={type}
                className="p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                placeholder={placeholder}
                {...register(name, rules)}
                autoComplete={autoComplete}
            />
            <div className="mt-1 text-red-600 min-h-[1rem] text-sm">{errorsMessage}</div>
        </div>
    );
};

export default Input;
