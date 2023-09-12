import React from 'react'

const Empty = ({ setToggle }) => {
    return (
        <div className='h-screen glass flex flex-col justify-between'>
            <div className='p-3 flex justify-end items-center bck h-[60px]'>
                <button className='block lg:hidden' onClick={setToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            <div className='mt-3 flex-1 flex justify-center items-center'>
                <div>
                    <p className='text-center text-gray-300 text-[20px]'>No Selected Contact</p>
                    <p className='text-center text-gray-300 text-[15px]'>Please select a contact to message</p>
                </div>

            </div>
        </div>
    )
}

export default Empty
