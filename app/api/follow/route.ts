import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    
    const res = await supabase
    .from("tb_followers")
    .select("*")
    .eq("follower_id", data.follower_id)
    .eq("followed_id", data.followed_id);

  if (!res.data?.length) {
    const res=await supabase.from("tb_followers").insert([data]);
  } else {
    await supabase
      .from("tb_followers")
      .delete()
      .eq("follower_id", data.follower_id)
      .eq("followed_id", data.followed_id);
  }
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