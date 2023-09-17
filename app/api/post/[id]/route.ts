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
      .from("tb_posts")
      .select("*")
      .eq("id", params.id)
      .select("*");

    if (data.data && data.data[0].user_id) {
      const data2 = await supabase
        .from("tb_users")
        .select("*")
        .eq("id", data.data[0].user_id)
        .select("*");

        const { data: fileList, error } = await supabase.storage
        .from("posts")
        .list("images");
      
      if (error) {
        console.error("Error listing files:", error);
        return;
      }
      
      const filteredFiles = fileList.filter(
        (file) => file !== null && file.name.includes(params.id)
      );
      
      const downloadPromises = filteredFiles.map(async (file) => {
        const fileList2 = await supabase.storage
          .from("posts")
          .getPublicUrl(`images/${file.name}`);
        console.log(fileList2.data);
        return fileList2.data;
      });
      
      const images = await Promise.all(downloadPromises);
            

      const data3 = await supabase
        .from("tb_likes")
        .select("*")
        .eq("post_id", params.id);

      const data4 = await supabase
        .from("tb_comments")
        .select("*")
        .eq("post_id", params.id);

      const data5 = {
        post: data.data,
        user: data2.data,
        picture: images,
        likes: data3.data,
        comments: data4.data,
      };

      return new Response(JSON.stringify({ message: data5 }), {
        status: 200,
        headers: { revalidate: dynamic },
      });
    }
  } catch (error) {
    console.error("Error fetching files: ", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), {
      status: 500,
    });
  }
}
