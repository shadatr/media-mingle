"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlinePicture } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { BsPersonCircle } from "react-icons/bs";
import LoadingIcons from "react-loading-icons";
import { toast } from "react-hot-toast";
import { UserType } from "@/app/types/types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Switch from "@mui/material/Switch";
import { createHash } from "crypto";
import { redirect } from "next/navigation";

const label = { inputProps: { "aria-label": "Switch demo" } };

const page = () => {
  const session = useSession({ required: false });
  const user = session.data?.user;
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [newConPassword, setnewConPassword] = useState('');
  const [userData, setUserData] = useState<UserType>();
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File>();
  const [error, setError] = useState("");

  if (!session.data?.user && session.status != "loading") {
    redirect("/");
  }
  
  useEffect(() => {
    if (user?.id) {
      const downloadData = async () => {
        const response = await axios.get(`/api/userData/${user?.id}`);
        const data: UserType[] = response.data.message;
        setSelectedUser(data[0]);
        setUserData(data[0]);
      };
      downloadData();
    }
  }, [user?.id]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUpdateData = (key: keyof UserType, value: string) => {
    
    if (selectedUser) {
      setUserData({
        ...selectedUser,
        [key]: value,
      });
    }
  };

  const handleUpdatePassword = () => {
    const passwordHash = createHash("sha256")
    .update(currentPassword)
    .digest("hex");
    if(passwordHash!=userData?.password){
      setError('Current password is wrong')
      return;
    }
    if(newPassword!=newConPassword){
      setError('New password does not match')
      return;
    }
    setError('')
    if (selectedUser) {
      setUserData({
        ...selectedUser,
        password: newPassword,
      });
      handleSubmitData()
    }
  };

  const handleSubmitData = () => {
    try{
      axios.put(`/api/userData/${user?.id}`, userData);
      setSelectedUser(userData);
      toast.success('updated succesfully')
    }
    catch{
      toast.error('error')
    }
  };

  const handleSubmitImage = () => {
    const formData = new FormData();
    try{
    if ( user?.id&&selectedImage) {
      formData.append("imageFile", selectedImage);
      formData.append("name", selectedImage.name);
      formData.append("user_id", (user?.id).toString());
    }
    axios.put(`/api/userImage`, formData);
    toast.success('updated succesfully')
    }
    catch{
      toast.error('error')
    }
  };

  return (
    <div className="flex justify-center items-center w-[105%]">
      {selectedUser ? (
        <div className="flex">
          <div className={`flex flex-col lg:w-[400px] sm:w-[300px] lg:text-sm sm:text-xsm ${activeTab.length>0? "sm:hidden lg:flex":" lg:flex"}`}>
            <span
              onClick={() => handleTabClick("username")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Username</p>
              <h1>{selectedUser.username}</h1>
            </span>
            <span
              onClick={() => handleTabClick("name")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Name</p>
              <h1>{selectedUser.name || "Not selected"}</h1>
            </span>
            <span
              onClick={() => handleTabClick("email")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Email Address</p>
              <h1>{selectedUser.email || "Not selected"}</h1>
            </span>
            <span
              onClick={() => handleTabClick("profile_picture")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Profile Picture</p>
              <h1>Change Profile Picture </h1>
            </span>
            <span
              onClick={() => handleTabClick("birth_date")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Birth Date</p>
              <h1>{selectedUser.birth_date || "Not selected"}</h1>
            </span>
            <span
              onClick={() => handleTabClick("private")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Privacy</p>
              <h1>{selectedUser.private ? "Private" : "Public"}</h1>
            </span>
            <span
              onClick={() => handleTabClick("password")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Password</p>
              <h1>Change password</h1>
            </span>
            <span
              onClick={() => handleTabClick("bio")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Bio</p>
              <h1>{selectedUser.bio || "Not selected"}</h1>
            </span>
            <span
              onClick={() => handleTabClick("gender")}
              className="hover:bg-primary hover:rounded-[20px] cursor-pointer px-6 py-3"
            >
              <p className="font-bold">Gender</p>
              <h1>{selectedUser.gender || "Not selected"}</h1>
            </span>
          </div>
          <div className={`border-r h-screen border-gray3  ${activeTab.length>0? "sm:hidden lg:flex":""}`} />
          <div className={`mx-10  ${activeTab.length<0? "sm:hidden sm:w-[300px] lg:w-[300px] lg:flex":"lg:flex lg:w-[300px] "}`}>
            {activeTab == "username" && (
              <span className="flex flex-col w-full">
                <p className="m-2 font-bold">Username</p>
                <input
                  value={userData?.username || ""}
                  placeholder="Enter username"
                  onChange={(e) => {
                    handleUpdateData("username", e.target.value),
                      e.target.value.length < 8 || /\s/.test(e.target.value)
                        ? setError(
                            "Username should be at least 8 characters and not include spaces"
                          )
                        : setError("");
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <p className="text-red-600 text-xsm px-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  {error.length ? (
                    <button className="flex w-[85px] items-center justify-center py-2 bg-blue-700 text-gray3 hover:bg-blue2 rounded-[20px] ">
                      save
                    </button>
                  ) : (
                    <button
                      className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                      onClick={() => handleSubmitData()}
                    >
                      save
                    </button>
                  )}
                </span>
              </span>
            )}
            {activeTab == "name" && (
              <span className="flex flex-col lg:w-full ">
                <p className="m-2 font-bold">Name</p>
                <input
                  value={userData?.name || ""}
                  placeholder="Enter name"
                  onChange={(e) => {
                    handleUpdateData("name", e.target.value);
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <p className="text-red-600 text-xsm px-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleSubmitData()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
            {activeTab == "email" && (
              <span className="flex flex-col w-full ">
                <p className="m-2 font-bold">Email address</p>
                <input
                  value={userData?.email || ""}
                  placeholder="Enter email address"
                  type="email"
                  onChange={(e) => {
                    handleUpdateData("email", e.target.value),
                      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                        e.target.value
                      )
                        ? setError("")
                        : setError("email invalid");
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <p className="text-red-600 text-xsm mx-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  {error.length ? (
                    <button className="flex w-[85px] items-center justify-center py-2 bg-blue-700 text-gray3 hover:bg-blue2 rounded-[20px] ">
                      save
                    </button>
                  ) : (
                    <button
                      className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                      onClick={() => handleSubmitData()}
                    >
                      save
                    </button>
                  )}
                </span>
              </span>
            )}
            {activeTab == "profile_picture" && (
              <span className="flex flex-col w-full ">
                <p className="m-2 font-bold">Profile picture</p>
                <label htmlFor="fileInput">
                  {userData?.profile_picture || selectedImage ? (
                    <div
                      className="rounded-full overflow-hidden"
                      style={{ width: "150px", height: "150px" }}
                    >
                      <img
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : userData?.profile_picture ?? ""
                        }
                        alt="Selected"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <BsPersonCircle size="150" />
                  )}
                </label>

                <label htmlFor="fileInput">
                  <AiOutlinePicture size="40" className="cursor-pointer my-5" />
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
                <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleSubmitImage()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
            {activeTab == "birth_date" && (
              <span className="flex flex-col w-full ">
                <p className="m-2 font-bold">Birth date</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker", "DatePicker"]}>
                    <DatePicker
                      label="Birth date"
                      value={userData?.birth_date}
                      className="flex bg-secondary px-4 py-3  w-full outline-none border border-gray3 text-secondary"
                      onChange={(e) => {
                        handleUpdateData("birth_date", e || "");
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <p className="text-red-600 text-xsm px-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleSubmitData()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
            {activeTab == "private" && (
              <span className="flex flex-col w-full ">
                <p className="m-2 font-bold ">Privacy</p>
                {userData?.private ? (
                  <Switch {...label} defaultChecked  />
                ) : (
                  <Switch
                    {...label}
                    onClick={() =>
                      handleUpdateData(
                        "private",
                        userData?.private ? "false" : "true"
                      )
                    }
                  />
                )}
                <p className="text-red-600 text-xsm px-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleSubmitData()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
            {activeTab == "password" && (
              <span className="flex flex-col w-full gap-4">
                <p className="m-2 font-bold">Change Password</p>
                <input
                  placeholder="Enter current password"
                  onChange={(e) => {
                    setcurrentPassword(e.target.value);
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <input
                  placeholder="Enter new password"
                  onChange={(e) => {
                    setnewPassword(e.target.value);
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <input
                  placeholder="Enter new password confirmation"
                  onChange={(e) => {
                    setnewConPassword(e.target.value);
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <p className="text-red-600 text-xsm px-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleUpdatePassword()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
            {activeTab == "bio" && (
              <span className="flex flex-col w-full ">
                <p className="m-2 font-bold">Bio</p>
                <input
                  value={userData?.bio || ""}
                  placeholder="Write your bio here"
                  onChange={(e) => {
                    handleUpdateData("bio", e.target.value);
                  }}
                  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3"
                />
                <p className="text-red-600 text-xsm px-2">{error}</p>
                <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleSubmitData()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
            {activeTab == "gender" && (
              <span className="flex flex-col w-full ">
                <p className="m-2 font-bold">Gender</p>
                <select defaultValue='--' onChange={(e) => {
                    handleUpdateData("gender", e.target.value);
                  }}  className="flex bg-primary px-4 py-3 rounded-[20px] w-full outline-none border border-gray3">
                  <option disabled>--</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                  <span className="flex w-full justify-end my-3">
                  <button
                    className="flex w-[85px] items-center justify-center py-2 bg-blue1 hover:bg-blue2 rounded-[20px] "
                    onClick={() => handleSubmitData()}
                  >
                    save
                  </button>
                </span>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="items-center justify-center flex h-[100%] mt-[200px]">
          <LoadingIcons.TailSpin
            stroke="white"
            width="100"
            height="100"
            speed={0.8}
          />
        </div>
      )}
    </div>
  );
};

export default page;
