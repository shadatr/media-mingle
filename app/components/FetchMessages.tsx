"use client";
import { supabase } from "../api/supabase";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserMessagesType } from "../types/types";


export function FetchMessages({
  id,
  onPostSend,
  user_id
}: {
  id?: number;
  onPostSend?: () => void;
  user_id?: number
}) {
  const session = useSession({ required: true });
  const user = session.data?.user;
  const [messages, setMessages] = useState<UserMessagesType[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const downloadData = async () => {
      if (user?.id != undefined) {
        const res = await axios.get(`/api/messages/${id}`);
        const data: UserMessagesType[] = res.data.message;
        setMessages(data.flat());
      }
    };
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
          table: "tb_messages",
        },
        (payload) => {
          setMessages((prevMessages: any) => {
            if (!prevMessages) return prevMessages;
  
            const { reciever_id, sender_id, id } = payload.new;
            const userMessages = messages.find((msg: any) => msg.user.id === user_id);
  
            if (payload.eventType === "INSERT" ) {
              if (reciever_id == id) {
                userMessages?.recieve_userMasseges.push(payload.new);
              } else if (sender_id == id) {
                userMessages?.sended_userMasseges.push(payload.new);
              }
            } else if (payload.eventType === "DELETE") {
              if (reciever_id == id) {
                const index = userMessages?.recieve_userMasseges.findIndex((msg: any) => msg.id === id);
                if (index !== -1) {
                  userMessages?.recieve_userMasseges.splice(index, 1);
                }
              } else if (sender_id == id) {
                const index = userMessages?.sended_userMasseges.findIndex((msg: any) => msg.id === id);
                if (index !== -1) {
                  userMessages?.sended_userMasseges.splice(index, 1);
                }
              }
            }
  
            return [...prevMessages];
          });
        }
      )
      .subscribe();
  
    return () => {
      changes.unsubscribe();
    };
  }, [id,refresh,onPostSend]);
  


  return messages;
}
