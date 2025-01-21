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
import Image from "next/legacy/image";
import { supabase } from "@/lib/supabaseClient";
import { formatDateToKhmer } from "@/utils/formatDateToKhmer";
import { Badge } from "./ui/badge";
import TiptapRenderer from "./TiptapRenderer/ClientRenderer";

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

type Rating = {
  id: number;
  rating: number;
  user_id: string;
  comment_id: string;
  created_at: string;
  project_id: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  blog_id: string | null;
  project_id: string;
  user_id: string;
  ratings: Rating[];
  profiles: Profile;
};

type Project = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
  views: number;
  slug: string;
  created_at: string;
  downloads: number;
  project_tags: Array<{
    tags: {
      id: string;
      name: string;
    };
  }>;
  profiles: {
    username: string;
    avatar_url: string;
  };
  comments: Comment[];
};

type ProjectDetailProps = {
  project: Project;
};

export default function ProjectDetailClient({ project }: ProjectDetailProps) {
  const [formData, setFormData] = useState<{
    comment: string;
    rating: number;
  }>({
    comment: "",
    rating: 0,
  });

  const [comments, setComments] = useState<Comment[]>(project.comments);

  // Real-time subscription for comments and ratings
  useEffect(() => {
    // Subscribe to comments
    const commentsChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "shareproject",
          table: "comments",
          filter: `project_id=eq.${project.id}`,
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
              blog_id: payload.new.blog_id || null,
              project_id: payload.new.project_id,
              user_id: payload.new.user_id,
              ratings: [],
              profiles: profileData,
            };

            setComments((prevComments) => [newComment, ...prevComments]);
          } catch (error) {
            console.error("Error fetching profile data:", error);
          }
        }
      )
      .subscribe();

    // Subscribe to ratings
    const ratingsChannel = supabase
      .channel("ratings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "shareproject",
          table: "ratings",
          filter: `project_id=eq.${project.id}`,
        },
        (payload) => {
          const newRating = payload.new as Rating;

          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === newRating.comment_id
                ? {
                    ...comment,
                    ratings: [...comment.ratings, newRating],
                  }
                : comment
            )
          );
        }
      )
      .subscribe();

    // Cleanup both subscriptions
    return () => {
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(ratingsChannel);
    };
  }, [project.id]);

  useEffect(() => {
    const updateViews = async () => {
      try {
        const { error } = await supabase
          .schema("shareproject")
          .from("projects")
          .update({ views: project.views + 1 })
          .eq("id", project.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    updateViews();
  }, [project.id, project.views]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleAddComment = async () => {
    if (!formData.comment.trim()) {
      alert("សូមបញ្ចូលមតិយោបល់មុនពេលបន្ថែម!");
      return;
    }

    const newComment = {
      content: formData.comment.trim(),
      user_id: "f30214e0-91b0-49b3-ac75-f7bc74a3d068", // Replace with actual user ID
      project_id: project.id,
    };

    try {
      // Step 1: Insert the comment into the `comments` table
      const { data: commentData, error: commentError } = await supabase
        .schema("shareproject")
        .from("comments")
        .insert([newComment])
        .select()
        .single(); // Fetch the inserted comment
      if (commentError) throw commentError;

      // Step 2: Insert the rating into the `ratings` table
      const newRating = {
        comment_id: commentData.id, // Link the rating to the new comment
        user_id: "f30214e0-91b0-49b3-ac75-f7bc74a3d068", // Replace with actual user ID
        rating: formData.rating,
        project_id: project.id,
      };

      const { error: ratingError } = await supabase
        .schema("shareproject")
        .from("ratings")
        .insert([newRating]);

      if (ratingError) throw ratingError;

      // Reset the form
      setFormData({ comment: "", rating: 0 });

      alert("មតិយោបល់ត្រូវបានបន្ថែមដោយជោគជ័យ!");
    } catch (error) {
      console.error("Error adding comment or rating:", error);
      alert("មានបញ្ហាក្នុងការបន្ថែមមតិយោបល់!");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-28">
      <div className="flex flex-col gap-10 py-[120px]">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">ទំព័រដើម</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">គម្រោង</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Project Header */}
        <div className="flex flex-col lg:flex-row items-center p-6 gap-6">
          {/* Project Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src={project.image_url}
              alt="Demo"
              width={600}
              height={500}
              className="rounded-lg shadow-lg"
              priority
              layout="intrinsic"
            />
          </div>

          {/* Project Details */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center lg:text-left">
              {project.name}
            </h1>

            {/* Author Information */}
            <div className="flex items-center gap-4 mt-4">
              <Image
                src={project.profiles.avatar_url}
                alt="Author Avatar"
                width={50}
                height={50}
                className="rounded-full border border-gray-300"
                layout="intrinsic"
              />
              <p className="text-gray-600">
                បង្ហោះនៅថ្ងៃទី{" "}
                <span className="font-medium">
                  {formatDateToKhmer(project.created_at)}
                </span>{" "}
                ដោយ{" "}
                <span className="font-medium text-blue-600">
                  {project.profiles.username || "Unknown User"}
                </span>
              </p>
            </div>

            {/* Tags and Views */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-gray-600 flex items-center">
                <Tag size={16} className="mr-2 text-blue-600" /> ស្លាក:
              </span>
              {project.project_tags.map((tag) => (
                <Badge
                  key={tag.tags.id}
                  variant="outline"
                  className="bg-blue-400 text-gray-800 text-xs rounded-full"
                >
                  {tag.tags.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center text-gray-600 text-sm mt-2">
              <Eye size={18} className="mr-2 text-gray-800" />
              <span className="font-bold text-gray-800">ការមើល៖ </span>
              <span className="ml-1 text-black-500 font-semibold">
                {project.views}
              </span>
            </div>

            {/* Price and Free/Paid Status */}
            <div className="flex justify-center items-center gap-10 flex-wrap mt-6">
              <div className="text-lg sm:text-xl font-semibold text-gray-700">
                <strong>ស្ថានភាព:</strong>{" "}
                {project.price === "0" ? "សេរី" : "បង់ប្រាក់"}
              </div>
              <div className="text-lg sm:text-xl font-semibold text-gray-700">
                <strong>តម្លៃ:</strong>{" "}
                {project.price === "0" ? "ឥតគិតថ្លៃ" : `$${project.price}`}
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-center mt-6">
              <Button className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out">
                ទាញយកគម្រោង
              </Button>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="">
          <p className="text-base sm:text-lg w-full lg:w-2/3  text-gray-600">
          <TiptapRenderer>{project.description}</TiptapRenderer>
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            មតិយោបល់
          </h3>

          {/* Add Comment Form */}
          <div className="p-4 border rounded-md shadow-sm">
            <textarea
              name="comment"
              placeholder="មតិយោបល់របស់អ្នក"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              value={formData.comment}
              onChange={handleInputChange}
            />
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer w-6 h-6 ${
                    formData.rating >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
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

          {/* Display Comments */}
          <div className="mt-6">
            {comments.length === 0 ? (
              <p className="text-gray-600 text-center">
                សូមទុកមតិយោបល់របស់អ្នក!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-4 p-4 border rounded-md shadow-sm bg-gray-50"
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
                      <p className="text-gray-800 font-medium">
                        {comment.profiles.username}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {formatDateToKhmer(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                  {comment.ratings &&
                    comment.ratings.length > 0 &&
                    comment.ratings[0].rating > 0 && (
                      <div className="flex mt-2">
                        {[...Array(comment.ratings[0].rating)].map(
                          (_, index) => (
                            <Star
                              key={index}
                              className="text-yellow-400 w-5 h-5"
                            />
                          )
                        )}
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
