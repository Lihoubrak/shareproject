"use client";
import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PostFormProject } from "@/types/types";
import useUploadProject from "@/hooks/useUploadProject";
import { TiptapEditorRef } from "@/components/TiptapEditor";

// Dynamically import TiptapEditor to disable SSR
const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
});

export default function UploadProject({
  tags,
  categories,
}: {
  tags: string[];
  categories: string[];
}) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [fileOption, setFileOption] = useState<"url" | "upload">("url");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormProject>({
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

  const { uploadProject, isLoading, error } = useUploadProject();

  const priceType = watch("price_type");

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

  const onSubmit = async (data: PostFormProject) => {
    await uploadProject(data, selectedTags, fileOption);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Project Name Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          ឈ្មោះគម្រោង
        </Label>
        <Controller
          control={control}
          name="name"
          rules={{ required: "តម្រូវអោយបំពេញឈ្មោះគម្រោង" }}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="បញ្ចូលឈ្មោះគម្រោង..."
              className="w-full md:w-1/2"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Project Image Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          រូបភាពគម្រោង
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

      {/* Price Type Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          ប្រភេទតម្លៃ
        </Label>
        <Controller
          control={control}
          name="price_type"
          render={({ field }) => (
            <RadioGroup
              defaultValue="free"
              onValueChange={field.onChange}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">ឥតគិតថ្លៃ</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">បង់ប្រាក់</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      {/* Price Field (Conditional) */}
      {priceType === "paid" && (
        <div>
          <Label className="inline-block font-medium dark:text-white mb-2">
            តម្លៃ
          </Label>
          <Controller
            control={control}
            name="price"
            rules={{ required: "តម្រូវអោយបំពេញតម្លៃសម្រាប់គម្រោងបង់ប្រាក់" }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="បញ្ចូលតម្លៃ..."
                className="w-full md:w-1/2"
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      )}

      {/* File URL or Upload Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          ជម្រើសឯកសារ
        </Label>
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
            <Label htmlFor="upload">ផ្ទុកឡើង</Label>
          </div>
        </RadioGroup>

        {fileOption === "url" ? (
          <div className="mt-2">
            <Label className="inline-block font-medium dark:text-white mb-2">
              URL ឯកសារ
            </Label>
            <Controller
              control={control}
              name="file_url"
              rules={{ required: "តម្រូវអោយបំពេញ URL ឯកសារ" }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="បញ្ចូល URL ឯកសារ..."
                  className="w-full md:w-1/2"
                />
              )}
            />
            {errors.file_url && (
              <p className="text-red-500 text-sm mt-1">
                {errors.file_url.message}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-2">
            <Label className="inline-block font-medium dark:text-white mb-2">
              ផ្ទុកឡើងឯកសារ
            </Label>
            <Controller
              control={control}
              name="file_upload"
              rules={{ required: "តម្រូវអោយផ្ទុកឡើងឯកសារ" }}
              render={({ field }) => (
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="w-full md:w-1/2"
                />
              )}
            />
            {errors.file_upload && (
              <p className="text-red-500 text-sm mt-1">
                {errors.file_upload.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tags Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          ស្លាក
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
                  <SelectValue placeholder="ជ្រើសរើសស្លាក" />
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
            placeholder="បន្ថែមស្លាកផ្ទាល់ខ្លួន"
            className="w-full md:w-[180px]"
          />
          <Button
            type="button"
            onClick={handleAddCustomTag}
            className="w-full md:w-auto"
          >
            បន្ថែមស្លាក
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
            សម្អាតស្លាក
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
        <Label className="inline-block font-medium dark:text-white mb-2">
          ប្រភេទ
        </Label>
        <Controller
          control={control}
          name="category"
          rules={{ required: "តម្រូវអោយជ្រើសរើសប្រភេទ" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
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
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <Label className="inline-block font-medium dark:text-white mb-2">
          ការពិពណ៌នា
        </Label>
        <Controller
          control={control}
          name="description"
          rules={{ required: "តម្រូវអោយបំពេញការពិពណ៌នា" }}
          render={({ field }) => (
            <TiptapEditor
              ref={editorRef}
              ssr={true}
              output="html"
              placeholder={{
                paragraph: "វាយបញ្ចូលការពិពណ៌នារបស់អ្នកនៅទីនេះ...",
                imageCaption: "វាយបញ្ចូលចំណងជើងសម្រាប់រូបភាព (ជាជម្រើស)",
              }}
              contentMinHeight={256}
              contentMaxHeight={640}
              onContentChange={field.onChange}
              initialContent={field.value || ""}
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full md:w-auto"
      >
        {isLoading ? "កំពុងដាក់ស្នើ..." : "ដាក់ស្នើគម្រោង"}
      </Button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}