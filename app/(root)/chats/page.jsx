'use client'
import ChatList from '@components/ChatList'
import ContactsInChat from '@components/ContactsInChat'
import { useSession } from 'next-auth/react'
import React from 'react'

const Chats = () => {
  const { data: session } = useSession()
  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full border-2">
        <ChatList />
      </div>
      <div className="w-2/3 max-lg:w-1/2 max-md:hidden">
        <ContactsInChat />
      </div>
    </div>
  )
}

export default Chats