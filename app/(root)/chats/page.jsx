'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const Chats = () => {
  const {data:session} = useSession()
  console.log(session)
  return (
    <div>Chats</div>
  )
}

export default Chats