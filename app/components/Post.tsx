"use client";
import React, { useEffect, useState } from "react";
import { FetchPosts } from "./FetchPosts";
import { BsPersonCircle } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";
import { TiDelete } from "react-icons/ti";
import { FaRegComment } from "react-icons/fa6";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { supabase } from "../api/supabase";
import axios from "axios";

const Post = ({ id }: { id: string }) => {
  const session = useSession({ required: true });
  const sessionUser = session.data?.user;

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const fetchPosts = FetchPosts({ id });
  const user = fetchPosts?.user[0];

  const handleLike = () => {
    const data = {
      user_id: sessionUser?.id,
      post_id: fetchPosts?.post[0].id,
    };
    try {
      axios.post("/api/like/1", data);
    } catch (error) {
      console.error("Error posting post:", error);
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

  if (!fetchPosts) {
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
    <div className="w-[700px]">
      <span>
        <div className="flex m-5">
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
      </span>
      <span className="text-center">{fetchPosts.post[0].text}</span>
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
      <span className={`grid grid-cols-2 my-5 gap-1`}>
        {fetchPosts.picture?.map(
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
      <div className="w-full flex items-center justify-center flex-col">
        <div className="border-t  w-full border-gray3" />
        <span className="flex justify-between items-center w-[200px] py-1 text-md text-gray2">
          <div className="flex flex items-center justify-center ">
            {fetchPosts.likes.length}
            {fetchPosts.likes.find(
              (item) => item.user_id == sessionUser?.id
            ) ? (
              <AiFillHeart
                size="20"
                color="red"
                className="cursor-pointer mx-1"
                onClick={handleLike}
              />
            ) : (
              <AiOutlineHeart
                size="20"
                color="gray"
                className="cursor-pointer mx-1"
                onClick={handleLike}
              />
            )}
          </div>
          <div className="flex flex items-center justify-center ">
            {fetchPosts.comments.length}
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
