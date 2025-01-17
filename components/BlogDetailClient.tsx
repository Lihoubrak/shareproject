'use client';
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
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Tag, Eye } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/data";
import { Badge } from "@/components/ui/badge";
import { QueryData } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";

type Comment = {
  name: string;
  comment: string;
  date: string;
  avatar: string;
};

// Define the type for the blog prop
type BlogWithTagsAndProfile = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  views: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
  blog_tags: {
    tags: {
      id: string;
      name: string;
    };
  }[];
};

type FormData = {
  name: string;
  comment: string;
};

const initialComments: Comment[] = [
  {
    name: "អាលីស",
    comment: "នេះជាអត្ថបទដ៏អស្ចារ្យ! អរគុណសម្រាប់ការចែករំលែក។",
    date: "07/01/2025",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "បុប",
    comment: "ខ្ញុំបានរៀនបានច្រើនពីអត្ថបទនេះ។ ត្រូវបន្តការងារដ៏ល្អនេះទៀត!",
    date: "06/01/2025",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "ឆាលី",
    comment: "ខ្ញុំរង់ចាំអត្ថបទដូចនេះទៀត!",
    date: "05/01/2025",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

export default function BlogDetailClient({ blog }: { blog: BlogWithTagsAndProfile }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [formData, setFormData] = useState<FormData>({ name: "", comment: "" });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddComment = () => {
    if (formData.comment) {
      const newComment: Comment = {
        name: formData.name,
        comment: formData.comment,
        date: new Date().toLocaleDateString(),
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setFormData({ name: "", comment: "" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-6 py-10 lg:px-28 lg:py-[120px]">
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

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        <div className="lg:w-11/12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center mb-4 gap-4">
            <Image
              src={blog.profiles.avatar_url}
              alt="Author Avatar"
              width={50}
              height={50}
              className="rounded-full border border-gray-300"
            />
            <p className="text-gray-600">
              បង្ហោះនៅថ្ងៃទី{" "}
              <span className="font-medium">{formatDate(blog.created_at)}</span>{" "}
              ដោយ{" "}
              <span className="font-medium text-blue-600">
                {blog.profiles.username || "Unknown User"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-gray-600 flex items-center">
              <Tag size={16} className="mr-2 text-blue-600" /> ស្លាក:
            </span>
            {blog.blog_tags.map((tag) => (
              <Badge
                key={tag.tags.id}
                variant="outline"
                className="bg-blue-400 text-gray-800 text-xs rounded-full"
              >
                {tag.tags.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-6">
            <Eye size={18} className="mr-2 text-gray-800" />
            <span className="font-bold text-gray-800">ការមើល៖ </span>
            <span className="ml-1 text-black-500 font-semibold">{blog.views}</span>
          </div>

          <Image
            src={blog.image_url}
            alt="Blog cover"
            width={800}
            height={400}
            className="rounded-lg shadow-md mb-6 w-full"
          />

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>{blog.content}</p>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">មតិយោបល់</h3>
            <div className="p-4 border rounded-md shadow-sm">
              <Textarea
                name="comment"
                placeholder="មតិយោបល់របស់អ្នក"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
                value={formData.comment}
                onChange={handleInputChange}
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
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border rounded-md shadow-sm bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={comment.avatar}
                        alt={comment.name}
                        width={40}
                        height={40}
                        className="rounded-full border border-gray-300"
                      />
                      <div>
                        <p className="text-gray-800 font-medium">{comment.name}</p>
                        <p className="text-gray-600 text-sm">{comment.date}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">មិនមានមតិយោបល់ទេ។</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/4 mt-10 lg:mt-0">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur-sm"></span>
              ប្លុកពាក់ព័ន្ធ
            </span>
          </h3>
          <div className="flex flex-col gap-5 ">
            <input
              type="text"
              placeholder="ស្វែងរកប្លុកពាក់ព័ន្ធ..."
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