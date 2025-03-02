"use client";

import React, { useState, ChangeEvent } from "react";
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
import { BlogCard } from "@/components/blog-card";
import { formatDateToKhmer } from "@/utils/formatDateToKhmer";
import dynamic from "next/dynamic";
import PostReadingProgress from "./shared/PostReadingProgress";
import PostContent from "./shared/PostContent";
import PostToc from "./shared/PostToc";
import { BlogWithTagsAndProfileAndComment } from "@/types/types";
import useBlogDetail from "@/hooks/useBlogDetail";

const TiptapRenderer = dynamic(
  () => import("./TiptapRenderer/ClientRenderer"),
  { ssr: false }
);

export default function BlogDetailClient({
  blog,
  relatedBlogs,
}: {
  blog: BlogWithTagsAndProfileAndComment;
  relatedBlogs: BlogWithTagsAndProfileAndComment[];
}) {
  const { comments, views, addComment } = useBlogDetail(blog.id);
  const [commentText, setCommentText] = useState("");

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

  return (
    <div className="px-4 py-24 md:px-6 lg:px-44 lg:py-[120px] dark:bg-gray-900 dark:text-gray-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">ទំព័រដើម</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">ប្លុក</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{blog.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={blog.profiles.avatar_url}
              alt="Author Avatar"
              width={40}
              height={40}
              className="rounded-full border"
              priority
            />
            <p className="text-sm md:text-base">
              បង្ហោះនៅថ្ងៃទី {formatDateToKhmer(blog.created_at)} ដោយ{" "}
              {blog.profiles.username || "Unknown User"}
            </p>
          </div>

          <Image
            src={blog.image_url}
            alt="Blog cover"
            width={800}
            height={500}
            className="rounded-lg shadow-md mb-6 w-full"
            priority
          />
          <PostReadingProgress />
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] gap-6">
            <div className="hidden lg:block">
              <PostToc />
            </div>
            <PostContent>
              <TiptapRenderer>{blog.content}</TiptapRenderer>
            </PostContent>
          </div>

          <div className="mt-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">មតិយោបល់</h3>
            <div className="p-4 border rounded-md shadow-sm">
              <Textarea
                name="comment"
                placeholder="មតិយោបល់របស់អ្នក"
                rows={3}
                onChange={handleInputChange}
                value={commentText}
              />
              <Button
                className="mt-3 w-full md:w-auto"
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
                    className="mb-4 p-4 border rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={comment.profiles.avatar_url}
                        alt={comment.profiles.username}
                        width={35}
                        height={35}
                        className="rounded-full border"
                        priority
                      />
                      <div>
                        <p className="text-sm md:text-base">
                          {comment.profiles.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateToKhmer(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm md:text-base">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center">សូមទុកមតិយោបល់របស់អ្នក!</p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              ប្លុកពាក់ព័ន្ធ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
}
