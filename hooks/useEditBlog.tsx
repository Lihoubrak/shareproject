import { useState } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { PostFormBlog } from "@/types/types";
import { supabase } from "@/lib/client";

export default function useEditBlog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editBlog = async (data: PostFormBlog, selectedTags: string[]) => {
    setIsLoading(true);
    setError(null);

    const { title, content, coverImage } = data;
    const slug = generateSlug(title);

    try {
      let coverImageUrl = "";

      // Step 1: Upload the cover image to Supabase Storage
      if (coverImage && coverImage.length > 0) {
        const file = coverImage[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${slug}.${fileExt}`;
        const folderPath = "blog-covers";
        const filePath = `${folderPath}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media-library")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("media-library")
          .getPublicUrl(filePath);

  
        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error("Error retrieving public URL for the uploaded file.");
        }

        coverImageUrl = publicUrlData.publicUrl;
      }

      // Step 2: Insert the blog post into the `blogs` table
      const { data: blogData, error: blogError } = await supabase
        .schema("shareproject")
        .from("blogs")
        .insert([
          {
            user_id: "c79f05cc-7a60-4fb0-ab8e-e8c82c28c10a", // Replace with the actual user ID
            title,
            content,
            slug,
            image_url: coverImageUrl,
          },
        ])
        .select("id")
        .single();

      if (blogError) {
        throw blogError;
      }

      const blogId = blogData.id;

      // Step 3: Insert tags into the `tags` table (if they don't exist) and get their IDs
      const tagIds = [];
      for (const tag of selectedTags) {
        const { data: existingTag, error: tagError } = await supabase
          .schema("shareproject")
          .from("tags")
          .select("id")
          .eq("name", tag)
          .single();

        if (tagError && tagError.code !== "PGRST116") {
          throw tagError;
        }

        let tagId;
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          const { data: newTag, error: insertError } = await supabase
            .schema("shareproject")
            .from("tags")
            .insert([{ name: tag }])
            .select("id")
            .single();

          if (insertError) {
            throw insertError;
          }

          tagId = newTag.id;
        }

        tagIds.push(tagId);
      }

      // Step 4: Insert the blog-tag relationships into the `blog_tags` table
      const blogTagsData = tagIds.map((tagId) => ({
        blog_id: blogId,
        tag_id: tagId,
      }));

      const { error: blogTagsError } = await supabase
        .schema("shareproject")
        .from("blog_tags")
        .insert(blogTagsData);

      if (blogTagsError) {
        throw blogTagsError;
      }

      console.log("Blog and tags created successfully!");
    } catch (error) {
      console.error("Error creating blog or tags:", error);
      setError("Failed to create blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { editBlog, isLoading, error };
}