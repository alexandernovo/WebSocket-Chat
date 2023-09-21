import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import ChatBox from '../components/ChatBox'
import Sidebar from '../components/Sidebar'
import Profile from '../components/Profile'
import { getSessionData } from '../utils/Session';
import axios from 'axios'
import Nav from '../components/Nav'
import io from 'socket.io-client';

const Home = () => {
    const [contact, setContact] = useState({});
    const [localContact, setLocalContact] = useState(localStorage.getItem('contactID'));
    const [toggle, setToggle] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const [userID, setUserID] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [socketInstance, setSocketInstance] = useState(null);

    //change the contact localstorage and to activate dependencies and to refetch messages in a selected contact
    // Change the contact local storage and activate dependencies to refetch messages for the selected contact

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        setSocketInstance(socket);

        // Clean up socket when component is unmounted
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getSessionData();
            setUserID(response.data._id);
        };
        fetchData();
    }, []);

    const handleContact = (id) => {
        localStorage.setItem('contactID', id);
        setLocalContact(id);
        setShowMessage(false);
        setShowProfile(false);

        // Use a function reference inside setTimeout
        const messageTimeout = setTimeout(() => {
            setShowMessage(true);
        }, 1500);

        // In large screens, it will not reactivate the sidebar
        if (window.innerWidth >= 1280) {
            setToggle(false);
        } else {
            // If it's a small screen, hide the sidebar
            setToggle(!toggle);
        }

        return () => {
            clearTimeout(messageTimeout);
        };
    };

    const handleProfile = () => {
        setToggle(false);
        setShowProfile(!showProfile);
    }

    const handleToggle = () => setToggle(!toggle);


    //Fetching Contacts
    useEffect(() => {
        const fetchContact = async () => {
            try {
                const contactID = localStorage.getItem('contactID');
                if (contactID) {
                    const response = await axios.get('/api/users/getContact', {
                        params: {
                            id: contactID
                        }
                    });
                    if (response.data.status === 'success') {
                        setContact(response.data.data);
                    }
                }
                else {
                    setContact(null);
                }
            } catch (error) {
                console.error('Error fetching contact:', error);
            }
        };

        fetchContact();
    }, [localContact]);

    //set Untrue the sidebar in Bigger Screen
    // set Untrue the sidebar in Bigger Screen
    useEffect(() => {
        const handleWindowResize = () => {
            if (window.innerWidth >= 1280) {
                setToggle(false);
            }
            // Add a condition to check if the keyboard is open
            else {
                if (window.innerHeight >= window.innerWidth) {
                    if (localStorage.getItem('contactID') === null) {
                        setToggle(true);
                    }
                }

            }
        };

        handleWindowResize();

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    return (
        <>
            <Layout>
                <Sidebar onClick={handleContact} toggle={toggle} setToggle={handleToggle} handleProfile={handleProfile} />
                <div className='flex-1'>
                    {showProfile ? (
                        <Profile setToggle={handleToggle} />
                    ) : (
                        <ChatBox contact={contact} setToggle={handleToggle} showMessage={showMessage} />
                    )}
                </div>
            </Layout>
        </>
    )
}

export default Home
