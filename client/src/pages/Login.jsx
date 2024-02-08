import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import Girl from '../assets/images/bg-girl.jpg'
import Nav from '../components/Nav'

const Login = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleUsernameChange = (event) => setUsername(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/users/auth', { username, password });
            if (response.data && response.data.status === 'success') {
                const { token } = response.data;
                localStorage.setItem('authToken', token);
                navigate('/home');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(
                    {
                        errorCall: error.response.data.errorCall,
                        message: error.response.data.message
                    }
                );
            }
        }
    };

    return (
        <div className='h-full'>
            <Nav />
            <div className='h-full overflow-y-auto lg:h-4/5 md:h-4/5 flex flex-col lg:flex-row md:flex:row px-5'>
                <div className='w-full px-4 lg:px-0 md:px-0 lg:w-1/2 md:w-1/2 flex items-center justify-center order-last md:order-1 lg:order-1  mt-5 md:mt-0 lg:mt-0'>
                    <div className='w-full lg:w-2/4 md:w-2/4 m-auto'>
                        <p className='text-[24px] md:text-[43px] lg:text-[35px] font-bold text-black tracking-wider text-pink-600'>Welcome Back,</p>
                        <p className='text-[12px] md:text-[27px] lg:text-[15px] font-bold text-black tracking-wider text-gray-400 mt-1 lg:mt-3 md:mt-3'>ChatMe gets you closer with your love ones.</p>
                        <form onSubmit={handleSubmit}>
                            <div className='mt-2'>
                                <Input
                                    label='Username'
                                    id='username'
                                    type='text'
                                    placeholder='Username'
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </div>
                            {error.errorCall === 'username' && (
                                <p className='m-0 text-[12px] text-red-500 mt-1'>{error.message}</p>
                            )}
                            <div className='mt-3'>
                                <Input
                                    label='Password'
                                    id='password'
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            {error.errorCall === 'password' && (
                                <p className='m-0 text-[12px] text-red-500 mt-1'>{error.message}</p>
                            )}
                            <div className='mb-3'>
                                <Button type="submit">SIGN IN</Button>
                                <p className='text-gray-400 text-[13px] text-center mt-2'>
                                    Don`t have an account yet? <Link to='/register' className='text-blue-400 ms-1'>Sign up here </Link>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
                <div className='w-full lg:w-1/2 md:w-1/2 flex items-center order-1  mt-8 md:mt-0 lg:mt-0'>
                    <div className='w-3/4 h-auto m-auto'>
                        <img src={Girl} className='object-fit h-full w-full' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
