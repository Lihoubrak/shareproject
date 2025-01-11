import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/data";
import React from "react";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-5 lg:px-28">
      <div className="flex flex-wrap gap-5 justify-center items-center py-[120px]">
        {blogPosts.map((post) => (
          <div key={post.slug} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <BlogCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}
