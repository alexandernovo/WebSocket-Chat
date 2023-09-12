import React from 'react';

const Button = ({ type, children }) => {
    return (
        <button type={type} className='w-full py-2 rounded-lg bg-blue-500 text-[13px] font-semibold text-white tracking-widest mt-3'>
            {children}
        </button>
    );
};

export default Button;
