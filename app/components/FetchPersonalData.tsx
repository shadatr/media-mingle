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

  useEffect(() => {
    const subscription = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "tb_posts",
          event: "DELETE",
        },
        (payload) => {
          setUser((prevPost: any) => {
            const deletedPostId = payload.old.id; // Assuming id is the identifier for posts
            const updatedPosts = prevPost?.posts.filter(
              (post: any) => post?.id !== deletedPostId
            );
            console.log(payload);
            console.log(updatedPosts); // Move this inside the DELETE condition
            console.log(deletedPostId);
            return {
              ...prevPost,
              posts: updatedPosts,
            };
          });
        }
      )
      .subscribe();
      console.log(user)

    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_followers",
        },
        (payload) =>{
        console.log(payload)
          setUser((prevPost: any) => {
            
            if (!prevPost) return prevPost;
            const updatedFollowers = [...prevPost.followers];
            if (payload.eventType === "INSERT") {
              console.log(payload)

              updatedFollowers.push(payload.new);
            } else if (payload.eventType === "DELETE") {
              console.log(payload)

              const index = updatedFollowers.findIndex(
                (like) => like.id === payload.old.id
              );
              if (index !== -1) {
                updatedFollowers.splice(index, 1);
              }
            }

            return {
              ...prevPost,
              followers: updatedFollowers,
            };
          })}
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      changes.unsubscribe();
    };
  }, [id, refresh]);

  return { user, setUser, setRefresh, refresh };
}
