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
    const post_id = formData.get('post_id'); // Get the post ID from the request

    if (!imageFile) {
      throw new Error('No file uploaded');
    }

    // Generate a unique object name, including the post ID
    const timestamp = Date.now();
    const objectName = `images/${post_id}_${imageFile.name}`;

    const res = await supabase.storage
      .from('comments') // Replace with your storage bucket name
      .upload(objectName, imageFile).then(async ()=>{
      
      const res2 = await supabase
      .from('objects')
      .update([
        {
          post_id: 2, // Add the post_id to the image object
        },
      ]).eq('bucket_id', `comments` );

      console.log(res2)}
      );


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
