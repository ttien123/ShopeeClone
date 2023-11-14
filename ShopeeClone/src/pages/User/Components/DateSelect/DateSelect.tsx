import range from 'lodash/range';
import React, { useEffect, useState } from 'react';

interface Props {
    onChange?: (value: Date) => void;
    value?: Date;
    errorMessage?: string;
}

const DateSelect = ({ errorMessage, value, onChange }: Props) => {
    const [date, setDate] = useState({
        date: value?.getDate() || 1,
        month: value?.getMonth() || 0,
        year: value?.getFullYear() || 1990,
    });

    useEffect(() => {
        if (value) {
            setDate({
                date: value.getDate(),
                month: value.getMonth(),
                year: value.getFullYear(),
            });
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value: valueFormSelect, name } = e.target;
        const newDate = {
            date: value?.getDate() || date.date,
            month: value?.getMonth() || date.month,
            year: value?.getFullYear() || date.year,
            [name]: Number(valueFormSelect),
        };
        setDate(newDate);
        onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
    };

    return (
        <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 text-right capitalize">Ngày sinh</div>
            <div className="sm:w-[80%] sm:pl-5">
                <div className="flex justify-between">
                    <select
                        onChange={handleChange}
                        name="date"
                        className="h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer"
                        value={value?.getDate() || date.date}
                    >
                        <option disabled>Ngày</option>
                        {range(1, 32).map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={handleChange}
                        name="month"
                        className="h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer"
                        value={value?.getMonth() || date.month}
                    >
                        <option disabled>Tháng</option>
                        {range(0, 12).map((item) => (
                            <option value={item} key={item}>
                                {item + 1}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={handleChange}
                        name="year"
                        className="h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer"
                        value={value?.getFullYear() || date.year}
                    >
                        <option disabled>Năm</option>
                        {range(1990, 2024).map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-1 text-red-600 min-h-[1rem] text-sm">{errorMessage}</div>
            </div>
        </div>
    );
};

export default DateSelect;
