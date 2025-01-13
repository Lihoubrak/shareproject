import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/data";
import React from "react";

export default function BlogPage() {
  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      {blogPosts.map((post) => (
        // Ensure each BlogCard has a unique key
        <BlogCard
          key={post.slug}  // Assuming `slug` is unique for each post
          slug={post.slug}
          title={post.title}
          image={post.image}
          description={post.description}
        />
      ))}
    </div>
  );
}
