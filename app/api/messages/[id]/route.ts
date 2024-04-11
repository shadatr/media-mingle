import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {

    const messages = await supabase
      .from("tb_messages")
      .select("*")

      const listMessages= messages.data?.filter((i)=>i.sender_id == params.id || i.reciever_id==params.id )
    if (messages.data&&listMessages) {
      const allUserIds = [
        ...new Set([
          ...listMessages.map((msg) => msg.sender_id),
          ...listMessages.map((msg) => msg.reciever_id),
        ]),
      ];
      const userData = await supabase
        .from("tb_users")
        .select("*")
        .in("id", allUserIds);

      const data = userData.data?.map((user) => {
        return {
          user: user,
          recieve_userMasseges: messages.data?.filter(
            (i) => i.reciever_id == params.id && i.sender_id==user.id
          ),
          sended_userMasseges: messages.data?.filter(
            (i) => i.sender_id == params.id && i.reciever_id==user.id
          ),
        };
      });
      return new Response(JSON.stringify({ message: data }), {
        status: 200,
        headers: { revalidate: dynamic },
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const res=await supabase.from("tb_messages").insert([data]);

    return new Response(
      JSON.stringify({ message: "Account created successfully" }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "There is a problem" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();

  try {
    const res=await supabase.from("tb_messages").update({'seen': true}).eq('reciever_id', data.reciever_id).eq('sender_id',data.sender_id)
    return new Response(
      JSON.stringify({ message: "Account created successfully" }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "There is a problem" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }
}