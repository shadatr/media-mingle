'use client'

import React from 'react'
import FetchPosts from "../../components/FetchPosts";


const page = () => {

    const posts=FetchPosts({id:2})
    console.log(posts)

  return (
    <div>
        
    </div>
  )
}

export default page