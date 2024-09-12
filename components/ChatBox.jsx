import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import React from 'react'

const ChatBox = ({ chat, currentUser, currentChatId }) => {

    const router = useRouter()
    const otherMembers = chat?.members?.filter(e => e._id !== currentUser._id)

    const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1]
    
    const seen = lastMessage?.seenBy?.find(member => member._id === currentUser._id)

    return (
        <div className={`chat-box ${chat._id === currentChatId ? 'bg-white' : ''}`} onClick={() => router.push(`/chats/${chat?._id}`)}>
            <div className="chat-info">
                {
                    chat?.isGroup ? (
                        <img src={chat?.groupPhoto || '/assets/group.png'} alt='group-photo' className='profilePhoto' />
                    ) : (
                        <img src={otherMembers[0].profileImage || '/assets/person.png'} alt='profile-photo' className='profilePhoto' />
                    )
                }

                <div className="flex flex-col gap-1">
                    {
                        chat?.isGroup ? (
                            <h2 className='font-bold'>{chat?.name}</h2>
                        ) : (
                            <h2 className='font-bold'>{otherMembers[0].username}</h2>
                        )
                    }

                    {
                        !lastMessage && <p className='text-small-bold'>Start a new chat</p>
                    }

                    {
                        lastMessage?.photo ? (
                            lastMessage?.sender?._id === currentUser.id ? (
                                <p className="text-small-medium text-grey-3">You sent a photo</p>
                            ) : (
                                <p className={`${seen ? "text-small-medium text-grey-3" : "text-small-bold"
                                    }`}>{otherMembers[0].username} sent a photo</p>
                            )
                        ) : (
                            <p
                                className={`last-message ${seen ? "text-small-medium text-grey-3" : "text-small-bold"
                                    }`}
                            >
                                {lastMessage?.text}
                            </p>
                        )
                    }
                </div>

                <div className='flex-1'>
                    <p className='text-base-light text-grey-3 w-full flex justify-end'>
                        {!lastMessage
                            ? format(new Date(chat?.createdAt), 'p')
                            : format(new Date(chat?.messages[chat.messages.length - 1].createdAt), 'p')
                        }
                    </p>
                </div>

            </div>
        </div>
    )
}

export default ChatBox