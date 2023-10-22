"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserDataType } from "@/app/types/types";
import { supabase } from "../api/supabase";

export function FetchPersonalData({ id }: { id: number }) {
  const [user, setUser] = useState<UserDataType>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function downloadData() {
      try {
        const response = await axios.get(`/api/user/${id}`);
        const data: UserDataType = response.data.message;
        setUser(data);
      } catch (error) {
        console.log("Error downloading data: ", error);
      }
    }

    downloadData();
  }, [id, refresh]);



  return { user, setUser, setRefresh, refresh };
}
