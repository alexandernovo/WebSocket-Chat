import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';

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
        <div className='px-2 lg:px-0 md:px-0'>
            <div className='w-full lg:w-2/6 md:w-2/6 mx-auto mt-10 glass shadow-none md:shadow-lg lg:shadow-lg p-10 rounded-xl '>
                <div className='flex items-center mb-5'>
                    <img className='w-[90px] h-[90px]' src={Logo} alt='Logo' />
                    <h1 className='text-4xl font-bold text-white tracking-widest'>ChatMe</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mt-3'>
                        <Input
                            classes="bck"
                            label='Username'
                            id='username'
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={handleUsernameChange}
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
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {error.errorCall === 'password' && (
                        <p className='m-0 text-[12px] text-yellow-400 mt-1'>{error.message}</p>
                    )}
                    <div className='mb-3'>
                        <Button type="submit">SIGN IN</Button>
                        <p className='text-white text-[13px] text-center mt-2'>
                            No Account? <Link to='/register' className='text-blue-800 ms-1'>Sign up here </Link>
                        </p>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default Login;
