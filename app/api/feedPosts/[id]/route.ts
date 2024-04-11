import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await supabase
      .from("tb_followers")
      .select("*")
      .eq("follower_id", params.id);

    const list = [];
    const followed = data.data || [];

    // Fetch posts for the user
    const userPosts = await supabase
      .from("tb_posts")
      .select("*")
      .eq("user_id", params.id);

    list.push(userPosts.data);

    // Fetch posts for each followed user
    for (const follow of followed) {
      if (follow.followed_id) {
        const followedUserPosts = await supabase
          .from("tb_posts")
          .select("*")
          .eq("user_id", follow.followed_id);
        list.push(followedUserPosts.data);
      }
    }

    list.flat()
    return new Response(JSON.stringify({ message: list }), {
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


