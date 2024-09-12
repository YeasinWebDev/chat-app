import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import ChatBox from './ChatBox'
import { pusherClient } from '@lib/pusher'

const ChatList = ({currentChatId}) => {
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


  useEffect(() => {
    if (session?.user) {
      
      pusherClient.subscribe(session.user._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newchat) =>{
        setChats((allChats) => [...allChats, newchat])
      }

      // Bind to the 'update-chat' event
      pusherClient.bind('update-chat', handleChatUpdate);
      pusherClient.bind('new-chat', handleNewChat);

      // Cleanup function to unsubscribe and unbind the event
      return () => {
        pusherClient.unsubscribe(session.user._id);
        pusherClient.unbind('update-chat', handleChatUpdate);
        pusherClient.unbind('new-chat', handleNewChat);
      };
    }
  }, [session?.user]);
  


  return (
    <div className='chat-list'>
      <input placeholder='Search Chat.....' className='input-search' onChange={(e) => setSearch(e.target.value) }/>

      {loading? <Loader/> :<div className="chats">
        {
          chats?.map((chat, index) => (
            <ChatBox chat={chat} key={index} currentUser={session?.user} currentChatId={currentChatId}/>
          ))
        }
      </div>}
    </div>
  )
}

export default ChatList