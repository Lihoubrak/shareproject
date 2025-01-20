import { supabase } from "@/lib/supabaseClient";
import React, { useState } from "react";

// Define props interface for the UploadWidget component
export interface UploadWidgetProps {
  onError?: (error: string) => void; // Callback for errors
  onSuccess?: (urls: string[]) => void; // Callback for successful uploads
}

const UploadWidget: React.FC<UploadWidgetProps> = ({
  onError,
  onSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Function to handle file uploads to Supabase storage
  const handleFileUpload = async (files: FileList | null): Promise<void> => {
    if (!files || files.length === 0) return;

    setIsUploading(true); // Set uploading state
    const uploadedUrls: string[] = []; // Store uploaded file URLs

    try {
      // Iterate through each file and upload it to Supabase
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`; // Unique filename with timestamp

        const { data, error } = await supabase.storage
          .from("media-library") // Replace "media" with your actual Supabase bucket name
          .upload(fileName, file);

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
          throw new Error(`Unable to generate public URL for ${fileName}`);
        }

        uploadedUrls.push(publicUrlData.publicUrl); // Add URL to the list
      }

      // Invoke the success callback if defined
      if (onSuccess) onSuccess(uploadedUrls);
    } catch (error: any) {
      // Invoke the error callback if defined
      if (onError) onError(error.message);
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // Function to open the file picker dialog
  const openFilePicker = (): void => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true; // Allow multiple file uploads
    input.accept = "image/*"; // Restrict to image files; adjust as needed
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
