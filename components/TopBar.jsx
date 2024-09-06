'use client'
import { Logout } from '@mui/icons-material'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TopBar = () => {
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user

    const handelLogOut = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <div className='topbar'>
            <Link href={'/chats'} className='flex items-center justify-center gap-1'>
                <img className='w-6' src="/assets/logo.svg" alt="" />
                <h1 className='text-xl font-semibold'>Chatify</h1>
            </Link>

            <div className="menu">
                <Link href={'/chats'} className={`font-semibold ${pathname === '/chats' ? 'text-[#1d31e1] font-bold' : ''}`}>
                    Chats
                </Link>
                <Link href={'/contacts'} className={` font-semibold ${pathname === '/contacts' ? 'text-[#1d31e1] font-bold' : ''}`}>
                    Contasts
                </Link>

                <Logout className='text-gray-800' onclick={handelLogOut} />

                <Link href={'/profile'}> <img className={` w-10 ${pathname === '/profile' ? 'border-2 rounded-full border-[#1d31e1]' : ''}`} src={user?.profileImage || '/assets/person.jpg'} /></Link>
            </div>
        </div>
    )
}

export default TopBar