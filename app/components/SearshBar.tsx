"use client";
import React, { useState } from 'react'
import { UserType } from '../types/types';
import axios from 'axios';
import { BsPersonCircle } from 'react-icons/bs';


const SearshBar = () => {
    const [foundUsers, setFounddUsers] = useState<UserType[]>([])
    const [searchedUser, setSearchedUser] = useState('')

    const search = async () =>{
        if(searchedUser){
            const res=await axios.get(`/api/search/${searchedUser}`)
            setFounddUsers(res.data.message)
            console.log(res.data.message)
        }
    }
  return (
    <div className='flex  justify-center items-start w-[100%] m-5'>
        <div className='flex flex-col'>
        <input placeholder='search for a user...' onChange={(e)=>{ setSearchedUser(e.target.value),search()}} className='bg-blue2 border border-gray3 rounded-[20px] px-4 py-3 w-[700px] outline-none' />
        <div className='border  border-gray3 rounded-[20px] '>
            {foundUsers.map((user)=>
            <span className="flex items-center m-3 mx-5">
            <p className="w-10">
              {user?.profile_picture ? (
                user?.profile_picture
              ) : (
                <BsPersonCircle size="20" />
              )}
            </p>
            <span>
              <h1 className="font-bold">{user?.name}</h1>
              <h1>{user?.username}</h1>
            </span>
          </span>
            )}
        </div>

        </div>
    </div>
  )
}

export default SearshBar