"use client";

import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import { Tag, Eye } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import { formatDateToKhmer } from "@/utils/formatDateToKhmer";
import dynamic from "next/dynamic";
import PostReadingProgress from "./shared/PostReadingProgress";
import PostSharing from "./shared/PostSharing";
import PostContent from "./shared/PostContent";
import PostToc from "./shared/PostToc";
import { BlogWithTagsAndProfileAndComment } from "@/types/types";
import useBlogDetail from "@/hooks/useBlogDetail";

// Dynamically import TiptapRenderer to disable SSR
const TiptapRenderer = dynamic(() => import("./TiptapRenderer/ClientRenderer"), {
  ssr: false,
});

export default function BlogDetailClient({
  blog,
  relatedBlogs,
}: {
  blog: BlogWithTagsAndProfileAndComment;
  relatedBlogs: BlogWithTagsAndProfileAndComment[];
}) {
  const { comments, views, addComment } = useBlogDetail(blog.id);
  const [commentText, setCommentText] = useState("");
  const [showRelatedBlogs, setShowRelatedBlogs] = useState(true);
  const blogContentRef = useRef(null);

  const currentBlogTags = blog.blog_tags.map((tag) => tag.tags.id);
  const filteredRelatedBlogs = relatedBlogs.filter((relatedBlog) =>
    relatedBlog.blog_tags.some((tag) => currentBlogTags.includes(tag.tags?.id))
  );

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = async () => {
    await addComment(commentText, "c79f05cc-7a60-4fb0-ab8e-e8c82c28c10a");
    setCommentText("");
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowRelatedBlogs(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (blogContentRef.current) {
      observer.observe(blogContentRef.current);
    }

    return () => {
      if (blogContentRef.current) {
        observer.unobserve(blogContentRef.current);
      }
    };
  }, []);

  return (
    <div className="px-6 py-28 lg:px-44 lg:py-[120px] dark:bg-gray-900 dark:text-gray-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="dark:text-gray-300">
              ទំព័រដើម
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog" className="dark:text-gray-300">
              ប្លុក
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="dark:text-gray-300">
              {blog.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        <div className="lg:w-3/4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center mb-4 gap-4">
            <Image
              src={blog.profiles.avatar_url}
              alt="Author Avatar"
              width={50}
              height={50}
              className="rounded-full border border-gray-300"
              priority
            />
            <p className="text-gray-600 dark:text-gray-300">
              បង្ហោះនៅថ្ងៃទី{" "}
              <span className="font-medium">
                {formatDateToKhmer(blog.created_at)}
              </span>{" "}
              ដោយ{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {blog.profiles.username || "Unknown User"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-gray-600 dark:text-gray-300 flex items-center">
              <Tag size={16} className="mr-2 text-blue-600 dark:text-blue-400" /> ស្លាក:
            </span>
            {blog.blog_tags.map((tag) => (
              <Badge
                key={tag.tags.id}
                variant="outline"
                className="bg-blue-400 dark:bg-blue-600 text-gray-800 dark:text-gray-100 text-xs rounded-full"
              >
                {tag.tags.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-6">
            <Eye size={18} className="mr-2 text-gray-800 dark:text-gray-100" />
            <span className="font-bold text-gray-800 dark:text-gray-100">ការមើល៖ </span>
            <span className="ml-1 text-black-500 dark:text-gray-100 font-semibold">
              {views}
            </span>
          </div>

          <Image
            src={blog.image_url}
            alt="Blog cover"
            width={800}
            height={500}
            className="rounded-lg shadow-md mb-6 w-full"
            priority
          />

          <div className="py-10" ref={blogContentRef}>
            <PostReadingProgress />
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] gap-6 lg:gap-8">
              <PostSharing />
              <PostContent>
                <TiptapRenderer>{blog.content}</TiptapRenderer>
              </PostContent>
              <PostToc />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              មតិយោបល់
            </h3>
            <div className="p-4 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <Textarea
                name="comment"
                placeholder="មតិយោបល់របស់អ្នក"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={3}
                onChange={handleInputChange}
                value={commentText}
              />
              <Button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddComment}
              >
                បន្ថែមមតិយោបល់
              </Button>
            </div>

            <div className="mt-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="mb-4 p-4 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={comment.profiles.avatar_url}
                        alt={comment.profiles.username}
                        width={40}
                        height={40}
                        className="rounded-full border border-gray-300"
                        priority
                      />
                      <div>
                        <p className="text-gray-800 dark:text-gray-100 font-medium">
                          {comment.profiles.username}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {formatDateToKhmer(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  សូមទុកមតិយោបល់របស់អ្នក!
                </p>
              )}
            </div>
          </div>
        </div>

        {showRelatedBlogs && (
          <div className="lg:w-1/4 mt-10 lg:mt-0">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur-sm"></span>
                ប្លុកពាក់ព័ន្ធ
              </span>
            </h3>
            <div className="flex flex-col gap-5">
              <input
                id="searchblog"
                type="text"
                placeholder="ស្វែងរកប្លុកពាក់ព័ន្ធ..."
                className="w-full p-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              {filteredRelatedBlogs.map((post) => (
                <BlogCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  image={post.image_url}
                  description={post.content}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}