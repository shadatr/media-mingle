'use client'

import Post from '@/app/components/Post'
import PostComments from '@/app/components/PostComments'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

const page = ({ params }: { params: { id: number } }) => {
  const session = useSession({ required: false });

  if (!session.data?.user && session.status != "loading") {
    redirect("/");
  }
  
  return (
    <div className='flex flex-col items-center justify-center w-[100%]'>
        <Post id={params.id}/>
        <PostComments id={params.id}/>
    </div>
  )
}

export default page