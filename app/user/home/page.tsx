"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { SinglePostType, UserDataType } from "@/app/types/types";
import PostFeed from "@/app/components/PostFeed";
import LoadingIcons from "react-loading-icons";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BsPersonCircle } from "react-icons/bs";

const page = () => {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [posts, setPosts] = useState<SinglePostType[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState<UserDataType[]>([]);

  if (!session.data?.user && session.status != "loading") {
    redirect("/");
  }
  useEffect(() => {
    const downloadData = async () => {
      if (user?.id != undefined) {
        const res = await axios.get(`/api/feedPosts/${user?.id}`);
        const data: SinglePostType[] = res.data.message;
        setPosts(data.flat());
        const resUser = await axios.get(`/api/users`);
        const dataUser: UserDataType[] = resUser.data.message;
        setUsers(dataUser.flat());
        const sortedData = dataUser.flat().sort((a, b) => b.followers.length - a.followers.length);

        console.log(sortedData)
        setLoaded(true);
      }
    };
    downloadData();
  }, [user]);

  if (!loaded) {
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
    <div className="flex items-center justify-center w-full">
      <div className="mt-20">
        <h1 className="lg:text-lg sm:text-md font-bold text-gray2 px-10">Feed</h1>
        <div className="border-t  border-gray3  lg:w-[700px] sm:w-[350px]" />
        {posts.length > 0 ? (
          posts.map((post, index) => <PostFeed id={post.id} key={index} />)
        ) : (
          <span className="text-md font-bold text-gray2 p-5 mx-5">
            No posts posted yet!
          </span>
        )}
      </div>
      <div className="top-20 right-0 fixed sm:hidden lg:flex flex-col">
          <p className="text-md font-bold">who to follow </p>
        <div className=" w-[350px] h-[700px] overflow-y-auto border rounded-[20px] border-gray3">
          {users.map((usr)=>
          <span
          className="flex lg:m-5 sm:m-3 gap-2 hover:bg-primary py-2 px-5 rounded-2xl"
          key={usr.user.id}
        >
          <Link href={`/user/personal-profile/${usr.user.id}`}  className="lg:w-12 sm:w-10">
            {usr?.user.profile_picture ? (
              <span className="inline-block rounded-full overflow-hidden lg:w-[40px] lg:h-[40px] sm:w-[25px] sm:h-[25px]">
                <img
                  src={usr.user.profile_picture}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </span>
            ) : (
              <div>
                <BsPersonCircle
                  size="40"
                  className="sm:hidden lg:flex"
                />
                <BsPersonCircle
                  size="25"
                  className="sm:flex lg:hidden"
                />
              </div>
            )}
          </Link>
          <div className="flex flex-col items-start">
            <Link href={`/user/personal-profile/${usr?.user.id}`} className="flex items-center gap-2 flex-col">
              <h1 className="lg:text-sm sm:text-xsm font-bold">
                {usr?.user.name}
              </h1>
              <h2 className="lg:text-xsm sm:text-xxsm  text-gray2">
                {usr?.user.username}
              </h2>
            </Link>
            <span className="lg:text-xsm sm:text-xsm ">
              {usr?.user.bio}
            </span>
          </div>
        </span>)}
        </div>
      </div>
    </div>
  );
};

export default page;
