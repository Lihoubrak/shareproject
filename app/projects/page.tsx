import ProjectCard from "@/components/project-card";
import { supabase } from "@/lib/supabaseClient";
import React from "react";

// Define the type for the project object
type Project = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
  views: number;
  slug: string;
  downloads: number;
  project_tags: Array<{
    tags: {
      id: string;
      name: string;
    };
  }>;
};

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let query = supabase
    .schema("shareproject")
    .from("categories")
    .select(
      `
      *,
      projects(*, profiles(*), project_tags(tags(*)))
      `
    );
  if (category) {
    query = query.eq("name", category);
  }
  // Execute the query
  const { data: categories, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects. Please try again later.</div>;
  }

  // Flatten the projects from the categories result
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
