"use client";
import { supabase } from "../api/supabase";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserMessagesType } from "../types/types";

export function FetchMessages({
  id,
  user_id,
}: {
  id?: number;
  user_id?: number;
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
          filter: `sender_id=eq.${id}`,
        },
        (payload: any) => {
          setMessages((prevMessages: any) => {
            console.log(prevMessages);
            if (!prevMessages) return prevMessages;
            const { reciever_id, sender_id, id } = payload.new;
            const updatedMessages = prevMessages.map((message: any) => {
              if (message.user.id == user_id) {
                if (reciever_id == user_id) {
                  message.recieve_userMasseges.push(payload.new);
                } else if (sender_id == id) {
                  message.sended_userMasseges.push(payload.new);
                }
              }
              return message;
            });
            return updatedMessages;
          });
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [id, refresh]);

  return { messages, setRefresh, refresh };
}
