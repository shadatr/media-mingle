'use client'

import Messages from "@/app/components/Messages"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


const page = () => {
  const session = useSession({ required: true });

  if (!session ) {
    redirect('/');
  }
    
  return (
    <div className="flex justify-center items-center w-[80%]"><Messages/></div>
  )
}

export default page;