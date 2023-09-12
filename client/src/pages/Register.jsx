import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/images/logo.png'
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
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
        <div className='px-2 lg:px-0 md:px-0 pb-6'>

            <div className='w-full lg:w-2/6 md:w-2/6 mx-auto mt-10 glass shadow-none md:shadow-lg lg:shadow-lg p-10 rounded-xl '>

                <div className='flex items-center mb-5'>
                    <img className='w-[90px] h-[90px]' src={Logo} alt='Logo' />
                    <h1 className='text-4xl font-bold text-white tracking-widest'>ChatMe</h1>
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
                            classes="bck"
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
                            classes="bck"
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
                            classes="bck"
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
                        <p className='m-0 text-[12px] text-yellow-400 mt-1'>{error.message}</p>
                    )}
                    <div className='mt-3'>
                        <Input
                            classes="bck"
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
                            classes="bck"
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
                        <p className='m-0 text-[12px] text-yellow-400 mt-1'>{error.message}</p>
                    )}

                    <div className='mb-3'>
                        <Button type="submit">SIGN UP</Button>
                        <p className='text-white text-[13px] text-center mt-2'>
                            Already have account?
                            <Link to="/" className='text-blue-800 ms-1'>Sign in here </Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Register
