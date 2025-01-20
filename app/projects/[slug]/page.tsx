import ProjectDetailClient from "@/components/ProjectDetailClient";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
type Params = {
  params: Promise<{
    slug: string;
  }>;
};
export async function generateStaticParams() {
  const { data: projects, error } = await supabase
    .schema("shareproject")
    .from("projects")
    .select("slug");

  if (error || !projects) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export const dynamicParams = true; // Allow fallback for non-pre-rendered paths
export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function ProjectDetail(props: Params) {
  const params = await props.params;
  const { slug } =  params;
  const decodedSlug = decodeURIComponent(slug);
  // Fetch project details
  const { data: project, error } = await supabase
    .schema("shareproject")
    .from("projects")
    .select(
      `
      *,
      project_tags(tags(id, name)),
      profiles(*),
      comments(*, profiles(*),ratings(*))
    `
    )
    .eq("slug", decodedSlug)
    .single();

  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound(); // Return a 404 page
  }

  return <ProjectDetailClient project={project} />;
}
