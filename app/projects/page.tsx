import ProjectCard from "@/components/project-card";
import { supabase } from "@/lib/client";
import { Project } from "@/types/types";
import React from "react";

// Define the type for the project object


// Define `generateMetadata` function for dynamic metadata generation
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams;

  // Decode the category if it is URL-encoded
  const decodedCategory = category ? decodeURIComponent(category) : null;

  // Construct the metadata based on the category (or use a default category)
  const title = decodedCategory ? `គម្រោង - ${decodedCategory}` : "គម្រោង - Share Your Ideas";
  const description = decodedCategory
    ? `Discover amazing projects in the ${decodedCategory} category. Explore and collaborate with the community.`
    : "Explore a variety of projects, from tech to creative designs. Discover new projects and download or collaborate with the community.";

  const url = decodedCategory
    ? `https://www.example.com/projects/${decodedCategory}`
    : "https://www.example.com/projects";
  const imageUrl = "https://www.example.com/og-image.jpg"; // Replace with your image URL

  return {
    title,
    description,
    keywords: "projects, tech, development, design, Cambodia, IT, programming",
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: "Project Showcase",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // Decode the category if it is URL-encoded
  const decodedCategory = category ? decodeURIComponent(category) : null;

  let query = supabase
    .schema("shareproject")
    .from("categories")
    .select(
      `*
      , projects(*, profiles(*), project_tags(tags(*)))`
    );

  if (decodedCategory) {
    query = query.eq("name", decodedCategory);
  }

  const { data: categories, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects. Please try again later.</div>;
  }

  const projects: Project[] =
    categories?.flatMap((category) => category.projects) || [];

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      {projects.map((project: Project) => {
        const tags = project.project_tags.map(
          (pt: { tags: { id: string; name: string } }) => pt.tags.name
        );
        return (
          <ProjectCard
            key={project.id}
            title={project.name}
            description={project.description}
            tags={tags}
            buttonText="មើលគម្រោង"
            image={project.image_url}
            price={project.price}
            views={project.views}
            slug={project.slug}
            downloads={project.downloads}
          />
        );
      })}
    </div>
  );
}
