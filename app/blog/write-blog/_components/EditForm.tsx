"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostFormBlog } from "@/types/types";
import useEditBlog from "@/hooks/useEditBlog"; // Import the custom hook

export default function EditForm({ tags: availableTags }: { tags: string[] }) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormBlog>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      coverImage: null,
    },
  });

  const { editBlog, isLoading, error } = useEditBlog();


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

  const onSubmit = async (data: PostFormBlog) => {
    await editBlog(data, selectedTags);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Title Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          Title
        </Label>
        <Controller
          control={control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Enter post title..."
              className="w-full md:w-1/2"
            />
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Cover Image Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          Cover Image
        </Label>
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
        <Label className="inline-block font-medium dark:text-white mb-2">
          Tags
        </Label>
        <div className="flex flex-col md:flex-row gap-2">
          <Controller
            control={control}
            name="tags"
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
          <Button
            type="button"
            onClick={handleAddCustomTag}
            className="w-full md:w-auto"
          >
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

      {/* Content Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          Content
        </Label>
        <Controller
          control={control}
          name="content"
          rules={{ required: "Content is required" }}
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
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full md:w-auto"
      >
        {isLoading ? "Submitting..." : "Create Blog"}
      </Button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}