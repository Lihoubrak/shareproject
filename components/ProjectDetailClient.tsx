"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Eye, Star, Tag } from "lucide-react";
import Image from "next/image";
import { formatDateToKhmer } from "@/utils/formatDateToKhmer";
import { Badge } from "./ui/badge";
import dynamic from "next/dynamic";
import PostSharing from "./shared/PostSharing";
import PostContent from "./shared/PostContent";
import PostToc from "./shared/PostToc";
import PostReadingProgress from "./shared/PostReadingProgress";
import { ProjectDetailProps } from "@/types/types";
import useProjectDetail from "@/hooks/useProjectDetail";

// Dynamically import TiptapRenderer to disable SSR
const TiptapRenderer = dynamic(
  () => import("./TiptapRenderer/ServerRenderer"),
  {
    ssr: false,
  }
);

export default function ProjectDetailClient({ project }: ProjectDetailProps) {
  const { comments, views, addComment } = useProjectDetail(project.id);
  const [formData, setFormData] = useState<{
    comment: string;
    rating: number;
  }>({
    comment: "",
    rating: 0,
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleAddComment = async () => {
    await addComment(
      formData.comment,
      formData.rating,
      "c79f05cc-7a60-4fb0-ab8e-e8c82c28c10a"
    );
    setFormData({ comment: "", rating: 0 });
  };

  return (
    <div className="px-4 py-24 md:px-6 lg:px-44 lg:py-[120px] dark:bg-gray-900 dark:text-gray-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="dark:text-gray-300">
              ទំព័រដើម
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects" className="dark:text-gray-300">
              គម្រោង
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="dark:text-gray-300">
              {project.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex my-6 flex-col lg:flex-row items-center p-4 lg:p-6 gap-6 border border-gray-300 dark:border-gray-700">
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src={project.image_url}
            alt="Demo"
            width={600}
            height={500}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center lg:text-left">
            {project.name}
          </h1>

          <div className="flex items-center gap-4 mt-4">
            <Image
              src={project.profiles.avatar_url}
              alt="Author Avatar"
              width={50}
              height={50}
              className="rounded-full border border-gray-300"
              priority
            />
            <p className="text-gray-600 dark:text-gray-300">
              បង្ហោះនៅថ្ងៃទី{" "}
              <span className="font-medium">
                {formatDateToKhmer(project.created_at)}
              </span>{" "}
              ដោយ{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {project.profiles.username || "Unknown User"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-gray-600 dark:text-gray-300 flex items-center">
              <Tag
                size={16}
                className="mr-2 text-blue-600 dark:text-blue-400"
              />{" "}
              ស្លាក:
            </span>
            {project.project_tags.map((tag) => (
              <Badge
                key={tag.tags.id}
                variant="outline"
                className="bg-blue-400 dark:bg-blue-600 text-gray-800 dark:text-gray-100 text-xs rounded-full"
              >
                {tag.tags.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mt-2">
            <Eye size={18} className="mr-2 text-gray-800 dark:text-gray-100" />
            <span className="font-bold text-gray-800 dark:text-gray-100">
              ការមើល៖{" "}
            </span>
            <span className="ml-1 text-black-500 dark:text-gray-100 font-semibold">
              {views}
            </span>
          </div>

          <div className="flex justify-center items-center gap-4 sm:gap-10 flex-wrap mt-6">
            <div className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300">
              <strong>ស្ថានភាព:</strong>{" "}
              {project.price === "0" ? "សេរី" : "បង់ប្រាក់"}
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300">
              <strong>តម្លៃ:</strong>{" "}
              {project.price === "0" ? "ឥតគិតថ្លៃ" : `$${project.price}`}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out">
              ទាញយកគម្រោង
            </Button>
          </div>
        </div>
      </div>

      <div>
        <PostReadingProgress />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] gap-6 lg:gap-8">
          <div className="hidden lg:block">
            <PostToc />
          </div>
          <PostContent>
            <TiptapRenderer>{project.description}</TiptapRenderer>
          </PostContent>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          មតិយោបល់
        </h3>

        <div className="p-4 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <textarea
            name="comment"
            placeholder="មតិយោបល់របស់អ្នក"
            className="w-full p-2 border bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            rows={3}
            value={formData.comment}
            onChange={handleInputChange}
          />
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer w-6 h-6 ${
                  formData.rating >= star ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
              />
            ))}
          </div>
          <Button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleAddComment}
          >
            បន្ថែមមតិយោបល់
          </Button>
        </div>

        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              សូមទុកមតិយោបល់របស់អ្នក!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={`${comment.id}-${comment.created_at}`}
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
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
                {comment.ratings &&
                  comment.ratings.length > 0 &&
                  comment.ratings[0].rating > 0 && (
                    <div className="flex mt-2">
                      {[...Array(comment.ratings[0].rating)].map((_, index) => (
                        <Star key={index} className="text-yellow-400 w-5 h-5" />
                      ))}
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
