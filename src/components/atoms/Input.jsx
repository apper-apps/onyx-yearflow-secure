import React from 'react';

const Input = ({ type = 'text', id, value, onChange, placeholder, className, min, max, rows, disabled, ...rest }) => {
    const commonProps = {
        id,
        value,
        onChange,
        placeholder,
        className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${className || ''}`,
        disabled,
        ...rest,
    };

    if (type === 'textarea') {
        return <textarea rows={rows} {...commonProps} />;
    } else if (type === 'select') {
        const { options = [], ...selectProps } = rest;
        return (
            <select {...commonProps} className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    } else {
        return <input type={type} min={min} max={max} {...commonProps} />;
    }
};

export default Input;