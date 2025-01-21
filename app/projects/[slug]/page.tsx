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

// Generate Metadata for the project
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  try {
    const decodedSlug = decodeURIComponent(slug);

    const { data: project, error: projectError } = await supabase
      .schema("shareproject")
      .from("projects")
      .select(
        `*, project_tags(tags(id, name)), profiles(*), comments(*, profiles(*), ratings(*))`
      )
      .eq("slug", decodedSlug)
      .single();

    if (projectError || !project) {
      return {
        title: "Project Not Found",
        description: "The project you are looking for does not exist.",
      };
    }

    return {
      title: project.name,
      description: project.description.substring(0, 160), // First 160 characters for description
      openGraph: {
        title: project.name,
        description: project.description.substring(0, 160),
        url: `https://yourwebsite.com/projects/${project.slug}`,
        images: [
          {
            url: project.image_url,
            width: 800,
            height: 600,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: project.name,
        description: project.description.substring(0, 160),
        images: [project.image_url],
      },
    };
  } catch (err) {
    console.error("Error fetching project for metadata:", err);
    return {
      title: "Error Loading Project",
      description: "An error occurred while loading the project.",
    };
  }
}

export default async function ProjectDetail(props: Params) {
  const params = await props.params;
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  // Fetch project details
  const { data: project, error } = await supabase
    .schema("shareproject")
    .from("projects")
    .select(
      `*, project_tags(tags(id, name)), profiles(*), comments(*, profiles(*), ratings(*))`
    )
    .eq("slug", decodedSlug)
    .single();

  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound(); // Return a 404 page
  }

  return <ProjectDetailClient project={project} />;
}
