"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { PostType } from "@/app/types/types";
import { supabase } from "../api/supabase";

export function FetchPosts({ id }: { id: string }) {
  const [post, setPost] = useState<PostType>();

  useEffect(() => {
    async function downloadData() {
      try {
        const response = await axios.get(`/api/post/${id}`);
        const data: PostType = response.data.message;
        setPost(data);
      } catch (error) {
        console.log("Error downloading data: ", error);
      }
    }

    downloadData();
  }, [id]);

  useEffect(() => {
    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_likes",
        },
        (payload) =>
          setPost((prevPost) => {
            if (!prevPost) return prevPost;
            const updatedLikes = [...prevPost.likes];

            if (payload.eventType === "INSERT") {
              updatedLikes.push(payload.new);
            } else if (payload.eventType === "DELETE") {
              const index = updatedLikes.findIndex(
                (like) => like.id === payload.old.id
              );
              if (index !== -1) {
                updatedLikes.splice(index, 1);
              }
            }

            return {
              ...prevPost,
              likes: updatedLikes,
            };
          })
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_comments",
        },
        (payload) =>
          setPost((prevPost) => {
            if (!prevPost) return prevPost;
            const updatedLikes = [...prevPost.comments];

            if (payload.eventType === "INSERT") {
              updatedLikes.push(payload.new);
            } else if (payload.eventType === "DELETE") {
              const index = updatedLikes.findIndex(
                (like) => like.id === payload.old.id
              );
              if (index !== -1) {
                updatedLikes.splice(index, 1);
              }
            }

            return {
              ...prevPost,
              comments: updatedLikes,
            };
          })
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [id]);

  return post;
}
