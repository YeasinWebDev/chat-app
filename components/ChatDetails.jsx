'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import Link from 'next/link'
import { AddPhotoAlternate, Send } from '@mui/icons-material'
import { CldUploadButton } from 'next-cloudinary'
import MessageBox from './MessageBox'

const ChatDetails = ({ chatId }) => {
  const { data: session } = useSession()
  const currentUser = session?.user

  const [loading, setLoading] = useState(true)
  const [chat, setchat] = useState({})
  const [otherMembers, setOtherMembers] = useState([])
  const [text, settext] = useState('')
  const chatContainerRef = useRef(null); 

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      setchat(data)
      setOtherMembers(data?.members?.filter(e => e._id !== currentUser._id))
      setLoading(false)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser && chatId) {
      getChatDetails()
    }
      
  }, [chatId, currentUser])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat?.messages]); 



  const sendMessage = async (e) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, chatId, currentUserId: currentUser._id }),
      })
      if(res.ok) settext("")
    } catch (error) {
      console.log(error)
    }
  }

  const sendPhoto = async (result) => {
    try {
      const res = await fetch('/api/messages',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo: result?.info?.secure_url, chatId, currentUserId: currentUser._id }),
      })
    } catch (error) {
      console.log(error)
    }
  }

  

  return loading ? <Loader></Loader> : (
    <div className='chat-deatils'>
      <div className="chat-header">
        {chat?.isGroup ? (
          <Link href={`/chats/${chatId}/group-info`} className='flex items-center gap-2'>
            <img
              src={chat?.groupPhoto || "/assets/group.png"}
              alt="group-photo"
              className="profilePhoto"
            />


            <div className="text">
              <p>
                {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                members
              </p>
            </div>
          </Link>
        ) : (
          <>
            <img
              src={otherMembers[0].profileImage || "/assets/person.jpg"}
              alt="profile photo"
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0].username}</p>
            </div>
          </>
        )}
      </div>

      <div ref={chatContainerRef} className="chat-body">
        {
          chat?.messages?.map((message,index) =>(
            <MessageBox key={index} message={message} currentUser={currentUser}/>
          ))
        }
      </div>

      <div className="send-massage">

        <div className="prepare-message ">

          <CldUploadButton options={{ maxFiles: 1 }} onSuccess={sendPhoto} uploadPreset='naezride'>
            <AddPhotoAlternate
              sx={{
                fontSize: '35px',
                color: 'gray',
                cursor: 'pointer',
                "&:hover": { color: '#1D31E1' }
              }}
            />
          </CldUploadButton>


          <div className='flex w-full'>
            <input
              type="text"
              placeholder="Type your message here..."
              onChange={e => settext(e.target.value)}
              value={text}
              required
              className='flex-1 py-3 px-2 outline-none'
            />
            <div className='border-2 rounded-full p-2 border-gray-500 cursor-pointer' onClick={sendMessage}>
              <Send />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatDetails