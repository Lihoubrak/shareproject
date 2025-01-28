import { useEffect, useRef, useState } from "react";
import UploadWidget, { UploadWidgetProps } from "@/components/Cloudinary/upload-widget"

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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setUploadedFiles([]);
      console.log("Media Library cleaned up successfully.");
    };
  }, []);

  // Handle successful uploads
  const handleUploadSuccess = (urls: string[]) => {
    setUploadedFiles(urls);
    if (onInsert) {
      onInsert(urls); // Pass uploaded URLs to the parent
    }
    console.log("Files uploaded successfully:", urls);
  };

  // Handle upload errors
  const handleUploadError = (error: string) => {
    console.error("Error uploading files:", error);
  };

  return (
    <div>
      {typeof children === "function" && children({ uploadedFiles })}
      <div ref={widgetContainerRef}></div>

      {/* Use UploadWidget for file uploads */}
      <UploadWidget
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        accept={options.accept}
        multiple={true}
      />

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