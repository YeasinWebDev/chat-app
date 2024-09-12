'use client'
import Loader from '@components/Loader'
import { GroupOutlined, PersonOutline } from '@mui/icons-material'
import { CldUploadButton } from 'next-cloudinary'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const GroupInfo = () => {

  const { register, setValue, handleSubmit, watch, reset } = useForm()
  const [loading, setloading] = useState(true)
  const [chat, setChat] = useState(null)
  const { chatId } = useParams()
  const router= useRouter()

  const chatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`)
      const data = await res.json()
      setChat(data)
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto
      })
      setloading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (chatId) {
      chatDetails()
    }
  }, [])

  const uploadPhoto = (result) => {
    setValue('groupPhoto', result?.info?.secure_url)
  }

  useEffect(() => {
    if (chat) {
      setValue('username', chat.name);
    }
  }, [chatId, chat]);


  const UpdateGroupChat = async (data) => {

    try {
     const res = await fetch(`/api/chats/${chatId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if(res.ok){
        router.push(`/chats/${chatId}`)
      }
      
    } catch (error) {
      console.error(error)
    }
  }

  return loading ? <Loader /> : (
    <div className='profile-page'>
      <h1 className='text-heading3-bold'>Edit Group Info</h1>

      <form onSubmit={handleSubmit(UpdateGroupChat)}>
        <div className="input">
          <input
            {...register("name", {
              required: 'Group Name is required',
            })}
            type='text'
            onChange={(e) => setValue('name', e.target.value)}
            className='input-field'
          />
          <GroupOutlined className='text-gray-700' />
        </div>

        <div className="flex flex-col items-center justify-between py-10 gap-3">
          <img src={watch("groupPhoto") || '/assets/group.png'} alt='profile' className='w-40 rounded-full' />

          <CldUploadButton options={{ maxFiles: 1 }} onSuccess={uploadPhoto} uploadPreset='naezride' className='w-full'>
            <p className='font-semibold w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 flex justify-center'>
              Upload New Photo
            </p>
          </CldUploadButton>
        </div>

        <div className='flex flex-col gap-3 pb-5 items-center justify-center'>
          <h1 className='font-semibold font-lg'>Members</h1>
          <div className='flex items-center gap-3'>
            {
              chat?.members.map((member) => (
                <span key={member._id} className='selected-contact'>{member.username}</span>
              ))
            }
          </div>
        </div>
        <button type="submit" className='w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900'>Save Changes</button>
      </form>
    </div>
  )
}

export default GroupInfo