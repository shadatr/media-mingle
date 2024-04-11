import { Database } from "@/app/types/supabase";
import { SinglePostType } from "@/app/types/types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const user_id = formData.get("user_id");
    const text = formData.get("text");

    if (user_id) {
      const postData = await supabase.from("tb_posts").insert([
        {
          text: text?.toString(),
          user_id: parseInt(user_id.toString()),
        },
      ]).select()

      if (postData.error) {
        throw postData;
      }
      if (postData ) {
        const entriesArray = Array.from(formData.entries());

        for (const [key, imageFile] of entriesArray) {
          if (key.startsWith("file")) {
            const objectName = `images/${postData.data[0].id}-${key}`; 
            const uploadRes = await supabase.storage
              .from("posts")
              .upload(objectName, imageFile);
            console.log(uploadRes);
          }
        }
        console.log("true");
      }

      return new Response(
        JSON.stringify({ message: "Successfully uploaded" }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "There is a problem", error: error }),
      {
        headers: { "content-type": "application/json" },
        status: 400,
      }
    );
  }
}
