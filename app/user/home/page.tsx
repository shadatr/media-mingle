"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { SinglePostType } from "@/app/types/types";
import PostFeed from "@/app/components/PostFeed";
import LoadingIcons from "react-loading-icons";
import { redirect } from 'next/navigation';

const page = () => {
  const session = useSession({ required: false });
  const user = session.data?.user;
  const [posts, setPosts] = useState<SinglePostType[]>([]);
  const [loaded, setLoaded] = useState(false);

  if (!session.data?.user) {
    redirect("/");
  }

  useEffect(() => {
    const downloadData = async () => {
      if (user?.id != undefined) {
        const res = await axios.get(`/api/feedPosts/${user?.id}`);
        const data: SinglePostType[] = res.data.message;
        setPosts(data.flat());
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
    <div className="flex flex-col items-center justify-center w-full">
      <div className="mt-20">
        <h1 className="text-lg font-bold text-gray2 ">Feed</h1>
        <div className="border-t  border-gray3 py-2 w-[700px]" />
        {posts.length > 0 ? (
          posts.map((post) => <PostFeed id={post.id} />)
        ) : (
          <span className="text-md font-bold text-gray2">No posts posted yet!</span>
        )}
      </div>
    </div>
  );
};

export default page;
