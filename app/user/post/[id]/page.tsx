import Post from '@/app/components/Post'
import PostComments from '@/app/components/PostComments'
import React from 'react'

const page = ({ params }: { params: { id: number } }) => {
  return (
    <div className='flex flex-col flex items-center justify-center w-[100%]'>
        <Post id={params.id}/>
        <PostComments id={params.id}/>
    </div>
  )
}

export default page