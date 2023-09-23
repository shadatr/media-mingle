"use client";
import { NotificationType } from "@/app/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";

const page = () => {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoadings] = useState(false);

  useEffect(() => {
    const downloadData = async () => {
      if (user?.id != undefined) {
        const res = await axios.get(`/api/notifications/${user.id}`);
        const data: NotificationType[] = res.data.message;
        setNotifications(data.flat());
        setLoadings(true);
        data.flat().map((ntf)=>{
          axios.put(`/api/notifications/${ntf.notification.id}`)
        })
      }
    };
    downloadData();
  }, [user?.id]);


  if (!notifications) {
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

  const sortedNotifications: NotificationType[] = notifications.sort(
    (a, b) => a.notification.id - b.notification.id
  );

  return (
    <div className="flex items-center justify-center w-[100%]">
      {loading ? (
        <div className="flex w-[700px]">
          <div className=" flex flex-col">
            {sortedNotifications.map((ntf) => {
              if (ntf.notification.type == "follow") {
                return (
                  <Link href={`/user/personal-profile/${ntf.user.id}`}>
                    <div className="flex items-center hover:bg-primary hover:rounded-[20px] py-4 mx-5 w-[400px]">
                      <span className="mx-3">
                        {ntf.user?.profile_picture ? (
                          <span
                          style={{ width: "30px", height: "30px" }}
                          className="inline-block rounded-full overflow-hidden"
                        >
                          <img
                            src={ntf.user.profile_picture}
                            alt="Selected"
                            className="w-full h-full object-cover"
                          />
                        </span>
                        ) : (
                          <BsPersonCircle size="30" />
                        )}
                      </span>
                      <p
                        className={`${
                          ntf.notification?.seen ? "text-gray2" : "font-bold"
                        }`}
                      >
                        {` ${ntf.user?.username}  ${ntf.notification?.text}`}
                      </p>
                    </div>
                  </Link>
                );
              } else if (
                ntf.notification.type == "comment" ||
                ntf.notification.type == "like"
              ) {
                return (
                  <Link href={`/user/post/${ntf.notification.post_id}`}>
                    <div className="flex items-center hover:bg-primary hover:rounded-[20px] py-4 mx-5 w-[400px]">
                      <span className="mx-3">
                        {ntf.user?.profile_picture ? (
                          <span
                          style={{ width: "30px", height: "30px" }}
                          className="inline-block rounded-full overflow-hidden"
                        >
                          <img
                            src={ntf.user.profile_picture}
                            alt="Selected"
                            className="w-full h-full object-cover"
                          />
                        </span>
                        ) : (
                          <BsPersonCircle size="30" />
                        )}
                      </span>
                      <p
                        className={`${
                          ntf.notification?.seen ? "text-gray2" : "font-bold"
                        }`}
                      >
                        {` ${ntf.user?.username}  ${ntf.notification?.text}`}
                      </p>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
          <div className="border-r h-screen border-gray3 m-2" />
        </div>
      ) : (
        <div className="items-center justify-center flex h-[100%] mt-[200px]">
          <LoadingIcons.TailSpin
            stroke="white"
            width="100"
            height="100"
            speed={0.8}
          />
        </div>
      )}
    </div>
  );
};

export default page;
