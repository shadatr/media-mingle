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

      console.log(images);

      const data3 = await supabase
        .from("tb_likes")
        .select("*")
        .eq("post_id", params.id);

      const data4 = await supabase
        .from("tb_comments")
        .select("*")
        .eq("post_id", params.id);

      const data5 = {
        post: data.data.flat(),
        user: data2.data?.flat(),
        picture: images.flat(),
        likes: data3.data?.flat(),
        comments: data4.data?.flat(),
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    await supabase.from("tb_likes").delete().eq("post_id", params.id);
    await supabase.from("tb_notification").delete().eq("post_id", params.id);
    await supabase.from("tb_comments").delete().eq("post_id", params.id);

    const res = await supabase.from("tb_posts").delete().eq("id", params.id);
    console.log(res.error);
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
