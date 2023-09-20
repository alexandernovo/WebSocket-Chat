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
                sessionStorage.setItem('authToken', token);
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
            <div className='h-4/5 flex px-5'>
                <div className='w-1/2 flex items-center justify-center'>
                    <div className='w-2/4 m-auto'>
                        <div className='flex items-center mb-2'>
                            <h1 className='text-[27px] font-bold text-black tracking-wider'>Sign In Here</h1>
                        </div>
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
                <div className='w-1/2 flex items-center'>
                    <div className='w-3/4 h-auto m-auto'>
                        <img src={Girl} className='object-fit h-full w-full' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
