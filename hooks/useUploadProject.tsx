import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateSlug } from "@/utils/generateSlug";
import { PostFormProject } from "@/types/types";

export default function useUploadProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadProject = async (data: PostFormProject, selectedTags: string[], fileOption: "url" | "upload") => {
    setIsLoading(true);
    setError(null);

    const { name, description, coverImage, file_url, file_upload, price, price_type, category } = data;
    const slug = generateSlug(name);

    try {
      let coverImageUrl = "";
      let fileUrl = file_url;

      // Upload cover image if provided
      if (coverImage && coverImage.length > 0) {
        const file = coverImage[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${slug}.${fileExt}`;
        const folderPath = "project-images";
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

      // Upload file if provided
      if (fileOption === "upload" && file_upload && file_upload.length > 0) {
        const file = file_upload[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${slug}-file.${fileExt}`;
        const folderPath = "project-files";
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

        fileUrl = publicUrlData.publicUrl;
      }

      // Get the ID of the selected category
      const { data: categoryData, error: categoryError } = await supabase
        .schema("shareproject")
        .from("categories")
        .select("id")
        .eq("name", category)
        .single();

      if (categoryError) {
        throw categoryError;
      }

      const categoryId = categoryData?.id;

      // Insert project data into the "projects" table
      const { data: projectData, error: projectError } = await supabase
        .schema("shareproject")
        .from("projects")
        .insert([
          {
            user_id: "f30214e0-91b0-49b3-ac75-f7bc74a3d068", // Replace with actual user ID
            name: name,
            description,
            slug,
            image_url: coverImageUrl,
            file_url: fileUrl, // Save the file URL
            price: price_type === "paid" ? price : "0", // Save price if paid
            category_id: categoryId, // Save the category ID
          },
        ])
        .select("id")
        .single();

      if (projectError) {
        throw projectError;
      }

      const projectId = projectData.id;

      // Insert tags into the "tags" table and get their IDs
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

      // Insert project-tag relationships
      const projectTagsData = tagIds.map((tagId) => ({
        project_id: projectId,
        tag_id: tagId,
      }));

      const { error: projectTagsError } = await supabase
        .schema("shareproject")
        .from("project_tags")
        .insert(projectTagsData);

      if (projectTagsError) {
        throw projectTagsError;
      }

      console.log("Project, tags, and category created successfully!");
    } catch (error) {
      console.error("Error creating project, tags, or category:", error);
      setError("Failed to upload project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadProject, isLoading, error };
}