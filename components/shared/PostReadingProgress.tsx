"use client";

import useProgress from "@/hooks/useProgress";
import React from "react";

const PostReadingProgress = () => {
  const { progress, enable } = useProgress(".article-content");

  return enable ? (
    <div
      className="fixed inset-x-0 h-1 bg-blue-600 dark:bg-blue-500 z-50"
      style={{ top: "80px", width: `${progress}%` }} // Adjust top to match header height
    />
  ) : null;
};

export default PostReadingProgress;
