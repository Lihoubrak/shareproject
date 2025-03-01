import React, { ReactNode } from "react";

interface PostContentProps {
  children: ReactNode;
}

const PostContent = ({ children }: PostContentProps) => {
  return (
    <div className="relative order-2 min-w-full dark:text-white article-content overflow-visible">
      {children}
    </div>
  );
};

PostContent.displayName = "PostContent";

export default PostContent;
