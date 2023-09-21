import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/images/logo.png'
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
import Nav from '../components/Nav'
import Girl from '../assets/images/bg-girl.jpg'
import axios from 'axios';

const Register = () => {

    // Initialize form data state as an object to store input values
    // To handle many useState Dynamically
    // object property access this formData in values to update it

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        confirmpassword: ''
    });
    //error object State
    const [error, setError] = useState({
        errorCall: '',
        message: ''
    });
    //success 
    const [success, setSuccess] = useState('');

    //Handle Inputs Dynamically
    const handleInputs = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/users', formData);
            console.log(response.data);
            if (response.data.status === 'success') {
                //clear the inputs after the success
                setFormData(
                    {
                        firstname: '',
                        lastname: '',
                        username: '',
                        password: '',
                        confirmpassword: ''
                    }
                );
                setSuccess(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(
                    {
                        errorCall: error.response.data.errorCall,
                        message: error.response.data.message
                    }
                );
            } else {
                console.log(error);
            }
        }
    }

    return (
        <div className='h-full'>
            <Nav />
            <div className='h-full flex px-5 items-center lg:h-4/5 md:h-4/5 flex-col lg:flex-row md:flex:row px-5 mt-5 lg:mt-8 md:mt-8'>
                <div className='w-full lg:w-1/2 md:w-1/2 flex items-center justify-center order-last md:order-1 lg:order-1 mt-5 md:mt-0 lg:mt-0 '>
                    <div className='w-full px-4 lg:px-0 md:px-0 lg:w-2/4 md:w-2/4 mx-auto mb-12 lg:mb-0 md:mb-0'>
                        <div className='flex items-center mb-2'>
                            <h1 className='text-[24px] md:text-[27px] lg:text-[27px] font-bold text-black tracking-wider text-pink-600'>Sign up Here</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {success && (
                                <div className='bg-green-500 rounded-lg py-2 px-2 flex items-center text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 me-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className='m-0 text-[12px]'>{success}</p>
                                </div>
                            )}
                            <div className='mt-3'>
                                <Input
                                    label='Firstname'
                                    id='firstname'
                                    type='text'
                                    name="firstname"
                                    placeholder='Firstname'
                                    value={formData.firstname}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div className='mt-3'>
                                <Input
                                    label='Lastname'
                                    id='lastname'
                                    name='lastname'
                                    type='text'
                                    placeholder='Lastname'
                                    value={formData.lastname}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div className='mt-3'>
                                <Input
                                    label='Username'
                                    id='username'
                                    name='username'
                                    type='text'
                                    placeholder='Username'
                                    value={formData.username}
                                    onChange={handleInputs}
                                />
                            </div>

                            {error.errorCall === 'username' && (
                                <p className='m-0 text-[12px] text-red-500 mt-1'>{error.message}</p>
                            )}
                            <div className='mt-3'>
                                <Input
                                    label='Password'
                                    id='password'
                                    name='password'
                                    type='password'
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={handleInputs}
                                />
                            </div>
                            <div className='mt-3'>
                                <Input
                                    label='Confirm Password'
                                    id='confirmpassword'
                                    name='confirmpassword'
                                    type='password'
                                    placeholder='Confirm Password'
                                    value={formData.confirmpassword}
                                    onChange={handleInputs}
                                />
                            </div>
                            {error.errorCall === 'password' && (
                                <p className='m-0 text-[12px] text-red-500 mt-1'>{error.message}</p>
                            )}

                            <div className='mb-3'>
                                <Button type="submit">SIGN UP</Button>
                                <p className='text-gray-400 text-[13px] text-center mt-2'>
                                    Already have account?
                                    <Link to="/" className='text-blue-400 ms-1'>Sign in here </Link>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
                <div className='w-full lg:w-1/2 md:w-1/2 flex items-center order-1 mt-8 md:mt-0 lg:mt-0'>
                    <div className='w-3/4 h-auto m-auto'>
                        <img src={Girl} className='object-fit h-full w-full' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
