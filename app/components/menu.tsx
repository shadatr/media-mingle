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

export default function Menu() {
  const session = useSession({ required: false });
  const user = session.data?.user;
  const [isOpen, setIsOpen] = useState(false);
  if (!session.data?.user) {
    redirect("/");
  }
  return (
    <div className="fixed">
      <div
        className={`lg:pl-10 lg:text-lg sm:text-md font-bold sm:pl-2 w-[300px] `}
      >
        <span
          className={`flex   ${
            isOpen ? "justify-end bg-blue3" : "justify-start"
          } mt-5 md:hidden`}
        >
          {isOpen ? (
            <BsXLg color="white" size="30" onClick={() => setIsOpen(false)} />
          ) : (
            
            <TiThMenu color="white" size="30" onClick={() => setIsOpen(true)} />
          )}
        </span>
        {isOpen ? (
          <div className="flex  bg-blue3">
            <div>
              <div className="flex flex-col items-center ">
                <span className=" lg:text-xlg sm:text-lg font-bold mx-10 mt-10">
                  MediaMingle
                </span>
                <span>
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
                </span>
                <Link
                  href={"/user/posting"}
                  className="bg-blue1 px-10 py-3 rounded-[20px] font-bold text-lg   m-2 "
                >
                  Post
                </Link>
              </div>
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
                <span>Sittings</span>
              </Link>
              <button
                className="hover:bg-primary hover:rounded-[20px] lg:mt-10 flex items-center gap-3 p-3"
                onClick={() => {signOut({redirect:true}); redirect('/auth/login')}}
              >
                <AiOutlineLogout size="28" className=" cursor-pointer"  />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {isOpen && <div className="border-r h-screen border-gray3 p-5" />}
        <div className="menu flex  bg-blue3">
          <div>
            <div className="flex flex-col items-center ">
              <span className=" lg:text-xlg sm:text-lg font-bold mx-10 mt-10">
                MediaMingle
              </span>
              <span>
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
              </span>
              <Link
                href={"/user/posting"}
                className="bg-blue1 px-10 py-3 rounded-[20px] font-bold text-lg   m-2 "
              >
                Post
              </Link>
            </div>
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
              <span>Sittings</span>
            </Link>
            <button
              className="hover:bg-primary hover:rounded-[20px] lg:mt-10 flex items-center gap-3 p-3"
              onClick={() => signOut({ redirect: true })}
            >
              <AiOutlineLogout size="28" className=" cursor-pointer" />
              <span>Logout</span>
            </button>
          </div>
          <div className="border-r h-screen border-gray3 p-5 z-30" />
        </div>
      </div>
    </div>
  );
}
