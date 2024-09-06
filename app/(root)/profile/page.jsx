'use client'
import { PersonOutline } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { CldUploadButton } from 'next-cloudinary'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const Profile = () => {
  const { data: session } = useSession()
  const user = session?.user

  const { register, setValue, handleSubmit, watch } = useForm()

  const uploadPhoto = (result) => {
    setValue('profileImage', result?.info?.secure_url)
  }

  useEffect(() => {
    if (user?.username) {
      setValue('username', user.username); 
    }
  }, [user, setValue]);


  const UpdateUser = async (data) => {
    console.log(data)
    try {
      await fetch(`/api/users/${user._id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='profile-page'>
      <h1 className='text-heading3-bold'>Edit Your Profile</h1>

      <form onSubmit={handleSubmit(UpdateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: 'Username is required',
              validate: (value) => {
                if (value.length < 3) {
                  return 'Username must be at least 3 characters';
                }
              },
            })}
            type='text'
            onChange={(e) => setValue('username', e.target.value)}
            className='input-field'
          />
          <PersonOutline className='text-gray-700' />
        </div>

        <div className="flex flex-col items-center justify-between py-10 gap-3">
          <img src={watch("profileImage") || user?.profileImage || '/assets/person.jpg'} alt='profile' className='w-40 rounded-full' />

          <CldUploadButton options={{ maxFiles: 1 }} onSuccess={uploadPhoto} uploadPreset='naezride' className='w-full'>
            <p className='font-semibold w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 flex justify-center'>
              Upload New Photo
            </p>
          </CldUploadButton>
        </div>
        <button type="submit" className='w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900'>Save Changes</button>
      </form>
    </div>
  )
}

export default Profile