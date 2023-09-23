"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsPersonCircle } from "react-icons/bs";
import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import "./styles.css";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { RiNotificationFill } from "react-icons/ri";

export default function App() {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="App">
        <div className="page ">
          <div
            className={`lg:pl-10 lg:text-lg sm:text-md font-bold sm:pl-2 sidebar ${
              isOpen ? "sidebar--open" : ""
            }`}
          >
            <div className={`lg:hidden`}>
              <div className="trigger " onClick={handleTrigger}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
              </div>
            </div>

            <div className="flex flex-col items-center sidebar-position">
              <span className=" lg:text-xlg sm:text-lg font-bold ">
                MediaMingle
              </span>
              <span>
                <div className="flex m-5">
                  <div className="w-20">
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
              <span>
                <Link
                  href={"/user/posting"}
                  className="bg-blue1 px-10 py-3 rounded-[20px] font-bold text-lg  h-[100px] m-10 "
                >
                  Post
                </Link>
              </span>
            </div>
            <Link
              className="hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={"/user/home"}
            >
              <AiFillHome />
              <span>Home</span>
            </Link>
            <Link
              className=" hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={`/user/personal-profile/${user?.id}`}
            >
              <BsFillPersonFill />
              <span>Personal Profile</span>
            </Link>
            <Link
              className=" hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={"/user/messages"}
            >
              <AiFillMessage />
              <span>Messages</span>
            </Link>
            <Link
              className="hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={"/user/notifications"}
            >
              <RiNotificationFill />
              <span>Notifications</span>
            </Link>
            <Link
              href={"/user/settings"}
              className="sidebar-position  hover:bg-primary hover:rounded-[20px]"
            >
              <AiFillSetting />
              <span>Sittings</span>
            </Link>
            <button
              className="sidebar-position  hover:bg-primary hover:rounded-[20px] lg:mt-10"
              onClick={() => signOut({ redirect: true })}
            >
              <AiOutlineLogout size="28" className=" cursor-pointer" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="App  sm:hidden lg:flex">
        <div className="page">
          <div
            className={`lg:pl-10 lg:text-lg sm:text-md font-bold sm:pl-2 sidebar 
          sidebar--open
        `}
          >
            <div className="flex flex-col items-center sidebar-position">
              <span className=" lg:text-xlg sm:text-lg font-bold ">
                MediaMingle
              </span>
              <span>
                <div className=" m-5">
                  <div >
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
              <span>
                <Link
                  href={"/user/posting"}
                  className="bg-blue1 px-10 py-3 rounded-[20px] font-bold text-lg  h-[100px] m-10 "
                >
                  Post
                </Link>
              </span>
            </div>
            <Link
              className="hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={"/user/home"}
            >
              <AiFillHome />
              <span>Home</span>
            </Link>
            <Link
              className=" hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={`/user/personal-profile/${user?.id}`}
            >
              <BsFillPersonFill />
              <span>Personal Profile</span>
            </Link>
            <Link
              className=" hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={"/user/messages"}
            >
              <AiFillMessage />
              <span>Messages</span>
            </Link>
            <Link
              className="hover:bg-primary hover:rounded-[20px] sidebar-position"
              href={"/user/notifications"}
            >
              <RiNotificationFill />
              <span>Notifications</span>
            </Link>
            <Link
              href={"/user/settings"}
              className="sidebar-position  hover:bg-primary hover:rounded-[20px]"
            >
              <AiFillSetting />
              <span>Sittings</span>
            </Link>
            <button
              className="sidebar-position  hover:bg-primary hover:rounded-[20px] lg:mt-10"
              onClick={() => signOut({ redirect: true })}
            >
              <AiOutlineLogout size="28" className=" cursor-pointer" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
