"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";
import { MessageType } from "@/app/types/types";
import Messages from "@/app/components/Messages";
import { FetchMessages } from "@/app/components/FetchMessages";

const page = ({ params }: { params: { id: number } }) => {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [msgText, setMsgText] = useState("");

  useEffect(()=>{
    if(user?.id){
    const setAllToSeen =()=>{
        const data = {
            sender_id: params?.id,
            reciever_id: user.id,
          };
        axios.put('/api/messages/1',data)
    }
    setAllToSeen()}
  },[user?.id])

  const handelSend = () => {
    const data = {
      text: msgText,
      sender_id: user?.id,
      reciever_id: params.id,
    };
    axios.post("/api/messages/1", data);
    setMsgText('')
  };

  const messages = FetchMessages({
    id: user?.id,
    user_id: params.id,
    onPostSend: handelSend,
  });
  const message = messages.find((item) => item.user.id == params.id);

  // Check if message is defined before using it
  if (message==undefined || messages==undefined ) {
    return (
        <div className="items-center justify-center flex h-[100%] mt-[200px]">
          <LoadingIcons.TailSpin
            stroke="white"
            width="100"
            height="100"
            speed={0.8}
          />
        </div>
      );
  }

  const combinedMessage: MessageType[] = [
    ...message?.recieve_userMasseges,
    ...message?.sended_userMasseges,
  ].map((item) => item);

  const sorted: MessageType[] = combinedMessage.sort((a, b) => a.id - b.id);

  return (
    <div className="w-[100%] flex justify-center ml-20">
      <div className="w-[900px] flex ">
        <Messages />
        <div className={`w-[800px] flex flex-col `}>
          <div className="flex flex-col h-[600px] overflow-y-auto">
            {sorted.map((msg) => (
              <div key={msg.id}>
                {msg.sender_id === user?.id && (
                  <span
                    className={`flex p-2 w-full rounded-md ${
                      msg.sender_id === user?.id
                        ? " justify-end"
                        : "  justify-start"
                    }`}
                  >
                    <div className=" flex flex-row items-center">
                      <span
                        className={`py-2 px-4 rounded-md mx-2 ${
                          msg.sender_id === user?.id
                            ? "bg-primary "
                            : "bg-gray3  "
                        }`}
                      >
                        {msg.text}
                      </span>
                      <span>
                        {user?.profile_picture ? (
                          user?.profile_picture
                        ) : (
                          <BsPersonCircle size="25" />
                        )}
                      </span>
                    </div>
                  </span>
                )}
                {msg.reciever_id === user?.id && (
                  <span
                    className={`flex p-2 w-full rounded-md ${
                      msg.sender_id === user?.id
                        ? " justify-end"
                        : "  justify-start"
                    }`}
                  >
                    <div className=" flex flex-row items-center">
                      <span>
                        {message?.user.profile_picture ? (
                          message?.user.profile_picture
                        ) : (
                          <BsPersonCircle size="25" />
                        )}
                      </span>
                      <span
                        className={`py-2 px-4 rounded-md mx-2 ${
                          msg.sender_id === user?.id
                            ? "bg-primary "
                            : "bg-gray3  "
                        }`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <span className="bg-primary w-full rounded-[20px] p-5">
              <textarea
                className="bg-primary w-full outline-none lg:h-[20px] sm:h-[150px]"
                placeholder="write your message here..."
                onChange={(e) => setMsgText(e.target.value)}
              />
            </span>
            <span
              className="bg-blue1 rounded-[20px] py-4 px-6 font-bold cursor-pointer "
              onClick={handelSend}
            >
              Post
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
