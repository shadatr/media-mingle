"use client";
import React, { useEffect, useRef, useState } from "react";
import { UserType } from "../types/types";
import axios from "axios";
import { BsPersonCircle } from "react-icons/bs";
import Link from "next/link";

const SearshBar = () => {
  const [foundUsers, setFounddUsers] = useState<UserType[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchedUser = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchedUser.current &&
        !searchedUser.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const search = async () => {
    if (searchedUser.current?.value) {
      const res = await axios.get(`/api/search/${searchedUser.current?.value}`);
      setFounddUsers(res.data.message);
      console.log(res.data.message);
    }
  };

  return (
    <div className="flex  justify-center items-start w-[100%] m-5">
      <div className="flex flex-col">
        <input
          placeholder="search for a user..."
          ref={searchedUser}
          onChange={(e) => {
            search(), setShowResults(true);
          }}
          className="bg-blue2 border border-gray3 rounded-[20px] px-4 py-3 w-[700px] outline-none"
        />
        {foundUsers.length > 0 && showResults && (
          <div className="border  border-gray3 rounded-[20px] ">
            {foundUsers.map((user) => (
              <Link href={`/user/user-profile/${user.id}`} className="flex items-center m-2  mx-5 hover:bg-primary hover:rounded-[20px] p-3">
                <p className="w-10">
                  {user?.profile_picture ? (
                    user?.profile_picture
                  ) : (
                    <BsPersonCircle size="20" />
                  )}
                </p>
                <span>
                  <h1 className="font-bold">{user?.name}</h1>
                  <h1>{user?.username}</h1>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearshBar;
