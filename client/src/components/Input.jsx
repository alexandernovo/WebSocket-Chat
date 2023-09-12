import React from 'react';

const Input = ({ label, id, name, type, placeholder, value, onChange, classes, onInput, onClick }) => {
    const className = `${classes} shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-white text-[13px] leading-tight focus:outline-none focus:shadow-outline placeholder:text-gray-200 placeholder:text-[13px]`;
    return (
        <div className='w-full'>
            {label && (
                <label className='block text-white text-sm mb-1 text-[13px]' htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                className={className}
                id={id}
                name={name}
                type={type}
                autoComplete={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onInput={onInput}
                onClick={onClick}
                required
            />
        </div>
    );
};

export default Input;
