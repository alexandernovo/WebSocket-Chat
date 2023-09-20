import React, { useEffect, useState, useRef } from 'react'
import Avatar1 from '../assets/profile/avatar1.jpg'
import Input from './Input'
import Messages from './Messages'
import Contact from './Contact'
import Dropdown from './Dropdown'
import { getSessionData } from '../utils/Session'
import axios from 'axios'
import Placeholder from '../assets/profile/placeholder.jpg'


const Sidebar = ({ onClick, toggle, setToggle, handleProfile }) => {
    const [session, setSession] = useState({});
    const [searchStatus, setSearchStatus] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState({});

    const debounceTimerRef = useRef(null); // Ref to hold the debounce timer

    const handleInput = (event) => setSearchInput(event.target.value);

    useEffect(() => {
        getSessionData()
            .then(response => {
                setSession(response.data);
            })
            .catch(error => {
                console.log('Error Getting Session: ', error);
            });
    }, []);

    useEffect(() => {
        const performSearch = async (input) => {
            try {
                const response = await axios.get('/api/users/search', {
                    params: {
                        search: input
                    }
                });
                if (response.data && response.data.status === 'success') {
                    setSearchResult(response.data);
                }
            } catch (error) {
                console.error('Error performing search:', error);
            }
        };

        setSearchStatus(searchInput !== '');

        // Clear the previous timer if it exists
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new timer to perform search after a delay
        if (searchInput !== '') {
            debounceTimerRef.current = setTimeout(() => {
                performSearch(searchInput);
            }, 500); // Adjust the delay as needed 
        }
    }, [searchInput]);

    return (
        <div className={`w-[280px] h-full p-3 ${toggle ? 'block absolute top-0 z-10 w-full ' : 'hidden'} bg-gray-100 lg:block`}>
            <div className='flex flex-col h-full'>
                <div className='flex items-center py-3 justify-between'>
                    <div className='flex items-center'>
                        <img src={session && session.image ? session.image : Placeholder} className='h-10 w-10 rounded-full object-cover border' />
                        <h1 className='text-[14.6px] text-gray-500 ms-1'>{session && `${session.firstname} ${session.lastname} `}</h1>
                    </div>
                    <div className='flex items-center'>
                        <Dropdown handleProfile={handleProfile} />
                        {/* <button className='ms-3 block md:block lg:hidden' onClick={setToggle}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button> */}
                    </div>
                </div>
                <div className='flex items-center relative mt-3'>
                    <Input
                        classes="z-20 border-0 shadow"
                        placeholder="Search Contacts..."
                        value={searchInput}
                        label="Search"
                        onInput={handleInput}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute w-4 h-4 text-gray-300 right-3 self-center">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>

                <div className='mt-4 overflow-y-auto md:overflow-y-hidden lg:overflow-y-hidden lg:hover:overflow-y-auto md:hover:overflow-y-auto flex-1' >
                    {searchStatus ?
                        <Contact contact={searchResult.data} onClick={onClick} />
                        :
                        <Messages onClick={onClick} />
                    }
                </div>
            </div>
        </div >
    )
}

export default Sidebar
