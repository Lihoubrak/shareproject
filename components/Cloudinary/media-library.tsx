import { supabase } from "@/lib/supabaseClient";
import { useEffect, useRef, useState } from "react";

// Define types for component props
interface MediaLibraryOptions {
  accept?: string; // Accepted file types (e.g., "image/*")
}

interface MediaLibraryProps {
  children?: (props: { uploadedFiles: string[] }) => React.ReactNode;
  onClose?: () => void;
  onInsert?: (uploadedUrls: string[]) => void;
  onOpen?: () => void;
  options?: MediaLibraryOptions;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  children,
  onInsert,
  onOpen,
  options = {},
}) => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setUploadedFiles([]);
      console.log("Media Library cleaned up successfully.");
    };
  }, []);

  // Handle file upload to Supabase
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("media-library") // Replace "media" with your bucket name
          .upload(fileName, file);

        if (error) {
          console.error("Error uploading file:", error);
          continue;
        }

        // Get public URL (for public buckets)
        const { data: publicUrlData } = supabase.storage
          .from("media-library")
          .getPublicUrl(data.path);

        if (publicUrlData) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      setUploadedFiles(uploadedUrls);

      if (onInsert) {
        onInsert(uploadedUrls); // Pass uploaded URLs to the parent
      }

      console.log("Files uploaded successfully:", uploadedUrls);
    } catch (error) {
      console.error("Error uploading files to Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open file picker
  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true; // Allow multiple files if needed
    input.accept = options.accept || "*"; // File types (e.g., "image/*")
    input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files);
    input.click();
  };

  return (
    <div>
      {typeof children === "function" && children({ uploadedFiles })}
      <div ref={widgetContainerRef}></div>

      {/* Open Button */}
      <button
        onClick={() => {
          openFilePicker();
          if (onOpen) {
            onOpen();
          }
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Uploading..." : "Open Media Library"}
      </button>

      {/* Uploaded Files Preview */}
      <div className="mt-4">
        {uploadedFiles.length > 0 && (
          <div>
            <h3>Uploaded Files:</h3>
            <ul>
              {uploadedFiles.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
