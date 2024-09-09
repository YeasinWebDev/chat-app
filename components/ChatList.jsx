import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import ChatBox from './ChatBox'

const ChatList = () => {
  const {data:session} = useSession()
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState([])
  const [search, setSearch] = useState('')

  const getChats = async () =>{
    try {
      setLoading(true)
      const res = await fetch( search !== '' ? `/api/users/${session?.user?._id}/searchChat/${search}` : `/api/users/${session?.user._id}`)
      const data = await res.json()
      setChats(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>{
    if(session?.user){
      getChats()
    }
  },[session?.user,search])


  return (
    <div className='chat-list'>
      <input placeholder='Search Chat.....' className='input-search' onChange={(e) => setSearch(e.target.value) }/>

      {loading? <Loader/> :<div className="chats">
        {
          chats?.map((chat, index) => (
            <ChatBox chat={chat} key={index} currentUser={session?.user}/>
          ))
        }
      </div>}
    </div>
  )
}

export default ChatList