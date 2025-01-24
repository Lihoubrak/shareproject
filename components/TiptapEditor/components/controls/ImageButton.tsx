import { supabase } from "@/lib/client";
import React, { ReactNode, useState } from "react";

export interface UploadWidgetProps {
  onError?: (error: string) => void; // Callback for errors
  onSuccess?: (urls: string[]) => void; // Callback for successful uploads
  children?: ({ open }: { open: () => void }) => ReactNode; // Accepts a function as children
}

const UploadWidget: React.FC<UploadWidgetProps> = ({
  onError,
  onSuccess,
  children,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null): Promise<void> => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("media")
          .upload(fileName, file);

        if (error) {
          throw new Error(`Upload failed for ${file.name}: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("media")
          .getPublicUrl(data?.path || "");

        if (!publicUrlData?.publicUrl) {
          throw new Error(`Unable to generate public URL for ${fileName}`);
        }

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      if (onSuccess) onSuccess(uploadedUrls);
    } catch (error: any) {
      if (onError) onError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const openFilePicker = (): void => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) =>
      handleFileUpload((e.target as HTMLInputElement).files);
    input.click();
  };

  return (
    <div>
      {children ? (
        children({ open: openFilePicker })
      ) : (
        <button
          onClick={openFilePicker}
          disabled={isUploading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </button>
      )}
    </div>
  );
};

export default UploadWidget;
