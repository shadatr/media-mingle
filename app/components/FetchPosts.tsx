import { useState, useEffect } from "react";
import axios from "axios";
import { PostType } from "@/app/types/types";

export default function FetchPosts({ id }: { id: number }) {
  const [post, setPost] = useState<PostType>();


  useEffect(() => {
    async function downloadData() {
      try {

        const response = await axios.get(
          `/api/post/${id}`
        );
        const data: PostType = response.data.message;
        setPost(data)
        console.log(data)

      } catch (error) {
        console.log("Error downloading data: ", error);
      }
    }
    downloadData();
  }, [id]);

  return post
}