import { supabase } from "@/lib/client"; // Ensure this points to your Supabase client configuration
import React, { useState } from "react";

// Define props interface for the UploadWidget component
export interface UploadWidgetProps {
  onError?: (error: string) => void; // Callback for errors
  onSuccess?: (urls: string[]) => void; // Callback for successful uploads
  accept?: string; // Accepted file types (e.g., "image/*")
  multiple?: boolean; // Allow multiple file uploads
}

const UploadWidget: React.FC<UploadWidgetProps> = ({
  onError,
  onSuccess,
  accept = "*",
  multiple = true,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Function to handle file uploads to Supabase storage
  const handleFileUpload = async (files: FileList | null): Promise<void> => {
    if (!files || files.length === 0) {
      onError?.("No files selected.");
      return;
    }

    setIsUploading(true); // Set uploading state
    const uploadedUrls: string[] = []; // Store uploaded file URLs

    try {
      const folderPath = "blog-images"; // Define the folder path in your bucket

      // Iterate through each file and upload it to Supabase
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`; // Generate a unique file name
        const filePath = `${folderPath}/${fileName}`;

        // Upload file to Supabase storage bucket
        const { data, error } = await supabase.storage
          .from("media-library") // Replace with your bucket name
          .upload(filePath, file);

        if (error) {
          throw new Error(`Upload failed for ${file.name}: ${error.message}`);
        }

        if (!data?.path) {
          throw new Error(`No path returned for ${file.name}`);
        }

        // Generate the public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from("media-library")
          .getPublicUrl(data.path);
        if (!publicUrlData?.publicUrl) {
          throw new Error(`Public URL generation failed for ${file.name}`);
        }

        uploadedUrls.push(publicUrlData.publicUrl); // Add URL to the list
      }

      // Invoke the success callback if defined
      onSuccess?.(uploadedUrls);
    } catch (error: unknown) {
      if (error instanceof Error) {
        onError?.(error.message);
      } else {
        onError?.("An unknown error occurred.");
      }
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // Function to open the file picker dialog
  const openFilePicker = (): void => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple; // Allow multiple file uploads
    input.accept = accept; // Restrict to specific file types
    input.onchange = (e) =>
      handleFileUpload((e.target as HTMLInputElement).files); // Handle file selection
    input.click(); // Trigger file picker dialog
  };

  return (
    <div>
      <button
        onClick={openFilePicker}
        disabled={isUploading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
};

export default UploadWidget;
