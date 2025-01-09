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
import Image from "next/image";
import { Tag, Eye } from "lucide-react";
import BlogPage from "../page";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/data";
import { Badge } from "@/components/ui/badge";

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
  const [viewCount, setViewCount] = useState<number>(0);
  const [tags] = useState<string[]>(["React", "Web Development", "Next.js"]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  useEffect(() => {
    setViewCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <div className="container mx-auto  px-28  py-[120px]">
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

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        {/* Blog Content Section */}
        <div className="lg:w-11/12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Build an Application: A Comprehensive Guide
          </h1>

          <div className="flex items-center mb-4 gap-4">
            <Image
              src="https://topdev.vn/blog/wp-content/uploads/2024/10/gamma-ai-218x150.png"
              alt="Author Avatar"
              width={50}
              height={50}
              className="rounded-full border border-gray-300"
            />
            <p className="text-gray-600">
              Published on <span className="font-medium">January 8, 2025</span>{" "}
              by <span className="font-medium text-blue-600">John Doe</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-gray-600 flex items-center">
              <Tag size={16} className="mr-2 text-blue-600" /> Tags:
            </span>
            {tags.map((tag, index) => (
               <Badge key={index}  variant="outline" className="bg-blue-400 text-gray-800 text-xs rounded-full">
               {tag}
             </Badge>
            ))}
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-6">
            <Eye size={18} className="mr-2 text-gray-800" />
            <span className="font-bold text-gray-800">Views: </span>
            <span className="ml-1 text-black-500 font-semibold">{viewCount}</span>
          </div>

          <Image
            src="https://topdev.vn/blog/wp-content/uploads/2024/10/gamma-ai-218x150.png"
            alt="Blog cover"
            width={800}
            height={400}
            className="rounded-lg shadow-md mb-6"
          />

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              Building an application is a multifaceted process that requires
              careful planning, design, and execution. It involves steps such
              as gathering requirements, creating a design, implementing the
              code, testing, and deploying. Following a structured approach can
              help ensure the success of your application development process.
            </p>

            <p>
              Understanding the target audience and defining clear objectives
              are critical early steps. This ensures the application addresses
              user needs effectively. Wireframes and prototypes provide a
              visual representation, allowing stakeholders to offer valuable
              feedback before development begins.
            </p>

            <p>
              During the implementation phase, developers work collaboratively
              to translate designs into functional code. Modern frameworks like
              React and Next.js streamline development by offering reusable
              components and server-side rendering capabilities.
            </p>

            <p>
              Testing and iteration are crucial to deliver a reliable
              application. Utilizing automated testing tools and gathering user
              feedback help identify areas for improvement. Finally, deploying
              the application to a robust infrastructure ensures scalability
              and performance.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Comments</h3>
            <div className="p-4 border rounded-md shadow-sm">
              <Textarea
                name="comment"
                placeholder="Your Comment"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

            <div className="mt-6">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border rounded-md shadow-sm bg-gray-50"
                >
                  <p className="text-gray-800 font-medium">{comment.name}</p>
                  <p className="text-gray-600 text-sm">{comment.date}</p>
                  <p className="mt-2 text-gray-700">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Blogs Section */}
        <div className="lg:w-1/3">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          <span className="relative">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur-sm"></span>
            Related Blogs
          </span>
        </h3>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Search related blogs..."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
            />
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
