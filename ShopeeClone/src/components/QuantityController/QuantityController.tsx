import InputNumber, { InputNumberProps } from '../InputNumber';
import { useState } from 'react';
interface Props extends InputNumberProps {
    max?: number;
    onIncrease?: (value: number) => void;
    onDecrease?: (value: number) => void;
    onType?: (value: number) => void;
    onFocusOut?: (value: number) => void;
    classNameWrapper?: string;
}

const QuantityController = ({
    onDecrease,
    onIncrease,
    max,
    classNameWrapper = 'ml-10',
    onType,
    onFocusOut,
    value,
    ...rest
}: Props) => {
    const [localValue, setLocalValue] = useState(Number(value || 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let _value = Number(e.target.value);
        if (max !== undefined && _value > max) {
            _value = max;
        } else if (_value < 1) {
            _value = 1;
        }
        onType && onType(_value);
        setLocalValue(_value);
    };

    const increase = () => {
        let _value = Number(value || localValue) + 1;
        if (max !== undefined && _value > max) {
            _value = max;
        }
        onIncrease && onIncrease(_value);
        setLocalValue(_value);
    };

    const decrease = () => {
        let _value = Number(value || localValue) - 1;
        if (_value < 1) {
            _value = 1;
        }
        onDecrease && onDecrease(_value);
        setLocalValue(_value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        onFocusOut && onFocusOut(Number(e.target.value));
    };

    return (
        <div className={`flex items-center` + classNameWrapper}>
            <button
                className="flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-300"
                onClick={decrease}
            >
                <svg enableBackground="new 0 0 10 10" viewBox="0 0 10 10" x={0} y={0} className="h-4 w-4">
                    <polygon points="4.5 4.5 3.5 4.5 0 4.5 0 5.5 3.5 5.5 4.5 5.5 10 5.5 10 4.5" />
                </svg>
            </button>
            <InputNumber
                className=""
                classNameError="hidden "
                classNameInput="h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none"
                onChange={handleChange}
                onBlur={handleBlur}
                value={value || localValue}
                {...rest}
            />
            <button
                className="flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-300"
                onClick={increase}
            >
                <svg enableBackground="new 0 0 10 10" viewBox="0 0 10 10" x={0} y={0} className="w-4 h-4">
                    <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5" />
                </svg>
            </button>
        </div>
    );
};

export default QuantityController;
