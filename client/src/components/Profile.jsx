import React, { useState, useEffect } from 'react'
import { getSessionData } from '../utils/Session'
import Placeholder from '../assets/profile/placeholder.jpg'
import Modal from './Modal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Logout } from '../utils/Session'

const Profile = ({ setToggle }) => {

    const [session, setSession] = useState({});
    const [open, setOpen] = useState(false)
    const [image, setImage] = useState(null);
    const token = localStorage.getItem('authToken');
    const [rerender, setRerender] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        getSessionData()
            .then(response => {
                setSession(response.data);
                setShowProfile(true);
            })
            .catch(error => {
                console.log('Error Getting Session: ', error);
            });
    }, [rerender]);

    const handleModal = () => setOpen(!open)

    const handleUploadProfile = (event) => {
        event.preventDefault();
        if (image) {
            const formData = new FormData();
            formData.append('image', image);

            axios.post('/api/users/uploadPhoto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then((response) => {
                    if (response.data.status === 'success') {
                        setRerender(!rerender);
                        handleModal(false);
                        setShowProfile(false);
                    }
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.log('No image selected.');
        }
    };

    return (
        <div className='h-screen p-2 text-white flex flex-col'>
            <button onClick={() => setToggle()} className='px-3 pt-3 block lg:hidden '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>
            <div className='flex-1 flex items-center {!showProfile ? justify-center: ""}'>
                {showProfile ? (
                    <>
                        <Modal open={open} handleModal={handleModal} handleUploadProfile={handleUploadProfile} setImage={setImage} />
                        <div className='w-3/4 md:w-2/4 lg:w-2/4 mx-auto p-2'>
                            <div className='w-[180px] h-[180px] md:w-[260px] md:h-[260px] lg:w-[260px] lg:h-[260px] rounded-full mx-auto relative'>
                                <img src={session && session.image ? session.image : Placeholder} className='w-full h-full object-cover rounded-full border border-gray-400 ' />
                                <svg onClick={() => handleModal()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-11 h-11 absolute text-white right-[-7px] md:right-3 lg:right-3 cursor-pointer bottom-7 border-2 border-white rounded-full p-2 bg-gray-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className='text-[20px] md:text-[30px] lg:text-[30px] tracking-widest text-center mt-2 text-gray-600'>{`${session.firstname} ${session.lastname}`}</h4>
                                <div className='w-full lg:w-3/4 md:w-3/4 mx-auto mt-2 p-2 px-4'>
                                    <p className='text-gray-400 text-[12px] md:text-[14px] lg:text-[14px]  mb-1'>Others</p>
                                    <button className='text-[14px] border border-gray-400 w-full p-3 text-start rounded flex items-center text-gray-600'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 me-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Account Settings <i className='text-yellow-300'>(coming soon)</i>
                                    </button>
                                    <button className='text-[14px] border border-gray-400  w-full p-3 text-start mt-3 rounded flex text-gray-600' onClick={() => Logout(navigate)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 me-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>

                ) : (
                    <>
                        <div className='w-3/4 md:w-2/4 lg:w-2/4 mx-auto p-2'>
                            <p className='text-center'>Loading...</p>
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}

export default Profile
