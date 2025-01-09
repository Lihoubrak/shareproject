import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/data";
import React from "react";

export default function BlogPage() {
 

  return (
    <div className="container mx-auto px-28">
    <div className="flex  gap-5 justify-center items-center flex-wrap py-[120px]">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
  </div>
  );
}
