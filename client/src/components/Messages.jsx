import React, { useState, useEffect } from 'react';
import Placeholder from '../assets/profile/placeholder.jpg';
import axios from 'axios';
import io from 'socket.io-client';
import { DatetoString } from '../utils/Date';
import { getSessionData } from '../utils/Session';

const Messages = ({ onClick }) => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [socketInstance, setSocketInstance] = useState(null);
    const [userID, setUserID] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const token = sessionStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getSessionData();
            setUserID(response.data._id);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        setSocketInstance(socket);
        // Clean up socket when component is unmounted
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socketInstance) {
            socketInstance.on('connect', () => {
                console.log('Connected to WebSocket');
            });

            socketInstance.on('disconnect', () => {
                console.log('Disconnected from WebSocket');
            });
            // Listen for 'onlineUsers' event
            socketInstance.on('onlineUsers', (users) => {
                setOnlineUsers(users);
            });

            // Emit 'setOnlineUsers' event
            socketInstance.emit('setOnlineUsers', token);
        }
        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [socketInstance]);

    const fetchData = () => {
        if (token) {
            axios.get('/api/chat/getMessages', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    setMessages(response.data.data.messages);
                    setUser(response.data.data.token);
                }
            }).catch((error) => {
                console.log('error :', error);
            });
        } else {
            console.log('Error: Token not Provided');
        };
    };

    useEffect(() => {
        // Function to fetch data initially
        const fetchInitialData = () => {
            fetchData();
        };

        // Function to fetch data when searchInput changes
        const fetchUpdatedData = () => {
            fetchData();
        };

        // Fetch data initially
        fetchInitialData();

        // Fetch data immediately when component is re-mounted
        fetchData();

        // Set interval to fetch data every 5 seconds
        const interval = setInterval(fetchUpdatedData, 5000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className='h-full'>
            <p className='text-gray-500 text-[13px] mb-2 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                Messages
            </p>
            {messages && messages.length !== 0 ? (
                messages
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((message, index) => (
                        <div key={index} className='mb-3 text-white '>
                            <div className='flex items-center py-1'>
                                <img
                                    src={user === message.sender._id ? (message.receiver.image || Placeholder) : (message.sender.image || Placeholder)}
                                    className='h-11 w-11 rounded-full object-cover border'
                                />

                                <div className='ms-2'>
                                    {user === message.sender._id ? (
                                        <div className='flex items-center'>
                                            <div className='cursor-pointer' onClick={() => onClick(message.receiver._id)}>
                                                <div className="flex items-center">
                                                    <div className={`h-2 w-2 ${onlineUsers.includes(message.receiver._id) ? 'bg-green-500' : 'bg-gray-500'} rounded-full me-1`}></div> {/*online circle*/}
                                                    <h6 className={`text-[14px] text-gray-700`}>{`${message.receiver.firstname} ${message.receiver.lastname}`}</h6>
                                                </div>
                                                <div className='flex items-center'>
                                                    <p className='text-[11px] text-gray-400 truncate max-w-[140px]'>{`You: ${message.message}`}</p>
                                                    <p className='text-gray-500 text-[11px] ms-2'>{DatetoString(message.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='cursor-pointer' onClick={() => onClick(message.sender._id)}>
                                            <div className="flex items-center">
                                                <div className={`h-2 w-2 ${onlineUsers.includes(message.sender._id) ? 'bg-green-500' : 'bg-gray-500'} rounded-full me-1`}></div> {/*online circle*/}
                                                <h6 className={`text-[14px] text-gray-700`}>{`${message.sender.firstname} ${message.sender.lastname}`}</h6>
                                            </div>
                                            <div className='flex items-center'>
                                                <p className='text-[11px] text-gray-400 truncate'>{message.message}</p>
                                                <p className='text-gray-500 text-[11px] ms-2'>{DatetoString(message.createdAt)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
            ) : (
                <p className='text-gray-300 text-center text-[13px]'>No Messages.</p>
            )}
        </div>
    );
};

export default Messages;
