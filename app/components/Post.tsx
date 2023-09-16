"use client";
import React, { useState } from "react";
import { FetchPosts } from "./FetchPosts";
import { BsPersonCircle } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";
import { TiDelete } from "react-icons/ti";

const Post = ({ id }: { id: string }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const fetchPosts = FetchPosts({ id });
  console.log(fetchPosts);
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
  const user = fetchPosts?.user[0];

  {
    fetchPosts.picture?.map((fileInfo) => console.log(typeof fileInfo));
  }

  return (
    <div className="flex items-center justify-center w-[100%]">
      <div className={`w-[700px]`}>
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
                className=" absolute top-2 right-2 w-[100%] cursor-pointer flex p-5 "
              >
                <TiDelete size="60" color="black"  />
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
      </div>
    </div>
  );
};

export default Post;
