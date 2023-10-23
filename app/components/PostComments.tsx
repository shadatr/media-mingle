"use client";
import React, { useEffect, useRef, useState } from "react";
import { FetchPosts } from "./FetchPosts";
import { useSession } from "next-auth/react";
import { BsPersonCircle, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { PostType, UserType } from "../types/types";
import { toast } from "react-hot-toast";
import { supabase } from "../api/supabase";

const PostComments = ({ id }: { id: number }) => {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [fetchPosts, setFetchPosts] = useState<PostType>();
  const [userComments, setUserComments] = useState<UserType[][]>([]);
  const [commentText, setCommentText] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [isPopoverOpenComment, setIsPopoverOpenComment] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

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
  }, [id,refresh]);

  const togglePopover = (id: number) => {
    setIsPopoverOpen(!isPopoverOpen);
    setIsPopoverOpenComment(id);
  };

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
    <div className="w-[700px]">
      <div className="flex items-center  m-5">
        <span>

        {user?.profile_picture ? (
          <span
            style={{ width: "40px", height: "40px" }}
            className="inline-block rounded-full overflow-hidden"
          >
            <img
              src={user.profile_picture}
              alt="Selected"
              className="w-full h-full object-cover"
            />
          </span>
        ) : (
          <BsPersonCircle size="40" />
        )}
        </span>
        <span className="px-2">
          <textarea
            placeholder="Reply on the post..."
            className="outline-none bg-primary px-5 py-4 w-[550px] rounded-[15px] h-[60px] "
            onChange={(e) => setCommentText(e.target.value)}
          />
        </span>
        <span
          className="bg-blue1 lg:px-8 lg:py-3 sm:px-5 sm:py-1 rounded-[20px] font-bold cursor-pointer"
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
                <span className="flex items-center m-5" key={comment.id}>
                  <p className="w-16">
                    {commentUser?.profile_picture ? (
                      <span
                        style={{ width: "40px", height: "40px" }}
                        className="inline-block rounded-full overflow-hidden"
                      >
                        <img
                          src={commentUser.profile_picture}
                          alt="Selected"
                          className="w-full h-full object-cover"
                        />
                      </span>
                    ) : (
                      <BsPersonCircle size="40" />
                    )}
                  </p>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <h1 className="text-sm font-bold">{commentUser?.name}</h1>
                      <h2 className="text-xsm text-gray2">
                        {commentUser?.username}
                      </h2>
                    </span>
                    <span>{comment.text}</span>
                  </div>
                </span>
                <span className="p-2 cursor-pointer">
                  <BsThreeDots
                    color="gray"
                    size="20"
                    onClick={() => togglePopover(comment.id)}
                  />
                  {isPopoverOpen &&
                    comment.id === isPopoverOpenComment &&
                    comment.user_id == user?.id &&
                    fetchPosts.post[0].user_id == user?.id && (
                      <div
                        ref={popoverRef}
                        className="absolute bg-primary rounded-md shadow-lg"
                      >
                        <button
                          className="block text-red-500 hover:text-red-700 p-2"
                          onClick={() => {
                            handledelete(comment.id);
                            setIsPopoverOpen(false);
                          }}
                        >
                          Delete
                        </button>
                      </div>
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
