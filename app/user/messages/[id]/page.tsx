"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";
import Messages from "@/app/components/Messages";
import { FetchMessages } from "@/app/components/FetchMessages";
import { redirect } from "next/navigation";

const page = ({ params }: { params: { id: number } }) => {
  const session = useSession({ required: false });
  const user = session.data?.user;
  const [msgText, setMsgText] = useState("");
  const { messages, refresh, setRefresh } = FetchMessages({
    id: user?.id,
    user_id: params.id,
  });

  if (!session.data?.user && session.status != "loading") {
    redirect("/");
  }
  useEffect(() => {
    if (user?.id) {
      const setAllToSeen = () => {
        const data = {
          sender_id: params?.id,
          reciever_id: user.id,
        };
        axios.put("/api/messages/1", data);
      };
      setAllToSeen();
    }
  }, [user?.id]);

  const handelSend = () => {
    if (!msgText) {
      return;
    }
    const data = {
      text: msgText,
      sender_id: user?.id,
      reciever_id: params.id,
    };
    axios.post("/api/messages/1", data);
    setMsgText("");
    setRefresh(!refresh);
  };
  

  const message = messages.find((item) => item.user.id == params.id);
  
  if (!messages.length) {
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
  return (
 
        <div className="w-[100%] flex justify-center lg:ml-20">
          <div className=" flex ">
            <span className="sm:hidden lg:flex">
            <Messages  />
            </span>
            <div className={`lg:w-[500px] sm:w-[350px] flex flex-col p-5`}>
              {message? <div className="flex flex-col h-[600px] overflow-y-auto">
                {[
                  ...message?.recieve_userMasseges,
                  ...message?.sended_userMasseges,
                ]
                  .map((item) => item)
                  .sort((a, b) => a.id - b.id)
                  .map((msg) => (
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
                                <span
                                  style={{ width: "25px", height: "25px" }}
                                  className="inline-block rounded-full overflow-hidden"
                                >
                                  <img
                                    src={user.profile_picture}
                                    alt="Selected"
                                    className="w-full h-full object-cover"
                                  />
                                </span>
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
                                <span
                                  style={{ width: "25px", height: "25px" }}
                                  className="inline-block rounded-full overflow-hidden"
                                >
                                  <img
                                    src={message.user.profile_picture}
                                    alt="Selected"
                                    className="w-full h-full object-cover"
                                  />
                                </span>
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
              </div>: <div className="flex h-[600px]  justify-center items-center font-bold">no masseges</div>}
              
              <div className="flex items-center">
                <span className="bg-primary w-full rounded-[20px] lg:p-5 sm:p-3">
                  <textarea
                    className="bg-primary w-full outline-none lg:h-[20px] sm:h-[20px]"
                    placeholder="write your message here..."
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                  />
                </span>
                <span
                  className="bg-blue1 rounded-[20px] lg:py-4 lg:px-6 sm:py-2 sm:px-3 font-bold cursor-pointer "
                  onClick={handelSend}
                >
                  Send
                </span>
              </div>
            </div>
          </div>
        </div>
 
  );
};

export default page;
