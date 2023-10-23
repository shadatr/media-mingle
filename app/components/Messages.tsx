"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import Link from "next/link";
import LoadingIcons from "react-loading-icons";
import { FetchMessages } from "./FetchMessages";

const Messages = () => {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const {messages} = FetchMessages({ id: user?.id });


  return (
    <div className="flex lg:w-[400px] sm:w-[300px]">
      {messages.length? <div className=" flex flex-col">
        {messages.map((msg) => {
          const combinedIds = [
            ...msg.recieve_userMasseges,
            ...msg.sended_userMasseges,
          ].map((item) => item);

          const greatestId = combinedIds.reduce((maxId, currentId) => {
            return Math.max(maxId, currentId.id);
          }, -Infinity);
          const lastText = combinedIds.find((i) => i.id == greatestId);
          if (msg.user.id !== user?.id) {
            return (
              <Link href={`/user/messages/${msg.user.id}`}>
                <div className="flex hover:bg-primary hover:rounded-[20px] py-4 px-5 w-[400px]">
                  <div className="w-20">
                    {msg.user?.profile_picture ? (
                      <span
                      style={{ width: "60px", height: "60px" }}
                      className="inline-block rounded-full overflow-hidden"
                    >
                      <img
                        src={msg.user.profile_picture}
                        alt="Selected"
                        className="w-full h-full object-cover"
                      />
                    </span>
                    ) : (
                      <BsPersonCircle size="60" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-sm font-bold">{msg.user?.username}</h1>
                    <p
                      className={`${
                        lastText?.seen ? "text-gray2" : "font-bold"
                      }`}
                    >
                      {lastText?.text}
                    </p>
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>: <div className="items-center justify-center flex w-[100%] font-bold">
        There is not messages yet!
      </div>}
      
      <div className="border-r h-screen border-gray3 " />
    </div>
  );
};

export default Messages;
