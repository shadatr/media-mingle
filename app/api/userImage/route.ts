import { Database } from "@/app/types/supabase";
import { SinglePostType } from "@/app/types/types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const user_id = formData.get("user_id");
    const imageFile = formData.get("imageFile");
    const name = formData.get("name");

    if (user_id&&imageFile) {
        const objectName = `images/${user_id}-${name}`; 
        const uploadRes = await supabase.storage
          .from("profilePicture")
          .upload(objectName, imageFile);
          console.log(uploadRes.data?.path);
          const getPublicUrl = await supabase.storage
          .from("profilePicture")
          .getPublicUrl(`images/${user_id}-${name}`);
          const res=await supabase.from("tb_users").update({'profile_picture': getPublicUrl.data.publicUrl}).eq('id', user_id)

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
