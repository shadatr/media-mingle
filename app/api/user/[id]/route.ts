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
    const data = await supabase
      .from("tb_users")
      .select("*")
      .eq("id", params.id);

      const data2 = await supabase
      .from("tb_followers")
      .select("*")
      .eq("followed_id", params.id);

      const data3 = await supabase
      .from("tb_followers")
      .select("*")
      .eq("follower_id", params.id);

      const data4 = await supabase
      .from("tb_posts")
      .select("*")
      .eq("user_id", params.id);

      const data5 ={
        user:data.data&&data.data[0],
        followers: data2.data,
        following:data3.data,
        posts:data4.data
      }
  
      return new Response(JSON.stringify({ message: data5 }), {
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

