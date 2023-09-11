'use client'
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (!result?.error) {
      router.push('/'); 
      
    } 
  };
  return (
    <div className="login-background h-screen text-secondary flex lg:flex-row  sm:flex-col lg:justify-between items-center lg:px-24 ">
      <div className="login-card lg:w-[380px] lg:h-[540px] sm:w-[300px] sm:h-[400px]  bg-blue3 bg-opacity-30 backdrop-blur-[50px] flex flex-col justify-center items-center lg:mt-20 sm:mt-40 rounded-[30px]">
        <p className="lg:text-md sm:text-sm font-bold py-5">Login to your account</p>
        <span>
          <p className="text-gray2 py-2 sm:text-xsm lg:text-sm">Username</p>
          <input onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setUsername(e.target.value)} className="lg:w-[270px] lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 bg-blue3 border border-gray-800 bg-opacity-30 " />
        </span>
        <span>
          <p className="text-gray2 py-2 sm:text-xsm lg:text-sm">Password</p>
          <input type='password' autoComplete='false' onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setPassword(e.target.value)} className="lg:w-[270px] lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 bg-blue3 border border-gray-800 bg-opacity-30 " />
        </span>
        <button onClick={handleLogin} className="border border-gray-800 lg:w-[270px] lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 sm:text-sm bg-blue2 m-5 rounded-[10px] lg:text-md font-bold">
          Login
        </button>
        <p className="sm:text-xsm lg:text-sm">
          Don't have an account?{" "}
          <Link href={"/auth/signin"} className="underline decoration-solid">
            Sign in
          </Link>
        </p>
      </div>
      <div className="lg:w-[800px] sm:w-[300px] ">
        <span className="logo flex sm:flex-col  items-center">
          <p className="logo-name text-xlg font-bold inline-block">
            MediaMingle
          </p>
          <p className="inline"> Where Connections Spark to Life!</p>
        </span>

        <p className="py-10 sm:text-xsm lg:text-sm">
        Are you prepared to immerse yourself in a dynamic universe filled with connections, creativity, and an incredible community? Your adventure begins now as you step into the vibrant realm of MediaMingle! 📸 Ignite Your Imagination 📸
        </p>
      </div>
    </div>
  );
};
2;

export default LoginPage;
