import React, { useEffect, useRef, useCallback } from "react";

interface LoadScriptProps {
  src: string;
  onLoad?: () => void;
  onError?: () => void;
}

const Script = ({ src, onLoad, onError }: LoadScriptProps) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const handleLoad = useCallback(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (onError) onError();
  }, [onError]);

  useEffect(() => {
    // Kiểm tra xem script đã tồn tại chưa
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      scriptRef.current = existingScript as HTMLScriptElement;
      return;
    }

    // Tạo script mới
    const script = document.createElement("script");
    script.async = true;
    script.src = src;

    // Thêm event listener
    script.addEventListener("load", handleLoad,{ passive: true });
    script.addEventListener("error", handleError,{ passive: true });

    // Thêm script vào DOM
    document.body.appendChild(script);
    scriptRef.current = script;

    // Cleanup
    return () => {
      if (scriptRef.current) {
        scriptRef.current.removeEventListener("load", handleLoad);
        scriptRef.current.removeEventListener("error", handleError);
        document.body.removeChild(scriptRef.current);
      }
    };
  }, [src, handleLoad, handleError]);

  return null; // Không render gì cả
};

export default Script;