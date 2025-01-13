import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor"; // Assuming custom TiptapEditor is imported

type PostForm = {
  title: string;
  content: string;
};

export default function EditForm() {
  const editorRef = useRef<TiptapEditorRef>(null); // Ref for the Tiptap editor instance
  const { control, reset, watch, setValue } = useForm<PostForm>({
    defaultValues: {
      title: "", // Default value for title
      content: "", // Default value for content
    },
  }); // Form hook
  
  const [isLoading, setIsLoading] = useState(false); // Set to false since no data is being fetched

  // Watch for form value changes and log them (without saving)
  useEffect(() => {
    const subscription = watch((values, { type }) => {
      if (type === "change") {
        // Log the form data for now
        console.log("Form data:", values);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  if (isLoading) return <div>Loading...</div>; // Display loading state

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="inline-block font-medium dark:text-white mb-2">Title</label>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full px-4 py-2.5 shadow border border-[#d1d9e0] rounded-md bg-white dark:bg-[#0d1017] dark:text-white dark:border-[#3d444d] outline-none"
              placeholder="Enter post title..."
            />
          )}
        />
      </div>

      <div>
        <label className="inline-block font-medium dark:text-white mb-2">Content</label>
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
              initialContent={field.value || ""} 
            />
          )}
        />
      </div>
    </div>
  );
}
