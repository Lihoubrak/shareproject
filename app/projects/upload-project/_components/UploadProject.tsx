'use client'
import React from 'react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import Shadcn RadioGroup

interface PostForm {
  name: string;
  description: string;
  file_url: string; // Add file_url field
  price: string;
  price_type: "free" | "paid"; // Add price_type field
  category: string; // Only one category can be selected
  tags: string[];
  coverImage: FileList | null;
  file_upload: FileList | null; // Add file_upload field
}

export default function UploadProject({ tags, categories }: { tags: string[], categories: string[] }) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [fileOption, setFileOption] = useState<"url" | "upload">("url"); // State for file option

  // Initialize form with default values
  const { control, reset, handleSubmit, setValue, watch } = useForm<PostForm>({
    defaultValues: {
      name: "",
      description: "",
      file_url: "",
      price: "",
      price_type: "free",
      category: "",
      tags: [],
      coverImage: null,
      file_upload: null,
    },
  });

  const priceType = watch("price_type"); // Watch price_type field
  const selectedCategory = watch("category"); // Watch category field

  useEffect(() => {
    const fetchData = async () => {
      const initialData = {
        name: "",
        description: "",
        tags: ["React", "Node.js"],
      };

      reset(initialData);
      setIsLoading(false);
    };

    fetchData();
  }, [reset]);

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setValue("tags", newTags);
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      handleAddTag(customTag.trim());
      setCustomTag("");
    }
  };

  const onSubmit = async (data: PostForm) => {
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
        .schema('shareproject')
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
        .schema('shareproject')
        .from("projects")
        .insert([
          {
            user_id: "f30214e0-91b0-49b3-ac75-f7bc74a3d068", // Replace with actual user ID
            name: name,
            description,
            slug,
            image_url: coverImageUrl,
            file_url: fileUrl, // Save the file URL
            price: priceType === "paid" ? price : "0", // Save price if paid
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
          .schema('shareproject')
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
            .schema('shareproject')
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
        .schema('shareproject')
        .from("project_tags")
        .insert(projectTagsData);

      if (projectTagsError) {
        throw projectTagsError;
      }

      console.log("Project, tags, and category created successfully!");
    } catch (error) {
      console.error("Error creating project, tags, or category:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Project Name Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Project Name</Label>
        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({ field }) => (
            <Input {...field} type="text" placeholder="Enter project name..." className="w-full md:w-1/2" />
          )}
        />
      </div>

      {/* Project Image Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Project Image</Label>
        <Controller
          control={control}
          name="coverImage"
          defaultValue={null}
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

      {/* Price Type Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Price Type</Label>
        <Controller
          control={control}
          name="price_type"
          defaultValue="free"
          render={({ field }) => (
            <RadioGroup
              defaultValue="free"
              onValueChange={field.onChange}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      {/* Price Field (Conditional) */}
      {priceType === "paid" && (
        <div>
          <Label className="inline-block font-medium dark:text-white mb-2">Price</Label>
          <Controller
            control={control}
            name="price"
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Enter price..."
                className="w-full md:w-1/2"
              />
            )}
          />
        </div>
      )}

      {/* File URL or Upload Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">File Option</Label>
        <RadioGroup
          defaultValue="url"
          onValueChange={(value: "url" | "upload") => setFileOption(value)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url">URL</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload">Upload</Label>
          </div>
        </RadioGroup>

        {fileOption === "url" ? (
          <div className="mt-2">
            <Label className="inline-block font-medium dark:text-white mb-2">File URL</Label>
            <Controller
              control={control}
              name="file_url"
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter file URL..."
                  className="w-full md:w-1/2"
                />
              )}
            />
          </div>
        ) : (
          <div className="mt-2">
            <Label className="inline-block font-medium dark:text-white mb-2">Upload File</Label>
            <Controller
              control={control}
              name="file_upload"
              defaultValue={null}
              render={({ field }) => (
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="w-full md:w-1/2"
                />
              )}
            />
          </div>
        )}
      </div>

      {/* Tags Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Tags</Label>
        <div className="flex flex-col md:flex-row gap-2">
          <Controller
            control={control}
            name="tags"
            defaultValue={[]}
            render={() => (
              <Select
                onValueChange={(value) => {
                  handleAddTag(value);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
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
              setSelectedTags([]);
              setValue("tags", []);
            }}
            variant="outline"
            className="w-full md:w-auto"
          >
            Clear Tags
          </Button>
        </div>
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

      {/* Category Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Category</Label>
        <Controller
          control={control}
          name="category"
          defaultValue=""
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Description Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">Description</Label>
        <Controller
          control={control}
          name="description"
          defaultValue=""
          render={({ field }) => (
            <TiptapEditor
              ref={editorRef}
              ssr={true}
              output="html"
              placeholder={{
                paragraph: "Type your description here...",
                imageCaption: "Type caption for image (optional)",
              }}
              contentMinHeight={256}
              contentMaxHeight={640}
              onContentChange={field.onChange}
              initialContent={field.value || ""}
            />
          )}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" onClick={handleSubmit(onSubmit)} className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full md:w-auto">
        Submit Project
      </Button>
    </div>
  );
}