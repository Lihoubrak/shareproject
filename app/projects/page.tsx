import ProjectCard from "@/components/project-card";
import { supabase } from "@/lib/supabaseClient";
import React from "react";

export default async function ProjectPage({ searchParams }: { searchParams: { category?: string } }) {
  const { category } = await searchParams;

  // Fetch projects from Supabase
  let query = supabase
    .schema('shareproject')
    .from('projects')
    .select('*, profiles(*), project_tags(tags(*)), categories(*)');

  // If a category is provided, filter projects by that category
  if (category) {
    query = query.eq("categories.name", category);
  }

  const { data: projects, error } = await query;
  if (error) {
    console.error('Error fetching projects:', error);
    return <div>Error loading projects. Please try again later.</div>;
  }

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      {projects?.map((project) => {
        const tags = project.project_tags.map((pt: { tags: { id: string; name: string; } }) => pt.tags.name);
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
