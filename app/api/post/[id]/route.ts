import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await supabase
    .from("tb_posts")
    .select("*").eq('id', params.id);

    const data2 = await supabase
    .from("tb_post_pictures")
    .select("*").eq('post_id', params.id);

    const data3 = await supabase
    .from("tb_likes")
    .select("*").eq('post_id', params.id);
  
    const data4 = await supabase
    .from("tb_comments")
    .select("*").eq('post_id', params.id);

    const data5={
        post: data.data,
        picture: data2.data,
        likes: data3.data,
        comments: data4.data
    }

    return new Response(JSON.stringify({ message: data5}), {
      status: 200,
      headers: { revalidate: dynamic },
    });
  } catch (error) {
    console.error("Error fetching files: ", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), {
      status: 500,
    });
  }
}