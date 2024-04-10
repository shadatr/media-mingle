"use client";
import React, { useEffect, useState } from "react";
import { BsPersonCircle, BsThreeDots } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { FaRegComment } from "react-icons/fa6";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";
import { PostType } from "../types/types";
import { supabase } from "../api/supabase";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

const PostFeed = ({
  id,
  onPostDelete,
}: {
  id: number;
  onPostDelete?: () => void;
}) => {
  const session = useSession({ required: true });
  const sessionUser = session.data?.user;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [post, setPost] = useState<PostType | null>(null);
  const [refresh, setRefresh] = useState(false);
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


  const handledelete = (id: number) => {
    axios
      .delete(`/api/post/${id}`)
      .then(() => toast.success("deleted successfully"));
    setRefresh(!refresh);
    if (onPostDelete) {
      onPostDelete();
    }
  };

  const handleLike = (postId: number) => {
    const data = {
      user_id: sessionUser?.id,
      post_id: postId,
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
    return;
  }

  return (
    <div className="lg:w-[700px] sm:w-[350px] sm:text-xsm lg:text-sm ">
      <Link href={`/user/post/${id}`}>
        <div className="flex justify-between items-start lg:px-5 pt-2">
          <div>
            <Link
              href={`/user/personal-profile/${user?.id}`}
              className="flex my-3 mx-5"
            >
              {user?.profile_picture ? (
                <span
                  className="inline-block rounded-full overflow-hidden mr-5 lg:w-[40px] lg:h-[40px] sm:w-[25px] sm:h-[25px]"
                >
                  <img
                    src={user.profile_picture}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </span>
              ) : (
                <span className="mr-5">
                  <BsPersonCircle size="40" />
                </span>
              )}
              <span>
                <h1 className="font-bold">{user?.name}</h1>
                <h2 className="text-xsm">{user?.username}</h2>
              </span>
            </Link>
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
                (fileInfo,index) =>
                  fileInfo && (
                    <img
                    key={index}
                      src={fileInfo.publicUrl}
                      alt="Selected"
                      className={`rounded-[20px] lg:w-[330px] sm:[200px] cursor-pointer`}
                      onClick={() => handleImageClick(fileInfo.publicUrl)}
                    />
                  )
              )}
            </span>
          </div>
          {post.post[0].user_id == sessionUser?.id && (
            <Popover placement="bottom" offset={0} showArrow className="bg-transparent fixed top-0">
            <PopoverTrigger>
                <Button className="bg-transparent">
                  <BsThreeDots
                    color="gray"
                    size="20"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className=" bg-transparent">
                <Button
                  className="block text-red-500 hover:text-red-700 p-2 px-5 bg-blue2 rounded-2xl "
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handledelete(post.post[0].id);
                  }}
                >
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </Link>
      <div className="w-full flex flex-col ">
        <span className="flex justify-between items-center w-[100px] gap-4 text-md text-gray2 lg:px-10 sm:px-4 pb-3">
          <div className="flex items-center">
            {post?.likes.length}
            {post?.likes.find((item) => item.user_id == sessionUser?.id) &&
            post.likes.find((i) => i.post_id == id) ? (
              <AiFillHeart
                size="20"
                color="red"
                className="cursor-pointer mx-1"
                onClick={() => handleLike(id)}
              />
            ) : (
              <AiOutlineHeart
                size="20"
                color="gray"
                className="cursor-pointer mx-1"
                onClick={() => handleLike(id)}
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
