'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { PostType } from "@/app/types/types";

export function FetchPosts({ id }: { id: string }) {
  const [post, setPost] = useState<PostType>();


  useEffect(() => {
    async function downloadData() {
      try {

        const response = await axios.get(
          `/api/post/${id}`
        );
        const data: PostType = response.data.message;
        setPost(data)

      } catch (error) {
        console.log("Error downloading data: ", error);
      }
    }
    downloadData();
  }, [id]);

  return post
}