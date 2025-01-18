import BlogDetailClient from "@/components/BlogDetailClient";
import { supabase } from "@/lib/supabaseClient";

type Params = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const { data: blogs, error } = await supabase
    .schema("shareproject")
    .from("blogs")
    .select("slug");

  if (error || !blogs) {
    console.error("Error fetching blogs:", error);
    return [];
  }

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export const dynamicParams = true; // Allow fallback for non-pre-rendered paths
export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function BlogDetail({ params }: Params) {
  const { slug } = await params;
  try {
    const decodedSlug = decodeURIComponent(slug);

    const { data: blog, error } = await supabase
      .schema("shareproject")
      .from("blogs")
      .select(
        `
        *,
        blog_tags(tags(id, name)),
        profiles(*),
        comments(*, profiles(*))
      `
      )
      .eq("slug", decodedSlug)
      .single();

    if (error || !blog) {
      console.error("Error fetching blog or blog not found:", error);
      return (
        <div>
          <h1>Blog Not Found</h1>
          <p>The blog you are looking for does not exist.</p>
          {error && <p>Error: {error.message}</p>}
        </div>
      );
    }

    return <BlogDetailClient blog={blog} />;
  } catch (err) {
    console.error("Unexpected error in BlogDetail component:", err);
    return (
      <div>
        <h1>An Error Occurred</h1>
        <p>
          Sorry, an error occurred while loading the blog. Please try again
          later.
        </p>
      </div>
    );
  }
}
