"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from "next/legacy/image";
import { Tag, Eye } from "lucide-react"; // Import Eye and Tag icons from lucide-react
import BlogPage from "@/app/blog/page";

type Comment = {
  name: string;
  comment: string;
  date: string;
};

type FormData = {
  name: string;
  comment: string;
};

export default function BlogDetail() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    comment: "",
  });
  const [viewCount, setViewCount] = useState<number>(0); // For view count
  const [tags] = useState<string[]>(["React", "Web Development", "Next.js"]); // Example tags

  // Handle form input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (formData.name && formData.comment) {
      const newComment: Comment = {
        name: formData.name,
        comment: formData.comment,
        date: new Date().toLocaleDateString(),
      };
      setComments([...comments, newComment]);
      setFormData({ name: "", comment: "" });
    }
  };

  // Increment view count when the page loads
  useEffect(() => {
    setViewCount((prevCount) => prevCount + 1); // Use functional update
  }, []);

  return (
    <div className="container mx-auto px-28 py-10">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>How to Build an Application</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Blog Header */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-gray-800">
          How to Build an Application: A Comprehensive Guide
        </h1>
        <div className="flex items-center mt-4 gap-4">
          {/* Author Avatar and Name */}
          <div className="flex items-center gap-2">
            <Image
              src="https://topdev.vn/blog/wp-content/uploads/2024/10/gamma-ai-218x150.png"
              alt="Author Avatar"
              width={50}
              height={50}
              className="rounded-full border-2 border-gray-300"
            />
            <p className="text-gray-600">
              Published on <span className="font-medium">January 8, 2025</span>{" "}
              by{" "}
              <span className="font-medium text-blue-600">
                {/* Author Name */} John Doe
              </span>
            </p>
          </div>
        </div>
        {/* Tags Section with Icons */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-gray-600 flex items-center">
            <Tag size={16} className="mr-2 text-blue-600" />
            Tags:
          </span>
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-blue-600 transition duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* View Count with Icon */}
        <div className="mt-2 text-gray-600 text-lg font-medium flex items-center">
          <Eye size={18} className="mr-2 text-gray-800" />
          <span className="font-bold text-gray-800">Views: </span>
          {viewCount}
        </div>
      </div>

      {/* Blog Image */}
      <div className="mt-6">
        <Image
          src="https://topdev.vn/blog/wp-content/uploads/2024/10/gamma-ai-218x150.png"
          alt="Blog cover"
          width={800}
          height={400}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Blog Content */}
      <div className="mt-8 text-gray-700 leading-relaxed">
        <p>
          Building an application is a multifaceted process that requires
          careful planning, design, and execution.
        </p>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
        {/* Comment Input */}
        <div className="mt-4 p-4 border rounded-md shadow-sm">
          <Textarea
            name="comment"
            placeholder="Your Comment"
            className="w-full p-2 border rounded-md"
            rows={3}
            value={formData.comment}
            onChange={handleInputChange}
          />
          <Button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleAddComment}
          >
            Add Comment
          </Button>
        </div>

        {/* Render Comments */}
        <div className="mt-6">
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md shadow-sm">
              <p className="text-gray-800 font-medium">{comment.name}</p>
              <p className="text-gray-600 text-sm">{comment.date}</p>
              <p className="mt-2 text-gray-700">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Blogs */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800">Related Blogs</h3>
        <div className="flex gap-5 justify-center items-center flex-wrap">
          <BlogPage />
          <BlogPage />
          <BlogPage />
          <BlogPage />
        </div>
      </div>
    </div>
  );
}
