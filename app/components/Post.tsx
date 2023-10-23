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
import toast from "react-hot-toast";

const Post = ({
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
          filter: `post_id=eq.${id}`,
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
          } else if (payload.eventType === "DELETE") {
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
    axios.delete(`/api/post/${id}`).then(()=> toast.success('deleted successfully') );
    if (onPostDelete) {
      onPostDelete();
    }
    setRefresh(!refresh);
  };

  const handleLike = (postId: number) => {
    const data = {
      user_id: sessionUser?.id,
      post_id: postId, 
    };
    try {
      axios.post(`/api/like/${postId}`, data); 
    } catch (error) {
      console.error("Error posting post:", error);
    }
    setRefresh(!refresh);
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
    <div className="lg:w-[700px] sm:w-[300px]">
      <div className="flex flex-row justify-between">
        <div>
          <div className="flex my-3 mx-5 items-center">
            <p className="mr-5">
              {user?.profile_picture ? (
                <span
                  className="inline-block rounded-full overflow-hidden lg:w-[60px] lg:h-[60px] sm:w-[40px] sm:h-[40px]"
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
            </p>
            <span className="items-center">
              <h1 className="text-ms font-bold">{user?.name}</h1>
              <h2 className="text-sm">{user?.username}</h2>
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
             (
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
          <div className="flex items-center justify-center ">
            {post?.comments.length}
            <FaRegComment
              size="20"
              color="gray"
              className="cursor-pointer mx-2"
            />
          </div>
        </span>
        <div className="border-t w-full border-gray3 " />
      </div>
    </div>
  );
};

export default Post;
