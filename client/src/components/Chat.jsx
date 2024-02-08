import React, { useEffect, useRef, useState } from 'react';
import Placeholder from '../assets/profile/placeholder.jpg';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = ({ contact, setToggle, showMessage }) => {
    const [chat, setChat] = useState('');
    const textareaRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem('authToken');
    const messagesEndRef = useRef(null);
    const socketInstance = useRef(null); // Use useRef here
    const chatContainerRef = useRef(null);
    let previousScrollHeight = 0; // Initialize previousScrollHeight

    useEffect(() => {
        socketInstance.current = io(import.meta.env.VITE_API_URL); // Use .current property

        return () => {
            socketInstance.current.disconnect(); // Use .current property
        };
    }, []);

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();

        const interval = setInterval(() => {
            const container = chatContainerRef.current;
            if (container && container.scrollHeight !== previousScrollHeight) {
                scrollToBottom();
                previousScrollHeight = container.scrollHeight;
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // Handle sending a message
    const handleSendMessage = (event) => {
        event.preventDefault();
        if (token) {
            const contact_id = contact._id;
            const socket = socketInstance.current; // Use .current property
            socket.emit('privateMessage', {
                receiver: contact_id,
                message: chat,
                senderToken: token
            });
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            setChat('');
        }
    };

    useEffect(() => {
        axios.get('/api/chat/getMessage', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                receiverID: contact._id
            }
        })
            .then(response => {
                setMessages(response.data.data);  // Update the messages state when new messages are received
            })
            .catch(error => {
                console.log('Cannote Get Messages: ', error);
            });
    }, [contact._id]);

    useEffect(() => {
        const socket = socketInstance.current;

        if (socket && contact && token) {
            // Remove any existing listeners before adding new ones
            socket.off('Messages');

            socket.emit('joinRoom', { sender: token, receiver: contact._id });
            socket.on('Messages', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);  // Append new message to the existing ones
            });
        }

        return () => {
            if (socket) {
                socket.off('Messages');
            }
        };
    }, [contact._id]);


    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='p-3 flex justify-between items-center'>
                <div className='flex items-center'>
                    <button className='block lg:hidden me-4' onClick={setToggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>

                    </button>
                    <div className='flex items-center'>
                        <img src={contact.image ? contact.image : Placeholder} className='h-9 w-9 rounded-full object-cover border' alt='Avatar' />
                        <h6 className='text-[15px] ms-1 text-gray-700'>
                            {contact ? `${contact.firstname} ${contact.lastname}` : ''}
                        </h6>
                    </div>
                </div>
                <button className='block lg:hidden' onClick={setToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            <hr></hr>
            <div className='flex-1 p-3 overflow-x-auto' ref={chatContainerRef}>
                {showMessage ? (
                    messages && messages.length !== 0 ? (
                        messages.map((message, index) => {
                            const isReceivedByContact = message.receiver === contact._id;
                            const justifyClass = isReceivedByContact ? 'justify-end' : 'justify-start';
                            const bgClass = isReceivedByContact ? 'bg-blue-500' : 'bg-pink-500';

                            if (message.receiver === contact._id || message.sender === contact._id) {
                                return (
                                    <div key={index} className={`flex ${justifyClass} mb-2`}>
                                        <div className={`flex ${bgClass} p-2 px-3 rounded-lg max-w-[190px] lg:max-w-[500px] md:max-w-[500px] item-center`}>
                                            <p className='break-keep whitespace-pre-wrap text-white text-[14px]'>{message.message}</p>
                                        </div>
                                    </div>
                                );
                            } else {
                                <p className='text-gray-300 text-center text-[13px]'>No Conversation Started.</p>
                            }
                        })
                    ) : (
                        <p className='text-gray-300 text-center text-[13px]'>No Conversation Started.</p>
                    )
                ) : (
                    <p className='text-gray-300 text-center text-[13px]'>Loading...</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage}>
                <div className='p-3 flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 lg:w-7 lg:h-7 md:w-7 lg:h-7 text-pink-600 ms-3 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 lg:w-7 lg:h-7 md:w-7 lg:h-7 text-pink-600 mx-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>

                    <textarea
                        ref={textareaRef}
                        className="center-placeholder shadow-lg overflow-hidden flex items-center bg-gray-100 resize-none border border-pink-100 rounded max-h-70 w-full shadow appearance-none border border-gray-400 rounded-full py-4 px-5 text-gray-700 text-[13px] leading-tight focus:outline-none focus:shadow-outline placeholder:text-gray-500 placeholder:text-[13px]"
                        rows='1.5'
                        placeholder="Type your message..."
                        onInput={adjustTextareaHeight}
                        value={chat}
                        onChange={(event) => setChat(event.target.value)}
                    />
                    <button className='' type='submit'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="pink"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-12 h-8 text-pink-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
