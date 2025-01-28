import React, { useEffect, useRef, useState } from "react";
import MediaGallery from "./MediaGallery";
import Button from "@/components/TiptapEditor/components/ui/Button";
import { supabase } from "@/lib/client";
import "./style.scss";
import UploadWidget from "../Cloudinary/upload-widget";

interface MediaLibraryProps {
  onInsert?: (image: ImageData) => void;
  onClose?: () => void;
}

interface ImageData {
  id?: string;
  url: string;
  format: string;
  display_name: string;
  width: number;
  height: number;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onInsert, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<ImageData | null>(null);

  // Fetch images from Supabase on mount
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from("media-library")
          .list();

        if (error) {
          throw error;
        }

        const imageUrls = data.map((file) => ({
          id: file.id,
          url: supabase.storage.from("media-library").getPublicUrl(file.name)
            .data.publicUrl,
          format: file.name.split(".").pop() || "unknown",
          display_name: file.name,
          width: 0,
          height: 0,
        }));

        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle successful uploads
  const handleUploadSuccess = (urls: string[]) => {
    const newImages = urls.map((url) => ({
      url,
      format: url.split(".").pop() || "unknown",
      display_name: url.split("/").pop() || "Untitled",
      width: 0,
      height: 0,
    }));
    setImages((prev) => [...newImages, ...prev]);
    setUploading(false);
  };

  // Handle upload errors
  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    setUploading(false);
  };

  // Handle image selection
  const handleSelect = (image: ImageData) => {
    setSelected(image);
  };

  // Handle insert action
  const handleFinish = () => {
    if (selected) {
      onInsert?.(selected);
    }
  };

  return (
    <div className="media-library">
      <header className="media-library__header">
        <h2>Assets</h2>
        <UploadWidget
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          accept="image/*"
          multiple={true}
        />
      </header>

      <div className="media-library__content">
        {loading ? (
          <div className="media-library__spinner" aria-label="Loading images" />
        ) : (
          <MediaGallery
            data={images}
            onSelect={handleSelect}
            selected={selected}
          />
        )}
      </div>

      <footer className="media-library__footer">
        <Button
          variant="outline"
          className="media-library__btn media-library__btn--cancel"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="media-library__btn media-library__btn--finish"
          disabled={!selected || uploading}
          onClick={handleFinish}
        >
          Insert
        </Button>
      </footer>
    </div>
  );
};

export default MediaLibrary;