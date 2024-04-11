"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession({ required: false });

  if (!session.data?.user && session.status != "loading") {
    redirect("/auth/login");
  }else{
    redirect("/user/home");
  }
  
  return <div></div>;
}
