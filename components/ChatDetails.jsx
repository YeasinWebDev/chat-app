'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Loader from './Loader'
import Link from 'next/link'
import { AddPhotoAlternate, Send } from '@mui/icons-material'

const ChatDetails = ({ chatId }) => {
  const { data: session } = useSession()
  const currentUser = session?.user

  const [loading, setLoading] = useState(true)
  const [chat, setchat] = useState({})
  const [otherMembers, setOtherMembers] = useState([])
  const [text, settext] = useState('')

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
    if (currentUser && chatId) getChatDetails()
  }, [chatId, currentUser])

  console.log(chat)


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

      <div className="chat-body"></div>

      <div className="send-massage">

        <div className="prepare-message ">

            <AddPhotoAlternate
              sx={{
                fontSize: '35px',
                color: 'gray',
                cursor: 'pointer',
                "&:hover": { color: '#1D31E1' }
              }}
            />

          <div className='flex w-full'>
            <input
              type="text"
              placeholder="Type your message here..."
              onClick={e => settext(e.target.value)}
              required
              className='flex-1 py-3 px-2'
            />
            <div className='border-2 rounded-full p-2 border-gray-500 cursor-pointer'>
              <Send/>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatDetails