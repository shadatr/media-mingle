'use client'
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createHash } from "crypto";

const SigninPage = () => {
  const router = useRouter();
  const [username, setUsername]= useState<string>('')
  const [password, setPassword]= useState<string>('')
  const [error, setError]= useState<string>('')
  const [confirmPassword, setConfirmPassword]= useState<string>('')


  const handleSubmit = () =>{
    if(password!==confirmPassword){
      setError("The passwords doesn't match")
      return;
    }
    if(!username||!password){
      setError("You should fill all the blanks")
      return;
    }
    if(username.length<8||password.length<8){
      setError("Password and username should be more than 8 characters")
      return;
    }
    const passwordHash = createHash("sha256")
      .update(password)
      .digest("hex");
    const data={
      username: username,
      password: passwordHash
    }
    try{
      axios.post('/api/signin',data )
      router.push('/user/home')
    }
    catch{

    }
  }


  return (
    <div className="login-background h-screen text-secondary flex lg:flex-row  sm:flex-col lg:justify-between items-center lg:px-24 ">
      <div className="login-card lg:w-[380px] lg:h-[540px] sm:w-[300px] sm:h-[400px]  bg-blue3 bg-opacity-30 backdrop-blur-[50px] flex flex-col justify-center items-center lg:mt-20 sm:mt-40 rounded-[30px]">
        <p className="lg:text-md sm:text-sm font-bold py-5">Create an Account</p>
        <span>
          <p className="text-gray2 py-2 sm:text-xsm lg:text-sm" >Username</p>
          <input onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setUsername(e.target.value)} className="lg:w-[270px] lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 bg-blue3 border border-gray-800 bg-opacity-30 " />
        </span>
        <span>
          <p className="text-gray2 py-2 sm:text-xsm lg:text-sm">Password</p>
          <input type="password" onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setPassword(e.target.value)} className="lg:w-[270px]  lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 bg-blue3 border border-gray-800 bg-opacity-30 " />
        </span>
        <span>
          <p className="text-gray2 py-2 sm:text-xsm lg:text-sm">Confirm password</p>
          <input type="password"  onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setConfirmPassword(e.target.value)} className="lg:w-[270px]  lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 bg-blue3 border border-gray-800 bg-opacity-30 " />
        </span>
        <button onClick={handleSubmit} className="border border-gray-800 lg:w-[270px] lg:px-3 lg:py-2 sm:w-[240px] sm:px-2 sm:py-1 sm:text-sm bg-blue2 m-5 rounded-[10px] lg:text-md font-bold">
          Sign In
        </button>
        <p className="text-red-500 p-2 sm:text-xsm lg:text-sm lg:w-[270px] sm:w-[240px]">{error}</p>
        <p className="sm:text-xsm lg:text-sm">
          Already have an account?{" "}
          <Link href={"/auth/login"} className="underline decoration-solid">
            Login
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


export default SigninPage;
