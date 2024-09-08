import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const ContactsInChat = () => {
    const [loading, setloading] = useState(true)
    const { data: session } = useSession()
    const [contact, setcontact] = useState([])
    const [search, setsearch] = useState('')
    const [selectedContacts, setselectedContacts] = useState([])
    const [name, setname] = useState('')
    const router = useRouter()

    const getContact = async () => {
        try {
            const res = await fetch(search !== '' ? `/api/users/searchContact/${search}` : '/api/users')
            const data = await res.json()
            setcontact(data.filter(e => e.email !== session?.user?.email))
            setloading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (session?.user?.email) {
            getContact()
        }
    }, [session?.user?.email, search])

    const handelSelect = (contact) => {
        if (selectedContacts.includes(contact)) {
            setselectedContacts(selectedContacts.filter(c => c !== contact))
        } else {
            setselectedContacts([...selectedContacts, contact])
        }
    }

    const createChat = async () => {
        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentUserId: session?.user?._id,
                    members: selectedContacts.map(c => c._id),
                    name,
                    isGroup: selectedContacts.length > 1
                })
            })

            const chat = await res.json()
            if (res.ok) {
                router.push(`/chats/${chat._id}`)
            }

            if (res.error) {
                alert('Failed to create chat')
            }
        } catch (error) {
            console.log(error)
        }
    }


    return loading ? <div><Loader /></div> : (
        <div className='create-chat-container'>
            <input type="text" placeholder='Search Contact....' className='input-search w-1/2' value={search} onChange={e => setsearch(e.target.value)} />

            <div className="contact-bar">
                <div className="contact-list">
                    <p className="text-body-bold">
                        Select or choose a contact
                    </p>
                    {
                        contact.map(item => (
                            <div key={item._id} className="contact" onClick={() => handelSelect(item)}>
                                {
                                    selectedContacts.find(c => c === item) ? <CheckCircle className='text-red-600' /> : <RadioButtonUnchecked />
                                }
                                <img src={item.profileImage || '/assets/person.jpg'} alt='profile' className='profilePhoto' />
                                <p className='text-base-bold'>{item.username}</p>
                            </div>
                        ))
                    }
                </div>

                <div className="create-chat">
                    {
                        selectedContacts.length > 1 && (
                            <>
                                <div className="flex flex-col gap-3">
                                    <p className="text-body-bold">Group Chat Name</p>
                                    <input
                                        placeholder="Enter group chat name..."
                                        className="input-group-name bg-[#f2f2f2]"
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <p className="text-body-bold">Members</p>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedContacts.map((contact, index) => (
                                            <p className="selected-contact" key={index}>
                                                {contact.username}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )
                    }
                    <button className='btn' onClick={createChat}>Start A New Chat</button>
                </div>
            </div>
        </div>
    )
}

export default ContactsInChat