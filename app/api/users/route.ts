import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function GET(
  request: Request) {
  
    try {
      const userData = await supabase.from("tb_users").select("*");
      if(userData.data){
      const resData = await Promise.all(userData.data.map(async (user) => {
        const followerData = await supabase.from("tb_followers").select("*").eq("followed_id", user.id);
        return { user: user, followers: followerData.data };
      }));
  
      return new Response(JSON.stringify({ message: resData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });}
    } catch (error) {
      console.error("Error fetching data: ", error);
      return new Response(JSON.stringify({ message: "An error occurred" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}

