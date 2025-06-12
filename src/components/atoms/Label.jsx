import React from 'react';

const Label = ({ htmlFor, children, className }) => {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className || ''}`}>
            {children}
        </label>
    );
};

export default Label;