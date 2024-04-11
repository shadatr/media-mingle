"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { BsPersonCircle, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { PostType, UserType } from "../types/types";
import { toast } from "react-hot-toast";
import { supabase } from "../api/supabase";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import Link from "next/link";

const PostComments = ({ id }: { id: number }) => {
  const session = useSession({ required: true });
  const user = session.data?.user;

  const [fetchPosts, setFetchPosts] = useState<PostType>();
  const [userComments, setUserComments] = useState<UserType[][]>([]);
  const [commentText, setCommentText] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`/api/comment/${id}`);
      const data: UserType[][] = response.data.message;
      setUserComments(data);

      const response2 = await axios.get(`/api/post/${id}`);
      const data2: PostType = response2.data.message;
      setFetchPosts(data2);
    };
    fetchComments();
  }, [refresh]);

  useEffect(() => {
    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_comments",
        },
        (payload) =>
          setFetchPosts((prevPost: any) => {
            if (!prevPost) return prevPost;
            const updatedLikes = [...prevPost.comments];

            if (payload.eventType === "INSERT") {
              updatedLikes.push(payload.new);
            } else if (payload.eventType === "DELETE") {
              const index = updatedLikes.findIndex(
                (like) => like.id === payload.old.id
              );
              if (index !== -1) {
                updatedLikes.splice(index, 1);
              }
            }

            return {
              ...prevPost,
              comments: updatedLikes,
            };
          })
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [id, refresh]);

  const handelPost = () => {
    const data = {
      user_id: user?.id,
      post_id: id,
      text: commentText,
    };
    try {
      axios.post("/api/comment/1", data);
      toast.success("Successfully posted!");
    } catch (error) {
      console.error("Error posting post:", error);
      toast.error("error happend while posting the comment!");
    }
    setRefresh(!refresh);
  };

  if (!fetchPosts) {
    return;
  }

  const handledelete = (id: number) => {
    axios.delete(`/api/comment/${id}`);
    setRefresh(!refresh);
  };

  return (
    <div className="lg:w-[700px] sm:w-[350px] lg:text-sm sm:text-xsm">
      <div className="flex items-center  m-5">
        <span>
          {user?.profile_picture ? (
            <span className="inline-block rounded-full overflow-hidden lg:w-[40px] lg:h-[40px] sm:w-[30px] sm:h-[30px]">
              <img
                src={user.profile_picture}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </span>
          ) : (
            <div>
              <BsPersonCircle size="40" className="sm:hidden lg:flex" />
              <BsPersonCircle size="25" className="sm:flex lg:hidden" />
            </div>
          )}
        </span>
        <span className="px-2">
          <textarea
            placeholder="Reply on the post..."
            className="outline-none bg-primary lg:px-5 lg:py-4 sm:px-2 sm:py-2  lg:w-[550px] sm:w-[200px] rounded-[15px] lg:h-[60px] sm:h-[40px]"
            onChange={(e) => setCommentText(e.target.value)}
          />
        </span>
        <span
          className="bg-blue1 lg:px-8 lg:py-3 sm:px-3 sm:py-1 rounded-[20px] font-bold cursor-pointer"
          onClick={handelPost}
        >
          Post
        </span>
      </div>
      <div className="border-t w-full border-gray3 " />
      <div>
        {fetchPosts?.comments.map((comment) => {
          const flatUserComments = userComments.flat();
          const commentUser = flatUserComments.find(
            (user) => user.id === comment.user_id
          );
          return (
            <div>
              <div className="flex flex-row justify-between">
                <span
                  className="flex items-center lg:m-5 sm:m-3"
                  key={comment.id}
                >
                  <Link href={`/user/personal-profile/${comment.user_id}`}  className="lg:w-16 sm:w-10">
                    {commentUser?.profile_picture ? (
                      <span className="inline-block rounded-full overflow-hidden lg:w-[40px] lg:h-[40px] sm:w-[25px] sm:h-[25px]">
                        <img
                          src={commentUser.profile_picture}
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
                  <div className="flex flex-col">
                    <Link href={`/user/profile/${comment.user_id}`} className="flex items-center gap-2">
                      <h1 className="lg:text-sm sm:text-xsm font-bold">
                        {commentUser?.name}
                      </h1>
                      <h2 className="lg:text-xsm sm:text-xxsm  text-gray2">
                        {commentUser?.username}
                      </h2>
                    </Link>
                    <span className="lg:text-sm sm:text-xsm ">
                      {comment.text}
                    </span>
                  </div>
                </span>
                <span className="p-2 cursor-pointer">
                  {comment.user_id == user?.id && (
                    <Popover
                      placement="bottom"
                      offset={0}
                      showArrow
                      className="bg-transparent fixed top-0"
                    >
                      <PopoverTrigger>
                        <Button className="bg-transparent">
                          <BsThreeDots color="gray" size="20" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className=" bg-transparent">
                        <Button
                          className="block text-red-500 hover:text-red-700 p-2 px-5 bg-blue2 rounded-2xl "
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handledelete(comment.id);
                            setIsPopoverOpen(false);
                          }}
                        >
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  )}
                </span>
              </div>
              <div className="border-t  w-full border-gray3" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostComments;
