import React from 'react'
import Logo from '../assets/images/logo.png'

const Nav = () => {
    return (
        <div className='sticky top-0 px-12 py-3 border flex items-center bg-white'>
            <img src={Logo} className='h-8 w-12' />
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-purple-700">ChatMe</span>

        </div>
    )
}

export default Nav
