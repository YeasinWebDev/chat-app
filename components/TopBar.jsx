'use client'
import { Logout } from '@mui/icons-material'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon for the hamburger
import CloseIcon from '@mui/icons-material/Close'; // Import the Close icon

const TopBar = () => {
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogOut = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <div className='flex items-center justify-between p-4 shadow-md bg-white'>
            {/* Logo Section */}
            <Link href={'/chats'} className='flex items-center justify-center gap-1'>
                <img className='w-6' src="/assets/logo.svg" alt="logo" />
                <h1 className='text-xl font-semibold'>Chatify</h1>
            </Link>

            {/* Hamburger Icon for Mobile */}
            <div className='md:hidden'>
                <MenuIcon
                    className='text-gray-800 cursor-pointer'
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                />
            </div>

            {/* Menu Section for Desktop */}
            <div className='hidden md:flex items-center gap-4'>
                <Link href={'/chats'} className={`font-semibold ${pathname === '/chats' ? 'text-[#1d31e1] font-bold' : 'text-gray-800'}`}>
                    Chats
                </Link>
                <Link href={'/contacts'} className={`font-semibold ${pathname === '/contacts' ? 'text-[#1d31e1] font-bold' : 'text-gray-800'}`}>
                    Contacts
                </Link>

                {/* Logout Icon */}
                <Logout className='text-gray-800 cursor-pointer' onClick={handleLogOut} />

                {/* Profile Image */}
                <Link href={'/profile'}>
                    <img
                        className={`w-10 h-10 object-cover ${pathname === '/profile' ? 'border-2 rounded-full border-[#1d31e1]' : 'rounded-full border-2 border-transparent'}`}
                        src={user?.profileImage || '/assets/person.jpg'}
                        alt="Profile"
                    />
                </Link>
            </div>

            {/* Mobile Slider Menu */}
            <div
                className={`fixed top-0 left-0 w-3/4 h-full bg-[#f2f2f2] p-4 z-50 transform transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Close Icon */}
                <div className='border-2 border-gray-700 w-fit mb-4 rounded-full p-1'>
                    <CloseIcon
                        className='text-gray-800 cursor-pointer'
                        onClick={() => setMobileMenuOpen(false)}
                    />
                </div>

                {/* Mobile Menu Links */}
                <Link href={'/chats'} className={`block py-2 font-semibold border-t-2 border-gray-700 ${pathname === '/chats' ? 'text-[#1d31e1] font-bold' : 'text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
                    Chats
                </Link>
                <Link href={'/contacts'} className={`block py-2 font-semibold ${pathname === '/contacts' ? 'text-[#1d31e1] font-bold' : 'text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
                    Contacts
                </Link>
                <div className='flex flex-col gap-4 mt-4'>
                    {/* Logout Icon */}
                    <Logout className='text-gray-800 cursor-pointer' onClick={handleLogOut} />

                    {/* Profile Image */}
                    <Link href={'/profile'} onClick={() => setMobileMenuOpen(false)}>
                        <img
                            className={`w-10 h-10 object-cover ${pathname === '/profile' ? 'border-2 rounded-full border-[#1d31e1]' : 'rounded-full border-2 border-transparent'}`}
                            src={user?.profileImage || '/assets/person.jpg'}
                            alt="Profile"
                        />
                    </Link>
                </div>
            </div>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40' onClick={() => setMobileMenuOpen(false)}></div>
            )}
        </div>
    )
}

export default TopBar
