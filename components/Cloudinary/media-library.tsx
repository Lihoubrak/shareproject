import { useEffect, useRef, useState } from "react";
import type {
  MediaLibraryOptions,
  MediaLibraryProps,
  MediaLibraryPropsOptions,
  MediaLibraryInsertResults,
} from "./media-library.type";
import Script from "./script";

// Define Cloudinary global and Widget types
declare global {
  interface Window {
    cloudinary: any; // Define the Cloudinary object
  }
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

const MediaLibrary = ({ children, onClose, onInsert, onOpen, options = {} }: MediaLibraryProps) => {
  const cloudinary = useRef<any>(undefined); // Initialize with undefined
  const widget = useRef<any>(undefined); // Initialize with undefined
  const widgetContainerRef = useRef<HTMLDivElement | null>(null); // Initialize with null if you're dealing with a DOM element
  
  const [isScriptLoading, setIsScriptLoading] = useState(true);

  useEffect(() => {
    // Clean up Cloudinary widget on unmount
    function destroy() {
      const iframe = document.querySelector("iframe[src*='cloudinary']");
      if (iframe && iframe.parentNode) {
        document.body.removeChild(iframe.parentNode);
        console.log("Media Library widget destroyed successfully.");
      }
    }

    return () => {
      widget.current = undefined;
      cloudinary.current = undefined;
      destroy();
    };
  }, []);

  function handleOnLoad() {
    setIsScriptLoading(false);

    // Store the Cloudinary window instance to a ref
    if (!cloudinary.current && typeof window !== "undefined") {
      cloudinary.current = (window as any).cloudinary;
    }

    // Create widget after idle time
    function onIdle() {
      if (!widget.current) {
        widget.current = createWidget();
      }
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(onIdle);
    } else {
      setTimeout(onIdle, 1);
    }
  }

  const {
    asset,
    buttonCaption,
    buttonClass,
    collection,
    defaultTransformations,
    folder,
    inlineContainer,
    insertCaption,
    maxFiles,
    multiple,
    removeHeader = false,
    search,
    transformation,
    username,
    zIndex,
  } = options as MediaLibraryPropsOptions;

  const callbackOptions = {
    cloudinary: cloudinary.current,
    widget: widget.current,
    close,
    open,
  };

  /**
   * Create Media Library widget
   */
  function createWidget() {
    const mediaLibraryOptions: MediaLibraryOptions = {
      cloud_name: CLOUDINARY_CLOUD_NAME!,
      api_key: CLOUDINARY_API_KEY!,
      asset,
      button_caption: buttonCaption,
      button_class: buttonClass,
      collection,
      default_transformations: defaultTransformations,
      folder,
      inline_container: inlineContainer,
      insert_caption: insertCaption,
      max_files: maxFiles,
      multiple,
      remove_header: removeHeader,
      search,
      transformation,
      username,
      z_index: zIndex,
    };

    return cloudinary.current.createMediaLibrary(mediaLibraryOptions, {
      showHandler: () => {
        if (typeof onOpen === "function") {
          onOpen(callbackOptions);
        }
      },
      hideHandler: () => {
        if (typeof onClose === "function") {
          onClose(callbackOptions);
        }
      },
      insertHandler: (data: MediaLibraryInsertResults) => {
        if (typeof onInsert === "function") {
          onInsert(data, callbackOptions);
        }
      },
    });
  }

  /**
   * Open the widget
   */
  function open() {
    widget.current?.show();
  }

  /**
   * Close the widget
   */
  function close() {
    widget.current?.hide();
  }

  return (
    <>
      {typeof children === "function" && children(callbackOptions)}
      <div ref={widgetContainerRef}></div>
      <Script
        src="https://media-library.cloudinary.com/global/all.js"
        onLoad={handleOnLoad}
        onError={() => console.error(`Failed to load Cloudinary Upload Widget`)}
      />
    </>
  );
};

export default MediaLibrary;
