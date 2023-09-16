"use client";
import React, { useState } from "react";
import axios from "axios";
import { AiOutlinePicture } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { BsPersonCircle } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import LoadingIcons from "react-loading-icons";
import { toast } from "react-hot-toast";

const UploadImage = () => {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [postText, setPostText] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setSelectedImage((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handelPost = () => {
    setLoading(true);
    const formData = new FormData();

    if (postText && user?.id) {
      formData.append("text", postText);
      formData.append("user_id", (user?.id).toString());
    }
    selectedImage.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      axios.post("/api/posting", formData).then(()=>  setLoading(false))
      toast.success('Successfully posted!')
      setSelectedImage([])
    } catch (error) {
      console.error("Error posting post:", error)
      setLoading(false)
      toast.error('error happend while posting the post!')
    }
   
  };

  const handleDelete = (name: string) => {
    setSelectedImage(selectedImage.filter((pic) => pic.name != name));
  };

  console.log(selectedImage)

  return (
    <div className="flex items-center justify-center lg:w-[120%] sm:w-[100%] flex-col lg:text-sm sm:text-xsm">
      {loading ? (
        <div className="items-center justify-cente flex h-[100%] mt-[200px]">
          <LoadingIcons.TailSpin stroke="white" width='100' height='100' speed={.8}  />
        </div>
      ) : (
        <div className=" lg:w-[800px] sm:w-[300px] ">
          <span>
            <div className="flex m-5">
              <p className="w-16">
                {user?.profile_picture ? (
                  user?.profile_picture
                ) : (
                  <BsPersonCircle size="40" />
                )}
              </p>
              <p>
                <h1 className="text-sm font-bold">{user?.name}</h1>
                <h2 className="text-xsm">{user?.username}</h2>
              </p>
            </div>
          </span>
          <div className="bg-primary w-full rounded-[20px] p-8">
            <textarea
              className="bg-primary w-full outline-none lg:h-[300px] sm:h-[150px]"
              placeholder="write your post here..."
              onChange={(e) => setPostText(e.target.value)}
            />
            {selectedImage.length > 0 && (
              <div className="grid grid-cols-2">
                {selectedImage.map((pic) => (
                  <span>
                    <TiDelete
                      className="absolute cursor-pointer"
                      size="30"
                      value={pic.name}
                      onClick={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDelete(pic.name)
                      }
                    />
                    <img
                      src={URL.createObjectURL(pic)}
                      alt="Selected"
                      className="w-[350px] rounded-[20px] "
                    />
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center m-4">
              {selectedImage.length < 4 ? (
                <>
                  <label htmlFor="fileInput">
                    <AiOutlinePicture size="30" className="cursor-pointer " />
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    multiple
                  />
                </>
              ) : (
                <AiOutlinePicture
                  size="30"
                  color="gray"
                  className="cursor-pointer "
                />
              )}
              <span
                className="bg-blue1 lg:px-10 lg:py-3 sm:px-5 sm:py-1 rounded-[20px] font-bold cursor-pointer"
                onClick={handelPost}
              >
                Post
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
