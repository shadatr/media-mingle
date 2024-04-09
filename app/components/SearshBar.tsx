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
    }
  };

  return (
    <div className="flex justify-center items-start w-[100%] m-5 sm:text-xsm lg:text-sm">
      <div className="flex flex-col">
        <input
          placeholder="search for a user..."
          ref={searchedUser}
          onChange={(e) => {
            search(), setShowResults(true);
          }}
          className="bg-blue2 border border-gray3 rounded-[20px] lg:px-4 lg:py-3 sm:px-3 sm:py-1 lg:w-[700px] sm:w-[270px] outline-none"
        />
        {foundUsers.length > 0 && showResults && (
          <div className="border  border-gray3 rounded-[20px] fixed bg-blue3 lg:w-[700px] sm:w-[270px] sm:mt-8 lg:mt-12" ref={searchedUser}>
            {foundUsers.map((user) => (
              <Link href={`/user/personal-profile/${user.id}`} className="flex items-center m-2 lg:mx-5 hover:bg-primary hover:rounded-[20px] lg:p-3 sm:p-1">
                <p className="mx-2">
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
