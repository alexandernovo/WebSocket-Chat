import React from 'react';

const Input = ({ label, id, name, type, placeholder, value, onChange, classes, onInput, onClick }) => {
    const className = `${classes} block rounded-2xl px-2.5 pb-3.5 pt-4  w-full text-sm text-black bg-white border border-gray-400 appearance-none text-black focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`;
    return (
        <div className='w-full relative'>

            <input
                className={className}
                id={id}
                name={name}
                type={type}
                autoComplete={name}
                placeholder=" "
                value={value}
                onChange={onChange}
                onInput={onInput}
                onClick={onClick}
                required
            />
            <label htmlFor={id} className="absolute text-sm text-gray-500 px-2 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:bg-white peer-focus:scale-75 peer-focus:-translate-y-6">{label}</label>
        </div>
    );
};

export default Input;
