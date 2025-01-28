import React from "react";
import { LuCheck } from "react-icons/lu";
import clsx from "clsx";
import Image from "next/image";

interface MediaGalleryProps {
  data: any[];
  selected: any | null;
  onSelect: (image: any) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  data,
  selected,
  onSelect,
}) => {
  return (
    <div className="media-gallery">
      {data.map((image, index) => (
        <div
          key={image.id || index}
          className={clsx("media-item", {
            "media-item--selected": selected?.id === image?.id,
            "media-item--uploading": !Boolean(image?.id),
          })}
          onClick={() => onSelect(image)}
        >
          {/* Checkbox for selected image */}
          {image?.id && (
            <div className="media-item__checkbox">
              {selected?.id === image.id && <LuCheck aria-hidden="true" />}
            </div>
          )}

          {/* Image preview */}
          <div className="media-item__preview">
            {image.url ? (
              <Image
                src={image.url}
                alt={image.display_name || "Uploaded image"}
                width={image.width || 200}
                height={image.height || 200}
                loading="lazy"
                objectFit="cover"
              />
            ) : (
              <div className="media-item__placeholder">Uploading...</div>
            )}
          </div>

          {/* Image info */}
          <div className="media-item__info">
            <div className="media-item__name">
              {image.display_name || "Untitled"}
            </div>
            <div className="media-item__details">
              <span>{image.format?.toUpperCase() || "N/A"}</span>
              <span> • </span>
              <span>
                {image?.width || 0} x {image?.height || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;