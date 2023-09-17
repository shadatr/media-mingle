import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);
  try {
    const res = await supabase
      .from("tb_likes")
      .select("*")
      .eq("user_id", data.user_id)
      .eq("post_id", data.post_id);

    if (!res.data?.length) {
      const res1 = await supabase.from("tb_likes").insert([data]);
      console.log(res1);
    } else {
      await supabase
        .from("tb_likes")
        .delete()
        .eq("user_id", data.user_id)
        .eq("post_id", data.post_id);
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


export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const likesData = await supabase
      .from("tb_likes")
      .select("*")
      .eq("post_id", params.id);

    const userIDs = likesData.data?.map((like) => like.user_id);

    if(userIDs){

      const likesUsers = await Promise.all(
        userIDs
          .filter((user_id) => user_id) 
          .map(async (user_id) => {
            if(user_id){
              const userRes = await supabase
                .from("tb_users")
                .select("*")
                .eq("id", user_id);
              return userRes.data;
            }
          })
      );

      
  
      console.log(likesUsers);
  
      return new Response(JSON.stringify({ message: likesUsers }), {
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
