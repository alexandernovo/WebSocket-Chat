import React from 'react'

const Empty = ({ setToggle }) => {
    return (
        <div className='h-screen glass flex flex-col justify-between'>
            <div className='mt-3 flex-1 flex justify-center items-center'>
                <div>
                    <p className='text-center text-gray-500 text-[20px] mb-2'>No Selected Contact</p>
                    <p className='text-center text-gray-500 text-[15px]'>Please select a contact to message</p>
                    <p className='text-center text-gray-500 text-[15px]'>or</p>
                    <p className='text-center text-gray-500 text-[15px]'>Search a contact</p>
                </div>

            </div>
        </div>
    )
}

export default Empty
