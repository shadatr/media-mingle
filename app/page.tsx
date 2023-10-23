import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession({ required: true });

  if (!session.data?.user ) {
    redirect('/auth/login');
  }
  else{
      redirect('/user/home');
    
  }
  return (
   <div></div>
  )
}
