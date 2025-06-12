import React from 'react';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';

const FormField = ({ label, id, error, children, className, inputProps = {}, type = 'text', rows, options }) => {
    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            {children ? (
                // Render custom children (like select or custom input elements)
                React.cloneElement(children, {
                    id,
                    className: `${children.props.className || ''} ${error ? 'border-error' : 'border-surface-300'}`,
                })
            ) : (
                <Input
                    id={id}
                    type={type}
                    rows={rows}
                    options={options}
                    className={error ? 'border-error' : 'border-surface-300'}
                    {...inputProps}
                />
            )}
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
};

export default FormField;