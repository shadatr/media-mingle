"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FetchPersonalData } from "@/app/components/FetchPersonalData";
import LoadingIcons from "react-loading-icons";
import axios from "axios";
import { supabase } from "@/app/api/supabase";
import PostFeed from "@/app/components/PostFeed";
import { AiFillMessage } from "react-icons/ai";
import Link from "next/link";

const page = ({ params }: { params: { id: number } }) => {
  const session = useSession({ required: true });
  const sessionUser = session.data?.user;
  const {user,setUser,refresh,setRefresh} = FetchPersonalData({ id: params.id });
  const userdata = user && user.user[0];
  const followersdata = user && user?.followers;
  const followingdata = user && user?.following;
  const postsdata = user && user?.posts;

  const handleFollow=()=>{
    const data={
      follower_id: sessionUser?.id,
      followed_id: params.id,
    }
    axios.post('/api/follow',data)
    setRefresh(!refresh)
  }


  useEffect(() => {

    const subscription = supabase
    .channel("table-db-changes")
    .on(
      "postgres_changes",
      {
        schema: "public",
        table: "tb_posts",
        event: 'DELETE'
      },
      (payload) => {
        console.log(payload)
          setUser((prevPost:any) => {
              const deletedPostId = payload.old.id; // Assuming id is the identifier for posts
              const updatedPosts = prevPost?.posts.filter(
                (post:any) => post?.id !== deletedPostId
              );
              console.log(updatedPosts); // Move this inside the DELETE condition
              console.log(deletedPostId);
              return {
                ...prevPost,
                posts: updatedPosts,
              };
            
          });
        
      }
    )
    .subscribe();
  
    return () => {
      subscription.unsubscribe();
    };
  }, [refresh]);


  if (!user) {
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
    <div className="flex w-[100%] items-center justify-center">
      <div className="flex flex-col justify-center items-center w-[700px]">
        <div>
          <div className="flex m-5 items-center gap-5">
            <div className="w-20">
              {userdata?.profile_picture ? (
                userdata?.profile_picture
              ) : (
                <BsPersonCircle size="80" />
              )}
            </div>
            <span>
              <p className="text-md font-bold">{userdata?.name}</p>
              <h1 className="text-sm font-semibold pb-2">
                {userdata?.username}
              </h1>
              <span className="text-xsm">{userdata?.bio}</span>
            </span>
          </div>
          <span className="font-bold flex w-[550px] justify-between items-center ">
            <div className=" flex gap-10 ml-36">
              <span>{followingdata?.length} following</span>
              <span>{followersdata?.length} followers</span>
            </div>
            {sessionUser?.id != params.id && (
              <span className="flex items-center">

              <button className="border border-gray3 bg-primary px-5 py-2 rounded-[15px] hover:text-gray2 mr-3" onClick={handleFollow}>
                {followersdata?.find((i)=> i.follower_id==sessionUser?.id) ? 'unfollow': 'follow'} 
              </button>
              <Link href={`/user/messages/${params.id}`}><AiFillMessage size='30' /></Link>
              </span>
            )}
          </span>
        </div>
        <div className="w-full mt-10">
          <h1 className="text-lg font-bold text-gray2">Posts</h1>
          <div className="border-t w-full border-gray3 py-2" />
          {postsdata?.map((post) => {
            if (post.id) {
              return <PostFeed key={post.id} id={post.id} onPostDelete={()=> setRefresh(!refresh)} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
