import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, disabled, type = 'button', whileHover, whileTap, ...rest }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            whileHover={whileHover}
            whileTap={whileTap}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;