import React, { useEffect, useRef, useState } from 'react';
import Placeholder from '../assets/profile/placeholder.jpg';
import axios from 'axios';

const Chat = ({ contact, setToggle, showMessage }) => {
    const [chat, setChat] = useState('');
    const textareaRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const token = sessionStorage.getItem('authToken');
    const messagesEndRef = useRef(null);

    const chatContainerRef = useRef(null);
    let previousScrollHeight = 0; // Initialize previousScrollHeight

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

    const handleSendMessage = (event) => {
        event.preventDefault();

        if (token) {
            axios.post('/api/chat/sendMessage', { receiverID: contact._id, message: chat },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((response) => {
                if (response.data.status === 'success') {
                    setRefresh(!refresh);
                    const textarea = textareaRef.current;
                    textarea.style.height = 'auto';
                    setChat('');
                }
            }).catch((error) => {
                console.log('Sending Message Failed: ', error);
            });
        }
    };

    useEffect(() => {
        const fetchMessages = () => {
            if (token) {
                axios.get('/api/chat/getMessage', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        receiverID: contact._id,
                    },
                }).then((response) => {
                    setMessages(response.data.data);
                }).catch((error) => {
                    console.log('Error Getting Messages: ', error);
                });
            }
        };

        fetchMessages();

        const interval = setInterval(fetchMessages, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [contact._id, refresh]);

    useEffect(() => {

    }, [])

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    return (
        <div className='h-full glass flex flex-col justify-between'>
            <div className='p-3 flex justify-between items-center bck'>
                <div className='flex items-center'>
                    <img src={contact.image ? contact.image : Placeholder} className='h-9 w-9 rounded-full object-cover' alt='Avatar' />
                    <h6 className='text-[15px] text-white ms-1'>
                        {contact ? `${contact.firstname} ${contact.lastname}` : ''}
                    </h6>
                </div>

                <button className='block lg:hidden' onClick={setToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            <div className='flex-1 p-3 overflow-x-auto' ref={chatContainerRef}>
                {showMessage ? (
                    messages && messages.length !== 0 ? (
                        messages.map((message) => (
                            <div key={message._id} className={`flex ${message.receiver === contact._id ? 'justify-end' : 'justify-start'} mb-2 `}>
                                <div className={`flex ${message.receiver === contact._id ? 'bg-blue-500' : 'bg-pink-500'} p-2 px-3 rounded-lg max-w-[500px] item-center`}>
                                    <p className='break-all whitespace-pre-wrap text-white text-[14px]'>{message.message}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-300 text-center text-[13px]'>No Conversation Started.</p>
                    )
                ) : (
                    <p className='text-gray-300 text-center text-[13px]'>Loading...</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage}>
                <div className='p-3 flex'>
                    <textarea
                        ref={textareaRef}
                        className="glass-gray overflow-hidden resize-none border rounded max-h-70 w-full shadow appearance-none border border-gray-400 rounded-full py-3 px-3 text-white text-[13px] leading-tight focus:outline-none focus:shadow-outline placeholder:text-gray-200 placeholder:text-[13px]"
                        rows='1.5'
                        placeholder="Type your message..."
                        onInput={adjustTextareaHeight}
                        value={chat}
                        onChange={(event) => setChat(event.target.value)}
                    />
                    <button className='' type='submit'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="teal"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-12 h-8 text-gray-300"
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
