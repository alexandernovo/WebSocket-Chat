import React from 'react';
import Placeholder from '../assets/profile/placeholder.jpg';

const Contact = ({ contact, onClick }) => {
    return (
        <div className='h-full'>
            {contact && contact.length !== 0 ? (contact.map(result => (
                <div key={result._id} className='mb-3 text-white cursor-pointer' onClick={() => onClick(result._id)}>
                    <div className='flex items-center py-1'>
                        <img src={result.image ? result.image : Placeholder} className='h-11 w-11 rounded-full object-cover border' />
                        <div className='ms-2'>
                            <h6 className='text-[14px] text-gray-700'>{contact ? (`${result.firstname} ${result.lastname}`) : ''}</h6>
                        </div>
                    </div>
                </div>
            ))

            )
                : (
                    <p className='text-gray-300 text-center text-[13px]'>No results found.</p>
                )
            }
        </div>
    );
};

export default Contact;
