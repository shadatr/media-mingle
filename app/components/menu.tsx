"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";

function Menu() {
  const session = useSession({ required: true });
  const user = session.data?.user;
  return (
      <div className="flex flex-row ml-8">
        <div>
          <p className=" text-xlg font-bold inline-block p-8">MediaMingle</p>
          <span className="flex items-center px-8 pb-8">
            <p className="w-20">
              {user?.profile_picture ? (
                user?.profile_picture
              ) : (
                <BsPersonCircle size="60" />
              )}
            </p>
            <span>
              <h1 className="text-md font-bold">{user?.name}</h1>
              <h1>{user?.username}</h1>
            </span>
          </span>
          <Link
            href={"/user/post"}
            className="bg-blue1 px-10 py-3 rounded-[20px] font-bold text-lg menu-list mx-8"
          >
            Post
          </Link>
          <div className="flex flex-col text-lg font-bold px-6 py-8">
            <Link className="p-2 hover:bg-primary hover:rounded-[20px]" href={"/user/home"}>
              Home
            </Link>
            <Link className="p-2 hover:bg-primary hover:rounded-[20px]" href={"/user/personal-profile"}>
              Personal Profile
            </Link>
            <Link className="p-2 hover:bg-primary hover:rounded-[20px]" href={"/user/messages"}>
              Messages
            </Link>
            <Link className="p-2 hover:bg-primary hover:rounded-[20px]" href={"/user/notifications"}>
              Notifications
            </Link>
            <Link className="p-2 hover:bg-primary hover:rounded-[20px]" href={"/user/sittings"}>
              Sittings
            </Link>
          </div>
          <button
            onClick={() => signOut({ redirect: true })}
            className="flex items-center font-bold text-lg m-8 mt-20  hover:text-red-500"
          >
            <p>Logout</p>
            <AiOutlineLogout size="28" className="mt-3 m-1 cursor-pointer" />
          </button>
        </div>
        <div className="border-r-[0.5px] border-gray3 h-screen"></div>
    </div>
  );
}

export default Menu;
