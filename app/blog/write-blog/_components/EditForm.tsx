'use client'
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import { supabase } from "@/lib/supabaseClient";
import { generateSlug } from "@/utils/generateSlug";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Shadcn Select components
import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { Input } from "@/components/ui/input"; // Import Shadcn Input
import { Label } from "@/components/ui/label"; // Import Shadcn Label

interface PostForm {
  title: string;
  content: string;
  tags: string[];
  coverImage: FileList | null; // Add cover image field
}

export default function EditForm({ tags: availableTags }: { tags: string[] }) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // State to store selected tags
  const [customTag, setCustomTag] = useState(""); // State to store custom tag input
  const { control, reset, handleSubmit, setValue } = useForm<PostForm>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      coverImage: null, // Initialize cover image field
    },
  });

  // Simulate loading data (e.g., from an API)
  useEffect(() => {
    const fetchData = async () => {
      // Simulate an API call
      const initialData = {
        title: "Initial Title",
        content: "<p>Initial content goes here...</p>",
        tags: ["tech", "programming"], // Example tags
      };

      // Reset the form with the initial data
      reset(initialData);
      setIsLoading(false);
    };

    fetchData();
  }, [reset]);

  // Add a tag to the selected tags list
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setValue("tags", newTags); // Update the form value
    }
  };

  // Remove a tag from the selected tags list
  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    setValue("tags", newTags); // Update the form value
  };

  // Add a custom tag
  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      handleAddTag(customTag.trim());
      setCustomTag(""); // Clear the input field
    }
  };

  // Submit the form to Supabase
  const onSubmit = async (data: PostForm) => {
    const { title, content, coverImage } = data;
    const slug = generateSlug(title); // Generate the slug
  
    try {
      let coverImageUrl = "";
  
      // Step 1: Upload the cover image to Supabase Storage
      if (coverImage && coverImage.length > 0) {
        const file = coverImage[0]; // Ensure coverImage is passed as an array
        const fileExt = file.name.split(".").pop(); // Get file extension
        const fileName = `${slug}.${fileExt}`; // Use the slug as the file name
        const folderPath = "blog-covers"; // Folder name inside the bucket
        const filePath = `${folderPath}/${fileName}`; // Complete path inside the folder
  
        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("media-library") 
          .upload(filePath, file);
  
        if (uploadError) {
          throw uploadError;
        }
  
        // Get the public URL of the uploaded image
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
      .schema('shareproject')
        .from("blogs") // Table name directly without schema
        .insert([
          {
            user_id: "f30214e0-91b0-49b3-ac75-f7bc74a3d068", // Replace with the actual user ID
            title,
            content,
            slug, // Include the auto-generated slug
            image_url: coverImageUrl, // Include the cover image URL
          },
        ])
        .select("id") // Return the inserted blog's ID
        .single();
  
      if (blogError) {
        throw blogError;
      }
  
      const blogId = blogData.id; // Get the inserted blog's ID
  
      // Step 3: Insert tags into the `tags` table (if they don't exist) and get their IDs
      const tagIds = [];
      for (const tag of selectedTags) {
        // Check if the tag already exists in the `tags` table
        const { data: existingTag, error: tagError } = await supabase
        .schema('shareproject')
          .from("tags") // Table name directly
          .select("id")
          .eq("name", tag)
          .single();
  
        if (tagError && tagError.code !== "PGRST116") {
          // Ignore "No rows found" error (PGRST116)
          throw tagError;
        }
  
        let tagId;
        if (existingTag) {
          // If the tag exists, use its ID
          tagId = existingTag.id;
        } else {
          // If the tag doesn't exist, insert it into the `tags` table
          const { data: newTag, error: insertError } = await supabase
          .schema('shareproject')
            .from("tags") // Table name directly
            .insert([{ name: tag }])
            .select("id")
            .single();
  
          if (insertError) {
            throw insertError;
          }
  
          tagId = newTag.id; // Get the inserted tag's ID
        }
  
        tagIds.push(tagId); // Store the tag ID
      }
  
      // Step 4: Insert the blog-tag relationships into the `blog_tags` table
      const blogTagsData = tagIds.map((tagId) => ({
        blog_id: blogId,
        tag_id: tagId,
      }));
  
      const { error: blogTagsError } = await supabase
        .schema('shareproject')
        .from("blog_tags") // Table name directly
        .insert(blogTagsData);
  
      if (blogTagsError) {
        throw blogTagsError;
      }
  
      console.log("Blog and tags created successfully!");
    } catch (error) {
      console.error("Error creating blog or tags:", error);
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Title Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Title</Label>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Enter post title..."
              className="w-full md:w-1/2"
            />
          )}
        />
      </div>

      {/* Cover Image Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Cover Image</Label>
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files)}
              className="w-full md:w-1/2"
            />
          )}
        />
      </div>

      {/* Tags Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Tags</Label>
        <div className="flex flex-col md:flex-row gap-2">
          <Controller
            control={control}
            name="tags"
            render={() => (
              <Select
                onValueChange={(value) => {
                  handleAddTag(value); // Add the selected tag
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Add custom tag"
            className="w-full md:w-[180px]"
          />
          <Button type="button" onClick={handleAddCustomTag} className="w-full md:w-auto">
            Add Tag
          </Button>
          <Button
            type="button"
            onClick={() => {
              // Optional: Add a button to clear all tags
              setSelectedTags([]);
              setValue("tags", []);
            }}
            variant="outline"
            className="w-full md:w-auto"
          >
            Clear Tags
          </Button>
        </div>
        {/* Display selected tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Content Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Content</Label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <TiptapEditor
              ref={editorRef}
              ssr={true}
              output="html"
              placeholder={{
                paragraph: "Type your content here...",
                imageCaption: "Type caption for image (optional)",
              }}
              contentMinHeight={256}
              contentMaxHeight={640}
              onContentChange={field.onChange}
              initialContent={field.value}
            />
          )}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full md:w-auto"
      >
        Create Blog
      </Button>
    </div>
  );
}