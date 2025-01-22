"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/legacy/image";
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
import { supabase } from "@/lib/supabaseClient";
import { formatDateToKhmer } from "@/utils/formatDateToKhmer";
import TiptapRenderer from "./TiptapRenderer/ClientRenderer";
import PostReadingProgress from "./shared/PostReadingProgress";
import PostSharing from "./shared/PostSharing";
import PostContent from "./shared/PostContent";
import PostToc from "./shared/PostToc";

// Type Definitions
type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  last_name: string;
  first_name: string;
  auth_provider: string;
  bio: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  blog_id: string;
  project_id: string;
  user_id: string;
  profiles: Profile;
};

type BlogWithTagsAndProfileAndComment = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  views: number;
  downloads: number;
  profiles: Profile;
  slug: string;
  blog_tags: {
    tags: {
      id: string;
      name: string;
    };
  }[];
  comments: Comment[];
};
// Main Component
export default function BlogDetailClient({
  blog,
  relatedBlogs,
}: {
  blog: BlogWithTagsAndProfileAndComment;
  relatedBlogs: BlogWithTagsAndProfileAndComment[];
}) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(blog.comments || []);

  // Extract the tags of the current blog
  const currentBlogTags = blog.blog_tags.map((tag) => tag.tags.id);

  // Filter related blogs to include only those that share at least one tag with the current blog
  const filteredRelatedBlogs = relatedBlogs.filter((relatedBlog) =>
    relatedBlog.blog_tags.some((tag) => currentBlogTags.includes(tag.tags?.id))
  );
  // Real-time Subscription for Comments
  useEffect(() => {
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "shareproject",
          table: "comments",
          filter: `blog_id=eq.${blog.id}`,
        },
        async (payload) => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .schema("shareproject")
              .from("profiles")
              .select("*")
              .eq("id", payload.new.user_id)
              .single();

            if (profileError) throw profileError;

            const newComment: Comment = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              blog_id: payload.new.blog_id,
              project_id: payload.new.project_id || "",
              user_id: payload.new.user_id,
              profiles: profileData,
            };
            setComments((prevComments) => [newComment, ...prevComments]);
          } catch (error) {
            console.error("Error fetching profile data:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [blog.id]);
  useEffect(() => {
    const updateViews = async () => {
      try {
        const { error } = await supabase
          .schema("shareproject")
          .from("blogs")
          .update({ views: blog.views + 1 })
          .eq("id", blog.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    updateViews();
  }, [blog.id, blog.views]);
  // Handle Comment Input Change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  // Handle Adding a Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("សូមបញ្ចូលមតិយោបល់មុនពេលបន្ថែម!");
      return;
    }

    const newComment = {
      content: commentText.trim(),
      user_id: "f30214e0-91b0-49b3-ac75-f7bc74a3d068",
      blog_id: blog.id,
    };

    try {
      const { error } = await supabase
        .schema("shareproject")
        .from("comments")
        .insert([newComment]);
      if (error) throw error;
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  return (
    <div className=" px-6 py-10 lg:px-44 lg:py-[120px] dark:bg-gray-900 dark:text-gray-100">
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
        <div className="lg:w-11/12">
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
              layout="intrinsic"
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
              {blog.views}
            </span>
          </div>

          <Image
            src={blog.image_url}
            alt="Blog cover"
            width={800}
            height={500}
            className="rounded-lg shadow-md mb-6 w-full"
            layout="intrinsic"
          />
          <div>
        <PostReadingProgress />
        {/* Project Overview */}
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
                        layout="intrinsic"
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

        <div className="lg:w-1/4 mt-10 lg:mt-0">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur-sm"></span>
              ប្លុកពាក់ព័ន្ធ
            </span>
          </h3>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="ស្វែងរកប្លុកពាក់ព័ន្ធ..."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
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
      </div>
    </div>
  );
}