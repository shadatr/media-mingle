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
    let list = [];

    const postData = await supabase
      .from("tb_posts")
      .select("*")
      .eq("user_id", params.id);

    const postPromises = (postData.data || []).map(async (i) => {
      const data = await supabase
        .from("tb_notification")
        .select("*")
        .eq("post_id", i.id);
      list.push(data.data);
    });

    await Promise.all(postPromises);

    const notificationsData = await supabase
      .from("tb_notification")
      .select("*")
      .eq("user_id", params.id);
    list.push(notificationsData.data);

    const userData = await supabase.from("tb_users").select("*");

    const data = list.flat().map((item) => {
      const user = userData.data?.find(
        (i) => i.id == item?.notification_sender
      );
      return { user: user, notification: item };
    });

    return new Response(JSON.stringify({ message: data }), {
      status: 200,
      headers: { revalidate: dynamic },
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), {
      status: 500,
    });
  }
}


export async function PUT(
    request: Request,
    { params }: { params: { id: number }}) {
  
    try {
      const res=await supabase.from("tb_notification").update({'seen': true}).eq('id', params.id)
      console.log(res)
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