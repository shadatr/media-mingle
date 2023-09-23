"use client";
import React, { useEffect, useRef, useState } from "react";
import { BsPersonCircle, BsThreeDots } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";
import { TiDelete } from "react-icons/ti";
import { FaRegComment } from "react-icons/fa6";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";
import { PostType } from "../types/types";
import { supabase } from "../api/supabase";
import Link from "next/link";

const PostFeed = ({
  id,
  onPostDelete,
}: {
  id: number;
  onPostDelete?: () => void;
}) => {
  const session = useSession({ required: true });
  const sessionUser = session.data?.user;
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [isPopoverOpenComment, setIsPopoverOpenComment] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [post, setPost] = useState<PostType | null>(null);
  const [refresh, setRefresh] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const user = post?.user[0];
  

  useEffect(() => {
    async function downloadData() {
      try {
        const response = await axios.get(`/api/post/${id}`);
        const data: PostType = response.data.message;
        setPost(data);
      } catch (error) {
        console.log("Error downloading data: ", error);
      }
    }

    downloadData();
  }, [id]);

  useEffect(() => {
    const subscription2 = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_likes",
          filter: `post_id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPost((prevPost: any) => {
              if (prevPost) {
                const newLike = payload.new;
                const updatedLikes = [...prevPost.likes, newLike];
                return {
                  ...prevPost,
                  likes: updatedLikes,
                };
              }
              return prevPost;
            });
          } else if (
            payload.eventType === "DELETE" ) {
            setPost((prevPost) => {
              if (prevPost) {
                const deletedLike = payload.old;
                const updatedLikes = prevPost.likes.filter(
                  (like) => like.id !== deletedLike.id
                );
                return {
                  ...prevPost,
                  likes: updatedLikes,
                };
              }
              return prevPost;
            });
          }
        }
      )
      .subscribe();
    return () => {
      subscription2.unsubscribe();
    };
  }, [refresh]);

  const togglePopover = (id: number) => {
    setIsPopoverOpen(!isPopoverOpen);
    setIsPopoverOpenComment(id);
  };

  const handledelete = (id: number) => {
    axios.delete(`/api/post/${id}`);
    setRefresh(!refresh)
    if (onPostDelete) {
      onPostDelete();
    }
  };

  const handleLike = (postId: number) => {
    const data = {
      user_id: sessionUser?.id,
      post_id: postId, // Use the postId parameter passed to the function
    };
    try {
      axios.post(`/api/like/${postId}`, data);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error posting post:", error);
    }
    
    if (onPostDelete) {
      onPostDelete();
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setModalOpen(false);
  };

  if (!post) {
    return 
  }

  return (
    <div className="w-[700px] ">
        <Link href={`/user/post/${id}`}>
      <div className="flex flex-row justify-between">
        <div>
          <div className="flex my-3 mx-5">
            <p className="w-16">
              {user?.profile_picture ? (
                user.profile_picture
              ) : (
                <BsPersonCircle size="40" />
              )}
            </p>
            <span>
              <h1 className="text-sm font-bold">{user?.name}</h1>
              <h2 className="text-xsm">{user?.username}</h2>
            </span>
          </div>
          <span className="text-center mx-5">{post?.post[0].text}</span>
          {isModalOpen && (
            <div className="modal ">
              <div className="modal-content ">
                <button
                  onClick={closeModal}
                  className="top-2 left-0 w-full cursor-pointer  "
                >
                  <TiDelete size="60" color="black" />
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="rounded-[20px] max-w-screen-lg mx-auto"
                />
              </div>
            </div>
          )}
          <span className={`grid grid-cols-2 my-5 gap-1 mx-5`}>
            {post?.picture?.map(
              (fileInfo) =>
                fileInfo && (
                  <img
                    src={fileInfo.publicUrl}
                    alt="Selected"
                    className={`rounded-[20px] w-[330px] cursor-pointer`}
                    onClick={() => handleImageClick(fileInfo.publicUrl)}
                  />
                )
            )}
          </span>
        </div>
        <span className="p-2 cursor-pointer">
          <BsThreeDots
            color="gray"
            size="20"
            onClick={() => togglePopover(post.post[0].id)}
          />
          {isPopoverOpen &&
            post.post[0].id === isPopoverOpenComment &&
            post.post[0].user_id == sessionUser?.id &&
            post.post[0].user_id == user?.id && (
              <div
                ref={popoverRef}
                className="absolute bg-primary rounded-md shadow-lg"
              >
                <button
                  className="block text-red-500 hover:text-red-700 p-2"
                  onClick={() => {
                    handledelete(post.post[0].id);
                    setIsPopoverOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
        </span>
      </div>
        </Link>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="border-t  w-full border-gray3" />
        <span className="flex justify-between items-center w-[200px] py-1 text-md text-gray2">
          <div className="flex items-center">
            {post?.likes.length}
            {post?.likes.find((item) => item.user_id == sessionUser?.id) &&
            post.likes.find((i) => i.post_id == id) ? (
              <AiFillHeart
                size="20"
                color="red"
                className="cursor-pointer mx-1"
                onClick={() => handleLike(id)} // Pass the correct post id here
              />
            ) : (
              <AiOutlineHeart
                size="20"
                color="gray"
                className="cursor-pointer mx-1"
                onClick={() => handleLike(id)} // Pass the correct post id here
              />
            )}
          </div>
          <div className="flex flex-row items-center justify-center ">
            {post?.comments.length}
            <Link href={`/user/post/${id}`}>
            <FaRegComment
              size="20"
              color="gray"
              className="cursor-pointer mx-2"
            />
            </Link>
          </div>
        </span>
        <div className="border-t w-full border-gray3 " />
      </div>
    </div>
  );
};

export default PostFeed;
