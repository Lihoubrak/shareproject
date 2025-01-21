import React, { useEffect, useRef, useState } from "react";
import MediaGallery from "./MediaGallery";
import Button from "@/components/TiptapEditor/components/ui/Button";

import "./style.scss";

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
  // const [previews, setPreviews] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<ImageData | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    const confirmUpload = window.confirm(
      "Please avoid uploading too many images unnecessarily to save storage space. Also, ensure your images comply with copyright rules. Do you wish to continue?"
    );

    if (confirmUpload) {
      fileInput.current?.click();
    }
  };

  const loadImage = (file: File): Promise<ImageData> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        resolve({
          url,
          width: image.width,
          height: image.height,
          format: file.type.split("/")[1],
          display_name: file.name.split(/\.\w+$/)[0],
        });
      };
      image.src = url;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const previewPromises = Array.from(files).map(loadImage);
    const loadedPreviews = await Promise.all(previewPromises);
    // setPreviews(loadedPreviews);

    // Add images directly to state without uploading
    setImages((prev) => [...loadedPreviews, ...prev]);

    setUploading(false);
  };

  const handleFinish = () => {
    if (selected !== null) {
      onInsert?.(selected);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="media-library">
      <header className="media-library__header">
        <h2>Assets</h2>
        <Button disabled={uploading} onClick={handleUploadClick}>
          Upload
        </Button>
      </header>

      <div className="media-library__content">
        {loading ? (
          <div className="media-library__spinner" aria-label="Loading images" />
        ) : (
          <MediaGallery
            data={[...images]}
            onSelect={setSelected}
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

      <input
        style={{ display: "none" }}
        type="file"
        multiple
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MediaLibrary;
