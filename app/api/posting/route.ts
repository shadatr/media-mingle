import { Database } from "@/app/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('file');
    const post_id = formData.get('post_id'); 

    if (!imageFile) {
      throw new Error('No file uploaded');
    }

    const objectName = `images/${post_id}`;

    const res = await supabase.storage
      .from('comments') 
      .upload(objectName, imageFile)

    return new Response(
      JSON.stringify({ message: "Successfully uploaded" }),
      {
        headers: { "content-type": "application/json" },
      }
    );
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
