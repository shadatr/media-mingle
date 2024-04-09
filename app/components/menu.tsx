"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsPersonCircle } from "react-icons/bs";
import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import "./styles.css";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { RiNotificationFill } from "react-icons/ri";
import { BsXLg } from "react-icons/bs";
import { TiThMenu } from "react-icons/ti";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function Menu() {
  const session = useSession({ required: false });
  const user = session.data?.user;

  return (
    <div className="fixed">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger>
            <TiThMenu color="white" size="30" className="m-5"/>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription className="flex flex-col gap-5 p-2 text-secondary ">
              <p className="logo-name text-xlg font-bold inline-block">MediaMingle</p>
        <div className="flex m-5 gap-5">
          <div>
            {user?.profile_picture ? (
              <span
                style={{ width: "60px", height: "60px" }}
                className="inline-block rounded-full overflow-hidden"
              >
                <img
                  src={user.profile_picture}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </span>
            ) : (
              <BsPersonCircle size="60" />
            )}
          </div>
          <div>
            <p className="text-md font-bold">{user?.name}</p>
            <h1 className="text-sm">{user?.username}</h1>
          </div>
        </div>
        <SheetClose asChild>
          <Link
            href={"/user/posting"}
            className="bg-blue1 px-10 py-3 rounded-[20px] font-bold mx-10"
          >
            Post
          </Link>
        </SheetClose>
      
        <div className="text-md font-bold gap-16">
        <SheetClose asChild>
          <Link
            className="hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
            href={"/user/home"}
          >
            <AiFillHome />
            <span>Home</span>
          </Link>
          </SheetClose>
          <SheetClose asChild>
          <Link
            className=" hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
            href={`/user/personal-profile/${user?.id}`}
          >
            <BsFillPersonFill />
            <span>Personal Profile</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            className=" hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3 "
            href={"/user/messages"}
          >
            <AiFillMessage />
            <span>Messages</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            className="hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
            href={"/user/notifications"}
          >
            <RiNotificationFill />
            <span>Notifications</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href={"/user/settings"}
            className="  hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
          >
            <AiFillSetting />
            <span>Settings</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <button
            className="hover:bg-primary hover:rounded-[20px] lg:mt-10 flex items-center gap-3 p-3"
            onClick={() => {
              signOut({ redirect: true });
              redirect("/auth/login");
            }}
          >
            <AiOutlineLogout size="28" className=" cursor-pointer" />
            <span>Logout</span>
          </button>
        </SheetClose>
        </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="sm:hidden lg:flex flex-col gap-5 p-8">
        <p className="logo-name text-xlg font-bold inline-block">MediaMingle</p>
        <div className="flex m-5 gap-5">
          <div>
            {user?.profile_picture ? (
              <span
                style={{ width: "60px", height: "60px" }}
                className="inline-block rounded-full overflow-hidden"
              >
                <img
                  src={user.profile_picture}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </span>
            ) : (
              <BsPersonCircle size="60" />
            )}
          </div>
          <div>
            <p className="text-md font-bold">{user?.name}</p>
            <h1 className="text-sm">{user?.username}</h1>
          </div>
        </div>
          <Link
            href={"/user/posting"}
            className="bg-blue1 px-10 py-3 rounded-[20px] font-bold mx-10"
          >
            Post
          </Link>
        <div className="text-md font-bold gap-16">
          <Link
            className="hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
            href={"/user/home"}
          >
            <AiFillHome />
            <span>Home</span>
          </Link>
          <Link
            className=" hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
            href={`/user/personal-profile/${user?.id}`}
          >
            <BsFillPersonFill />
            <span>Personal Profile</span>
          </Link>
          <Link
            className=" hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3 "
            href={"/user/messages"}
          >
            <AiFillMessage />
            <span>Messages</span>
          </Link>
          <Link
            className="hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
            href={"/user/notifications"}
          >
            <RiNotificationFill />
            <span>Notifications</span>
          </Link>
          <Link
            href={"/user/settings"}
            className="  hover:bg-primary hover:rounded-[20px] flex items-center gap-3 p-3"
          >
            <AiFillSetting />
            <span>Settings</span>
          </Link>
          <button
            className="hover:bg-primary hover:rounded-[20px] lg:mt-10 flex items-center gap-3 p-3"
            onClick={() => {
              signOut({ redirect: true });
              redirect("/auth/login");
            }}
          >
            <AiOutlineLogout size="28" className=" cursor-pointer" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
