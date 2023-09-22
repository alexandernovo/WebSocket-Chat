import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import ChatBox from '../components/ChatBox'
import Sidebar from '../components/Sidebar'
import Profile from '../components/Profile'
import axios from 'axios'

const Home = () => {
    const [contact, setContact] = useState({});
    const [localContact, setLocalContact] = useState(localStorage.getItem('contactID'));
    const [toggle, setToggle] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const [showProfile, setShowProfile] = useState(false);

    //change the contact localstorage and to activate dependencies and to refetch messages in a selected contact
    // Change the contact local storage and activate dependencies to refetch messages for the selected contact

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
                if (!localStorage.getItem('contactID')) {
                    setToggle(true);
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
